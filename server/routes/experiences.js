// In routes/experiences.js
const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const upload = multer({ dest: 'uploads/' }); // or use cloud storage later

router.post('/', authenticateToken, upload.array('photos'), async (req, res) => {
  try {
    const { category, subcategory, title, description, price, city, address, maxGuests } = req.body;
    const photoPaths = req.files.map(file => file.path);

    const newExp = new Experience({
      category,
      subcategory,
      title,
      description,
      price,
      city,
      address,
      maxGuests,
      photos: photoPaths,
      userId: req.userId,
    });

    await newExp.save();
    res.json(newExp);
  } catch (err) {
    console.error('Error saving experience:', err);
    res.status(500).json({ error: 'Failed to save experience' });
  }
});



// Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// // Get homes by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const experiences = await Experience.find({ userId });
    res.json(experiences);
  } catch (err) {
    console.error('Error fetching user homes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single experience by ID
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

//get experiences by user 


//edit an experience
router.put('/:id', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      price: req.body.price,
    };

    if (req.file) {
      updateData.photos = [req.file.path];
    }

    const updatedExperience = await Experience.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // ensure user owns experience
      { $set: updateData },
      { new: true }
    );

    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found or unauthorized' });
    }

    res.json(updatedExperience);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//stripe 

const ExperienceBooking = require('../models/ExperienceBooking');

router.post('/api/create-checkout-session', async (req, res) => {
  const { products, experienceId, experienceTitle, experienceAddress, userId, experiencePhoto, date} = req.body;

  // 1. Save booking to DB
  try {
    // Step 1: Save booking to DB
    const booking = await ExperienceBooking.create({
      experienceId,
      userId,
      totalPrice: products[0].price,
      price: products[0].price,
      experienceTitle,
      experienceAddress,
      experiencePhoto,
      date,
      status: 'pending',
    });

    // Step 2: Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity || 1,
      })),
      mode: 'payment',
      success_url: `http://localhost:5173/successexperience?bookingId=${booking._id}`,
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});




module.exports = router;
