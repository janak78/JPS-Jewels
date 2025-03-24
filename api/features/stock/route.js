var express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const XLSX = require("xlsx");
const stockSchema = require("./model");
const { verifyLoginToken } = require("../authentication/authentication");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, ""));
  },
});

const upload = multer({ storage: storage });

function getDefaultImageUrl(Shape) {
  const lowerCaseShape = Shape?.toLowerCase() || "";
  switch (lowerCaseShape) {
    case "asscher":
    case "sq eme":
      return "https://jpsjewels.com/api/EMARALD.jpg";
    case "baguette":
    case "bug":
      return "https://jpsjewels.com/api/Bug.jpg";
    case "cushion":
    case "cu":
    case "square cushion":
    case "sq cu":
    case "cushion modified":
      return "https://jpsjewels.com/api/Cushion.jpg";
    case "emerald":
    case "eme":
    case "square emerald":
      return "https://jpsjewels.com/api/EMARALD.jpg";
    case "heart":
    case "he":
    case "heart modified":
      return "https://jpsjewels.com/api/images/Heart.jpg";
    case "long radiant":
    case "long rad":
    case "radiant":
    case "rad":
    case "radiant modified":
      return "https://jpsjewels.com/api/RADIENT.png";
    case "marquise":
    case "mq":
    case "marquise modified":
      return "https://jpsjewels.com/api/Marquise.png";
    case "oval":
    case "ovl":
      return "https://jpsjewels.com/api/OVAL.png";
    case "pear":
    case "pe":
      return "https://jpsjewels.com/api/PEAR.png";
    case "princess":
    case "pri":
    case "princess modified":
      return "https://jpsjewels.com/api/PRINCESS.png";
    case "round":
    case "rbc":
      return "https://jpsjewels.com/api/images/RBC.jpg";
    default:
      return "https://jpsjewels.com/api/images/RBC.jpg"; // Default fallback image
  }
}

