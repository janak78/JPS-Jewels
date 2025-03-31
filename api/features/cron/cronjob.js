// const cron = require("node-cron");
// const fs = require("fs");
// const path = require("path");
// const mongoose = require("mongoose");
// const { processExcelFile } = require("../stock/route");
// const CronjobModel = require("../cron/modal");

// cron.schedule("*/1 * * * *", async () => {
//   console.log(
//     "Cron job started... Checking if another instance is running..."
//   );

//   // Check if a job is already running
//   const runningJob = await CronjobModel.findOne({ IsCronjob_running: true });

//   if (runningJob) {
//     console.log("Another cron instance is running. Skipping this cycle.");
//     return;
//   }

//   // Mark the job as running
//   await CronjobModel.updateMany({}, { IsCronjob_running: true });

//   console.log("No other cron job is running. Proceeding with execution...");

//   const pendingFolder = path.join(__dirname, "../pendingFiles");

//   if (!fs.existsSync(pendingFolder)) {
//     console.log(" No pending folder found. Skipping this cycle.");
//     await CronjobModel.updateMany({}, { IsCronjob_running: false });
//     return;
//   }

//   const files = fs
//     .readdirSync(pendingFolder)
//     .filter((file) => file.endsWith(".xlsx"));

//   if (files.length === 0) {
//     console.log("No pending files found. Exiting cron job.");
//     await CronjobModel.updateMany({}, { IsCronjob_running: false });
//     return;
//   }

//   console.log(`Found ${files.length} pending file(s) to process.`);

//   for (const fileName of files) {
//     try {
//       const filePath = path.join(pendingFolder, fileName);
//       console.log(`🔍 Processing file: ${fileName}`);

//       // Get processing metadata from DB
//       const fileEntry = await CronjobModel.findOne({ Name: fileName });

//       if (!fileEntry) {
//         console.error(`❌ No metadata found in DB for ${fileName}. Skipping.`);
//         continue;
//       }

//       if (fileEntry.Processed) {
//         console.log(`${fileName} is already processed. Skipping.`);
//         continue;
//       }

//       // Process the Excel file
//       await processExcelFile(
//         filePath,
//         fileEntry.IsNatural,
//         fileEntry.IsLabgrown
//       );

//       // Move successfully processed file
//       const successFolder = path.join(__dirname, "../successfullyProcessed");
//       if (!fs.existsSync(successFolder))
//         fs.mkdirSync(successFolder, { recursive: true });
//       fs.renameSync(filePath, path.join(successFolder, fileName));

//       // Mark as processed in DB
//       await CronjobModel.updateOne({ Name: fileName }, { Processed: 1 });

//       console.log(`Successfully processed: ${fileName}`);
//     } catch (error) {
//       console.error(`Error processing ${fileName}:`, error);

//       // Move failed file to error folder
//       const errorFolder = path.join(__dirname, "../errorWhileProcessing");
//       if (!fs.existsSync(errorFolder))
//         fs.mkdirSync(errorFolder, { recursive: true });
//       fs.renameSync(filePath, path.join(errorFolder, fileName));
//     } finally {
//         console.log(`Cleaning up... set false  for all everywhere`);
//       await CronjobModel.updateMany({}, { IsCronjob_running: false });
//     }
//   }

//   console.log("Cron job cycle completed. Waiting for next run...");

//   // Unlock the job after completion
// });

const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { processExcelFile } = require("../stock/route");
const CronjobModel = require("../cron/modal");

cron.schedule("*/1 * * * *", async () => {
  console.log("Cron job started... Checking if another instance is running...");

  // Check if a job is already running
  const runningJob = await CronjobModel.findOne({ IsCronjob_running: true });

  if (runningJob) {
    console.log("Another cron instance is running. Skipping this cycle.");
    return;
  }

  // Mark the job as running
  await CronjobModel.updateMany({}, { IsCronjob_running: true });

  console.log("No other cron job is running. Proceeding with execution...");

  const pendingFolder = path.join(__dirname, "../pendingFiles");

  if (!fs.existsSync(pendingFolder)) {
    console.log("No pending folder found. Skipping this cycle.");
    await CronjobModel.updateMany({}, { IsCronjob_running: false });
    return;
  }

  const files = fs
    .readdirSync(pendingFolder)
    .filter((file) => file.endsWith(".xlsx"));

  if (files.length === 0) {
    console.log("No pending files found. Exiting cron job.");
    await CronjobModel.updateMany({}, { IsCronjob_running: false });
    return;
  }

  console.log(`Found ${files.length} pending file(s) to process.`);

  for (const fileName of files) {
    try {
      const filePath = path.join(pendingFolder, fileName);
      console.log(`🔍 Processing file: ${fileName}`);

      const fileEntry = await CronjobModel.findOne({ Name: fileName });

      if (!fileEntry) {
        console.error(`❌ No metadata found in DB for ${fileName}. Skipping.`);
        continue;
      }

      if (fileEntry.Processed) {
        console.log(`${fileName} is already processed. Skipping.`);
        continue;
      }

      await CronjobModel.updateOne({ Name: fileName }, { Status: "Uploading" });

      // Process the file and track inserted rows
      const insertedCount = await processExcelFile(
        filePath,
        fileEntry.IsNatural,
        fileEntry.IsLabgrown
      );

      await CronjobModel.updateOne(
        { Name: fileName },
        { Processed: 1, InsertedRows: insertedCount, Status: "Completed" }
      );

      console.log(`Successfully processed: ${fileName}`);
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error);
      await CronjobModel.updateOne({ Name: fileName }, { Status: "Failed" });
    } finally {
      await CronjobModel.updateMany({}, { IsCronjob_running: false });
    }
  }

  console.log("Cron job cycle completed. Waiting for next run...");
});
