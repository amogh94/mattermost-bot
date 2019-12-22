let Constants = require("../constants");
let GuerdonHandler = require("./GuerdonHandler");

class TestGuerdonClassifierHandler extends GuerdonHandler{
    constructor(message){
        super(message);
    }

    parse(){
        let parts = this.message.split(";");
        parts.shift();
        parts = parts.join(";").trim();
        this.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testGuerdon,
            requestType: "POST",
            payload: {
                text: parts
            }
        };
    }

    getReply() {
        if(this.apiResponse.hasOwnProperty("sentiment")){
            let sentiment = this.apiResponse.sentiment;
            return ("Your text seems to have a " + sentiment + " tone");
        }
        else {
            return (Constants.defaultError);
        }
    }
}

module.exports = TestGuerdonClassifierHandler;