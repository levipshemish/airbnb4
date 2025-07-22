const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const multer = require('multer');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
// const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

 
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/homes', require('./routes/homes'));
  app.use('/api/experiences', require('./routes/experiences'));
  app.use('/api/services', require('./routes/services'));
  app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/experiencebookings', require('./routes/experiencebooking'))
  app.use('/api/servicebookings', require('./routes/servicebooking'));
  



//stripe
  app.post('/api/create-checkout-session', async (req, res) => {
    const { products } = req.body; 

    const lineItems = products.map((product) => ({
        price_data:{
            currency:"usd",
            product_data:{
                name:product.name,
            },
            unit_amount:product.price*100,
        },
        quantity: product.quantity || 1, 
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:5173/success",
        cancel_url:'http://localhost:5173/cancel',
    })

    res.json({id:session.id})
  }); 
 
 


 

  //post one home to booking/ checkout page
  app.post('/api/bookings', async (req, res) => {
    const { homeId, homeName, homeCity, totalPrice, startDate, endDate } = req.body;
    try {
      const booking = await Booking.create({ homeId, homeName, homeCity, totalPrice, startDate, endDate });
  
      // Respond with booking AND a dummy URL property
      res.json({
        booking,
        url: 'https://example.com/thank-you'  // <-- Add this here!
      });
    } catch (err) {
      res.status(500).json({ error: 'Booking failed' });
    }
  });
  


 

  
  // Read all
  app.get('/api/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
  });
  
  // Update
  app.put('/api/messages/:id', async (req, res) => {
    const { name, text } = req.body;
    try {
      const updated = await Message.findByIdAndUpdate(
        req.params.id,
        { name, text },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Update failed' });
    }
  });
  
  // Delete
  app.delete('/api/messages/:id', async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: 'Delete failed' });
    }
  });
  
  app.listen(5869, () => console.log('Server running on port 5869'));


  