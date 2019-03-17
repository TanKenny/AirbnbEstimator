'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const Listing = require('./models/ListingSchema');

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.create(JSON.parse(event.body))
        .then(listing => callback(null, {
          statusCode: 200,
          body: JSON.stringify(listing)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the Listing.'
        }));
    });
};

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.findById(event.pathParameters.id)
        .then(listing => callback(null, {
          statusCode: 200,
          body: JSON.stringify(listing)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the listing.'
        }));
    });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.find()
        .then(listings => callback(null, {
          statusCode: 200,
          body: JSON.stringify(listings)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the listings.'
        }))
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(listing => callback(null, {
          statusCode: 200,
          body: JSON.stringify(listing)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not update the listing.'
        }));
    });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.findByIdAndRemove(event.pathParameters.id)
        .then(listing => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed listing with id: ' + listing._id, listing: listing })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fdelete the listing.'
        }));
    });
};
