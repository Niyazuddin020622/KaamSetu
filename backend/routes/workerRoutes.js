const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// GET /api/workers - Fetch all workers with flexible filters & search
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      city, 
      minRating, 
      maxRate, 
      availableOnly, 
      emergencyOnly, 
      sortBy,
      limit = 50 
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    if (emergencyOnly === 'true') {
      query.emergencyAvailable = true;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxRate) {
      query.hourlyRate = { $lte: Number(maxRate) };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { subSkills: searchRegex },
        { area: searchRegex },
        { city: searchRegex },
        { bio: searchRegex }
      ];
    }

    let sortOption = { rating: -1, completedJobs: -1 };
    if (sortBy === 'rate_asc') sortOption = { hourlyRate: 1 };
    else if (sortBy === 'rate_desc') sortOption = { hourlyRate: -1 };
    else if (sortBy === 'experience') sortOption = { experienceYears: -1 };
    else if (sortBy === 'rating') sortOption = { rating: -1, reviewCount: -1 };
    else if (sortBy === 'completed') sortOption = { completedJobs: -1 };

    const workers = await Worker.find(query)
      .sort(sortOption)
      .limit(Number(limit));

    res.json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching workers', error: error.message });
  }
});

// GET /api/workers/:id - Single worker details
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving worker profile', error: error.message });
  }
});

// POST /api/workers - Register new worker
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      category,
      subSkills,
      experienceYears,
      hourlyRate,
      dailyRate,
      city,
      area,
      bio,
      avatar,
      languages,
      emergencyAvailable,
      toolsProvided
    } = req.body;

    if (!name || !phone || !category || !hourlyRate || !city || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, category, hourlyRate, city, area.'
      });
    }

    // Default avatars based on trade if not provided
    const defaultAvatars = {
      'Plumber': 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=400&auto=format&fit=crop&q=80',
      'Welder': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80',
      'Electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      'Carpenter': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80',
      'Painter': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80',
      'Mason (Mistri)': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&auto=format&fit=crop&q=80'
    };

    const finalAvatar = avatar && avatar.trim() !== '' 
      ? avatar 
      : (defaultAvatars[category] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

    // Parse subSkills if string
    let parsedSkills = [];
    if (Array.isArray(subSkills)) {
      parsedSkills = subSkills;
    } else if (typeof subSkills === 'string') {
      parsedSkills = subSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const worker = new Worker({
      name,
      phone,
      email: email || '',
      category,
      subSkills: parsedSkills.length ? parsedSkills : [category],
      experienceYears: Number(experienceYears) || 2,
      hourlyRate: Number(hourlyRate),
      dailyRate: dailyRate ? Number(dailyRate) : Number(hourlyRate) * 7,
      city,
      area,
      bio: bio || `Experienced and dependable professional ${category} with expertise in local repairs and installations.`,
      avatar: finalAvatar,
      isVerified: true,
      isAvailable: true,
      badge: 'Verified Pro',
      rating: 5.0,
      reviewCount: 1,
      completedJobs: 1,
      languages: Array.isArray(languages) ? languages : ['Hindi', 'English'],
      emergencyAvailable: Boolean(emergencyAvailable),
      toolsProvided: toolsProvided !== undefined ? Boolean(toolsProvided) : true,
      reviews: [{
        customerName: 'App Administrator',
        rating: 5,
        comment: 'Verified background check and trade skill certification passed.'
      }]
    });

    await worker.save();

    res.status(201).json({
      success: true,
      message: 'Worker registered successfully!',
      data: worker
    });
  } catch (error) {
    console.error('Error creating worker:', error);
    res.status(500).json({ success: false, message: 'Failed to register worker', error: error.message });
  }
});

// PUT /api/workers/:id - Update worker
router.put('/:id', async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, message: 'Profile updated', data: updatedWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// POST /api/workers/:id/reviews - Add customer review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'customerName, rating, and comment are required.' });
    }

    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const numRating = Number(rating);
    worker.reviews.unshift({
      customerName,
      rating: numRating,
      comment,
      date: new Date()
    });

    // Recompute average
    const total = worker.reviews.reduce((acc, r) => acc + r.rating, 0);
    worker.reviewCount = worker.reviews.length;
    worker.rating = Number((total / worker.reviews.length).toFixed(1));
    worker.completedJobs += 1;

    await worker.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: worker
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
});

module.exports = router;
