# Documentation on story creation and assignment at each iteration
### Story board as on October 28, 2019:
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/process/Untitled.png)

### Story board as on October 30, 2019:
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/process/progress.JPG)

### Story board as on November 1, 2019 (end of Iteration 1):
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/process/progress_2.JPG)

### Story board as on November 2, 2019 (start of Iteration 2):
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/process/Iteration_2_2nd_Nov.JPG)

### Story board as on November 8, 2019 (End of Iteration 2):
![](https://github.ncsu.edu/csc510-fall2019/CSC510-13/blob/master/process/Untitled3.png)


# Scrum meeting notes / process notes
| Meeting Date  | Meeting Minutes | 
| ------------- | ------------- |
|October 25, 2019 | In this meeting, we divided the project into smaller modules and analyzed tasks required for implementation. We created user stories. In the group we discussed the complexity/effort required for each user story and assigned story points. Then we divided the work equally amongst all of us. We will review this work after some days to see if everyone is on track and check if someone is overloaded or needs help. This will also help us understand if our initial estimates are correct.|
|October 29, 2019 | In this meeting we discussed status of our individual tasks and any blockers that we have due to dependencies on other tasks. Most of the tasks are on track to be completed by the end of this iteration. This gave us a sense of satisfaction that our estimates were correct. We also added some tasks for upcoming Iteration 2 based on our findings and pending work expected at the end of Iteration 1. We will build upon this further. One major positive was, we were successfully able to test a user model on our local machine in our proff of concept, which removes any dependencies on Colab or other external AI cloud environments. We plan to meet on November 1, 2019 to discuss and reflect on this iteration, and to finalize this document for Iteration 1 milestone.|
|November 1, 2019 | In this short meeting, we confirmed that all the iteration tasks were completed and we are on track. Also, this was an opportunity for each of us to talk about any difficulty they might have faced on their tasks. For example, the Mattermost API integration was an issue, because the API did not work according to their documentation. We decided to take a day to think about Iteration 2, in addition to the tasks for Iteration 2 that were already created earlier. We will assign the tickets in our next meeting on the 2nd. |
|November 2, 2019 | In this meeting, we discussed the tasks we need to work on in Iteration 2. We created the tasks on the Project board and assigned story points to them. Then we divided the tasks to complete the user stories to all the team members.  We also identified the dependencies between the tasks, integration tasks, and exception handling that we need to complete in this iteration.|
|November 6, 2019 | In this meeting, we discussed status of tasks in the second iteration that are not yet complete. We also identified a few issues/bugs in tasks which had mutual dependencies on each other and discussed approach to resolve those. We discussed any blockers for the demo which is scheduled on November 7. We have decided to meet on November 8 to close the current iteration and to finalize the documentation for the same.|
|November 8, 2019 | In this meeting, we closed iteration 2. We have completed all tasks planned for this iteration. We discussed and documented the practices and reflection for this iteration. |


# Iteration Documentation
## Iteration 1

### Status of Tasks
| Task Title  | Story Points | Assigned To |  Status | 
| ----------- | ---------- |  --------- |  ------ |
|Generate and upload pkl file and automate the Login to Bot's Google Drive|3|Akanksha|Done|
|Add Download functionality to the classifier to download models and datasets|3|Akanksha|Done|
|PoC - Test USer Classifier|3|Harsh| Done|
|Notify the user when they test their classifier against their message|1|Amogh|Done|
|Mattermost API Integration for Top N Users|3|Amogh|Done|
|Unit Tests for Mattermost API Integration for Top N Users|3|Amogh|Done|
|CSV File Format and Rules for "Train my Classifier"|1| Sayali| Done|
|Model Training for Given User Data|3|Sayali| Done|
|Model file (pkl) access to only a particular user|1|Akanksha|Done|
|Text pre-processing for user input data|3|Sayali|Done|
|Access to model (.pkl) file given by user|1|Harsh|Done|
|Ranking the users by the sentiment of their messages|3|Harsh|Done|

All the planned tasks were completed.

### Practices
We ensured communication occurred daily regarding each person's task status through a WhatsApp group. At an individual level, each one of us raised concerns if any, at the first sign of doubt, and seeked clarification. Code was reviewed nearly every night. We believe our process was carried out in the true spirit of Agile, to the best of our ability.

The class material on TDD was very helpful and helped us a lot in this project. We've tried to follow the TDD approach throughout.

For 2 tasks, we followed pair programming, with the assigned person taking the role of the 'driver', with the other person being the 'observer'. 

### Process Reflection
Overall, each one of us is satisfied with the way this iteration flowed, and would aim to replicate the same in the next one. However, we did face difficulty on the Mattermost ticket - the API documentation suggested 'page', 'params' and 'page_size' as query parameters but the API was found to work with only one query parameter and gave wrong results when multiple parameters were used. Getting to work around that was an unexpected challenge. Keeping some buffer capacity, helped us in overcoming this challenge.

## Iteration 2

### Status of Tasks
| Task Title  | Story Points | Assigned To | Status |
| ----------- | ------ | ------- | -----------|
|Using credentials with docker to upload trained model | 3| Amogh | Done |
|Enhancing User Experience | 3| Amogh | Done |
|Model Evaluation | 5| Sayali | Done |
|Bot integration | 1| Sayali | Done |
|Test user classifier - input test tranformation and classification | 3| Harsh | Done |
|Bug fixes in app.py | 1| Akankska | Done |
|Test user classifier model generation | 3| Harsh | Done |
|Text classification by bot | 1| Akanksha | Done |
|Enhancements to Use case 1 | 3| Akanksha | Done |

### Practices
In Iteration 2, we took into account the feedback/reflection of Iteration 1 and followed practices which we found were useful in Iteration 1. We continued the practice of daily communication to know the status of tasks, dependencies that may arise and any potential blockers. This ensured we have good coordination since we knew where everyone is with respect to their tasks. 

We used pair programming for a couple of tasks with the assigned person taking the role of the 'driver' and another teammate taking the role of the 'navigator'.

### Process Reflection
All of us are satisfied with the practices we followed throughout the iteration. We appreciate the agile practices that ensured we always stay on track and also facilitated high collaboration. We were able to complete all tasks planned in this iteration efficiently.

We also appreciate the practice of test-driven development (TDD). Writing tests before writing the actual code helped us to avoid deviation from the scope. Also, it brought clarity in our approach since we knew the expected behaviour for various inputs and edge cases beforehand. We could prioritize our tasks focussing on the core working of uses cases first followed by edge cases. 
