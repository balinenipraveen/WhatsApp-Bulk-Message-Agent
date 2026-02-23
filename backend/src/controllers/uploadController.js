import { parseExcelFile } from '../services/excelParserXlsx.js';

export const uploadExcelFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await parseExcelFile(req.file.path);

    res.json({
      success: true,
      message: 'Excel file parsed successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

export const uploadImageFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`
      }
    });

  } catch (error) {
    next(error);
  }
};


