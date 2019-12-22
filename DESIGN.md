# Problem Statement
There are numerous tasks in domains where Artificial Intelligence and text-classification models are used - spam filtering, categorizing product reviews, predicting the chance of defaulting, to name a few. All these problems share one commonality, which is using a dataset to train a Machine Learning model and using that ML model to predict results. The same tasks of preprocessing text data, filtering noise, and training the ML model needs to be done by each individual. We are trying to solve this problem wherein, an individual can just give his/her labeled data-set to our AI bot, and expect the bot to perform all these tasks on their behalf, and return a trained model that fits well (has highest validation accuracy). We plan to test the bot by getting a semantic analyzer created through it, which could classify a message or a tweet's tone as positive, neutral or negative. Thus, individuals with no ML / AI experience can get their Machine Learning Model created and test the same by simply feeding a line of text and see if its tone is rude or neutral. Hence, the user-base of our bot could range from a naive user to an ML expert.

# Bot Description

> Phrase: "Coin your Text Classifier"

Our bot is a Responder Bot. It can function as a Reward Bot or BotBot too, based on the task given. It performs 2 major tasks.

- Train a text-classification model

The user just needs to provide us with a dataset and define the text-classification task (what are the classes and input texts). The bot will choose optimal hyperparameters for a given ML technique and return the best-trained model (with highest accuracy/F-1 score) to the user. This helps any beginner in AI to perform text classification even without knowing the complex math behind it. It is completely abstracted from the end-user. There are many common use cases for this like spam email filtering, analyzing website content using tags (which helps Google crawl your website easily which ultimately helps in increasing a user's SEO ratings), document classification, etc. 
(Note: Initially we plan to focus on 2-class classification and later expand it to multi-class classification bot if time permits)

- Apply the user's trained model for classifying data.

Through a web interface, the user is allowed to upload a trained model. Then, the user will provide input texts through the interface and the pre-trained model (given earlier) will be used to classify this text. This is useful when the user is using a different service to create a trained model and is looking for an interface which can help in testing the model.

- Test our bot

We also provide the user with the option of using our trained text classifier bot. To demonstrate this, we will create a pre-trained sentiment analyzer. User provides input data to our bot, and our bot will classify the tone of any text/message/tweet and respond to user. Any naive user with no knowledge or experience in AI or ML can easily use this service.

- Mattermost Top Users Using our AI-bot

As a stretch goal, we plan to implement a "Mattermost Reward Bot" using the semantic model trained by our AI bot. Given a special text message, the bot will respond with the top 10 members (with highest reward points) on the channel based on most recent messages sent on the channel. This reward will be decided based on how many, and how useful/positive/non-abusive comments, a member has posted on the Mattermost channel. By using our AI bot, we will assign reward points to members. This way members feel appreciated for their contribution and will be encouraged to contribute more and help other students, which indirectly offloads a lot of work from course staff. The client (querying for the top 10) can be either the Mattermost chat window or our interface.

# Use Cases
```
User Interaction:
When user enters “Hi Guerdon” 
Bot will respond: "Hi I am Guerdon. Here is what I can do for you: -
Train my classifier ; <G-drive link
Test the classifier ; <G-drive link> ;  <input text> 
Classify my test ; <input text>
Find top <N> members
" 


Use Case 1: Train your text classifier
1 Preconditions
   User must upload data file to google drive and have a link ready to be provided as input if they want our Bot to train a classifier.
2 Main Flow
   User provides a shared drive link where the data is uploaded[S1]. Bot will provide interface for user to check model training status [E1][S2]. Once the model is trained, bot will provide a G-drive link for the trained model, back to user[S3],[S4].
3 Subflows
  [S1] User uploads data to G-drive and makes the data accessible to anyone with the link. User enters message in the following format: "Train my classifier ; <G-drive link>"
  [S2] Bot will update training status continuously to user [Starting/In progress/Done/Error] through a link.
  [S3] Bot updates user with the status of successfully trained model.
  [S4] Bot uploads the trained model to G-drive and provides link back to the user.
4 Alternative Flows
  [E1] The provided link is not accessible or no data is found. Bot returns error.
```

```
Use Case 2: Provide trained classifier and input data to test the classifier.
1 Preconditions
   User wants to test the sentiment of text using their own classifier. User must upload the trained model to G-drive. 
2 Main Flow
   User selects the option of providing their own model and data for testing[S1][S2]. Bot will respond back with a positive or negative feedback or error [S3][E1][E2].
3 Subflows
  [S1] User uploads trained model to G-drive and makes the model accessible for downloading to anyone with the link.
  [S2] User enters a message in the following format: "Test the classifier ; <G-drive link> ;  <input text> "
  [S3] Bot updates user with the result once classification is complete. 
4 Alternative Flows
  [E1] The provided link is not accessible or no model is found. Bot returns error.
  [E2] Input text is not provided, so bot returns error.
    

```
```
Use Case 3: Test our Bot classifier.
1 Preconditions
   User wants to test the sentiment of text using our AI-Bot classifier. User must have the input line of text ready.
2 Main Flow
   User chooses to use our Bot classifier for classifying input data [S1].Bot responds with classification results [S2][E1]
3 Subflows
  [S1] User enters a message in the following format: "Classify my test ; <input text>"
  [S2] Bot updates user with the result once classification is complete.
4 Alternative Flows
  [E1] Input text is not provided, so bot returns error.
```

```
Use Case 4 [Stretch]: Mattermost top N users using our AI bot (Can be used for giving rewards (Reward Bot)).
1 Preconditions
   User wants to get a list of top N Mattermost users who were most active, provided support / posted helpful contents (judged using our AI-Bot) on class channel.
2 Main Flow
   User selects to view top mattermost users. Bot replies with top N users based on how helpful their contribution was to the class channel over the past week[S1][E1].
3 Subflows
  [S1] Bot measures user activity based on how active they were (number of texts sent) weighted by how positive/useful their messages were, and accordingly builds a list of top N users and returns it.
  [S2] User enters a message in the following format: "Find top <N> members"
4 Alternative Flows
  [E1] Bot is not able to fetch user data from Mattermost and hence returns error.
```


# Design Sketches

## WireFrame Mockups
The links for mock up for each screen are :

### Use Case 1: 
[Train your text classifier](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/Wireframe_Usecase_1.png)

### Use Case 2: 
[Provide trained classifier and input data to test the classifier](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/Wireframe_Usecase_2.png)

### Use Case 3: 
[Test our Bot classifier](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/Wireframe_Usecase_3.png)

### Use Case 4: 
[Mattermost Rewards](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/Wireframe_Usecase_4.png)

## Story board

### Use Case 1: Train your text classifier
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/1.1.png)
<br>
<br>
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/1.2.png)
<br>
<br>
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/1.3.png)
<br>
<br>
<br>
Error Scenario:
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/1.4.png)

