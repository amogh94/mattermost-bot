let GuerdonHandler = require("./GuerdonHandler");
let Constants = require("../constants");
let got = require("got");
let Sentiment = require("sentiment");

class MattermostTopUsersHandler extends GuerdonHandler{

    constructor(message){
        super(message);
        this.channel = Constants.channelId;
        this.sentiment = new Sentiment();
    }

    parse(){
        this.n = parseInt(this.message.match(Constants.testMattermostTopUsersMatcher())[0].split(/\s+/)[1]);
        
        const getTimestamp = () =>{
            var date = new Date();
            date.setDate(date.getDate() - Constants.mattermostNumberOfDays);
            return date.getTime();
        };
        
        this.apiRequestDetails = {
            url:Constants.mattermostApiHost+Constants.apiUrls.mattermostTopN(this.channel),
            requestType: "GET",
            query: {
                page: 0
            }
        };

        this.weekTimestamp = getTimestamp();
    }

    

    async callAPI(){
        await this.setUserMessages();
        let weightedUserScoreMap = this.getWeightedUserScoreMap();
        await this.setFormattedApiResponse(weightedUserScoreMap);
    }

    getReply() {
        if(this.formattedApiResponse != null && this.formattedApiResponse.length > 0) {
            let formattedReply = "Here are your top users over the last " +  Constants.mattermostNumberOfDays + " days:\n";
            for (var i in this.formattedApiResponse){
                let response = this.formattedApiResponse[i];
                formattedReply += response.name + " : " + response.score + " points\n" ;
            }
            return formattedReply;
        }
        else{
            return (Constants.defaultError);
        }
    }

    getWeightedUserScoreMap(){
        let weightedUserScoreMap = []
        for (let userId in this.userMessages){
            let messages = this.userMessages[userId];
            let length = messages.length;
            let sentimentScore = 0;
            for (let index in messages){
                sentimentScore += messages[index]["sentiment"];
            }
            let weightedScore = (sentimentScore/length).toFixed(2);
            weightedUserScoreMap.push({"id" : userId , "score": weightedScore});
        }
        weightedUserScoreMap.sort((a, b) => (a.score <= b.score) ? 1 : -1);
        return weightedUserScoreMap;
    }

    getSentiment(message){
        return this.sentiment.analyze(message).score;
    }

    async setUserMessages(){
        /** 
         * userMessages = {
         *      user1: [{msg: somettext, sentiment: ____}, {msg: somettext, sentiment: ____}],
         *      user2: [{msg: somettext, sentiment: ____}, {msg: somettext, sentiment: ____}],
         * }
         */

        const shouldFetchMessages = (posts,order) => {
            return (
                posts[order[order.length-1]].create_at >= this.weekTimestamp || 
                (order.length > 0 && posts.length > 0)
            );
        };

        let userMessages = {};
        let apiRequestDetails = this.apiRequestDetails;
        let posts = {};
        let order = [];
        do{
            try{
                this.apiRequestDetails.headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.BOTTOKEN}`
                };

                await super.callAPI();
                posts = this.apiResponse.posts;
                order = this.apiResponse.order;
                for(let messageId in posts){
                    let messageBody = posts[messageId];
                    if(messageBody.create_at < this.weekTimestamp){
                        continue;
                    }
                    let userId = messageBody.user_id;
                    let userMessage = messageBody.message;
                    if(!userMessages.hasOwnProperty(userId)){
                        userMessages[userId] = [];
                    }
                    userMessages[userId].push({message: userMessage, sentiment: this.getSentiment(userMessage)});
                    
                }
                apiRequestDetails.query.page++;
            }catch(e){
                console.log("Error when calling Mattermost /channel/:id/posts API  ### ",e);
                /* TODO: Write this to a logger */
                break;
            }
        }while(shouldFetchMessages(posts,order));
        
        this.userMessages = userMessages;
    }

    async setFormattedApiResponse(weightedUserScoreMap){
        
        const isPrivilegedUser = (userDetails) => {
            return userDetails.roles.match(/system_admin/)!=null; 
        };

        let numberOfMembers = this.n;
        this.formattedApiResponse = [];
        
        let userCount = 0;
        for(let index in weightedUserScoreMap){
            try{
                this.apiRequestDetails.url = Constants.mattermostApiHost+Constants.apiUrls.mattermostUsers+"/"+weightedUserScoreMap[index].id;
                delete this.apiRequestDetails.query;
                await super.callAPI();
                let userDetails = this.apiResponse;
                if(isPrivilegedUser(userDetails)){
                    continue;
                }
                let userName = `${userDetails.first_name} ${userDetails.last_name}`;
                if(userName.length == 1){
                    userName = userDetails.username;
                }
                if(userName.length == 0){
                    continue;
                }
                
                weightedUserScoreMap[index].name = userName;
                this.formattedApiResponse.push(weightedUserScoreMap[index]);
                userCount++;
                if(userCount >= numberOfMembers){
                    break;
                }
            }
            catch(e){
                console.log("Error when calling Mattermost /users/ids API  ### ",e);
            }
        }
    }
}

module.exports = MattermostTopUsersHandler;
