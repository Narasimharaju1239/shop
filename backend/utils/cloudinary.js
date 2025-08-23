// Cloudinary configuration and multer storage setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('Cloudinary ENV:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dtl8qeshm', // replace with your cloud name if not using env
  api_key: process.env.CLOUDINARY_API_KEY || '724486562625323', // replace with your API key if not using env
  api_secret: process.env.CLOUDINARY_API_SECRET || 'W7aVEd91UHY7dt32pSZebozej6c', // replace with your API secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shop-eluru', // change folder name as needed
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

module.exports = { cloudinary, storage };