### Use Case 2: Provide trained classifier and input data to test the classifier
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/2.1.png)
<br>
<br>
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/2.2.png)
<br>
<br>
<br>
Error Scenario:
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/2.3.png)

### Use Case 3: Test our Bot classifier
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/3.1.png)
<br>
<br>
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/3.2.png)
<br>
<br>
<br>
Error Scenario:
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/3.3.png)

### Use Case 4: Mattermost Rewards
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/4.1.png)
<br>
<br>
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/4.2.png)
<br>
<br>
<br>
Error Scenario:
<br>
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/4.3.png)

# Architecture Design + Additional Patterns

## System Architecture

![High Level Design](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/architecture1.jpg)

Our system provides a web interface we will build, and also interacts with the following third party endpoints - Google Drive, Twitter, Mattermost. The dotted line indicates future stretch goals.

![Lower Level Design](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/design/architecture2.jpg)

The web server provides a simple user interface for taking user input. It uses Mattermost client and the model trainer/classifier application to generate its results. The Mattermost client calls Mattermost API, and filters the results for top 10. The model trainer and classifier provides two endpoints: to train a model, and classify a text.

## Components

### Web Server

The web server provides a rudimentary UI for the user to perform the following tasks. We require as many pages as tasks, and a home page to select these tasks. The task pages, along with their URLs are listed below:

