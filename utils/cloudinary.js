
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getAllImages() {

    const response = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix: 'Carousel',
    });
  
    const sliderData = response.resources.map((image, key) => ({
      id: key,
      ...image,
    }));
  
    return sliderData;
  }
  