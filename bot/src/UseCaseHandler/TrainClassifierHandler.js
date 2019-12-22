let GuerdonHandler = require("./GuerdonHandler");
let Constants = require("../constants");
let got = require("got");

class TrainClassifierHandler extends GuerdonHandler{

    constructor(message){
        super(message);
        this.userName = null;
        this.user_email = null;
        this.userId = null;
        this.delayedReply = true;
    }

    parse(){
        let parts = this.message.split(";");
        parts.shift();
        if(parts.length > 1){
            throw new Error("Bad format of message");
        }
        parts = parts[0].trim();
        this.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.trainClassifier,
            requestType: "POST",
            payload: {
                dataset: parts,
                email_id: this.user_email
            }
        };
    }

    async setUserEmail(){ 
        let user_id = this.userId;
        try {
            let result = await(got(Constants.mattermostApiHost+Constants.apiUrls.mattermostUsers+"/"+user_id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.BOTTOKEN}`
                    },
                    json: true
                })
            );
            let userDetails = result.body;
            this.user_email = userDetails.email;
        }
        catch(e){
            console.error("Error while fetching user email for user : " + user_id + e);
        }
    }

    getReply() {
        if(!this.userName){
            this.userName = "";
        }
        if(typeof this.replyToChannel == "string"){
            const reply = Constants.trainingReply(this.userName);
            this.replyToChannel = null;
            return reply;
        }else{
            if(this.errorCode == 412){
                this.replyToChannel = "Hey @"+this.userName+", your data set URL doesn't seem to exist!";
            }else{
                const url = this.apiResponse.url;
                if(typeof url != "undefined"){
                    this.replyToChannel = "Hey @"+this.userName+", please find your classifier at: "+url;
                }else{
                    this.replyToChannel = Constants.defaultError;
                }
            }
            return this.replyToChannel;
        }
        
    }

    callAPI(){}
    async callAPI_delayed(){
        await super.callAPI();
    }

}

module.exports = TrainClassifierHandler;