- Provide a dataset to get a trained model (GET "/train")
- Provide a text and model identifier, to get the text's sentiment (GET "/classify")
- Provide a text and get its sentiment using our model (GET "/classify/ai")
- Query for the most recent top 10 (in general, top N) Mattermost users (GET "/top/:N")

Another request (GET "/:model_token") the user can make is to check whether a model (for the data just submitted) is available or not.

The web service will be written in Python using the Flask package.

#### Task 1

This task is triggered by a button on the 'GET "/train"' page. The user is asked to provide the trained data as text input (in the form of a Google Drive URL where the data resides), and clicks a button that makes a request 'POST "/train"'. The response is the URL at which the model, once trained, will be available.

#### Task 2

This task is again triggered by a button on the 'GET "/classify"' page. The user is asked to provide a text/message and a model identifier (the model's Google Drive link) and then clicks a button that makes a request to 'POST "/classify"'. The response is the binary sentiment of the message.

#### Task 3

This is similar to task 2, the only difference being, the model identifier is not specified by the user. We will use our own bot to classify this text.

#### Task 4

This URL queries the Mattermost Bot service to get the Top N users and returns a list of users.

#### Task 5

The parameter "model_token" is a temporary identifier for a model. When a model is available, this request will respond with a Google Drive link, and a 404 status otherwise.

### Model Trainer and Classifier

This application provides two endpoints, POST "/train" and GET "/classify". For training, it computes the number of classes (N) in the given data set and constructs a set of candidate models. Then, it computes the accuracy (or F-1 score of model) and selects the best one.

The best model is stored in a _.pkl_ format and saved on Google Drive.

### Mattermost Client

The Mattermost client provides a REST endpoint "/top/:N" to get all the messages of a given channel after a given timestamp, from Mattermost. Then, it weights number of messages and tone of messages and , 

## Timeline

## Deployment

Our project contains multiple servers (applications) each having its own set of responsibilities as explained above. So, we will containerize each of them and run them all on a single server, thus abstracting this detail from the end user. We write a Dockerfile for each of these services, and then write and run a docker-compose file. Therefore, we can build, start or stop all the services through a single command.

The project will be hosted on a NCSU VCL server, provisioned for a very lengthy time limit.

## Constraints

### Size of training data

Since training the model is highly dependent on how large the data set is, we will have to impose a limit on the size of the training data which the user supplies. This will be done through appropriate messaging on our web interface. Due to server memory and processing limits, data exceeding a threshold size will be trimmed.

### Google Drive - file access permissions 

We ask the user to supply their data set through a Google Drive link. Our system will read the file at that link. Thus, the user needs to provide at least a _View_ level access on this file to "anyone with a link".

The trained model will be stored on our team's Google Drive link. We will ensure that these files too have a _View_ permission.

### Response from 3rd party APIs

Since we will be using Google Drive, Twitter and Mattermost APIs, we should expect (as a client to these APIs) timeouts or denial of service or other non-2xx status responses from them. The user experience of this system highly depends on them giving proper responses. In case of non-2xx responses, we will provide appropriate error messages.

## Packages and Tools used

The _flask_ Python library is used for the web application. Events on the browser are handled by _jQuery_. For building the data model, we will use _Scikit-Learn, Keras, Pandas, Numpy, Matplotlib_ and other Python libraries. Docker and docker-compose are used to connect all these services together and expose them all through a single point of contact (IP address).

## Additional Design Patterns

Our project architecture follows the blackboard pattern, since it is based on user actions. The Mediator pattern is used for communicating between our applications.
