const express = require('express');
const router = express.Router();
const Home = require('../models/Home');
const multer = require('multer');
const mongoose = require('mongoose');
const upload = multer({ dest: 'uploads/' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// If you store authenticateToken middleware globally:
const authenticateToken = require('../middleware/auth');
console.log('authenticateToken is:', authenticateToken);


// Create Home
router.post('/', authenticateToken, upload.array('photos'), async (req, res) => {
  try {
    const { name, text, address, price, city, maxGuest } = req.body;
    const photoPaths = req.files.map(file => file.path);

    const newHome = new Home({
      name,
      text,
      address,
      price,
      city,
      maxGuest,
      photos: photoPaths,
      userId: req.userId,
    });

    await newHome.save();
    res.json(newHome);
  } catch (err) {
    console.error('Create home error:', err);
    res.status(500).json({ error: 'Failed to create home' });
  }
});

// Get all homes
router.get('/get', async (req, res) => {
    try {
      console.log('📡 Getting homes...');
      const homes = await Home.find();
      console.log('✅ Homes fetched:', homes.length);
      res.json(homes);
    } catch (err) {
      console.error('❌ Failed to fetch homes:', err); // <== THIS is the key
      res.status(500).json({ error: 'Failed to fetch home' });
    }
  });
  

// // Get homes by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const homes = await Home.find({ userId });
    res.json(homes);
  } catch (err) {
    console.error('Error fetching user homes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// // Update home
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      text: req.body.text,
      address: req.body.address,
      price: req.body.price,
    };

    if (req.file) {
      updateData.photos = [req.file.path];
    }

    const updatedHome = await Home.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedHome) {
      return res.status(404).json({ message: 'Home not found' });
    }

    res.json(updatedHome);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// // Get single home
router.get('/:id', async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ error: 'Home not found' });
    res.json(home);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch home' });
  }
});

// routes/stripe.js (or wherever your POST /create-checkout-session is)

const Booking = require('../models/Booking');

router.post('/api/create-checkout-session', async (req, res) => {
  const { products, homeId, userId, startDate, endDate, name, address, photo} = req.body;

  // 1. Save booking to DB
  try {
    // Step 1: Save booking to DB
    const booking = await Booking.create({
      homeId,
      userId,
      startDate,
      endDate,
      totalPrice: products[0].price,
      name,
      address,
      photo,
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
      success_url: `http://localhost:5173/success?bookingId=${booking._id}`,
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


module.exports = router;
