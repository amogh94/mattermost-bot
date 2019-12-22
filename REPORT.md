# The problem our Guerdon bot solves 
Text classification and sentiment analysis are very useful areas of machine learning which have wide applications such as spam filtering, toxic content blockers, product reviews categorization, and survey response analysis. All these applications have one common characteristic - using a dataset to train a machine learning (ML) model and using that ML model to classify test data. The same tasks of preprocessing text data, vectorization, and training the ML model need to be done for each application.

Guerdon bot tries to solve this problem. An individual can just give his/her labeled data-set to the bot, and expect the bot to perform all these tasks on their behalf, and return a trained model that fits well (has highest validation accuracy). The bot also has a predefined text classifier which users can directly use to find the sentiment of their text. In addition, users can give their own ML model and a text which they wish to classify as input to the bot, and the bot will classify the text using the model they provided. Our bot helps individuals with no ML / AI experience to create their machine learning model and test the same by simply feeding in a line of text and see if its tone is positive, negative or neutral. That is, the bot generalizes these tasks of model training and text classification. Hence, the user-base of our bot could range from a naive user to an ML expert.

The bot listens to Mattermost and also ranks channel members by the number and tone of their comments.

# Primary features and screenshots
* Greeting  

The bot responds with a greeting message specifying the details of its services and how to invoke those services.

![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/report/Usecase0.gif)

Our bot serves the following features:

* Train a model for text-classification  

The user provides a training dataset. The bot will generate ML models for text classification from this data and choose the model with highest validation accuracy. The bot uploads the .pkl file of the trained model to Google drive and returns the shareable link of the file to the user.

![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/report/Usecase1.gif)

* Use the model trained on user data for classifying input text  

The user provides a trained model and the text which they want to classify. The bot applies this model on input text and identifies the tone of the text.

![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/report/Usecase2.gif)

* Use the bot's predefined ML model for classifying input text  

The user provides a text which (s)he wishes to classify. Guerdon (bot) has its own predefined ML model for semantic text classification. The bot will classify the input text using this model.

![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/report/Usecase3.gif)

* Find mattermost top N users  

The bot can also find top N users on the Mattermost channel based on the useful contributions made by each member on the channel. The bot will assign reward points to each member based on how many positive/non-abusive comments they have made. This can make users feel appreciated for their contribution and they will be encouraged to help other users on the channel.

![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/report/Usecase4.gif)


# Reflection on the development process and project

We started off with a high-level design of the project. During the design phase, we defined our use cases and devised wireframes and storyboards. These design sketches were extremely useful to put oneself in the users' shoes and understand the project flow. For our architecture design, we came up with various components of the system, their individual functionalities, how they would communicate with each other and third-part APIs which we will use. The design phase enabled us to think through how we can build our system by analyzing project requirements in depth and laid the foundation of our project.  

Then we used the test-driven development approach. We mocked the service component of our bot. We wrote expected responses for all the use cases and came up with a fully operational bot (with mocked data) that can respond to basic commands. Mocking helped us to define different layers of our system and which APIs will be invoked on various commands. We appreciate the practice of test-driven development. Writing tests before writing the actual code helped us to avoid deviation from the scope. Also, it brought clarity in our approach since we knew the expected behaviour for various inputs and edge cases beforehand. At the end of this phase, we had a solid skeleton of the project in place such that in the subsequent phase, we just had to replace the mocked service component with actual implementation. This is a way of development that we hadn't tried before and are happy to have done it now.

In the implementation phase, we used a highly agile approach. We planned weekly iterations. We used scrum-ban boards to document tasks in each iteration, assign story points, divide tasks equally and track the progress of tasks. We also ensured daily communication amongst the team members which enabled us to quickly identify any dependencies, roadblocks and to know the status of tasks. We used techniques such as 'pair programming' and 'sit together' to foster good collaboration. These techniques provided an enhanced learning experience and were useful for sharing knowledge and collaborating ideas. We also discovered that sometimes, third-party API docs need not always work as claimed, and we must confirm whether they work beforehand.

In the deployment phase, we learnt how to use Ansible to provision a host and deploy the bot on Amazon EC2 instance. During this phase, we picked up how to resolve issues related to missing dependencies, configuration management, environment variables, keys and authentication. Deploying the project real-time and making it demo-able to peers gave us immense satisfaction. 

This project has been a great learning experience. We learnt various design and architecture methods, testing practices and software processes. We appreciate how each of the phases perfectly complement each other and when performed in sequence how each phase simplifies the next phase.

Overall, we highly appreciate the practices we used in this project and we are satisfied with the great deal of things we learnt throughout!

# Limitations and Future Work

* Currently we are limited to perform only sentiment analysis and classification with Guerdon Bot. We could extend this implementation to perform a thorough multi-label text classfication.

* Currently the bot generates and compares traditional machine learning models for the input training data and selects the best fitting model. In recent years, there has been significant development in the field of NLP with the resurgence of deep learning. Our bot can be extended to incorporate deep learning models such as Convolutional Neural Networks, Recurrent Neural Networks (LSTM), HAN model etc. to achieve better performance for NLP tasks.  

* Currently the bot is running on a single EC2 instance, which results in a single point of failure. In future, the bot can be deployed on an elastic cluster and we can apply load-balancing techniques, so that if one node fails, other nodes can respond. We can also scale the cluster up and down based on the request load at a given time instance.

# Screencast
Our project screencast, demonstrating each use case in detail can be found [here](https://www.youtube.com/watch?v=ZP2gxjHo0n4).
