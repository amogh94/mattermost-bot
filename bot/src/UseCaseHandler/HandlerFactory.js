const GreetingHandler = require("./GreetingHandler");
const MattermostTopUsersHandler = require("./MattermostTopUsersHandler");
const TrainClassifierHandler = require("./TrainClassifierHandler");
const TestYourClassifierHandler = require("./TestYourClassifierHandler");
const TestGuerdonClassifierHandler = require("./TestGuerdonClassifierHandler");
const Constants = require("../constants");

class HandlerFactory {
    static async getHandler(messageDetails) {
        let message = JSON.parse(messageDetails.data.post).message;
        if(this.isMessageEmpty(message)){
            return null;
        }
        let lowerCaseMessage = message.toLowerCase();
        if (HandlerFactory.isGreeting(lowerCaseMessage)) {
             return new GreetingHandler(message);
        } 
        else if (HandlerFactory.isTopUsers(lowerCaseMessage)) {
            let handler = new MattermostTopUsersHandler(message);
            return handler;
        } 
        else if (HandlerFactory.isTrainYourClassifier(lowerCaseMessage)) {

            let handler = new TrainClassifierHandler(message);
            handler.userName = messageDetails.data.sender_name;
            try{
                handler.userId = JSON.parse(messageDetails.data.post).user_id;
                await handler.setUserEmail();
            }catch(e){}
            return handler;
        } 
        else if (HandlerFactory.isTestYourClassifier(lowerCaseMessage)) {
            let handler =  new TestYourClassifierHandler(message);
            handler.userName = messageDetails.data.sender_name;
            return handler;
        }
        else if (HandlerFactory.isTestGuerdon(lowerCaseMessage)) {
            return new TestGuerdonClassifierHandler(message);
        } 
        else {
            return null;
        }
    }

    
    static isMessageEmpty(message){
        return (typeof message == "undefined" || message.length === 0);
    }

    static isGreeting(message){
        return ((message.match(Constants.greetingMatcher())) !== null);
        
    }
    static isTrainYourClassifier(message){
        return ((message.match(Constants.trainClassifierMatcher())) !== null);
    }
    static isTestGuerdon(message){
        return ((message.match(Constants.testGuerdonClassifierMatcher())) !== null);
    }
    static isTestYourClassifier(message){
        return ((message.match(Constants.testYourClassifierMatcher())) !== null);
    }
    static isTopUsers (message){
        return ((message.match(Constants.testMattermostTopUsersMatcher())) !== null);
    }
}

module.exports = HandlerFactory;