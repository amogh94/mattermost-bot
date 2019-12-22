# Bot Milestone

## Bot Platform Implementation

The __BOTTOKEN__ environment variable required for the bot is the _Personal Access Token_ of your Mattermost account. It is not set in code, rather stored in the _.env_ file.

The bot handles any message posted on the channel in 2 steps. First, it finds out whether the message matches any of the use cases. If so, it creates an object derived from the [_GuerdonHandler_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/src/UseCaseHandler/GuerdonHandler.js) class which contains methods to call APIs that perform tasks for the said use case. The classes are abstracted in [_bot/src/app.js_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/src/app.js) through the use of the Factory design pattern.

The project architecture follows the blackboard pattern since it is based on user actions. The mediator pattern is used for communicating between our applications - the bot running in Node, and the classifier (a Python(Flask) app).

Since we have the classifier application (that provides a set of APIs) in Python and the Bot application in NodeJS, we have used docker-compose to deploy them together. This saves and abstracts the effort of having to install different _pip_ and _npm_ packages and having to run two servers. 

For Use Cases 1, 2 and 3, API implementation is in Python (we have to create our own API's). The interaction between Python and Node.js happens via REST requests and follows the API contracts which are described below:

| Use Case  | Request from Node.js | Response from Python|
| ------------- | ------------- |------------- |
|**Train your text classifier** <br> *Correct Input Format*  | POST http://classifier:8000/trainClassifier <br> Content-Type: application/json <br> {'dataset' : '<csv_file_link>'} | HTTP/1.1 200 OK <br> Content-Type: application/json <br>{'message' :  'Classifier is being trained', <br>'url' : '<trained_model_link>' }|
|**Train your text classifier** <br> *Missing/Wrong Parameters* | POST http://classifier:8000/trainClassifier <br> Content-Type: application/json <br> {'dataset' : ''} | HTTP/1.1 400 BAD REQUEST <br> Content-Type: application/json <br>{}|
|**Provide a trained <br> classifier and input data, <br>to test the classifier** <br> *Correct Input Format* | POST http://classifier:8000/testClassifier <br> Content-Type: application/json <br> {'text' : '<_text_>', <br> 'classifier' : '<classifier_link>'} | HTTP/1.1 200 OK <br> Content-Type: application/json <br>{'sentiment' :  '<tone_of_text>' }|
|**Provide a trained <br> classifier and input data, <br>to test the classifier** <br> *Missing/Wrong Parameters*| POST http://classifier:8000/testClassifier <br> Content-Type: application/json <br> {'text' : '', <br> 'classifier' : ''} | HTTP/1.1 400 BAD REQUEST <br> Content-Type: application/json <br>{}|
|**Test our Bot classifier** <br> *Correct Input Format* | POST http://classifier:8000/testClassifier/Guerdon <br> Content-Type: application/json <br> {'text' : '<_text_>'} | HTTP/1.1 200 OK <br> Content-Type: application/json <br>{'sentiment' :  '<tone_of_text>' }|
|**Test our Bot classifier** <br> *Missing/Wrong Parameters* | POST http://classifier:8000/testClassifier/Guerdon <br> Content-Type: application/json <br> {'text' : ''} | HTTP/1.1 400 BAD REQUEST <br> Content-Type: application/json <br>{}|

Use Case 4, Finding Mattermost Top N users requires making a call to Mattermost API and then processing the messages in Node using sentiment library.

## Use Cases Refinement

Based on the feedback received, we removed the web server component and decided to implement its 4 related use-cases within Mattermost itself. This is achieved by sending messages of a specific format on Mattermost.

The refined use cases are explained below.

### Use Case 0: Bot Interaction

```
1 Preconditions
   User must have an account on Mattermost for the "csc510-f19" server.
2 Main Flow:
   User enters “Hi Guerdon” on Mattermost.
   Bot will respond on the same channel: "Hi I am Guerdon. Here is what I can do for you. Mention the input cases in the following format for the respective tasks-
1) Train your text classifier - "Train my classifier ; <a link to your dataset stored in a csv format>"
2) Provide trained classifier and input data to test the classifier - "Test the classifier ; <a link to your model as a .pkl file> ;  <your text here>" 
3) Test our Bot classifier - "Classify my text ; <input text>"
4) Mattermost top 5 members using our AI bot- "Find top 5 members" (you can replace 5 with any number)

```
### Use Case 1: Train your text classifier

```
1 Preconditions
   User must upload data file to google drive and have a link ready to be provided as input if they want our Bot to train a classifier.
2 Main Flow
   User provides a shared drive link where the data is uploaded[S1]. Bot will reply to user with model training status [E1][S2]. Once the model is trained, bot will provide a G-drive link for the trained model, back to user[S3],[S4].
3 Subflows
  [S1] User uploads data to G-drive and makes the data accessible to anyone with the link. User enters message in the following format: "Train my classifier ; <a link to your dataset stored in a csv format>"
  [S2] Bot will update user with personalized message, that it will notify user once training is complete.
  [S3] Bot updates user with the status of successfully trained model.
  [S4] Bot uploads the trained model to G-drive and send a personalized message to the user on channel, for providing trained model link back to the user.
4 Alternative Flows
  [E1] The provided link is not accessible or no data is found or Bot is not able to access the API. Bot returns an error message "Error!! Please try again after sometime."
```

### Use Case 2: Provide a trained classifier and input data, to test the classifier

```
1 Preconditions
   User wants to test the sentiment of text using their own classifier. User must upload the trained model (as a .pkl file) to G-drive. 
2 Main Flow
   User selects the option of providing their own model and data for testing[S1][S2]. Bot will respond back with a positive or negative feedback or error [S3][E1][E2].
3 Subflows
  [S1] User uploads trained model to G-drive and makes the model accessible for downloading to anyone with the link.
  [S2] User enters a message in the following format: "Test the classifier ; <a link to your model as a .pkl file> ;  <your text here>"
  [S3] Bot updates user with the result once classification is complete. 
4 Alternative Flows
  [E1] The provided link is not accessible or no model is found or Bot is not able to communicate with API. Bot returns error.
  [E2] Input text is not provided, so bot returns the error message "Error!! Please try again after sometime."

```

### Use Case 3: Test our Bot classifier.

```
1 Preconditions
   User wants to check the sentiment of text using our GUERDON-Bot classifier. User must have the input line of text ready.
2 Main Flow
   User chooses to use our Bot classifier for classifying input data [S1].Bot responds with classification results [S2][E1]
3 Subflows
  [S1] User enters a message in the following format: "Classify my text ; <input text>"
  [S2] Bot updates user with the result once classification is complete.
4 Alternative Flows
  [E1] Input text is not provided, or the bot is not able to access the API. so bot returns the error message "Error!! Please try again after sometime."
```

### Use Case 4 [Stretch]: Mattermost top N users using our AI bot (Can be used for giving rewards (Reward Bot)):

```

1 Preconditions
   User wants to get a list of top N Mattermost users who were most active, provided support / posted helpful contents (judged using sentiment analyzer of our AI-Bot) on class channel.
2 Main Flow
   User selects to view top mattermost users[S1]. Bot replies with top N users based on how helpful their contribution was to the class channel over the past week[S2][E1].
3 Subflows
  [S1] User enters a message in the following format: "Find top <N> members"
  [S2] Bot measures user activity based on how active they were (number of texts sent) weighted by how positive/useful their messages were, and accordingly builds a list of top N users (names, scores) and returns it.
  
4 Alternative Flows
  [E1] Bot is not able to fetch user data from Mattermost (API access error) and hence returns the error message "Error!! Please try again after sometime."
```

## Mocking Infrastructure
### Mocking the bot code
We have a [_mock.json_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/test/mock.json) file (in the _bot/test_ directory) which returns mock API responses when we run unit tests. We have used [_nock_](https://github.com/nock/nock), which is a HTTP server mocking and expectations library for _Node_. Nock works by overriding Node's _http.request_ function and is used to test modules that perform HTTP requests in isolation. We have also used _Mocha_ and _Chai_ Javascript packages for writing the unit tests. Mocha simplifies asynchromous testing while chai is a BDD/TDD assertion library for node and the browser. 

We have written unit tests for happy paths and alternative (error) paths for the bot. For example, a unit test to return the correct child class object of [_GuerdonHandler_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/src/UseCaseHandler/GuerdonHandler.js) for any message posted. You can find all the tests at [_/bot/test/testBot.js_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/test/testBot.js).

### Mocking the classifier code
For the classifier, we have mocked calls to methods from external classes, focussing on testing the functionality of the current class. We have used _unittest.mock_ library in Python for mocking and writing tests. _unittest.mock_ provides a core _Mock_ class, which can be used to create flexible mock objects. Mocks allow us to specify (mock) return values. Additionally, we have used patch() decorator in mock that provides an easier way to temporarily replace classes in a particular module with a _Mock_ object. We have returned mock data from the APIs that are not yet implemented to support service integration. 

## Selenium/Puppeteer Testing
We have written integration tests using _Puppeteer_ to verify that the bot is returning the correct response based on an input message. Puppeteer tests can be found at [_bot/test/bot_integration.js_](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/bot/test/bot_integration.js). They cover testing of all of our use cases: (a) The bot replies with a greeting response when a greeting message is received, (b) the bot returns tone of the message when Guerdon classifier is used, (c) it returns a URL to the model when user wants to build a model, (d) it returns tone of the message when user gives his/her text classifier and the text to classify, and (e) it returns top N users (contributors) in Mattermost when the same are requested. The screencast demonstrates the happy path and alternate path for each of these use-cases using the above Automation tests.

## Screencast

Please watch our screencast [here](https://drive.google.com/file/d/1N-FQEAimoOQQmS4YtNQw9vc_t2yYi59H/view?usp=sharing). It demonstrates the happy and alternative path of our bot, performing its four primary use cases.

## How to run and test
We are using our class mattermost workspace since we rely on data from class Mattermost channels in our implementation to categorize top 'N' contributors. Although, in this milestone the data is mocked.

Create a "project" channel in mattermost workspace (Integration tests use this channel to avoid spamming the main class channel). Another option is to change the mattemostProjectUrl variable in bot_Integration.js file inside test folder. 

When deployed, the project requires docker-compose installed. If it is not already installed, you can install it using the command:
```
$ pip3 install docker-compose
```
Note: If you are a Windows user, install "Docker Toolbox" for windows.

The bot requires a token named __BOTTOKEN__. This is the _Personal Access Token_ of your Mattermost account. At the project directory's root, create a file named __.env__ and add the following line:
```
BOTTOKEN=paste_your_token_here
```
To run the bot, use the following command:
```
$ docker-compose up --build
```
To run tests, set the environment variables __MATTERMOST_EMAIL__ and __MATTERMOST_PWD__. Make sure these are of different user than the one used for running the Bot (we have a check wherein the Bot will not reply to itself). Then go to _/bot_ directory and run the following command:
```
$ npm test
```
