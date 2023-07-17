const mongoose = require('mongoose');

const connectToMongo=()=> {
  try {
     mongoose.connect('mongodb://127.0.0.1:27017/iNotebook1?directConnection=true&readPreference=primary&appname=Mongodb&tls=false', {
    
      //maxMessageSize: 10485760,
      //SlogicalSessionTimeoutMinutes:3000000
      //reconnectTries:Number.MAX_VALUE
      
    });
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}



module.exports = connectToMongo;