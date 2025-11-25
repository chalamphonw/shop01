const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

const validateFileType = (filename, allowedTypes) => {
  const ext = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(ext);
};

const validateProductData = (data) => {
  const errors = [];
  
  if (!data.productId?.trim()) errors.push('Product ID is required');
  if (!data.name?.trim()) errors.push('Product name is required');
  if (!data.price || data.price <= 0) errors.push('Valid price is required');
  if (!['white', 'black'].includes(data.color)) errors.push('Invalid color');
  if (!['solar', 'software', 'network'].includes(data.category)) errors.push('Invalid category');
  if (!data.description?.trim()) errors.push('Description is required');
  if (data.stock === undefined || data.stock < 0) errors.push('Valid stock is required');
  
  return errors;
};

module.exports = {
  validateEmail,
  validatePhone,
  validateFileType,
  validateProductData
};
