const mongoose = require('mongoose');
 
const Mongo = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MONGO CONNECTED.');
  } 

module.exports = Mongo;