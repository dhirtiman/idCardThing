const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const csv = require("csv-parser");

const dataPoints = [];

function addSpaceAroundSlash(str) {
  if (str.includes("/")) {
    // Add space before and after the slash
    return str.replace("/", " / ");
  } else {
    return str;
  }
}

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
          const dpi = 600; // DPI value
          const canvas = createCanvas(imageDimensions.x, imageDimensions.y, {
            density: dpi,
          });
          const ctx = canvas.getContext("2d");

          loadImage(templateImage).then((image) => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            const endIndex = Math.min(
              startIndex + batchSize,
              dataPoints.length
            );
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
  ctx.font = "bold 48px serif"; // size for the STUDENT NAME
  if (rowData["Student Name"].length > 16) {
    // CONDITIONS if Name is  long
    ctx.font = "bold 36px serif";
    if (rowData["Student Name"].length > 21) {
      ctx.font = "bold 34.5px serif";
    }
  }

  ctx.fillStyle = "#FFFF00"; // Yellow

  ctx.fillText(rowData["Student Name"], x, y,590); /// write student name


  ctx.font = "bold 48px serif";

  if (rowData['Class'].length > 6) {   // IF CLASS IS LONG ASS HELLL NURSEREY
    ctx.fillText('CLASS : '+rowData['Class'],x+10,y+58) // write class   
    // ctx.fillText('.',x+10,y+58) // write class   

  }else{
    ctx.textAlign = "left";
    ctx.fillText('CLASS : ',x-138,y+58) // write class 
    
    ctx.fillText(rowData['Class'],x+60,y+58,230) // write class 
  
  }




  
  ctx.font = "bold 28px serif"; // smaller text
  ctx.textAlign = "left";

  ctx.fillStyle = "#FFFFFF"; // back to white

  ctx.fillText(rowData["Father's Name"], x - 60, y + 100, 350); // write Father's Name

  ctx.font = "bold 28px serif"; // smaller text
  ctx.fillText(rowData["Mother's Name"], x - 60, y + 158, 350); // write Mother's Name

  ctx.font = "bold 28px serif"; // smaller text
  ctx.fillText(rowData.Address, x - 60, y + 317.5, 350); // write address

  ctx.font = "bold 28px arial";

  const contactNo = rowData["Contact No."];
  const contactNoMain = addSpaceAroundSlash(contactNo);
  ctx.fillText(contactNoMain, x - 60, y + 210); // write contact number

  ctx.fillText(rowData["Date of Birth"], x - 60, y + 262.5);
}

const coordinates = [
  { x: 400, y: 721 }, // 1st
  { x: 1087.5, y: 721 }, // 2nd
  { x: 1765, y: 721 }, // 3rd
  { x: 2450, y: 721 }, // 4th
  { x: 3143, y: 721 }, // 5th
  { x: 400, y: 1908 },
  { x: 1087.5, y: 1908 },
  { x: 1765, y: 1908 },
  { x: 2450, y: 1908 },
  { x: 3143, y: 1908 },
];

const imageDimensions = {
  // image dimensions * same as template files
  x: 3508,
  y: 2480,
};

async function makeFolder(outputPath) {
  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
    } else {
      console.log("Folder created successfully.");
    }
  });
}

// 3508 x 2480
const args = +process.argv.slice(2)
const classNumber = args || 7                              // chose class here  // START HERE

// const templateImage = `./templates/class${classNumber}FullTemplate.png`;
const templateImage = `./templates/fullTemplate.png`;

const outputPath = `./output/class${'mix'}/`;
// const csvFile = `./data/class${classNumber}CSV.csv`;
const csvFile = `./data/classMIXCSV.csv`;


 makeFolder(outputPath); // creates a class dedicated folder

writeDataOnPNG(); // main function
