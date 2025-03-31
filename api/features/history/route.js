var express = require("express");
const Cronmodal = require("../cron/modal");
const { verifyLoginToken } = require("../authentication/authentication");

const router = express.Router();

const historyDetails = async () => {
  const history = await Cronmodal.aggregate([
    {
      $match: { IsDelete: false },
    },
    {
      $project: {
        CronjobId: 1,
        Name: 1,
        Record: 1,
        InsertedRows: 1,
        TotalRows: 1,
        Processed: 1,
        Status: 1,
        Time: 1,
        IsCronjob_running: 1,
        IsDelete: 1,
        IsNatural: 1,
        IsLabgrown: 1,
      },
    },
  ]);

  const historyCount = history.length;

  return {
    statusCode: historyCount > 0 ? 200 : 204,
    message:
      historyCount > 0
        ? "History details retrieved successfully"
        : "No History found",
    data: history,
    TotalCount: historyCount,
  };
};

router.get("/historydetails",  async (req, res) => {
  try {
    const response = await historyDetails();
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong, please try later!" });
  }
});

const historyDetailsPopup = async (CronjobId) => {
  if (!CronjobId) {
    throw new Error("CronjobId is required.");
  }

  const historySearchQuery = {
    CronjobId,
    IsDelete: false,
  };

  const historyData = await Cronmodal.find(historySearchQuery);

  if (historyData.length === 0) {
    return {
      statusCode: 204,
      message: "No Historydetail found",
      data: [],
    };
  }

  const history = await Cronmodal.aggregate([
    { $match: historySearchQuery },
    {
      $project: {
        CronjobId: 1,
        Name: 1,
        Record: 1,
        InsertedRows: 1,
        TotalRows: 1,
        Processed: 1,
        Status: 1,
        Time: 1,
        IsCronjob_running: 1,
        IsDelete: 1,
        IsNatural: 1,
        IsLabgrown: 1,
      },
    },
  ]);

  const historyCount = history.length;

  return {
    statusCode: historyCount > 0 ? 200 : 204,
    message:
      historyCount > 0
        ? "historydetail retrieved successfully"
        : "No History found",
    data: contact,
    TotalCount: historyCount,
  };
};

router.get("/historydetailspopup", verifyLoginToken, async (req, res) => {
  try {
    const { CronjobId } = req.query;

    const response = await historyDetailsPopup(CronjobId);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong, please try later!" });
  }
});

module.exports = router;
