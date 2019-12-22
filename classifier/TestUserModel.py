from FileUtils import FileUtils
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import numpy as np
from Constants import POSITIVE, NEUTRAL, NEGATIVE

class TestUserModel:
    user_text = ""
    model = ""
    model_name = ""
    
    def remove_pattern(self, input_txt, pattern):
        r = re.findall(pattern, input_txt)
        for i in r:
            input_txt = re.sub(i, '', input_txt)
        return input_txt

    def __init__(self, text, userModel):
        self.user_text = text
        self.model = userModel
        self.file_utils_obj = FileUtils()

    def download_user_model(self):
        self.model_name = self.file_utils_obj.download(self.model, False)
        return self.model_name

    def classify(self):
        #Loading vectorizer which was fitted during training
        vectorizer = pickle.load(open("./vectorizer/tfidf_final.pkl", 'rb'))
        
        # Loading model
        model_path = self.model_name
        user_model = pickle.load(open(model_path, 'rb'))
        
        # Preprocessing of data
        text_to_classify = self.remove_pattern(self.user_text,"@[\w]*")
        text_to_classify = text_to_classify.replace("[^a-zA-Z#]", " ")
        text_to_classify = ' '.join([w for w in text_to_classify.split() if len(w)>3])
        test_input = [text_to_classify]
        tfidf_text = vectorizer.transform(test_input)

        #print(len(tfidf_text.toarray()[0]))
        prediction = user_model.predict(tfidf_text)
        
        if(prediction[0] == 1):
            return POSITIVE
        else:
            return NEGATIVE