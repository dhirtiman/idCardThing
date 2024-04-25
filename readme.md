## ID Card Document Automator

This is a id card generator which automates id card using a csv file and template png files

### Dependencies used

- [canvas](https://www.npmjs.com/package/canvas): to create a canvas over the template image
- [csv-parser](https://www.npmjs.com/package/csv-parser): it allow me to read the csv files

### File Structure

```
IDCARDTHING/
│
├── templates/
│   ├── class{classNumber}FullTemplate.png       # Template file for
│
├── data/
│   ├── class {classNumber}.csv               # CSV file containing students details
│
├── output/
│   ├── class{classNumber}/
│   │   ├── 1-10.png            # Generated ID cards
│   │   ├── (n-10)-(n).png
│   │   └── ...
│   └── ...
│
├── main.js             # Main script for generating ID cards
└──
```

### Usage

1. Place your student data in CSV format in the `data/` directory.
2. Customize the ID card template  `templates/` directory.
3. Run the `main.js` script to generate ID cards.
4. The generated ID cards will be saved in the `output/class{classNumber}` directories.

### note: Students csvFile structure

``` 
slno,Student Name,Father's Name,Mother's Name,Class,Contact No.,Date of Birth,Address
```

### How to Run

```bash
node main.js
```

### Contributing

Contributions are not welcome 

### License

DO WHATEVER THE F** YOU WANT WITH THIS PROJECT
