const ImageKit = require('imagekit');

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit = null;

if (publicKey && privateKey && urlEndpoint) {
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint
  });
} else {
  console.warn('⚠️ ImageKit environment variables missing! Uploads will fail until configured.');
}

module.exports = imagekit;

