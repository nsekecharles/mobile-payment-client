'use strict';

function Helpers() {
        
    this.buildGetPaymentUrlEndpoint = function(options) {
        
        if(!options) {
            throw new Error("Please specify api options")
        }

        if(!options.monetbil_api_version) {
            throw new Error("Please specify api version in options (monetbil_api_version field)")
        }

        if(!options.monetbil_service_key) {
            throw new Error("Please specify service key in options (monetbil_service_key field)")
        }

        if(!options.monetbil_api_base_url) {
            throw new Error("Please specify api base url key in options (monetbil_api_base_url field)")
        }

        
        if(options.monetbil_api_version === "v2.1") { // TODO (see TODO in  associated test file) supported versions should be in an externalized shared list (or enum ?)
            var baseUrl = options.monetbil_api_base_url.endsWith("/") ? options.monetbil_api_base_url : options.monetbil_api_base_url + "/";
            return baseUrl + options.monetbil_api_version + "/" + options.monetbil_service_key;
        }

        throw new Error("Unsupported api version : " + options.monetbil_api_version);
    }

}
module.exports = Helpers;