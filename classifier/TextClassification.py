from textblob import TextBlob
import FileUtils
from Constants import POSITIVE, NEUTRAL, NEGATIVE
from GenerateTrainedModel import CreateClassifier
from ClassifierUtils import delete_file
from TestUserModel import TestUserModel

class TextClassification:
    def __init__(self):
        pass

    def classify_with_user_model(self, text, userModel):
        user_classifier = TestUserModel(text, userModel)
        model_name = user_classifier.download_user_model()

        if user_classifier.model_name is None:
            return None
        user_classifier_response = user_classifier.classify()
        delete_file(model_name)
        return user_classifier_response

    def classify_semantic_text(self,text):
        ''' This method would classify the text based on our model
            We are using textblob to classify our text based on the polarity.
            If the polarity is less than 0 it is negative, if it is 0 its neutral else it is positive.
            We are also considering subjectivity of the sentence which lies between [0,1] where 0 means the
            sentence is objective and 1 means the sentence is highly subjective (that is it could be a public opinion)
            If a text is highly subjective, we are considering it as neutral 
        '''
        polarity, subjectivity = self.get_polarity_and_subjectivity(text)
        
        if subjectivity >= 0.8 or polarity == 0:
            return NEUTRAL

        elif polarity > 0:
            return POSITIVE

        else:
            return NEGATIVE 

    def get_polarity_and_subjectivity(self, text):
        
        blob = TextBlob(text)

        # initialise polarity and subjectivity with 0
        polarity = 0
        subjectivity = 0
        
        # for each sentence add the attributes to account for complete text provided by the user
        if blob and blob.sentences:
            for sentence in blob.sentences:
                polarity += sentence.sentiment.polarity
                subjectivity += sentence.sentiment.subjectivity
            # Get average subjectivity for each sentence 
            subjectivity /= len(blob.sentences)

        return polarity, subjectivity
       

    def train_classifier(self, dataset_url, email):
        train_features = ''
        create_classifier = CreateClassifier()
        dataset = create_classifier.get_dataset(dataset_url)
        if dataset is None:
            return None
        train_features = create_classifier.tokenize_data(dataset)
        url =  create_classifier.train_model(train_features, email)
        return url
