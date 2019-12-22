from flask import Flask, abort, request, Response, jsonify
import json
import sys
import urllib.request
import urllib
import TextClassification
import ValidationUtils
from Constants import APP_NAME, PORT
app = Flask(__name__)

# Object instantiation to validate user provided URLs 
validate_utils_obj = ValidationUtils.ValidationUtils()

# Get the request and call the respective API based on the url

@app.route('/trainClassifier', methods=['POST'])
def train_your_classifer():
	# Use Case 1: Function to train a new classifier with the dataset provided by user 
	try:
		text_classifier = TextClassification.TextClassification()

		# Raise an HTTP 400 Error if dataset or email is not provided
		# Raise an HTTP 400 Error if the dataset link provided by user is not valid
		if not request.json["dataset"] or not validate_utils_obj.validate_url(request.json["dataset"]) or not request.json["email_id"]:
			resp = Response(status=400, mimetype='application/json')
			return resp
		
		res = { 'message' :  "Classifier is being trained" ,	
				'url' : text_classifier.train_classifier(request.json["dataset"], request.json["email_id"])}

		if res["url"] is None:
			resp = Response(status=412)
			return resp

		js = json.dumps(res)
		
		resp = Response(js, status=200, mimetype='application/json')

	except Exception as e:
		# Raise an HTTP 500 Internal Server Error and send the exception caught
		js = json.dumps({'error': str(e)})
		resp = Response(js, status=500, mimetype='application/json')
	
	return resp	


@app.route('/testClassifier', methods=['POST'])
def test_your_classifer():
	# Use Case 2: Function to classify user text using user provided classifier
	try:
		text_classifier = TextClassification.TextClassification() 

		# Raise an HTTP 400 Error if text or classifer is not provided
		# Raise an HTTP 400 Error if the classifier link provided by user is valid
		if not request.json["text"] or not request.json["classifier"] or not validate_utils_obj.validate_url(request.json["classifier"]):
			resp = Response(status=400, mimetype='application/json')
			return resp
		
		res = {'sentiment' : text_classifier.classify_with_user_model(request.json["text"], request.json["classifier"])}
		if res["sentiment"] is None:
			resp = Response(status=412)
			return resp

		js = json.dumps(res)
		resp = Response(js, status=200, mimetype='application/json')

	except Exception as e:
		# Raise an HTTP 500 Internal Server Error and send the exception caught
		js = json.dumps({'error': str(e)})
		resp = Response(js, status=500, mimetype='application/json')
	
	return resp	


@app.route('/testClassifier/Guerdon', methods=['POST'])
def test_Guerdon():	
	# Use Case 3: Function to test our classifier and classify sentiments using Guerdon
	try:
		text_classifier = TextClassification.TextClassification()
		
		# Raise an HTTP 400 Error if text is not provided
		if not request.json["text"]:
			resp = Response(status=400, mimetype='application/json')
			return resp
		
		res = {'sentiment' : text_classifier.classify_semantic_text(request.json["text"])}
		js = json.dumps(res)
		resp = Response(js, status=200, mimetype='application/json')

	except Exception as e:
		# Raise an HTTP 500 Internal Server Error and send the exception caught
		js = json.dumps({'error': str(e)})
		resp = Response(js, status=500, mimetype='application/json')
	
	return resp


@app.errorhandler(404)
def method_not_found():
	# Raise an HTTP 404 Error if the requested route is incorrect
	resp = Response(status=404, mimetype='application/json')
	return resp


if __name__ == '__main__':
	app.run(APP_NAME, port=PORT)