const mongoose = require('mongoose');
const ListingSchema = new mongoose.Schema({  
  placeType: {  
    placeType: String,
    propertyType: String,
    guestSpace: String,
    dedicatedGuestSpace: Boolean,
    companyType: Boolean,
  },
  bedrooms: {
    guests: Number,
    numOfBedrooms: Number,
    numofBedsAvailable: Number,
    sleepingArrangements: {
      bedrooms : [String], 
      commonSpaces : [String]
    }
  },
  bathrooms: Number,
  bedrooms: Number,
  location: {
    address: String,
    apartmentNumber: String,
    city: String,
    state: String,
    zipCode: Number,
    country: String
  },
  amenities: {
    generalAmenities: [String],
    safetyAmenities: [String]
  },
  sharedSpaces: {
    spaces: [String]
  }
});

module.exports = mongoose.model('Listing', ListingSchema);