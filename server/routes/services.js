const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const upload = multer({ dest: 'uploads/' });
const Service = require('../models/Service');
const authenticateToken = require('../middleware/auth'); // your JWT middleware

router.post('/', authenticateToken, upload.array('photos', 5), async (req, res) => {
  try {
    console.log('🔐 req.user:', req.user); // Add this

    const {
      category,
      subcategory,
      title,
      description,
      price,
      location,
      duration
    } = req.body;

    const photoPaths = req.files.map(file => file.path); // or just file.filename if you're serving statically

    const newService = new Service({
      user: req.userId,
      category,
      subcategory,
      title,
      description,
      price,
      location,
      duration,
      photos: photoPaths
    });

    await newService.save();

    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Server error creating service' });
  }
});


router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

//get one serviceby id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(service);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

//get all services by userId 
router.get('/user/:userId', async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const services = await Service.find({ user: userId });
      res.json(services);
    } catch (err) {
      console.error('Error fetching user services:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

//update one service 
router.put('/:id', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        subcategory: req.body.subcategory,
        price: req.body.price,
        location: req.body.location,
        duration: req.body.duration,
      };
  
      if (req.file) {
        updateData.photos = [req.file.path]; // Overwrite existing photo(s)
      }
  
      const updatedService = await Service.findOneAndUpdate(
        { _id: req.params.id, user: req.userId }, // ✅ secure: only owner can update
        { $set: updateData },
        { new: true }
      );
  
      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found or unauthorized' });
      }
  
      res.json(updatedService);
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

 //stripe 
 // routes/stripe.js or wherever create-checkout-session is

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ServiceBooking = require('../models/ServiceBooking');

router.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      products,
      userId,
      service: {
        serviceId,
        serviceTitle,
        serviceLocation,
        servicePhoto,
        servicePrice,
        date
      }
    } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity || 1,
    }));

    const newBooking = await ServiceBooking.create({
      userId,
      serviceId,
      serviceTitle,
      servicePhoto,
      serviceLocation,
      servicePrice,
      date,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/successservice?bookingId=${newBooking._id}`,
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ id: session.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


 



module.exports = router;
