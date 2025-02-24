var express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const XLSX = require("xlsx");
const stockSchema = require("./model");
const { verifyLoginToken } = require("../authentication/authentication");

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

router.post(
  "/addstocks",
  verifyLoginToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const fileName = req.file.filename;
      const fileData = `./${fileName}`;
      const workbook = XLSX.readFile(fileData);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // ✅ Define Allowed Fields
      const allowedFields = [
        "Image", "Video", "Diamond Type", "H&A", "Ratio", "Tinge", "Milky",
        "EyeC", "Table(%)", "Depth(%)", "measurements", "Amount U$", "Price $/ct",
        "Disc %", "Rap $", "Fluo Int", "Symm", "Polish", "Cut", "Clarity", "Color",
        "Carats", "Shape", "Certificate No", "Lab", "SKU", "Sr.No"
      ];

      for (const data of jsonData) {
        // ✅ Check for Extra Fields
        const dataFields = Object.keys(data);
        const extraFields = dataFields.filter(field => !allowedFields.includes(field));

        if (extraFields.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid fields detected: ${extraFields.join(", ")}. Only allowed fields are: ${allowedFields.join(", ")}`
          });
        }

        // ✅ Proceed with Inserting Data
        await stockSchema.findOneAndUpdate(
          { SKU: data.SKU },
          {
            Image: data.Image,
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
            Cut: data.Cut,
            Clarity: data.Clarity,
            Color: data.Color,
            Carats: data.Carats,
            Shape: data.Shape,
            CertificateNo: data["Certificate No"],
            Lab: data.Lab,
            SKU: data.SKU,
            SrNo: data["Sr.No"],
          },
          { upsert: true, new: true }
        );
      }

      res.status(200).json({ success: true, message: "Excel file processed successfully" });
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
        // Add certificate URL
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        // Add default image URL based on the shape
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

    const diamondDetailsPage = await stockSchema.aggregate([
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
      {
        $sort: { createdAt: 1 },
      },
    ]);

    const stockCount = diamondDetailsPage.length;

    const totalCount = diamondDetailsPage.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const paginatedDiamonds = diamondDetailsPage.slice(
      pageNumber * pageSize,
      (pageNumber + 1) * pageSize
    );

    return {
      statusCode: diamondDetailsPage.length > 0 ? 200 : 204,
      message:
        diamondDetailsPage.length > 0
          ? "diamondDetailsPage retrieved successfully"
          : "No diamondDetailsPage found",
      data:
        paginatedDiamonds.length > 0 ? paginatedDiamonds : diamondDetailsPage,
      totalPages: totalPages,
      currentPage: pageNumber + 1, // Convert back to 1-based page number
      TotalCount: stockCount,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};

router.get("/data/page", async function (req, res) {
  try {
    const { pageSize, pageNumber } = req.query;

    const result = await fetchDiamondsPageDetails({ pageSize, pageNumber });

    if (result.statusCode === 200) {
      result.data.forEach((diamond) => {
        // Add certificate URL
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        // Add default image URL based on the shape
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

const fetchcaratsDetails = async () => {
  const Carets = await stockSchema.aggregate([
    {
      $match: {
        Carats: 1.32,
        IsDelete: false, // Filter to get only Carats = 1.32
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
        // Add certificate URL
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        // Add default image URL based on the shape
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

function getDefaultImageUrl(Shape) {
  const lowerCaseShape = Shape.toLowerCase();
  switch (lowerCaseShape) {
    case "asscher":
    case "sq eme":
      return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
    case "baguette":
    case "bug":
      return "https://jpsjewels.com/wp-content/uploads/Tapered-baguette.png";
    case "cushion":
    case "cu":
      return "https://jpsjewels.com/wp-content/uploads/Cushion.png";
    case "square cushion":
    case "sq cu":
      return "https://jpsjewels.com/wp-content/uploads/Cushion.png";
    case "cushion modified":
      return "https://jpsjewels.com/wp-content/uploads/Cushion-Square.png";
    case "emerald":
    case "eme":
      return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
    case "square emerald":
      return "https://jpsjewels.com/wp-content/uploads/Emerald-Square.png";
    case "heart":
    case "he":
      return "https://jpsjewels.com/wp-content/uploads/Heart.png";
    case "heart modified":
      return "https://jpsjewels.com/wp-content/uploads/Heart.png";
    case "long radiant":
    case "long rad":
      return "https://jpsjewels.com/wp-content/uploads/Radiant.png";
    case "marquise":
    case "mq":
      return "https://jpsjewels.com/wp-content/uploads/Marquise.png";
    case "marquise modified":
      return "https://jpsjewels.com/wp-content/uploads/Marquise.png";
    case "oval":
    case "ovl":
      return "https://jpsjewels.com/wp-content/uploads/Oval.png";
    case "pear":
    case "pe":
      return "https://jpsjewels.com/wp-content/uploads/Pear.png";
    case "princess":
    case "pri":
      return "https://jpsjewels.com/wp-content/uploads/Princess.png";
    case "princess modified":
      return "https://jpsjewels.com/wp-content/uploads/Princess.png";
    case "radiant":
    case "rad":
      return "https://jpsjewels.com/wp-content/uploads/Radiant-Square.png";
    case "radiant modified":
      return "https://jpsjewels.com/wp-content/uploads/Radiant.png";
    case "round":
    case "rbc":
      return "https://jpsjewels.com/wp-content/uploads/Round.png";
    default:
      return "https://jpsjewels.com/wp-content/uploads/Round.png";
  }
}

const fetchDaimondDetails = async (SkuId) => {
  const diamondSearchQuery = await stockSchema.findOne({
    SKU: SkuId,
    IsDelete: false,
  });
  // console.log(diamondSearchQuery, "diamondSearchQuery");

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
        // Add certificate URL
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        // Add default image URL based on the shape
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
        // Add certificate URL
        const certificateUrl = getCertificateUrl(
          diamond.Lab,
          diamond.CertificateNo
        );
        diamond.certificateUrl = certificateUrl;

        // Add default image URL based on the shape
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
    const updatestock = await stockSchema.findOneAndUpdate(
      { SKU, IsDelete: false },
      { $set: { IsDelete: true } },
      { new: true }
    );

    if (!updatestock) {
      return {
        statusCode: 404,
        message: `No stock item found`,
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
