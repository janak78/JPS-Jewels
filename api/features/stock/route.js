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
    case "long octagon":
      return "https://jpsjewels.com/api/images/Octagonal.jpg";
    case "pentagonal":
    case "long pentagon":
      return "https://jpsjewels.com/api/images/Pentagonal.jpg";
    case "shield":
    case "scad":
    case "sld":
      return "https://jpsjewels.com/api/images/Shield.jpg";
    case "trapezoid":
    case "tp":
    case "trapez":
    case "wide trapezoid":
    case "long trapezoid":
      return "https://jpsjewels.com/api/images/Trapezoid.jpg";
    case "half moon":
    case "hm":
      return "https://jpsjewels.com/api/images/Halfmoon.jpg";
    case "tapered baguette":
    case "tb":
      return "https://jpsjewels.com/api/images/Taperedbaguette.jpg";
    case "baguette":
    case "bgt":
      return "https://jpsjewels.com/api/images/Baguette.jpg";
    case "lozenge":
    case "lozg":
      return "https://jpsjewels.com/api/images/Lozenge.jpg";
    case "rose cut":
    case "rose":
      return "https://jpsjewels.com/api/images/Rosecut.jpg";
    case "trilliant":
      return "https://jpsjewels.com/api/images/Trilliant.jpg";
    case "hexagonal":
      return "https://jpsjewels.com/api/images/Hexagonal.jpg";
    case "bullet":
    case "bullet cut":
      return "https://jpsjewels.com/api/images/BULLET.jpg";
    case "kite":
    case "kmsc":
      return "https://jpsjewels.com/api/images/kite.jpg";
    case "asscher":
    case "sq eme":
    case "sqemerald":
    case "square emerald":
      return "https://jpsjewels.com/api/images/EMARALD.jpg";
    case "baguette":
    case "bug":
      return "https://jpsjewels.com/api/images/Bug.jpg";
    case "cushion":
    case "cu":
    case "square cushion":
    case "sq cu":
    case "cushion modified":
    case "cushion brilliant":
    case "cushion brilliant ha":
    case "long cushion":
    case "long cu bril":
    case "cm":
    case "cus. crisscut":
      return "https://jpsjewels.com/api/images/Cushion.jpg";
    case "emerald":
    case "eme":
    case "square emerald":
    case "sem":
    case "ecbf":
    case "eca":
    case "ecmb":
    case "ecm":
    case "elegance emerald":
      return "https://jpsjewels.com/api/images/EMARALD.jpg";
    case "heart":
    case "he":
    case "heart modified":
    case "hrt":
    case "heart mb":
    case "heart stepcut":
      return "https://jpsjewels.com/api/images/Heart.jpg";
    case "long radiant":
    case "long rad":
    case "radiant":
    case "rad":
    case "radiant modified":
    case "rmb":
    case "rm":
    case "sq.rad":
      return "https://jpsjewels.com/api/images/RADIENT.jpg";
    case "marquise":
    case "mq":
    case "marquise modified":
    case "mmc":
    case "mq. stepcut":
      return "https://jpsjewels.com/api/images/Marquise.jpg";
    case "oval":
    case "ovl":
    case "oval stepcut":
    case "moval":
      return "https://jpsjewels.com/api/images/OVAL.jpg";
    case "pear":
    case "pe":
    case "pmc":
    case "pmb":
    case "pear stepcut":
    case "pear old cut":
      return "https://jpsjewels.com/api/images/PEAR.jpg";
    case "princess":
    case "pri":
    case "princess modified":
    case "pr":
      return "https://jpsjewels.com/api/images/PRINCESS.jpg";
    case "round":
    case "rbc":
    case "round modifi brillin":
      return "https://jpsjewels.com/api/images/RBC.jpg";
    default:
      return "https://jpsjewels.com/api/images/diamond.jpg"; // Default fallback image
  }
}

const colors = new Map(
  [
    "Yellow",
    "Orange",
    "Pink",
    "Blue",
    "Green",
    "Brown",
    "Red",
    "White",
    "Violet",
    "Purple",
    "Gray",
    "Olive",
    "Black",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ].map((c) => [c.toLowerCase(), c])
);

const intensities = [
  "Fancy Deep",
  "Fancy Dark",
  "Fancy Vivid",
  "Fancy Intense",
  "Fancy Light",
  "Very Light",
  "Light",
  "Faint",
  "Fancy",
];

const overtones = new Map(
  [
    "Beige",
    "Beige White",
    "Black",
    "Bluish",
    "Brown",
    "Dark Brown",
    "Dark Golden",
    "Golden",
    "Green",
    "Light Beige",
    "Light Brown",
    "Light Golden",
    "Pink",
    "Pinkish",
    "Red",
    "Reddish",
    "White",
    "Yellow",
    "Yellowish",
    "Brownish",
    "Greenish",
  ].map((o) => [o.toLowerCase(), o])
);

function extractAttributes(input) {
  const result = { color: new Set(), intensity: null, overtone: new Set() };

  const lowerInput = input.toLowerCase().replace(/-/g, " ");
  const sortedIntensities = [...intensities].sort(
    (a, b) => b.length - a.length
  );

  let usedWords = new Set();

  for (const intensity of sortedIntensities) {
    const lowerIntensity = intensity.toLowerCase();
    if (lowerInput.includes(lowerIntensity)) {
      result.intensity = intensity;
      usedWords = new Set(lowerIntensity.split(" "));
      break;
    }
  }

  const words = lowerInput.split(/\s+/);
  for (const word of words) {
    if (colors.has(word)) {
      result.color.add(colors.get(word));
    }
    if (overtones.has(word) && !usedWords.has(word)) {
      result.overtone.add(overtones.get(word));
    }
  }

  words.forEach((word, index) => {
    if (index < words.length - 1) {
      const compound = `${word} ${words[index + 1]}`;
      if (
        overtones.has(compound) &&
        !usedWords.has(word) &&
        !usedWords.has(words[index + 1])
      ) {
        result.overtone.add(overtones.get(compound));
      }
    }
  });

  return {
    color: result.color.size ? Array.from(result.color).join(", ") : null,
    intensity: result.intensity,
    overtone: result.overtone.size
      ? Array.from(result.overtone).join(", ")
      : null,
  };
}

