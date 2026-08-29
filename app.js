

const getCarouselImgSrc = (car) => {
  if (!car) return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
  const img = car.image ? String(car.image).trim() : '';
  const local = car.localImage ? String(car.localImage).trim() : '';

  // 1. Base64 is self-contained and always works
  if (img.startsWith('data:image')) return img;
  if (local.startsWith('data:image')) return local;

  // 2. Online URLs or Google Drive links/IDs
  if (img && (img.startsWith('http') || img.includes('drive.google.com') || (!img.includes('/') && img.length > 15))) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(img, 1200) : img;
  }

  // 3. Local asset image if provided
  if (local) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(local, 1200) : local;
  }

  // 4. Fallback
  if (img) {
    return typeof formatImageUrl === 'function' ? formatImageUrl(img, 1200) : img;
  }
  return typeof SVG_FALLBACK !== 'undefined' ? SVG_FALLBACK : (typeof SVG_COVER_FALLBACK !== 'undefined' ? SVG_COVER_FALLBACK : '');
};

