// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Get API base URL from environment
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  return `${baseUrl}/${cleanPath}`;
};
