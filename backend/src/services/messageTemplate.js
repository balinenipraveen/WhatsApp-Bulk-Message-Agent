/**
 * Personalize message template by replacing {name} placeholder
 * @param {string} template - Message template with {name} placeholder
 * @param {string} name - Customer name to insert
 * @returns {string} Personalized message
 */
export const personalizeMessage = (template, name) => {
  if (!template || !name) {
    throw new Error('Template and name are required');
  }

  // Replace all occurrences of {name} with actual name
  return template.replace(/{name}/gi, name);
};

/**
 * Validate message template
 * @param {string} template - Message template to validate
 * @returns {object} Validation result
 */
export const validateTemplate = (template) => {
  if (!template || typeof template !== 'string') {
    return {
      valid: false,
      message: 'Template must be a non-empty string'
    };
  }

  if (template.trim().length === 0) {
    return {
      valid: false,
      message: 'Template cannot be empty'
    };
  }

  if (template.length > 4096) {
    return {
      valid: false,
      message: 'Template exceeds maximum length of 4096 characters'
    };
  }

  // Check if template contains {name} placeholder
  const hasNamePlaceholder = /{name}/i.test(template);

  return {
    valid: true,
    hasNamePlaceholder,
    message: hasNamePlaceholder
      ? 'Template is valid with name personalization'
      : 'Template is valid (no name personalization)'
  };
};

/**
 * Generate preview messages for a list of customers
 * @param {string} template - Message template
 * @param {Array} customers - Array of customer objects with name property
 * @param {number} limit - Maximum number of previews to generate
 * @returns {Array} Array of preview objects
 */
export const generatePreviews = (template, customers, limit = 5) => {
  if (!Array.isArray(customers) || customers.length === 0) {
    return [];
  }

  const previewCount = Math.min(limit, customers.length);
  const previews = [];

  for (let i = 0; i < previewCount; i++) {
    const customer = customers[i];
    previews.push({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      personalizedMessage: personalizeMessage(template, customer.name)
    });
  }

  return previews;
};

