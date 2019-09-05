'use strict';

var objectAssign = require('object-assign'),
 Helpers = new (require('./helpers'))(), 
 axios = require('axios'), 
 qs = require('querystring');

function Monetbil(options) {

    this.options = {
        monetbil_api_version: 'v2.1',
        monetbil_api_base_url: 'https://api.monetbil.com/widget/',
        monetbil_service_key: null,
        return_url: null,
        notify_url: null,
        logo_url: null,
        request_options: {
            headers: {
                Accept: '*/*',
                Connection: 'close',
                'User-Agent': 'node-monetbil/' + 1
            }
        }
    };

    objectAssign(this.options, options);
}

Monetbil.prototype.getPaymentUrl = async function(paymentData) {

    const paymentDataRequiredError = new Error('Payment Data is required');
    
    if(!paymentData || paymentData.constructor !== Object || Object.entries(paymentData).length === 0) {
        throw paymentDataRequiredError;
    }

    if(isNaN(paymentData.amount) || paymentData.amount <= 0) {
        throw new Error('Payment amount is value is required and should be a valid number > 0');
    }
    const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    var resp = await axios.post(Helpers.buildGetPaymentUrlEndpoint(this.options), qs.stringify(paymentData), config);
  
    return resp;
}

module.exports = Monetbil;