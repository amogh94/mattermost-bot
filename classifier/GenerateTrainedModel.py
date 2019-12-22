from FileUtils import FileUtils
import uuid
import pickle
import numpy as np
import pandas as pd
from ClassifierUtils import delete_file
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import precision_recall_fscore_support
from sklearn.metrics import confusion_matrix, roc_curve, roc_auc_score, classification_report, accuracy_score, precision_recall_fscore_support


class CreateClassifier:

    def __init__(self):
        self.file_utils_obj = FileUtils()
        self.train = None

    def get_dataset(self, dataset_url):
        # download the dataset from url
        dataset_name = self.file_utils_obj.download(dataset_url, True)
        return dataset_name


    def get_model(self, model_url):
        model_name = self.file_utils_obj.download(model_url, False)
        return model_name

    def tokenize_data(self, dataset):
        self.train = pd.read_csv(dataset).fillna(' ')
        train_text = self.train['text']
        word_vectorizer = TfidfVectorizer(
        max_df=0.80,
        min_df=1,
        stop_words='english',
        max_features=1000)
        
        train_features = word_vectorizer.fit_transform(train_text)
        
        #delete the dataset after model is created
        delete_file(dataset)
        return train_features

    def train_model(self, train_features, email):
        # train the model with the vectorized dataset
        train_target = self.train['tone']
        X_train, X_test, Y_train, Y_test = train_test_split( train_features, train_target, test_size=0.2, random_state=42)
        
        #Naive Bayes
        naive_bayes_model, naive_bayes_accuracy= self.train_naive_bayes(X_train, X_test, Y_train, Y_test)

        #SVM
        svm_classifier, svm_accuracy = self.train_svm(X_train, X_test, Y_train, Y_test)
        
        #Decision Tree
        decision_tree_classifier, decision_tree_accuracy = self.train_decision_tree(X_train, X_test, Y_train, Y_test)
        
        model = naive_bayes_model

        if svm_accuracy>=naive_bayes_accuracy and svm_accuracy>=decision_tree_accuracy:
            model = svm_classifier
        elif decision_tree_accuracy>=naive_bayes_accuracy and decision_tree_accuracy>=svm_accuracy:
            model=decision_tree_classifier

        # Generate the model as pkl file
        model_pkl_filename = self.generate_pkl(model, email)
        
        # upload the pkl file to google drive link
        link = self.file_utils_obj.upload_model(model_pkl_filename, email)
        
        #delete the model after uploading it on google drive
        
        delete_file(model_pkl_filename)
        
        return link

    def train_naive_bayes(self, X_train, X_test, Y_train, Y_test):
        gnb = MultinomialNB()
        gnb.fit(X_train, Y_train)
        predictions= gnb.predict(X_test)
        return gnb, accuracy_score(Y_test, predictions)

    def train_logistic_regression(self, X_train, X_test, Y_train, Y_test):
        lr_classifier = LogisticRegression(C=0.1, solver='sag')
        lr_classifier.fit(X_train, Y_train)
        predictions= lr_classifier.predict_proba(X_test)[:, 1]
        return lr_classifier, accuracy_score(Y_test,predictions)

    def train_svm(self, X_train, X_test, Y_train, Y_test):
        svm_model = SVC(C = 0.1, kernel = 'linear')
        svm_model.fit(X_train, Y_train)
        predictions= svm_model.predict(X_test)
        return svm_model, accuracy_score(Y_test,predictions)

    def train_decision_tree(self, X_train, X_test, Y_train, Y_test):
        decision_tree_classifier = DecisionTreeClassifier()
        decision_tree_classifier.fit(X_train, Y_train)
        predictions = decision_tree_classifier.predict(X_test)
        return decision_tree_classifier, accuracy_score(Y_test,predictions)

    def generate_pkl(self, model, email):
        # Save the trained model as pkl
        u = uuid.uuid4()

        # Dump the trained decision tree classifier with Pickle
        model_pkl_filename = "./data/" + email + u.hex + "_trained_classifier.pkl"
        
        # Open the file to save as pkl file
        model_pkl = open(model_pkl_filename, 'wb')
        pickle.dump(model, model_pkl)
        
        # Close the pickle instances
        model_pkl.close()
        
        return model_pkl_filename
