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
      // Create canvas

      const canvas = createCanvas(imageDimensions.x, imageDimensions.y);
      const ctx = canvas.getContext("2d");

      // Load template background
      loadImage(templateImage).then((image) => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw data points onto the canvas
        ctx.textAlign = "center";
        for (const rowData of dataPoints) {
          let x = 800;
          let y = 1425;

          ctx.font = "bold 96px serif"; // size for the STUDENT NAME 
          if (rowData["Student Name"].length > 16) {    // CONDITIONS if Name is  long
            ctx.font = "bold 72px serif";
            if (rowData["Student Name"].length > 21) {
              ctx.font = "bold 69px serif";
            }
          }

          ctx.fillStyle = "#FFFF00";  // Yellow 

          ctx.fillText(rowData["Student Name"], x, y);   /// write student name 

          ctx.fillStyle = "#111111";   // back to white
          ctx.font = "bold 48px serif";

          // ctx.fillText(rowData['Father\'s Name'], x+100, y);
          //   ctx.fillText(rowData['Mother\'s Name'], x, y);
          //   ctx.fillText(rowData['Contact No.'], x, y);
          //   ctx.fillText(rowData['Date of Birth'], x, y);
          //   ctx.fillText(rowData.Address, x, y);

          break;
        }

        // Save image to disk
        const out = fs.createWriteStream(outputPath + "/output.png");
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on("finish", () => console.log("Image saved."));
      });
    });
}

const templateImage = "./templates/fullTemplate.png";
const imageDimensions = {
  x: 7016,
  y: 4960,
};
const outputPath = "./output/";
const csvFile = "./data/class3CSV.csv";

writeDataOnPNG();
