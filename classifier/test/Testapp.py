from flask import Flask, abort, request, Response
import json
import urllib.request
import app
from unittest import TestCase
from MockFile import MOCK_DATASET_URL, MOCK_MODEL1_URL, MOCK_MODEL2_URL, MOCK_BAD_URL
from TextClassification import POSITIVE

class AppTests(TestCase):

    def setUp(self):
        app.app.config['TESTING'] = True
        self.app = app.app.test_client()

    # executed after each test
    def tearDown(self):
        pass
 
    def classify(self, text):
        return self.app.post(
            '/testClassifier/Guerdon',
            json = { 'text' : text }
        )
    
    def classify_using_user_model(self, text, classifier):
        return self.app.post(
            '/testClassifier',
            json = { 'text' : text, 'classifier' : classifier}
        )
    
    def train_model(self, dataset):
        return self.app.post(
            '/trainClassifier',
            json = { 'dataset' : dataset}
        )

    def test_our_Guerdon(self):
        response = self.classify('All the best')
        self.assertEqual(response.status, "200 OK")
        self.assertEqual(response.json['sentiment'], POSITIVE)
        
        # If the text to be classified is blank
        response = self.classify('')
        self.assertEqual(response.status, "400 BAD REQUEST")

    def test_user_classifer(self):
        response = self.classify_using_user_model('All the best', MOCK_MODEL1_URL)
        self.assertEqual(response.status, "200 OK")
        self.assertEqual(response.json['sentiment'], POSITIVE)

        # If the text to be classified is blank
        response = self.classify_using_user_model('', MOCK_MODEL1_URL)
        self.assertEqual(response.status, "400 BAD REQUEST")
        
        # If the url provided is not accessible
        response = self.classify_using_user_model('All the best', MOCK_BAD_URL)
        self.assertEqual(response.status, "400 BAD REQUEST")


    def test_train_user_classifer(self):
        response = self.train_model(MOCK_DATASET_URL)
        self.assertEqual(response.status, "200 OK") 
        self.assertEqual(response.json['url'], MOCK_MODEL2_URL)
        
        # If the url provided is not accessible
        response = self.train_model(MOCK_BAD_URL)
        self.assertEqual(response.status, "400 BAD REQUEST")