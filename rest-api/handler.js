'use strict';

require('dotenv').config({ path: './variables.env' });
const aws = require('aws-sdk');
const connectToDatabase = require('./db');
const Listing = require('./Models/Listing');
// const Prediction = require('./Models/Prediction');

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const listing = JSON.parse(event.body)
  const payload = [listing.bedrooms.guests,listing.bedrooms.numOfBedsAvailable,listing.bedrooms.numOfBedrooms,listing.bathrooms].join(",")

  const ENDPOINT_NAME = process.env.ENDPOINT_NAME
  const runtime = new aws.SageMakerRuntime();

  const config = {
      EndpointName: ENDPOINT_NAME,
      ContentType: 'text/csv',
      Body: payload,
  }
 
  runtime.invokeEndpoint(config, (err,data) => {
    if(err) console.log(err)
    else { 
      const predictionPrice = JSON.parse(Buffer.from(data.Body, 'hex').toString('ascii')).predictions[0].score;
      const request = {
        "Listing": listing,
        "Prediction": {
          "LinearRegression": predictionPrice
        }
      }
      connectToDatabase()
      .then(() => {
        Listing.create(request)
          .then(prediction => callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(prediction)
          }))
          .catch(error => callback(null, {
            statusCode: error.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the Listing: ' + error
          }));
      });
      }
  })
};

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Listing.findById(event.pathParameters.id)
        .then(listing => callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
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
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
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
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
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
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify({ message: 'Removed listing with id: ' + listing._id, listing: listing })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fdelete the listing.'
        }));
    });
};

// module.exports.predict = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const listing = JSON.parse(event.body)
//   const payload = [listing.bedrooms.guests,listing.bedrooms.numOfBedsAvailable,listing.bedrooms.numOfBedrooms,listing.bathrooms].join(",")

//   const ENDPOINT_NAME = process.env.ENDPOINT_NAME
//   const runtime = new aws.SageMakerRuntime();

//   const config = {
//       EndpointName: ENDPOINT_NAME,
//       ContentType: 'text/csv',
//       Body: payload,
//   }
 
//   runtime.invokeEndpoint(config, (err,data) => {
//     if(err) console.log(err)
//     else { 
//       const predictionPrice = JSON.parse(Buffer.from(data.Body, 'hex').toString('ascii')).predictions[0].score;
//       const request = {
//         "Listing": listing,
//         "Prediction": {
//           "LinearRegression": predictionPrice
//         }
//       }
//       connectToDatabase()
//       .then(() => {
//         Prediction.create(request)
//           .then(prediction => callback(null, {
//             statusCode: 200,
//             headers: {
//               "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
//               "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
//             },
//             body: JSON.stringify(prediction)
//           }))
//           .catch(error => callback(null, {
//             statusCode: error.statusCode || 500,
//             headers: { 'Content-Type': 'text/plain' },
//             body: 'Could not create the Listing: ' + error
//           }));
//       });
//       }
//   })
// };
