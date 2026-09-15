export const getImageUrl = (image, defaultFallback = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80') => {
  if (!image) return defaultFallback;
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image;
  }
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://smart-event-registration-portal-74sf.onrender.com/uploads';
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanImg = String(image).replace(/^\//, '');
  return `${cleanBase}/${cleanImg}`;
};
