//XLSX
const XLSX = require("xlsx");
const createExporttokpedfile = (data, filePath) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Map the data to match the columns (Product ID, Nama Produk, etc.)
  // sesuai pada function ketika nanti dipanggil
  const mappedData = data.map((item) => ({
    "Product ID": item.productid,
    "Nama Produk": item.nama,
    URL: item.url,
    "Minimum Pemesanan": item.minpesan,
    "Total Stok": item.totstok,
    "Stok Campaign": item.stokcampaign,
    "Harga (Rp)*": item.hargajual,
    "Stok Utama*": item.stok,
    "Pengingat Stok": item.ingatstok,
    "SKU Name": item.sku,
    "Status*": item.status,
    "Berat* (Gram)": item.berat,
  }));

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(mappedData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Write the workbook to the specified file path
  XLSX.writeFile(workbook, filePath);
};

const readImportTokopedia = (fileBuffer) => {
  // Parse the XLSX file using the `xlsx` library
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON array format
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get data in array format

  const rowData = [];

  //Access each row and column
  jsonData.forEach((row, rowIndex) => {
    const rowInfo = {};
    row.forEach((cell, colIndex) => {
      rowInfo[`col${colIndex + 1}`] = cell || ""; // Access each column of the row
    });
    rowData.push({ [`row${rowIndex + 1}`]: rowInfo });
  });

  const infotokped = [];

  rowData.forEach((row, index) => {
    const key = Object.keys(row)[0]; // Get the key for each row (row1, row2, row3...)
    const col1 = row[key].col1; // Access col1
    const col2 = row[key].col2; // Access col2

    if (index != 0) {
      // header harus
      infotokped.push({ sku: col2, idTokped: col1 });
    }
  });

  // Respond with the data and the
  return infotokped;
};

module.exports = { createExporttokpedfile, readImportTokopedia };