router.post(
  "/addstocks",

  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const isNatural = req.body.IsNatural;
      const isLabgrown = req.body.IsLabgrown;

      const fileName = req.file.filename;
      const fileData = `./${fileName}`;
      const workbook = XLSX.readFile(fileData);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const allowedFields = [
        "Image",
        "Video",
        "Diamond Type",
        "H&A",
        "Ratio",
        "Tinge",
        "Milky",
        "EyeC",
        "Table(%)",
        "Depth(%)",
        "measurements",
        "Amount U$",
        "Price $/ct",
        "Disc %",
        "Rap $",
        "Fluo Int",
        "Symm",
        "Polish",
        "Intensity",
        "Cut",
        "Clarity",
        "Color",
        "Carats",
        "Shape",
        "Certificate No",
        "Lab",
        "SKU",
        "Sr.No",
        "IsNatural",
        "IsLabgrown",
      ];

      for (const data of jsonData) {
        const dataFields = Object.keys(data);
        const extraFields = dataFields.filter(
          (field) => !allowedFields.includes(field)
        );

        if (extraFields.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid fields detected: ${extraFields.join(
              ", "
            )}. Only allowed fields are: ${allowedFields.join(", ")}`,
          });
        }

        const defaultImageUrl = getDefaultImageUrl(data.Shape);
        const finalImage =
          data.Image && data.Image.length > 0 ? data.Image : defaultImageUrl;

          console.log(finalImage,"fi1")

        await stockSchema.findOneAndUpdate(
          { SKU: data.SKU },
          {
            Image: finalImage,
            Video: data.Video,
            DiamondType: data["Diamond Type"],
            HA: data["H&A"],
            Ratio: data.Ratio,
            Tinge: data.Tinge,
            Milky: data.Milky,
            EyeC: data.EyeC,
            Table: data["Table(%)"],
            Depth: data["Depth(%)"],
            measurements: data.measurements,
            Amount: data["Amount U$"],
            Price: data["Price $/ct"],
            Disc: data["Disc %"],
            Rap: data["Rap $"],
            FluoInt: data["Fluo Int"],
            Symm: data.Symm,
            Polish: data.Polish,
            Intensity: data.Intensity,
            Cut: data.Cut,
            Clarity: data.Clarity,
            Color: data.Color,
            Carats: data.Carats,
            Shape: data.Shape,
            CertificateNo: data["Certificate No"],
            Lab: data.Lab,
            SKU: data.SKU,
            SrNo: data["Sr.No"],
            IsNatural: isNatural,
            IsLabgrown: isLabgrown,
          },
          { upsert: true, new: true }
        );
      }
      fs.unlinkSync(fileName);
      res
        .status(200)
        .json({ success: true, message: "Excel file processed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing the request",
      });
    }
  }
);

const labUrlMap = {
  HRD: "https://my.hrdantwerp.com/Download/GetGradingReportPdf/?reportNumber=",
  GIA: "https://www.gia.edu/report-check?locale=en_US&reportno=",
  IGI: "https://www.igi.org/API-IGI/viewpdf-url.php?r=",
};

function getCertificateUrl(lab, certificateNo) {
  if (!lab || !certificateNo) {
    return null;
  }

  const labKey = Object.keys(labUrlMap).find(
    (key) => key.toLowerCase() === lab.toLowerCase()
  );
  if (!labKey) {
    return null;
  }

  const urlBase = labUrlMap[labKey];

  if (labKey === "HRD") {
    return `${urlBase}${encodeURIComponent(
      certificateNo
    )}&printDocumentType=DiamondIdentificationReportPlusMini`;
  }

  return `${urlBase}${encodeURIComponent(certificateNo)}`;
}

const fetchStockDetails = async () => {
  const diamondsdetail = await stockSchema.aggregate([
    {
      $match: { IsDelete: false },
    },
    {
      $project: {
        Image: 1,
        Video: 1,
        DiamondType: 1,
        HA: 1,
        Ratio: 1,
        Tinge: 1,
        Milky: 1,
        EyeC: 1,
        Table: 1,
        Depth: 1,
        measurements: 1,
        Amount: 1,
        Price: 1,
        Disc: 1,
        Rap: 1,
        FluoInt: 1,
        Symm: 1,
        Polish: 1,
        Cut: 1,
        Clarity: 1,
        Color: 1,
        Carats: 1,
        Shape: 1,
        CertificateNo: 1,
        Lab: 1,
        SKU: 1,
        SrNo: 1,
      },
    },
  ]);

  const stockCount = diamondsdetail.length;

  return {
    statusCode: diamondsdetail.length > 0 ? 200 : 204,
    message:
      diamondsdetail.length > 0
        ? "diamondsdetail retrieved successfully"
        : "No diamondsdetail found",
    data: diamondsdetail,
    TotalCount: stockCount,
  };
};

router.get("/data", async function (req, res) {
  try {
    const result = await fetchStockDetails();

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({ result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const fetchDiamondsPageDetails = async (query) => {
  try {
    const pageSize = parseInt(query.pageSize) || 10;
    let pageNumber = parseInt(query.pageNumber) || 1;
    pageNumber = pageNumber - 1;

    const matchStage = { IsDelete: false };

    if (query.IsNatural === true) {
      matchStage.IsNatural = true;
    }
    if (query.IsLabgrown === true) {
      matchStage.IsLabgrown = true;
    }

    if (query.Shape?.length) {
      matchStage.Shape = Array.isArray(query.Shape)
        ? { $in: query.Shape }
        : query.Shape;
    }

    if (query.Color?.length) {
      matchStage.Color = Array.isArray(query.Color)
        ? { $in: query.Color }
        : query.Color;
    }

    if (query.Clarity?.length) {
      matchStage.Clarity = Array.isArray(query.Clarity)
        ? { $in: query.Clarity }
        : query.Clarity;
    }

    if (query.Cut?.length) {
      matchStage.Cut = Array.isArray(query.Cut)
        ? { $in: query.Cut }
        : query.Cut;
    }

    if (query.Polish?.length) {
      matchStage.Polish = Array.isArray(query.Polish)
        ? { $in: query.Polish }
        : query.Polish;
    }

    if (query.Symm?.length) {
      matchStage.Symm = Array.isArray(query.Symm)
        ? { $in: query.Symm }
        : query.Symm;
    }

    if (query.FluoInt?.length) {
      matchStage.FluoInt = Array.isArray(query.FluoInt)
        ? { $in: query.FluoInt }
        : query.FluoInt;
    }

    if (query.Lab?.length) {
      matchStage.Lab = Array.isArray(query.Lab)
        ? { $in: query.Lab }
        : query.Lab;
    }

    if (query.Milky?.length) {
      matchStage.Milky = Array.isArray(query.Milky)
        ? { $in: query.Milky }
        : query.Milky;
    }

    if (query.Tinge?.length) {
      matchStage.Tinge = Array.isArray(query.Tinge)
        ? { $in: query.Tinge }
        : query.Tinge;
    }

    if (query.minCt || query.maxCt) {
      matchStage.Carats = {};
      if (query.minCt) matchStage.Carats.$gte = parseFloat(query.minCt);
      if (query.maxCt) matchStage.Carats.$lte = parseFloat(query.maxCt);
    }

    if (query.minDepth || query.maxDepth) {
      matchStage.Depth = {};
      if (query.minDepth) matchStage.Depth.$gte = parseFloat(query.minDepth);
      if (query.maxDepth) matchStage.Depth.$lte = parseFloat(query.maxDepth);
    }

    if (query.minTable || query.maxTable) {
      matchStage.Table = {};
      if (query.minTable) matchStage.Table.$gte = parseFloat(query.minTable);
      if (query.maxTable) matchStage.Table.$lte = parseFloat(query.maxTable);
    }

    if (query.minRatio || query.maxRatio) {
      matchStage.Ratio = {};
      if (query.minRatio) matchStage.Ratio.$gte = parseFloat(query.minRatio);
      if (query.maxRatio) matchStage.Ratio.$lte = parseFloat(query.maxRatio);
    }

    if (query.isAmount) {
      if (query.minAmount || query.maxAmount) {
        matchStage.Amount = {};
        if (query.minAmount)
          matchStage.Amount.$gte = parseFloat(query.minAmount);
        if (query.maxAmount)
          matchStage.Amount.$lte = parseFloat(query.maxAmount);
      }
    }

    if (query.isPrice) {
      if (query.minPrice || query.maxPrice) {
        matchStage.Price = {};
        if (query.minPrice) matchStage.Price.$gte = parseFloat(query.minPrice);
        if (query.maxPrice) matchStage.Price.$lte = parseFloat(query.maxPrice);
      }
    }

    if (
      query.minLength ||
      query.maxLength ||
      query.minWidth ||
      query.maxWidth ||
      query.minDepthmm ||
      query.maxDepthmm
    ) {
      matchStage.$expr = { $and: [] };

      if (query.minLength) {
        matchStage.$expr.$and.push({
          $gte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 0],
              },
            },
            parseFloat(query.minLength),
          ],
        });
      }

      if (query.maxLength) {
        matchStage.$expr.$and.push({
          $lte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 0],
              },
            },
            parseFloat(query.maxLength),
          ],
        });
      }

      if (query.minWidth) {
        matchStage.$expr.$and.push({
          $gte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 1],
              },
            },
            parseFloat(query.minWidth),
          ],
        });
      }

      if (query.maxWidth) {
        matchStage.$expr.$and.push({
          $lte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 1],
              },
            },
            parseFloat(query.maxWidth),
          ],
        });
      }

      if (query.minDepthmm) {
        matchStage.$expr.$and.push({
          $gte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 2],
              },
            },
            parseFloat(query.minDepthmm),
          ],
        });
      }

      if (query.maxDepthmm) {
        matchStage.$expr.$and.push({
          $lte: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$measurements", "*"] }, 2],
              },
            },
            parseFloat(query.maxDepthmm),
          ],
        });
      }
    }

    const diamondDetailsPage = await stockSchema.aggregate([
      { $match: matchStage },
      {
        $project: {
          Image: 1,
          // Video: 1,
          // DiamondType: 1,
          // HA: 1,
          // Ratio: 1,
          // Tinge: 1,
          // Milky: 1,
          // EyeC: 1,
          // Table: 1,
          // Depth: 1,
          // measurements: 1,
          Amount: 1,
          Price: 1,
          // Disc: 1,
          // Rap: 1,
          // FluoInt: 1,
          // Symm: 1,
          // Polish: 1,
          Cut: 1,
          Clarity: 1,
          Color: 1,
          Carats: 1,
          Shape: 1,
          // CertificateNo: 1,
          Lab: 1,
          SKU: 1,
          SrNo: 1,
        },
      },
      { $sort: { createdAt: 1 } },
    ]);

    const stockCount = diamondDetailsPage.length;
    const totalPages = Math.ceil(stockCount / pageSize);
    const paginatedDiamonds = diamondDetailsPage.slice(
      pageNumber * pageSize,
      (pageNumber + 1) * pageSize
    );

    return {
      statusCode: diamondDetailsPage.length === 0 ? 204 : 200,
      message:
        diamondDetailsPage.length > 0
          ? "diamondDetailsPage retrieved successfully"
          : "No diamondDetailsPage found",
      data:
        paginatedDiamonds.length > 0 ? paginatedDiamonds : diamondDetailsPage,
      totalPages,
      currentPage: pageNumber + 1,
      TotalCount: stockCount,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};

router.post("/data/page", async function (req, res) {
  try {
    const { pageSize, pageNumber } = req.query;
    let {
      IsNatural,
      IsLabgrown,
      Shape,
      minCt,
      maxCt,
      Color,
      Clarity,
      Cut,
      Polish,
      Intensity,
      Symm,
      FluoInt,
      Lab,
      Milky,
      Tinge,
      minDepth,
      maxDepth,
      minTable,
      maxTable,
      minRatio,
      maxRatio,
      minLength,
      maxLength,
      minWidth,
      maxWidth,
      minDepthmm,
      maxDepthmm,
      isAmount,
      isPrice,
      minAmount,
      maxAmount,
      minPrice,
      maxPrice,
    } = req.body;

    [Shape, Color, Clarity, Cut, Polish, Symm, FluoInt, Lab, Milky, Tinge, Intensity,] = [
      Shape,
      Color,
      Clarity,
      Cut,
      Polish,
      Symm,
      FluoInt,
      Lab,
      Milky,
      Tinge,
      Intensity,
    ].map((val) => (val && !Array.isArray(val) ? [val] : val));

    const result = await fetchDiamondsPageDetails({
      pageSize,
      pageNumber,
      IsNatural,
      IsLabgrown,
      Shape,
      minCt,
      maxCt,
      Color,
      Clarity,
      Cut,
      Polish,
      Intensity,
      Symm,
      FluoInt,
      Lab,
      Milky,
      Tinge,
      minDepth,
      maxDepth,
      minTable,
      maxTable,
      minRatio,
      maxRatio,
      minLength,
      maxLength,
      minWidth,
      maxWidth,
      minDepthmm,
      maxDepthmm,
      isAmount,
      isPrice,
      minAmount,
      maxAmount,
      minPrice,
      maxPrice,
    });

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        diamond.certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : getDefaultImageUrl(diamond.Shape);
      });
    }

    res.status(result.statusCode).json({ result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

const fetchcaratsDetails = async () => {
  const Carets = await stockSchema.aggregate([
    {
      $match: {
        IsDelete: false,
      },
    },
    {
      $sort: {
        Amount: -1,
      },
    },
    {
      $project: {
        Image: 1,
        Video: 1,
        DiamondType: 1,
        HA: 1,
        Ratio: 1,
        Tinge: 1,
        Milky: 1,
        EyeC: 1,
        Table: 1,
        Depth: 1,
        measurements: 1,
        Amount: 1,
        Price: 1,
        Disc: 1,
        Rap: 1,
        FluoInt: 1,
        Symm: 1,
        Polish: 1,
        Cut: 1,
        Clarity: 1,
        Color: 1,
        Carats: 1,
        Shape: 1,
        CertificateNo: 1,
        Lab: 1,
        SKU: 1,
        SrNo: 1,
      },
    },
  ]);

  const stockCount = Carets.length;

  return {
    statusCode: Carets.length > 0 ? 200 : 204,
    message:
      Carets.length > 0 ? "Carets retrieved successfully" : "No Carets found",
    data: Carets,
    TotalCount: stockCount,
  };
};

router.get("/caretdata", async function (req, res) {
  try {
    const result = await fetchcaratsDetails();

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({ result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const fetchShapeDataDetails = async (shape) => {
  try {
    const matchQuery = { IsDelete: false };

    if (shape) {
      matchQuery.Shape = shape;
    }

    let Carets;

    if (shape) {
      // Fetch 5 records for the selected shape
      Carets = await stockSchema.aggregate([
        { $match: matchQuery },
        { $sort: { Amount: -1 } },
        { $limit: 5 },
        {
          $project: {
            Image: 1,
            // Video: 1,
            // DiamondType: 1,
            // HA: 1,
            // Ratio: 1,
            // Tinge: 1,
            // Milky: 1,
            // EyeC: 1,
            // Table: 1,
            // Depth: 1,
            // measurements: 1,
            Amount: 1,
            Price: 1,
            // Disc: 1,
            // Rap: 1,
            // FluoInt: 1,
            // Symm: 1,
            // Polish: 1,
            Cut: 1,
            Clarity: 1,
            Color: 1,
            Carats: 1,
            Shape: 1,
            // CertificateNo: 1,
            Lab: 1,
            SKU: 1,
            // SrNo: 1,
          },
        },
      ]);
    } else {
      // Fetch 5 records per unique shape WITHOUT grouping
      Carets = await stockSchema.aggregate([
        { $match: matchQuery },
        { $sort: { Shape: 1, Amount: -1 } }, // Sort by Shape and Amount descending
        {
          $group: {
            _id: "$Shape",
            diamonds: { $push: "$$ROOT" },
          },
        },
        { $unwind: "$diamonds" }, // Flatten grouped diamonds array
        { $sort: { "diamonds.Amount": -1 } }, // Sort by Amount descending within each shape
        { $group: { _id: "$_id", diamonds: { $push: "$diamonds" } } }, // Re-group for slicing
        { $project: { diamonds: { $slice: ["$diamonds", 5] } } }, // Take only top 5 per shape
        { $unwind: "$diamonds" }, // Flatten the final result
        {
          $project: {
            Image: "$diamonds.Image",
            Amount: "$diamonds.Amount",
            Price: "$diamonds.Price",
            Cut: "$diamonds.Cut",
            Clarity: "$diamonds.Clarity",
            Color: "$diamonds.Color",
            Carats: "$diamonds.Carats",
            Shape: "$diamonds.Shape",
            Lab: "$diamonds.Lab",
            SKU: "$diamonds.SKU",
          },
        },
      ]);
    }

    return {
      statusCode: Carets.length > 0 ? 200 : 204,
      message:
        Carets.length > 0 ? "Carets retrieved successfully" : "No Carets found",
      data: Carets,
    };
  } catch (error) {
    console.error("Error fetching shape data details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

// **API Route**
router.get("/shapedata", async function (req, res) {
  try {
    const shape = req.query.shape || null;
    const result = await fetchShapeDataDetails(shape);

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({ result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const getSimilarDiamonds = async (carat, color, clarity, shape) => {
  try {
    const result = await fetchStockDetails();

    if (
      result.statusCode !== 200 ||
      !result.data ||
      !Array.isArray(result.data)
    ) {
      return { statusCode: result.statusCode, data: [] };
    }

    const caratValue = parseFloat(carat);

    let similarDiamonds = result.data.filter((diamond) => {
      const diamondCarat = parseFloat(diamond.Carats);
      return (
        diamond.Shape === shape &&
        (diamond.Color === color ||
          (diamond.Clarity === clarity &&
            Math.abs(diamondCarat - caratValue) <= 0.2))
      );
    });

    if (similarDiamonds.length === 0) {
      similarDiamonds = result.data.filter((diamond) => {
        const diamondCarat = parseFloat(diamond.Carats);
        return (
          diamond.Shape === shape &&
          ((diamond.Color === color || diamond.Clarity === clarity) &&
            Math.abs(diamondCarat - caratValue)) <= 0.3
        );
      });
    }

    if (similarDiamonds.length === 0) {
      similarDiamonds = result.data.filter((diamond) => {
        const diamondCarat = parseFloat(diamond.Carats);
        return (
          diamond.Shape === shape && Math.abs(diamondCarat - caratValue) <= 0.4
        );
      });
    }

    similarDiamonds = similarDiamonds.slice(0, 5);

    const projectedDiamonds = similarDiamonds.map((diamond) => ({
      Image: diamond.Image,
      Amount: diamond.Amount,
      Price: diamond.Price,
      Cut: diamond.Cut,
      Clarity: diamond.Clarity,
      Color: diamond.Color,
      Carats: diamond.Carats,
      Shape: diamond.Shape,
      Lab: diamond.Lab,
      SKU: diamond.SKU,
    }));

    return { statusCode: 200, data: projectedDiamonds };
  } catch (error) {
    console.error("Error in getSimilarDiamonds:", error.message);
    return { statusCode: 500, data: [], message: error.message };
  }
};

router.get("/similarproducts", async function (req, res) {
  try {
    const { carat, color, clarity, shape } = req.query;

    if (!carat || !color || !clarity || !shape) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "Missing required query parameters: carat, color, clarity, shape",
      });
    }

    let result = await getSimilarDiamonds(carat, color, clarity, shape);

    if (result.statusCode === 200 && result.data.length > 0) {
      result.data = result.data.map((diamond) => {
        return {
          ...diamond,
          certificateUrl: getCertificateUrl(diamond.Lab, diamond.CertificateNo),
          Image:
            diamond.Image && diamond.Image.length > 0
              ? diamond.Image
              : getDefaultImageUrl(diamond.Shape),
        };
      });
    }

    res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error in /similarproducts route:", error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// function getDefaultImage(Shape) {
//   const lowerCaseShape = Shape.toLowerCase();
//   switch (lowerCaseShape) {
//     case "asscher":
//     case "sq eme":
//       return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
//     case "baguette":
//     case "bug":
//       return "https://jpsjewels.com/wp-content/uploads/Tapered-baguette.png";
//     case "cushion":
//     case "cu":
//       return "https://jpsjewels.com/wp-content/uploads/Cushion.png";
//     case "square cushion":
//     case "sq cu":
//       return "https://jpsjewels.com/wp-content/uploads/Cushion.png";
//     case "cushion modified":
//       return "https://jpsjewels.com/wp-content/uploads/Cushion-Square.png";
//     case "emerald":
//     case "eme":
//       return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
//     case "square emerald":
//       return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
//     case "heart":
//     case "he":
//       return "https://jpsjewels.com/wp-content/uploads/Heart.png";
//     case "heart modified":
//       return "https://jpsjewels.com/wp-content/uploads/Heart.png";
//     case "long radiant":
//     case "long rad":
//       return "https://jpsjewels.com/wp-content/uploads/Radiant.png";
//     case "marquise":
//     case "mq":
//       return "https://jpsjewels.com/wp-content/uploads/Marquise.png";
//     case "marquise modified":
//       return "https://jpsjewels.com/wp-content/uploads/Marquise.png";
//     case "oval":
//     case "ovl":
//       return "https://jpsjewels.com/wp-content/uploads/Oval.png";
//     case "pear":
//     case "pe":
//       return "https://jpsjewels.com/wp-content/uploads/Pear.png";
//     case "princess":
//     case "pri":
//       return "https://jpsjewels.com/wp-content/uploads/Princess.png";
//     case "princess modified":
//       return "https://jpsjewels.com/wp-content/uploads/Princess.png";
//     case "radiant":
//     case "rad":
//       return "https://jpsjewels.com/wp-content/uploads/Radiant-Square.png";
//     case "radiant modified":
//       return "https://jpsjewels.com/wp-content/uploads/Radiant.png";
//     case "round":
//     case "rbc":
//       return "https://jpsjewels.com/wp-content/uploads/Round.png";
//     default:
//       return "https://jpsjewels.com/wp-content/uploads/Round.png";
//   }
// }

const fetchDaimondDetails = async (SkuId) => {
  const diamondSearchQuery = await stockSchema.findOne({
    SKU: SkuId,
    IsDelete: false,
  });

  if (!diamondSearchQuery) {
    return {
      statusCode: 400,
      message: "stock item not found",
    };
  }

  const diamonds = await stockSchema.aggregate([
    { $match: diamondSearchQuery },
    {
      $project: {
        Image: 1,
        Video: 1,
        DiamondType: 1,
        HA: 1,
        Ratio: 1,
        Tinge: 1,
        Milky: 1,
        EyeC: 1,
        Table: 1,
        Depth: 1,
        measurements: 1,
        Amount: 1,
        Price: 1,
        Disc: 1,
        Rap: 1,
        FluoInt: 1,
        Symm: 1,
        Polish: 1,
        Cut: 1,
        Clarity: 1,
        Color: 1,
        Carats: 1,
        Shape: 1,
        CertificateNo: 1,
        Lab: 1,
        SKU: 1,
        SrNo: 1,
      },
    },
  ]);

  return {
    statusCode: diamonds.length > 0 ? 200 : 204,
    message:
      diamonds.length > 0
        ? "diamonds retrieved successfully"
        : "No diamonds found",
    data: diamonds,
  };
};

router.get("/data/:SkuId", async function (req, res) {
  try {
    const { SkuId } = req.params;
    const result = await fetchDaimondDetails(SkuId);

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;
        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const fetchSearchDaimondDetails = async (CertificateNo) => {
  const diamondSearchQuery = await stockSchema.findOne({
    CertificateNo: CertificateNo,
    IsDelete: false,
  });

  if (!diamondSearchQuery) {
    return {
      statusCode: 400,
      message: "stock item not found",
    };
  }

  const diamonds = await stockSchema.aggregate([
    { $match: diamondSearchQuery },
    {
      $project: {
        Image: 1,
        Video: 1,
        DiamondType: 1,
        HA: 1,
        Ratio: 1,
        Tinge: 1,
        Milky: 1,
        EyeC: 1,
        Table: 1,
        Depth: 1,
        measurements: 1,
        Amount: 1,
        Price: 1,
        Disc: 1,
        Rap: 1,
        FluoInt: 1,
        Symm: 1,
        Polish: 1,
        Cut: 1,
        Clarity: 1,
        Color: 1,
        Carats: 1,
        Shape: 1,
        CertificateNo: 1,
        Lab: 1,
        SKU: 1,
        SrNo: 1,
      },
    },
  ]);

  return {
    statusCode: diamonds.length > 0 ? 200 : 204,
    message:
      diamonds.length > 0
        ? "diamonds retrieved successfully"
        : "No diamonds found",
    data: diamonds,
  };
};

router.get("/searchdata/:CertificateNo", async function (req, res) {
  try {
    const { CertificateNo } = req.params;

    if (!/^\d+$/.test(CertificateNo)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Certificate Number. Only numeric values are allowed.",
      });
    }

    const result = await fetchSearchDaimondDetails(CertificateNo);

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/stockpopup", verifyLoginToken, async function (req, res) {
  try {
    const { SkuId } = req.query;
    const result = await fetchDaimondDetails(SkuId);

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        diamond.Image =
          diamond.Image && diamond.Image.length > 0
            ? diamond.Image
            : defaultImageUrl;
      });
    }

    res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

const deletestock = async (SKU) => {
  try {
    const findCart = await Cart.findOne({
      SKU: SKU,
      IsDelete: false,
      IsCheckout: false,
    });
    if (findCart) {
      return {
        statusCode: 205,
        message: `can't delete It's Already is in Cart!!!`,
      };
    }

    const updatestock = await stockSchema.findOneAndUpdate(
      { SKU, IsDelete: false },
      { $set: { IsDelete: true } },
      { new: true }
    );

    if (!updatestock) {
      return {
        statusCode: 404,
        message: `Stock not found or already deleted!`,
      };
    }
    return {
      statusCode: 200,
      message: `stock item deleted successfully.`,
      data: updatestock,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to soft delete stock item data.",
      error: error.message,
    };
  }
};

router.delete("/deletestock/:SKU", verifyLoginToken, async (req, res) => {
  try {
    const { SKU } = req.params;
    const response = await deletestock(SKU);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
});

module.exports = router;
