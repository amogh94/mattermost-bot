const Constants = require("../constants");
let got = require("got");

// Factory - Use case handler (Abstract)
class GuerdonHandler {
    constructor(message) {
        // Prevent direct instantiation
        if (new.target === GuerdonHandler) {
            throw new TypeError("Cannot construct GuerdonHandler instances directly.");
        }
        if (this.parse === undefined) {
            throw new TypeError("Must override method parse");
        }
        if (this.getReply === undefined) {
            throw new TypeError("Must override method getReply");
        }
        this.message = message;
        this.replyToChannel = Constants.defaultReply;
        this.apiRequestDetails = {};
        this.apiResponse = {};
    }

    async callAPI(){
        /***
         * Use this.apiRequestDetails to call API and set this.apiResponse
         */
        let apiRequestDetails = this.apiRequestDetails;
        let options = this.buildOptions();
        try{
            let result = await(got(apiRequestDetails.url,options));
            this.apiResponse = result.body;
        }catch(e){
            this.errorCode = e.statusCode;
            console.log(`API Exception ### Request :: ${this.apiRequestDetails} ### Error :: ${e}`);
        }
    }

    buildOptions(){
        let defaults = {
            body: this.apiRequestDetails.payload,
            method: this.apiRequestDetails.requestType,
            headers: {
                "Content-Type": "application/json"
            },
            json: true
        };
        let keys = Object.keys(this.apiRequestDetails);
        // remove url, requestType and payload
        let mandatoryKeys = ["url","requestType","payload"];
        let options = keys.filter(option => !mandatoryKeys.includes(option) );
        // options = query and headers..
        if(options.length){
            // add each of them to defaults..
            for(var i in options){
                let option = options[i];
                defaults[option] = this.apiRequestDetails[option];
            }
        }
        return defaults;
    }

}
module.exports = GuerdonHandler;