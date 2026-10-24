const express = require('express');
const dotenv = require('dotenv');  
const cors = require('cors');
const Mongo =require('./db')

dotenv.config();
const app = express();
Mongo()

//Get the routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

app.use(cors());
app.use(express.json());


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/booking', bookingRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
