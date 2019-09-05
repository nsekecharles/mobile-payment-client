'use strict';

var chai = require('chai');
var assert = chai.assert
var expect = chai.expect
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var nock = require('nock');
var MonetbilClient = require('../index');

// TODO Dans user agent mettre le nom et la versio de l'api qui qui fait la requête

describe('MonetbilClient', function() {


    describe('Constructor', function() {

        it('should have default options', function() {
            let options =  {
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

            var client = new MonetbilClient();
            assert.deepEqual(client.options, options);
        });

        it('should have ovverided options', function() {

            let options =  {
                monetbil_api_version: 'v2.1',
                monetbil_api_base_url: 'https://api.monetbil.com/widget/',
                monetbil_service_key: "a service key",
                return_url: "https://return_after_payment_url",
                notify_url: "https://payment_notification_url",
                logo_url: "https//customer_logo_url",
                request_options: {
                    headers: {
                      Accept: '*/*',
                      Connection: 'close',
                      'User-Agent': 'node-monetbil/' + 1
                    }
                }
            };
            
            var client = new MonetbilClient(options);
            assert.deepEqual(client.options, options);
        });
    });

    describe('Get Payment URL', function() {

        const options =  {
            monetbil_api_version: 'v2.1',
            monetbil_api_base_url: 'https://api.monetbil.com/widget/',
            monetbil_service_key: "PeEVKjJCjbuFVEpygbBt5tlWEj3VFDBu",
            return_url: "https://return_after_payment_url",
            notify_url: "https://payment_notification_url",
            logo_url: "https//customer_logo_url",
            request_options: {
                headers: {
                  Accept: '*/*',
                  Connection: 'close',
                  'User-Agent': 'node-monetbil/' + 1
                }
            }
        };

        it('method should exists', function() {

            const client = new MonetbilClient(options);

            assert.typeOf(client.getPaymentUrl, 'function');
        });

        it('should throw Error when getting paymentUrl without paymentData',  async function() {
            
            const client = new MonetbilClient(options); 
            await expect(client.getPaymentUrl()).to.be.rejectedWith("Payment Data is required");
        });

        it('should throw Error when getting paymentUrl with null paymentData', async function() {

            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(null)).to.be.rejectedWith("Payment Data is required");
        });

        it('should throw Error when getting paymentUrl with undefined paymentData', async function() {

            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(undefined)).to.be.rejectedWith("Payment Data is required");
        });

        it('should throw Error when getting paymentUrl with empty paymentData', async function() {
            
            const paymentData = {};
            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(paymentData)).to.be.rejectedWith("Payment Data is required");
        });

        it('should throw Error when try to get paymentUrl without a amount', async function() {

            const paymentData = { anyData: '' };
            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(paymentData)).to.be.rejectedWith("Payment amount is value is required and should be a valid number > 0");
        });

        // TODO require payment Amount > 0 remove this test if the api doesn't require this
        it('should throw Error when trying to get paymentUrl with amount = 0', async function() {

            const paymentData = { amount: 0 };
            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(paymentData)).to.be.rejectedWith("Payment amount is value is required and should be a valid number > 0");
        });
        
        it('should throw Error when trying to get paymentUrl with amount = aaaa', async function() {

            const paymentData = { amount: 'aaa' };
            const client = new MonetbilClient(options);
            await expect(client.getPaymentUrl(paymentData)).to.be.rejectedWith("Payment amount is value is required and should be a valid number > 0");
        });

        it('should get paymentUrl via a post request',async function() {
            const paymentData = { amount: '100' };
            const client = new MonetbilClient(options);

            const scope = nock("https://api.monetbil.com/widget/")
            .post("/v2.1/PeEVKjJCjbuFVEpygbBt5tlWEj3VFDBu")
            .reply(200,{});

            await client.getPaymentUrl(paymentData);

            scope.done();
        });

        it('should get paymentUrl with application/x-www-form-urlencoded as content-type in request headers',async function() {
            const paymentData = { amount: '100' };
            const client = new MonetbilClient(options);

            const scope = nock("https://api.monetbil.com/widget/", {
                reqheaders: {
                    "content-type": "application/x-www-form-urlencoded",
                }
              })
            .post("/v2.1/PeEVKjJCjbuFVEpygbBt5tlWEj3VFDBu")
            .reply(200,{});

            await client.getPaymentUrl(paymentData);

            scope.done();
        });

        it('should get paymentUrl with correct data in request',async function() {
            const paymentData = { amount: '100' };
            const client = new MonetbilClient(options);

            const scope = nock("https://api.monetbil.com/widget/", {
                reqheaders: {
                    "content-type": "application/x-www-form-urlencoded",
                }
              })
            .post("/v2.1/PeEVKjJCjbuFVEpygbBt5tlWEj3VFDBu", "amount=100")
            .reply(200,{});

            await client.getPaymentUrl(paymentData);

            scope.done();
        });

        it('should return request response when getting paymentUrl',async function() {
            const paymentData = { amount: '100' };
            const client = new MonetbilClient(options);
            const expectedResponse = {
                "success": true,
                "payment_url":"https://api.monetbil.com/pay/v2.1/h6hTYFbcxL5UOrPcDRDkz9Gqb1xPMp"
               };

            const scope = nock("https://api.monetbil.com/widget/", {
                reqheaders: {
                    "content-type": "application/x-www-form-urlencoded",
                }
              }).post("/v2.1/PeEVKjJCjbuFVEpygbBt5tlWEj3VFDBu", "amount=100")
            .reply(200, expectedResponse);

            var response = await client.getPaymentUrl(paymentData);
            
            assert.deepEqual(expectedResponse, response.data);

            scope.done();
        });
    });
});


   /*
            var paymentData = {
                amount: 100,
                //phone: "677770605",
                ///phone: "654088375",
                //phone_lock: true,
                //locale: 'en',
                //operator: 'CM_ORANGEMONEY',
                //country: 'CM',
                //currency: 'XAF',
                //item_ref: 'reservation_id',
               // payment_ref: 'id order',
                //user: 'user id',
               // first_name: '',
                //last_name: '',
                //email: '',
                //returl_url:'',
               // notify_url: options.notify_url,
              //  logo: options.logo_url
            };
    */