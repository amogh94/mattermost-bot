const Constants = require("./constants");
const Client = require('mattermost-client');
const HandlerFactory = require('./UseCaseHandler/HandlerFactory');

let client = new Client(Constants.host, Constants.group, {});

(async () => {
    // todo: check if process.env.BOTTOKEN exists and terminate with message if not set
    const botToken = process.env.BOTTOKEN;
    if(typeof botToken != "undefined"){
        let request = await client.tokenLogin(botToken);
        client.on('message', async (message) => {
            try{
                // Bot should not respond to itself
                if (message.data.sender_name !== Constants.botName){
                    let guerdonHandler = await HandlerFactory.getHandler(message);
                    if(guerdonHandler != null){
                        guerdonHandler.parse();
                        await guerdonHandler.callAPI();
                        let reply = await guerdonHandler.getReply();
                        const channel = message.broadcast.channel_id;
                        client.postMessage(reply, channel);
                        if(guerdonHandler.delayedReply){
                            await guerdonHandler.callAPI_delayed();
                            reply = guerdonHandler.getReply();
                            if(reply != null){
                                client.postMessage(reply, channel);
                            }
                        }
                    }
                }
            }catch(err) {
                console.error(err.message);
                // Todo: Write this to a logger
            }
        });
    }else{
        console.error("BOTTOKEN environment variable is not set.");
        // Todo: Write this to a logger
    }
})();