'use strict';

var assert = require('chai').assert;
var Helpers = require('../lib/helpers');


describe("Helpers", function() {

    const sut = new Helpers();
    const supportedApiVersions = ["v2.1"]; // TODO externalize supported versions

    describe("Helpers buildGetPaymentUrlEndpoint method", function() {

        it("Method should exists", function() {
            assert.typeOf(sut.buildGetPaymentUrlEndpoint, 'function');
        });

        it("should throw error when api options is not specified", function() {
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(), Error, "Please specify api options");
        });

        it("should throw error when api options is null", function() {
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(null), Error, "Please specify api options");
        });

        it("should throw error when api options is undefined", function() {
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(undefined), Error, "Please specify api options");
        });

        it("should throw error when api version is absent in options", function() {
            var options = {};
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(options), Error, "Please specify api version in options (monetbil_api_version field)");
        });

        it("should throw error when api service key is absent in options", function() {
            var options = {monetbil_api_version: "v2.1"};
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(options), Error, "Please specify service key in options (monetbil_service_key field)");
        });

        it("should throw error when api base url is absent in options", function() {
            var options = {monetbil_api_version: "v2.1", monetbil_service_key: "fkrUdfgeMTzaw"};
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(options), Error, "Please specify api base url key in options (monetbil_api_base_url field)");
        });

        it("should throw error when api version is not supported", function() {
            var options = { monetbil_api_version: "v2.2", monetbil_service_key: "fkrUdfgeMTzaw", monetbil_api_base_url: "https://ddds" };
            assert.throws(() => sut.buildGetPaymentUrlEndpoint(options), Error, "Unsupported api version : " + options.monetbil_api_version);
        });

        supportedApiVersions.forEach(function(version) {
            it("should build getPaymentUrl endpoint for api version " + version, function() {
                
                var options = { monetbil_api_version: version, monetbil_service_key: "fkrUdfgeMTzaw", monetbil_api_base_url: "https://ddds/" };
                var expectedUrl = "https://ddds/" + version+"/" + options.monetbil_service_key;

                var actual = sut.buildGetPaymentUrlEndpoint(options);

                assert.equal(actual, expectedUrl);
            });
        });

        it("should build getPaymentUrl endpoint when base_url options don't ends with '/'", function() {
            
            var options = { monetbil_api_version: supportedApiVersions[0], monetbil_service_key: "fkrUdfgeMTzaw", monetbil_api_base_url: "https://ddds" };
            var expectedUrl = "https://ddds/" + supportedApiVersions[0] + "/" + options.monetbil_service_key;

            var actual = sut.buildGetPaymentUrlEndpoint(options);

            assert.equal(actual, expectedUrl);
        })
        
    });

});