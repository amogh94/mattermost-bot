# Deployment scripts
The platform we adopted for deployment is AWS EC2. We have used Ansible for automating the deployment. 
The following steps are required to integrate our AI bot. (The scripts can be found in Ansible_Scripts folder.)

### Preconditions:  
The following accounts are required for this deployment:
- a user account on Mattermost with name "guerdon_bot" (this is the bot), since we have integrated our bot with Mattermost platform
- an AWS account
- a Github account which is permitted to access the private repository of our project

### Configurations:
- Download the AWS command line interface (CLI).
- Set the AWS credentials either through AWS CLI or through environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Set your region (us-east-1 recommended).
- Create a file .env and add the following line. This is the Mattermost access token. The contents of this file is:
```
BOTTOKEN=<your Mattermost access token>
```
- Follow [these](https://github.ncsu.edu/settings/keys) steps to create an SSH Key for your GitHub account (assuming you have access to the repository), and check that the files *id_rsa* and *id_rsa.pub* are present at the path:
```
/root/.ssh
```
- Add a GitHub configuration file at */root/.ssh/config*. The file must have the following content:
```
Host github.ncsu.edu
HostName github.ncsu.edu
IdentityFile /root/.ssh/id_rsa
```
- Copy the ansible scripts *ec2_launch.yml*, *install_packages.yml*, *start_bot.yml* into the working directory.

### Steps for Application Deployment:
- Run the *ec2_launch.yml* script file to create an EC2 instance on AWS.
```
ansible-playbook ec2_launch.yml
```
- Run the *install_packages.yml* script to update apt packages, install Docker and Docker Compose on the instance.
```
ansible-playbook install_packages.yml -i inventory -u ubuntu
```
- Run the *start_bot.yml* script to start the bot application on the instance.
```
ansible-playbook start_bot.yml -i inventory -u ubuntu
```

### Deployment Verification:
- Verify whether the bot is running:<br/>
Type “Hi Guerdon” <br/>
Bot will respond with:
```
Hi I am Guerdon. Here is what I can do for you. Mention the input cases in the following format for the respective tasks-
1) Train your text classifier - "Train my classifier ; <a link to your dataset stored in a csv format; Please keep column names as: "text" for data and "tone" for class.>"
2) Provide trained classifier and input data to test the classifier - "Test the classifier ; <a link to your model as a .pkl file> ;  <your text here>" 
3) Test our Bot classifier - "Classify my text ; <input text>"
4) Mattermost top 5 members using our AI bot- "Find top 5 members" (you can replace 5 with any number)
```

# Acceptance Testing

## Credentials for Instructors:
We have invited TAs to our project channel named ```project_guerdon_team13```. Link is [here](https://chat.alt-code.org/csc510-f19/channels/project). 

Please email : hshah3@ncsu.edu and aagniho@ncsu.edu if you are not able to access our project channel.

##### Recommended
TA's can perform the below acceptance testing steps in this project-guerdon channel. We are using our class Mattermost space. So you should be able to login using the same Mattermost credentials.

##### Alternative 
Alternatively, we have also created a TA account just incase, TA's are not able to access our project channel through their login.
Please use the below credentials to login as a TA and use our bot 'Guerdon AI bot'.
```
username: teaching_assistant
password: guerdonbot
```


## Acceptance Test Instructions

The bot works on all the channels for all our use cases. It is recommended to use our project channel (link provided above) to avoid spamming other channels.

### Use Case 1: Train your text classifier
Steps:
- Upload a .csv file, containing training data (in the format specified above i.e. text, tone) to your Google Drive with view permission to all and copy its link (Make sure there are atleast 1000 rows in your dataset).
- Enter a message in the following format on Mattermost:
```
Train my classifier ; < Google Drive link >
For Example: 
You can use these datasets for testing: 
1) Train my classifier ; https://drive.google.com/open?id=1-5f5mKldtEL8PRvH34TvJRDOeQ8nsKrn
2) Train my classifier ; https://drive.google.com/open?id=1_KKeh-K_7gi1DSMF7yA8fwHmOGagHOS3
```
- Bot will respond instantly to you with a training status message:
```
Thanks @teaching_assistant (or your username). I will notify you when your classifier is trained. Watch this space!
```
- When the model is trained, the bot should respond with a link (also, watch out for mail from Google sharing the same link with you on your email id registered on Mattermost. If you are using our dummy TA account, please check credentials below in Use Case 2 to login).
```
Hey @teaching_assistant (or your username), please find your classifier at: <a google drive link>
```
Note - If the data set link that you provided is not accessible or no data is found or the number of data rows is less than 1000, bot may return the following error message (graceful handling). If the message format is incorrect, bot will not respond.
```
Error!! Please try again after sometime
```

### Use Case 2: Provide trained classifier and input data to test the classifier

Pre condition:
- If you plan to use the model trained in above step, make sure to give it public access before using it. Due to security reasons, we give access only to the user who requested for the model to be trained.

- If you are using the TA (teaching_account) account that we created to perform testing, you might need to login to below Gmail account and give the model public access. 
```
  Credentials: 
  email : hackoverflow22@gmail.com
  password - hackoverflow@12
```
Steps:
- Upload a trained model pickle file to your Google Drive with view permission to all and copy its link. 
- Enter a message in the following format in Mattermost:
```
Test the classifier ; < Google Drive link > ; <text to be classified>
For Example: 
You can use these models for testing.
1) Test the classifier ; https://drive.google.com/open?id=1LNRRA5IGGJIo4PxbsfrhzJ0F_V32ov_1 ; Amazing work. Keep it up
2) Test the classifier ; https://drive.google.com/open?id=1LNRRA5IGGJIo4PxbsfrhzJ0F_V32ov_1 ; I expected more. Bad job
3) Test the classifier ; https://drive.google.com/open?id=1-OTNacn4tsSunDoSORl_j3KzWzYi5U7K ; Bad work. You should have done more.
4) Test the classifier ; https://drive.google.com/open?id=1hm9UZBF3drVtziPMG5hlqzuvzGnkPebF ; Amazing work. As expected. Keep it up.

```
- Bot will respond instantly to you with a test status message:
```
Thanks @teaching_assistant (or your username). I will notify you when I can find your classifier and test your message on it. Watch this space!
```
- When the bot classifies the text using the model you provided, it should respond with the sentiment of the text.
```
Hey @teaching_assistant (or your username), your text seems to have a Positive/Negative tone.
```
Note: If the provided model pickle file link is not accessible or no model is found or input text is not provided, bot will return the following error message (graceful handling). If the message format is incorrect, bot will not respond.
```
Error!! Please try again after sometime
```

### Use Case 3: Test our Bot classifier
Steps:
- Enter a message in the following format.
```
Classify my test ; <text to be classified>
```
- Bot should update user with the result (Positive, Negative, or Neutral) once classification is complete.
```
Your text seems to have a Positive tone
```
Note: If the provided format provided is incorrect, bot will not respond.


### Use Case 4: Mattermost top N users using our AI bot
Steps:
- Enter a message in the following format: 
```
Find top <N> contributors
```
- The bot should respond with the list of top users, with name and score for each. For example,
```
Name1 : 2.00 points
Name2 : 1.75 points
...
```
Note - If bot is not able to fetch user data from Mattermost (that is, when Mattermost API does not respond), it should return error.
```
Error!! Please try again after sometime
```

# Code Inspection

Some important class descriptions helpful for understanding our Bot implementation

1. [HandlerFactory.js](bot/src/UseCaseHandler/HandlerFactory.js)
This is the main code-router file for our bot. This is the base class of factory design pattern used for handling different bot usecases. It routes requests to appropriate Use-Case handler ( TrainClassifier handler, MattermostTopUsers handler, TestYourClassifier handler, TestGuerdonClassifier handler). Each of the usecase handlers inherits from the abstract base class (GuerdonHandler).

2. [App.js](bot/src/app.js)
This is the entrypoint for our bot. A Mattermost message listener is defined here which processes requests whenever a message is posted on Mattermost channel. It accepts the incoming message, invokes the Handler factory to handle the request and responds back to the user once the request is processed and reply is ready.

3. [App.py](classifier/app.py)
This is the API entrypoint for our Guerdon bot. Whenever it receives an incoming request, it validates the request, routes the request to TextClassification module, which invokes the requested API endpoints (train model, test user model, test guerdon classifier model) to handle the request and respond back.

# Screencast
Our deployment screencast shows how we deployed our project. Please watch it [here](https://drive.google.com/file/d/1zdd_vUSW5QTdPkiVi1J4MEu8IRLto0VM/view).
