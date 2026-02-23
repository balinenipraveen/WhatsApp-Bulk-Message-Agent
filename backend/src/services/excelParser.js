import ExcelJS from 'exceljs';
import fs from 'fs';

export const parseExcelFile = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('Excel file is empty or invalid');
    }

    const customers = [];
    const errors = [];

    // Start from row 2 to skip header (assuming row 1 is header)
    let hasHeader = false;
    let startRow = 1;

    // Check if first row looks like a header
    const firstRow = worksheet.getRow(1);
    const firstCellValue = firstRow.getCell(1).value;
    if (firstCellValue && typeof firstCellValue === 'string' &&
        (firstCellValue.toLowerCase().includes('name') ||
         firstCellValue.toLowerCase().includes('customer'))) {
      hasHeader = true;
      startRow = 2;
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber < startRow) return;

      const name = row.getCell(1).value;
      const phoneNumber = row.getCell(2).value;

      // Skip empty rows
      if (!name && !phoneNumber) return;

      // Validate row data
      if (!name || !phoneNumber) {
        errors.push({
          row: rowNumber,
          message: `Missing ${!name ? 'name' : 'phone number'}`
        });
        return;
      }

      // Clean and format phone number
      let cleanedPhone = String(phoneNumber).trim().replace(/[\s\-\(\)]/g, '');

      // Add + if not present and starts with digits
      if (!cleanedPhone.startsWith('+') && /^\d/.test(cleanedPhone)) {
        cleanedPhone = '+' + cleanedPhone;
      }

      // Basic phone validation (must start with + and have 10-15 digits)
      if (!/^\+\d{10,15}$/.test(cleanedPhone)) {
        errors.push({
          row: rowNumber,
          message: `Invalid phone number format: ${phoneNumber}. Should include country code (e.g., +1234567890)`
        });
        return;
      }

      customers.push({
        name: String(name).trim(),
        phoneNumber: cleanedPhone
      });
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return {
      success: true,
      customers,
      errors,
      total: customers.length,
      hasErrors: errors.length > 0
    };

  } catch (error) {
    // Clean up file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

