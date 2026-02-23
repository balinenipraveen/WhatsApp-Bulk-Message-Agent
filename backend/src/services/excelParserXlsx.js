import XLSX from 'xlsx';
import fs from 'fs';

export const parseExcelFile = async (filePath) => {
  try {
    // Read the file
    const workbook = XLSX.readFile(filePath);

    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('Excel file is empty or invalid');
    }

    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const customers = [];
    const errors = [];

    // Check if first row looks like a header
    let hasHeader = false;
    let startRow = 0;

    if (data.length > 0 && data[0][0]) {
      const firstCell = String(data[0][0]).toLowerCase();
      if (firstCell.includes('name') || firstCell.includes('customer')) {
        hasHeader = true;
        startRow = 1;
      }
    }

    // Process rows
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 1;

      const name = row[0];
      const phoneNumber = row[1];

      // Skip empty rows
      if (!name && !phoneNumber) continue;

      // Validate row data
      if (!name || !phoneNumber) {
        errors.push({
          row: rowNumber,
          message: `Missing ${!name ? 'name' : 'phone number'}`
        });
        continue;
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
        continue;
      }

      customers.push({
        name: String(name).trim(),
        phoneNumber: cleanedPhone
      });
    }

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

