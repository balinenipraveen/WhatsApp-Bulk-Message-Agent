import { validateTemplate, generatePreviews } from '../services/messageTemplate.js';

export const validateMessageTemplate = async (req, res, next) => {
  try {
    const { template } = req.body;

    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Template is required'
      });
    }

    const validation = validateTemplate(template);

    res.json({
      success: true,
      data: validation
    });

  } catch (error) {
    next(error);
  }
};

export const previewMessages = async (req, res, next) => {
  try {
    const { template, customers, limit } = req.body;

    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Template is required'
      });
    }

    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({
        success: false,
        message: 'Customers array is required'
      });
    }

    const previews = generatePreviews(template, customers, limit);

    res.json({
      success: true,
      data: {
        previews,
        total: customers.length
      }
    });

  } catch (error) {
    next(error);
  }
};

