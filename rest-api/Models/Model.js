const mongoose = require('mongoose');
const ModelSchema = new mongoose.Schema({  
  location: String,
  season: String,
  models: [Object]
});

module.exports = mongoose.model('Model', ModelSchema);
