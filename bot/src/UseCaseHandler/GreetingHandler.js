let GuerdonHandler = require("./GuerdonHandler");
let Constants = require("../constants");
class GreetingHandler extends GuerdonHandler{

    constructor(message){
        super(message);
    }

    parse(){}
    callAPI(){}

    getReply() {
        this.replyToChannel = Constants.greeting.join("\n");
        return this.replyToChannel;
    }
}

module.exports = GreetingHandler;