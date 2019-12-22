import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import numpy as np

def remove_pattern(input_txt, pattern):
    r = re.findall(pattern, input_txt)
    for i in r:
        input_txt = re.sub(i, '', input_txt)
    return input_txt

def test_user_classifier(user_model , text_to_classify):
    loaded_model = pickle.load(open(user_model, 'rb'))
    
    # Preprocessing of input text
    text_to_classify = remove_pattern(text_to_classify,"@[\w]*")
    text_to_classify = text_to_classify.replace("[^a-zA-Z#]", " ")
    text_to_classify = ' '.join([w for w in text_to_classify.split() if len(w)>3])
    
    # Vectorization using tfidf
    #Loading vectorizer which was fitted during training
    vectorizer = pickle.load(open("./tfidf_final.pkl", 'rb'))
    test_input = [text_to_classify]

    tfidf_text = vectorizer.transform(test_input)
    prediction = loaded_model.predict(tfidf_text)
    
    if(prediction[0] == 1):
        return "positive"
    else:
        return "negative"

if __name__ == "__main__":
    model_file_path = "./lreg_final.pkl"
    user_text = "You did good but I expceted a bit more"
    sentiment = test_user_classifier( model_file_path, user_text)
    print("Text 1: " + user_text)
    print("Sentiment 1: " + str(sentiment))
    user_text = "This is less than what I expected"
    sentiment = test_user_classifier( model_file_path, user_text)
    print("Text 2: " + user_text)
    print("Sentiment 2: " + str(sentiment))