router.post("/addstocks", upload.single("file"), async (req, res) => {
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

    const parseNumber = (value) => {
      if (typeof value === "string") {
        return parseFloat(value.replace(/,/g, "")) || 0; // Remove commas and convert to number
      }
      return value || 0;
    };

    const getHyperlink = (cell, worksheet) => {
      if (cell && cell.l && cell.l.Target) {
        return cell.l.Target; // Extract hyperlink
      }
      return cell ? cell.v : ""; // Return cell value if no hyperlink
    };

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

      const imageCellRef = Object.keys(worksheet).find(
        (key) => worksheet[key].v === data.Image
      );
      const videoCellRef = Object.keys(worksheet).find(
        (key) => worksheet[key].v === data.Video
      );

      const imageUrl = imageCellRef
        ? getHyperlink(worksheet[imageCellRef], worksheet)
        : data.Image;
      const videoUrl = videoCellRef
        ? getHyperlink(worksheet[videoCellRef], worksheet)
        : data.Video;

      const defaultImageUrl = getDefaultImageUrl(data.Shape);
      const finalImage =
        imageUrl && imageUrl.length > 0 ? imageUrl : defaultImageUrl;

      const colorIntensityData = extractAttributes(
        `${data.Color || ""} ${data.Intensity || ""}`
      );

      await stockSchema.findOneAndUpdate(
        { SKU: data.SKU },
        {
          Image: finalImage,
          Video: videoUrl,
          DiamondType: data["Diamond Type"],
          HA: data["H&A"],
          Ratio: data.Ratio,
          Tinge: data.Tinge,
          Milky: data.Milky,
          EyeC: data.EyeC,
          Table: parseNumber(data["Table(%)"]),
          Depth: parseNumber(data["Depth(%)"]),
          measurements: data.measurements,
          Amount: parseNumber(data["Amount U$"]),
          Price: parseNumber(data["Price $/ct"]),
          Disc: parseNumber(data["Disc %"]),
          Rap: parseNumber(data["Rap $"]),
          FluoInt: data["Fluo Int"],
          Symm: data.Symm,
          Polish: data.Polish,
          Intensity: colorIntensityData.intensity,
          Cut: data.Cut,
          Clarity: data.Clarity,
          Color: colorIntensityData.color,
          Overtone: colorIntensityData.overtone,
          Carats: parseNumber(data.Carats),
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
});

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

        // const defaultImageUrl = getDefaultImageUrl(diamond.Shape);
        // diamond.Image =
        //   diamond.Image && diamond.Image.length > 0
        //     ? diamond.Image
        //     : defaultImageUrl;
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
      // If "Other" (empty string) is selected, remove shape filtering
      if (query.Shape.includes("other")) {
        delete matchStage.Shape;
      } else {
        matchStage.Shape = { $in: query.Shape };
      }
    }
    

    if (query.Color?.length) {
      let selectedColors = Array.isArray(query.Color)
        ? query.Color.flatMap((color) => color.split(/\s*,\s*/)) // Split if comma-separated
        : [query.Color];

      matchStage.Color = { $regex: selectedColors.join("|"), $options: "i" };
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
    if (query.Intensity?.length) {
      matchStage.Intensity = Array.isArray(query.Intensity)
        ? { $in: query.Intensity }
        : query.Intensity;
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
      {
        $addFields: {
          hasBothColors: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$Color",
                  regex:
                    query.Color &&
                    Array.isArray(query.Color) &&
                    query.Color.length > 0
                      ? `^.*${query.Color.join(".*")}.*$`
                      : ".*",
                  options: "i",
                },
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      { $sort: { hasBothColors: -1, createdAt: 1 } },
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

    [
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
    ] = [
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
    if (shape) matchQuery.Shape = shape;

    let Carets;

    if (shape) {
      // Fetch 5 records for the selected shape
      Carets = await stockSchema
        .aggregate([
          { $match: matchQuery },
          { $sort: { Amount: -1 } },
          { $limit: 5 },
          {
            $project: {
              Image: 1,
              Amount: 1,
              Price: 1,
              Cut: 1,
              Clarity: 1,
              Color: 1,
              Carats: 1,
              Shape: 1,
              Lab: 1,
              SKU: 1,
            },
          },
        ])
        .allowDiskUse(true);
    } else {
      // Efficiently fetch 5 records per shape
      Carets = await stockSchema
        .aggregate([
          { $match: matchQuery },

          // Group directly while limiting to prevent memory overload
          {
            $facet: {
              groupedByShape: [
                { $sort: { Amount: -1 } },
                {
                  $group: {
                    _id: "$Shape",
                    diamonds: { $push: "$$ROOT" },
                  },
                },
                { $set: { diamonds: { $slice: ["$diamonds", 5] } } }, // ✅ Limit within each group
              ],
            },
          },
          { $unwind: "$groupedByShape" },
          { $replaceRoot: { newRoot: "$groupedByShape" } },

          // Flatten structure
          { $unwind: "$diamonds" },
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
        ])
        .allowDiskUse(true);
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
    SKU: CertificateNo,
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
