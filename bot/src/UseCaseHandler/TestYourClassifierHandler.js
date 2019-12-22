let GuerdonHandler = require("./GuerdonHandler");
let Constants = require("../constants");

class TestYourClassifierHandler extends GuerdonHandler{

    constructor(message){
        super(message);
        this.userName = null;
        this.delayedReply = true;
    }

    parse(){
        let parts = this.message.split(";");
        parts.shift();
        const url = parts.shift().trim();
        const text = parts[0].trim();
        this.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testClassifier,
            requestType: "POST",
            payload: {
                text: text,
                classifier: url
            }
        };
    }

    callAPI(){}

    getReply() {
        if(!this.userName){
            this.userName = "";
        }
        if(typeof this.replyToChannel == "string"){
            const reply = Constants.testingReply(this.userName);
            this.replyToChannel = null;
            return reply;
        }else{
            if(this.errorCode == 412){
                this.replyToChannel = "Hey @"+this.userName+", your model URL doesn't seem to exist!";
            }else{
                const sentimentExists = this.apiResponse.hasOwnProperty("sentiment");
                if(sentimentExists){
                    let sentiment = this.apiResponse.sentiment;
                    this.replyToChannel = "Hey @"+this.userName+", your text seems to have a " + sentiment + " tone.";
                }else{
                    this.replyToChannel = Constants.defaultError;
                }
            }
            return this.replyToChannel;
        }
    }

    async callAPI_delayed(){
        await super.callAPI();
    }

}

module.exports = TestYourClassifierHandler;