// Run all tests before app deployment - figure this out
// 1. Test type of class object returned from handler factory
// 2. Test and Mock API responses
// 3. Create mock.json for all api responses
// 4. Test whether bot token is set
// 5. code coverage test with karma-coverage
// 6. Test parse method (pass and fail) in each use case

const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");
const HandlerFactory = require("../src/UseCaseHandler/HandlerFactory");
const GreetingHandler = require("../src/UseCaseHandler/GreetingHandler");
const TrainClassifierHandler = require("../src/UseCaseHandler/TrainClassifierHandler");
const TestGuerdonClassifierHandler = require("../src/UseCaseHandler/TestGuerdonClassifierHandler");
const TestYourClassifierHandler = require("../src/UseCaseHandler/TestYourClassifierHandler");
const MattermostTopUsersHandler = require("../src/UseCaseHandler/MattermostTopUsersHandler");
const Constants = require("../src/constants");

const mockApiResponses = require("./mock.json");

describe('Unit Tests for Guerdon Bot', () => {
    
    /**
     * Initial Tests
     */

    it('Should always pass', () => {
        expect(true).to.be.true;
    });

     it("Bot Token should be set" , () => {
         expect(process.env.BOTTOKEN).to.not.be.empty;
     });

    /**
     * -----------------------------------------------------------------------------
     * Tests to verify the class of handler objects returned for differet messages
     * -----------------------------------------------------------------------------
     */
    it("Handler object should be null for empty message" , async() => {
        const message = {
            data:{
                post: '{"message": " "}'
                
            }
        };
        expect(await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("GreetingHandler object should be returned for the message 'hi Guerdon'" , async() => {
        const message = {
            data:{
                post: '{"message": "hi Guerdon"}'
                
            }
        };
        expect(await HandlerFactory.getHandler(message)).to.be.an.instanceof(GreetingHandler);
    });

    it("Handler object should be null for a badly formatted Greeting message" , async() => {
        const message = {
            data:{
                post: '{"message": "hi"}'
                
            }
        };
        expect(await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("TrainClassifierHandler object should be returned for a message of the 'Train my classifier' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Train my classifier ; https://drive.google.com"}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.an.instanceOf(TrainClassifierHandler);
    });

    it("Handler object should be null for a badly formatted message of the 'Train my classifier' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Train my classifier ; "}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("TestGuerdonClassifierHandler object should be returned for a message of the 'Classify my Text' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Classify my text ; that is a good answer!"}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.an.instanceOf(TestGuerdonClassifierHandler);
    });

    it("Handler object should be null for a badly formatted message of the 'Classify my Text' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Classify my text ; "}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("TestYourClassifierHandler object should be returned for a message of the 'Test my classifier' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Test the classifier ; https://drive.google.com/ ; that didn\'t help me."}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.an.instanceOf(TestYourClassifierHandler);
    });

    it("Handler object should be null for a badly formatted message of the 'Test my classifier' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Test the classifier ; https://drive.google.com/"}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("MattermostTopUsersHandler object should be returned for a message of the 'Top N members' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "Find top 20 members"}'   
            },
            broadcast:{
                channel_id: "a1945nuqfi8otmsr431xcmm4pe"
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.an.instanceOf(MattermostTopUsersHandler);
    });

    it("Handler object should be null for a badly formatted message of the 'Top N members' use case" , async() => {
        const message = {
            data:{
                post: '{"message": "find members"}'
                
            }
        };
        expect (await HandlerFactory.getHandler(message)).to.be.null;
    });

    it("Handler object should be null for messages that do not map to any of the use cases" , async() => {
        const message = {
            data:{
                post: '{"message": "These teams have got a great start"}'
                
            }
        };
        expect(await HandlerFactory.getHandler(message)).to.be.null;
    });

    /**
     * -----------------------------------------------------------------------------------------------
     * Tests to verify that the handlers can parse the message and set their API parameters correctly
     * -----------------------------------------------------------------------------------------------
     */

    it("TrainClassifierHandler should parse message correctly",()=>{
        let message = "Train my classifier ; https://drive.google.com";
        let handler = new TrainClassifierHandler(message);
        handler.parse();
        expect(handler.apiRequestDetails.payload.dataset).to.equal("https://drive.google.com");
    });

    it("TrainClassifierHandler should not parse badly formatted message",()=>{
        let message = "Train my classifier ;  https://drive.google.com; text";
        let handler = new TrainClassifierHandler(message);
        expect(()=>{handler.parse()}).to.throw(Error);
    });

    it("TrainClassifierHandler should not parse badly formatted message",()=>{
        let message = "Train my classifier";
        let handler = new TrainClassifierHandler(message);
        expect(()=>{handler.parse()}).to.throw(Error);
    });

    it("TestGuerdonClassifierHandler should parse message correctly",()=>{
        let message = "Classify my text ; Please check this on StackOverflow ";
        let handler = new TestGuerdonClassifierHandler(message);
        handler.parse();
        expect(handler.apiRequestDetails.payload.text).to.equal("Please check this on StackOverflow");
    });

    it("TestGuerdonClassifierHandler should not parse badly formatted message",()=>{
        let message = "Please check this on StackOverflow ";
        let handler = new TestGuerdonClassifierHandler(message);
        handler.parse();
        expect(handler.apiRequestDetails.payload.text).to.be.a('string').that.is.empty;
    });

    it("TestYourClassifierHandler should parse message correctly",()=>{
        let message = "Test the classifier ; https://drive.google.com/ ; that didn't help me.";
        let handler = new TestYourClassifierHandler(message);
        handler.parse();
        expect(handler.apiRequestDetails.payload.text).to.equal("that didn't help me.");
        expect(handler.apiRequestDetails.payload.classifier).to.equal("https://drive.google.com/");
    });

    it("TestYourClassifierHandler should not parse badly formatted message",()=>{
        let message = "https://drive.google.com/ ; that didn't help me.";
        let handler = new TestYourClassifierHandler(message);
        expect(()=>{handler.parse()}).to.throw(Error);
    });

    it("Mattermost Top N should parse message correctly",()=>{
        let message = "Find top 5 users";
        let handler = new MattermostTopUsersHandler(message);
        handler.parse();
        expect(handler.n).to.equal(5);
    });

    it("Mattermost Top N should not parse badly formatted message",()=>{
        let message = "Find top users";
        let handler = new MattermostTopUsersHandler(message);
        expect(()=>{handler.parse()}).to.throw(Error);
    });


    /**
     * -------------------------------------------------------------------------------------
     * Mock the API responses and check that the handlers return the expected processed results
     * -------------------------------------------------------------------------------------
     */

    it("TrainClassifierHandler should return a one-time link for model",async ()=>{
        const dataset = "https://drive.google.com";
        const apiRequestData = {
            dataset:dataset
        };

        let trainClassifierService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.trainClassifier, apiRequestData)
            .reply(200, JSON.stringify(mockApiResponses.trainClassifier));

        let handler = new TrainClassifierHandler(dataset);

        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.trainClassifier,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI_delayed();
        expect(handler.apiResponse).to.not.be.empty;
        expect(handler.apiResponse.message).to.not.be.empty;
        expect(handler.apiResponse.url).to.not.be.empty;
    });

    it("TrainClassifierHandler should not return any message on API error",async ()=>{
        const dataset = "https://drive.google.com train this";
        const apiRequestData = {
            dataset:dataset
        };

        let trainClassifierService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.trainClassifier, apiRequestData)
            .reply(500, JSON.stringify(mockApiResponses.trainClassifierFailed));

        let handler = new TrainClassifierHandler(dataset);
        handler.userName = "guerdon-bot";
        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.trainClassifier,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI_delayed();
        expect(handler.apiResponse).to.be.empty;
    });
        
    it("TestGuerdon should return a positive sentiment for positive text",async ()=>{
        const message = "Please check this on StackOverflow";
        const apiRequestData = {
            text:message
        };

        let testGuerdonService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.testGuerdon,apiRequestData)
            .reply(200, JSON.stringify(mockApiResponses.testGuerdon));

        let handler = new TestGuerdonClassifierHandler(message);

        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testGuerdon,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI();
        expect(handler.apiResponse).to.not.be.empty;
        expect(handler.apiResponse.sentiment).to.be.equal("positive");
    });

    it("TestGuerdon should return empty object on API error",async ()=>{
        const message = "Please check this on StackOverflow";
        const apiRequestData = {
            text:message
        };

        let testGuerdonService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.testGuerdon,apiRequestData)
            .reply(500, JSON.stringify(mockApiResponses.testGuerdonFailed));

        let handler = new TestGuerdonClassifierHandler(message);

        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testGuerdon,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI();
        expect(handler.apiResponse).to.be.empty;
    });

    
    it("TestYourClassifierHandler should return a positive sentiment for positive text",async ()=>{
        const message = "Please check this on StackOverflow";
        const classifier = "https://drive.google.com/xxfhg"
        const apiRequestData = {
            text:message,
            classifier: classifier
        };

        let testClassifierService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.testClassifier,apiRequestData)
            .reply(200, JSON.stringify(mockApiResponses.testClassifier));

        let handler = new TestYourClassifierHandler(message);

        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testClassifier,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI_delayed();
        expect(handler.apiResponse).to.not.be.empty;
        expect(handler.apiResponse.sentiment).to.be.equal("positive");
    });

    it("TestYourClassifierHandler should return empty object on API error",async ()=>{
        const message = "Please check this on StackOverflow";
        const apiRequestData = {
            text:message
        };

        let testClassifierService = nock(Constants.classifierApiHost)
            .post(Constants.apiUrls.testClassifier,apiRequestData)
            .reply(500, JSON.stringify(mockApiResponses.testClassifierFailed));

        let handler = new TestYourClassifierHandler(message);

        handler.apiRequestDetails = {
            url:Constants.classifierApiHost+Constants.apiUrls.testClassifier,
            requestType: "POST",
            payload:apiRequestData
        };

        await handler.callAPI();
        expect(handler.apiResponse).to.be.empty;
    });

    // TO BE REVISITED
    it("MattermostTopUsersHandler should fetch messages and group them by user",async ()=>{
        const message = "Find Top 3 users";
        const channelId = Constants.channelId;

        let apiRequestData = {
            url:Constants.mattermostApiHost+Constants.apiUrls.mattermostTopN(channelId),
            requestType: "GET",
            query: {
                page: 0
            }
        };

        let emptyPage = {
            order:[],
            posts:[]
        };

        let MattermostTopNService = nock(Constants.mattermostApiHost)
            .get(Constants.apiUrls.mattermostTopN(channelId))
            .query({page : 0})
            .reply(200, JSON.stringify(mockApiResponses.mattermostChannelPosts[0]));
        
        let MattermostTopNServicePage2 = nock(Constants.mattermostApiHost)
            .get(Constants.apiUrls.mattermostTopN(channelId))
            .query({page : 1})
            .reply(200, JSON.stringify(mockApiResponses.mattermostChannelPosts[1]));
        
        let MattermostTopNServicePage3 = nock(Constants.mattermostApiHost)
            .get(Constants.apiUrls.mattermostTopN(channelId))
            .query({page : 2})
            .reply(200, JSON.stringify(emptyPage));

        let handler = new MattermostTopUsersHandler(message);
        handler.channelId = Constants.channelId;
        handler.apiRequestDetails = apiRequestData;

        await handler.setUserMessages();
        expect(handler.userMessages).to.have.property("user2");
    });

    it("MattermostTopUsersHandler should set user messages to empty on API error",async ()=>{
        const message = "Find Top 3 users";
        const channelId = 'a1945nuqfi8otmsr431xcmm4pe';
        let apiRequestData = {
            url:Constants.mattermostApiHost+Constants.apiUrls.mattermostTopN(channelId),
            requestType: "GET",
            query: {
                page: 0
            }
        };

        let MattermostTopNService = nock(Constants.mattermostApiHost)
            .get(Constants.apiUrls.mattermostTopN(channelId))
            .query({page : 0})
            .reply(500, JSON.stringify(mockApiResponses.mattermostAPIFailed));

        let handler = new MattermostTopUsersHandler(message);

        handler.apiRequestDetails = {
            url:Constants.mattermostApiHost+Constants.apiUrls.mattermostTopN(channelId),
            requestType: "GET",
            payload:apiRequestData
        };

        await handler.setUserMessages();
        expect(handler.userMessages).to.be.empty;
    });


    /**
     * -------------------------------------------------------------------------------------------------
     * Tests to verify that the bot is able to construct a reply to the user on success and error cases
     * -------------------------------------------------------------------------------------------------
     */
    it("The bot should show all its options when user greets it", async()=>{
        const message = "Hi Guerdon";
        let handler = new GreetingHandler(message);
        const reply = handler.getReply();
        expect(reply).to.equal(Constants.greeting.join("\n"));
    });

    // Write tests for Train Your Classifier's reply

    it("The bot should reply with an acknowledgement, when user submits their request to train their classifier.",async ()=>{
        const message = "Train my classifier ; https://drive.google.com/dsfdsfffxcv.csv";
        let handler = new TrainClassifierHandler(message);
        handler.userName = "Tester";
        const reply = handler.getReply();
        expect(reply).to.equal(Constants.trainingReply("Tester"));
    });

    it("The bot should reply with error message when it cannot train the user's classifier",async ()=>{
        const message = "Train my classifier ; https://drive.google.com/dsfdsfffxcv.csv";
        let handler = new TrainClassifierHandler(message);
        handler.replyToChannel = null;
        const reply = handler.getReply();
        expect(reply).to.equal(Constants.defaultError);
    });

    it("The bot should reply with error message when dataset URL is not found",async()=>{
        const message = "Train my classifier ; https://drive.google.com/dsfdsfffxcv.csv";
        let handler = new TrainClassifierHandler(message);
        handler.userName = "tester";
        const expectedResponse = "Hey @tester, your data set URL doesn't seem to exist!";
        handler.errorCode = 412;
        handler.replyToChannel = null;
        const reply = handler.getReply();
        expect(reply).to.equal(expectedResponse);
    });

    it("The bot should reply with sentiment of the given text, using its own classifier",async ()=>{
        const message = "This is a good question. Even I have the same doubt";
        let handler = new TestGuerdonClassifierHandler(message);
        handler.apiResponse = {
            sentiment : "Positive"
        }
        let result = handler.getReply();
        expect(result).to.not.be.empty;
        expect(result).to.equals("Your text seems to have a Positive tone");
    });

    it("The bot should reply with error message when it cannot reach its API to classify the given text",async ()=>{
        const message = "This is a good question. Even I have the same doubt";
        let handler = new TestGuerdonClassifierHandler(message);
        let result = handler.getReply();
        expect(result).to.not.be.empty;
        expect(result).to.equals(Constants.defaultError);
    });

    it("The bot should reply with an acknowledgement, when user submits their request to test a message on their classifier.",async ()=>{
        const message = "Test the classifier ; https://drive.google.com/dsfdsfffxcvpkl ;  That is great!";
        let handler = new TestYourClassifierHandler(message);
        handler.userName = "Tester";
        const reply = handler.getReply();
        expect(reply).to.equal(Constants.testingReply("Tester"));
    });


    it("The bot should reply with sentiment of the given text, applying the user's classifier",async ()=>{
        const message = "Test the classifier ; https://drive.google.com/ ; that didn\'t help me.";
        let handler = new TestYourClassifierHandler(message);
        handler.apiResponse = {
            sentiment: "positive"
        };
        handler.replyToChannel = null;
        handler.userName = "Tester";
        const reply = handler.getReply();
        expect(reply).to.equal("Hey @Tester, your text seems to have a positive tone.");
    });

    it("The bot should reply with error message when it cannot classify using the user's classifier",async ()=>{
        const message = "Test the classifier ; https://drive.google.com/ ; that didn\'t help me.";
        let handler = new TestYourClassifierHandler(message);
        handler.apiResponse = {};
        handler.replyToChannel = null;
        const reply = handler.getReply();
        expect(reply).to.equal(Constants.defaultError);

    });

    it("The bot should reply with error message when model URL is not found",async()=>{
        const message = "Test the classifier ; https://drive.google.com/dsfdsfffxcv.pkl ; Good job Guerdon";
        let handler = new TestYourClassifierHandler(message);
        handler.userName = "tester";
        const expectedResponse = "Hey @tester, your model URL doesn't seem to exist!";
        handler.errorCode = 412;
        handler.replyToChannel = null;
        const reply = handler.getReply();
        expect(reply).to.equal(expectedResponse);
    });

    it("The bot should return formatted reply text when asked for top N Mattermost users",async ()=>{
        const message = "Find Top 2 users";
        let handler = new MattermostTopUsersHandler(message);

        handler.formattedApiResponse = 
            [
                {"id": "user1", "score": 30, "name": "ABC"},
                {"id": "user2", "score": 20, "name": "XYZ"}
            ];

        let result = handler.getReply();
        expect(result).to.not.be.empty;
        expect(result).to.equals("Here are your top users over the last 7 days:\nABC : 30 points\nXYZ : 20 points\n");
    });

    it("The bot should reply with an error message when top users could not be found",async ()=>{
        const message = "Find Top 2 users";
        let handler = new MattermostTopUsersHandler(message);

        handler.formattedApiResponse = [];

        let result = handler.getReply();
        expect(result).to.not.be.empty;
        expect(result).to.equals(Constants.defaultError);
    });

});

