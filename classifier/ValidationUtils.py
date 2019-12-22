import urllib
import validators

class ValidationUtils:

	def __init__(self):
		pass

	#Validate if the URL is accessible	
	def validate_url(self,url):
		try:
			return validators.url(url)
		except:
			return False

	#Validate if the input text is not empty
	def validate_text(self, text):
		return not not text