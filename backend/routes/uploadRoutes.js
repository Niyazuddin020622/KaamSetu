const express = require('express');
const router = express.Router();
const multer = require('multer');
const imagekit = require('../utils/imagekit');

// Multer memory storage (keeps file in RAM buffer for direct streaming to ImageKit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('केवल इमेज फाइल (JPG, PNG, WebP) अपलोड की जा सकती है।'), false);
    }
  }
});

/**
 * @route   GET /api/upload/imagekit-auth
 * @desc    Get secure authentication parameters for direct client-side upload
 * @access  Public (Safe: Private key is never exposed, only temporary HMAC signature)
 */
router.get('/imagekit-auth', (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: 'ImageKit backend is not configured'
      });
    }

    const authParams = imagekit.getAuthenticationParameters();
    res.json({
      success: true,
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  } catch (err) {
    console.error('ImageKit auth parameters error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ImageKit upload token'
    });
  }
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload image directly through backend to ImageKit
 * @access  Public / Protected
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: 'ImageKit credentials not configured in backend environment.'
      });
    }

    let fileBuffer = null;
    let fileName = `worker_${Date.now()}`;
    const folder = req.body.folder || '/kaamsetu/workers';

    // 1. Support multipart form file
    if (req.file) {
      fileBuffer = req.file.buffer;
      const cleanOriginal = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      fileName = `${Date.now()}_${cleanOriginal}`;
    } 
    // 2. Support base64 string fallback
    else if (req.body.imageBase64) {
      fileBuffer = req.body.imageBase64;
      fileName = `${Date.now()}_upload.jpg`;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: 'कृपया अपलोड करने के लिए कोई इमेज चुनें।'
      });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
      useUniqueFileName: true,
      tags: ['kaamsetu', 'worker_profile']
    });

    // Provide optimized thumbnail URL with on-the-fly smart face-crop & webp
    const optimizedUrl = `${uploadResponse.url}?tr=w-350,h-350,fo-face,q-80,f-auto`;

    res.json({
      success: true,
      url: uploadResponse.url,
      optimizedUrl,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'इमेज अपलोड विफल रहा। कृपया पुनः प्रयास करें।'
    });
  }
});

module.exports = router;

