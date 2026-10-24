const express = require('express');
const dotenv = require('dotenv');  
const cors = require('cors');
const Mongo =require('./db')

const authRoutes = require('./routes/auth');

const app = express();
dotenv.config();
Mongo()

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
