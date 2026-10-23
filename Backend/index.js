const express = require('express');
const dotenv = require('dotenv');  
const cors = require('cors');
const Mongo =require('./db')

dotenv.config();
const app = express();
Mongo()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
