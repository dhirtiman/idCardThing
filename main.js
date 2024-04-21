const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const csv = require("csv-parser");

const dataPoints = [];

// Read data from CSV file
async function writeDataOnPNG() {
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (row) => {
      // Extract data from CSV and store it
      dataPoints.push(row);
    })
    .on("end", () => {
      let startIndex = 0;
      let batchSize = 10;
      let range = 1;

      function processBatch() {
        if (startIndex < dataPoints.length) {
          const canvas = createCanvas(imageDimensions.x, imageDimensions.y);
          const ctx = canvas.getContext("2d");

          loadImage(templateImage).then((image) => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            const endIndex = Math.min(startIndex + batchSize, dataPoints.length);
            const currentDataPoints = dataPoints.slice(startIndex, endIndex);
            drawDataPoints(currentDataPoints, ctx, coordinates, range);

            // Save image to disk
            const out = fs.createWriteStream(
              outputPath + `/${range}-${endIndex}.png`
            );
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on("finish", () => {
              console.log(`Image ${range}-${endIndex} saved.`);
              // Clear the stream before advancing to the next batch
              stream.destroy();
              // Update start index and range for the next batch
              startIndex += batchSize;
              range = endIndex;
              // Process the next batch
              processBatch();
            });
          });
        }
      }

      // Start processing the first batch
      processBatch();
    });
}

function drawDataPoints(dataPoints, ctx, coordinates, range) {
  for (let i = 0; i < dataPoints.length; i++) {
    if (i >= coordinates.length) break; // Ensure we don't exceed available coordinates
    const { x, y } = coordinates[i];
    writeOne(dataPoints[i], ctx, x, y);
  }
}

async function writeOne(rowData, ctx, x, y) {
  
  ctx.textAlign = "center";
  ctx.font = "bold 96px serif"; // size for the STUDENT NAME
  if (rowData["Student Name"].length > 16) {
    // CONDITIONS if Name is  long
    ctx.font = "bold 72px serif";
    if (rowData["Student Name"].length > 21) {
      ctx.font = "bold 69px serif";
    }
  }

  ctx.fillStyle = "#FFFF00"; // Yellow

  ctx.fillText(rowData["Student Name"], x, y); /// write student name

  ctx.textAlign = "left";

  ctx.font = "bold 56px serif"; // smaller text
  if (rowData["Father's Name"].length > 16) {
    // CONDITIONS if Name is  long
    ctx.font = "bold 50px serif";
    if (rowData["Father's Name"].length > 21) {
      ctx.font = "bold 46px serif";
    }
  }

  ctx.fillStyle = "#FFFFFF"; // back to white

  ctx.fillText(rowData["Father's Name"], x - 180, y + 200); // write Father's Name

  ctx.font = "bold 56px serif"; // smaller text
  if (rowData["Mother's Name"].length > 16) {
    // CONDITIONS if Name is  long
    ctx.font = "bold 50px serif";
    if (rowData["Mother's Name"].length > 21) {
      ctx.font = "bold 40px serif";
    }
  }
  ctx.fillText(rowData["Mother's Name"], x - 120, y + 316); // write Mother's Name

  ctx.font = "bold 56px serif"; // smaller text
  if (rowData.Address.length > 16) {
    // CONDITIONS if Name is  long
    if (rowData.Address.length > 21) {
      ctx.font = "bold 40px serif";
    }
  }
  ctx.fillText(rowData.Address, x - 120, y + 635, 600); // write address

  ctx.font = "bold 56px arial";

  ctx.fillText(rowData["Contact No."], x - 120, y + 420); // write contact number

  ctx.fillText(rowData["Date of Birth"], x - 120, y + 525);
}

const templateImage = "./templates/fullTemplate.png";
const imageDimensions = {
  x: 7016,
  y: 4960,
};
const outputPath = "./output/";
const csvFile = "./data/class3CSV.csv";

const coordinates = [
  { x: 800, y: 1440 }, // 1st
  { x: 2175, y: 1440 }, // 2nd
  { x: 3530, y: 1440 }, // 3rd
  { x: 4900, y: 1440 }, // 4th
  { x: 6256, y: 1440 }, // 5th
  { x: 800, y: 3800 },
  { x: 2175, y: 3800 },
  { x: 3530, y: 3800 },
  { x: 4900, y: 3800 },
  { x: 6256, y: 3800 },
];

writeDataOnPNG();
