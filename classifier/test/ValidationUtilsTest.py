import unittest
from ValidationUtils import ValidationUtils
from unittest.mock import patch

class ValidationUtilsTest(unittest.TestCase):
    @patch('ValidationUtils.urllib')
    def test_validate_url_when_url_is_valid(self, mock_urllib):
        mock_urllib.request.urlopen.side_effect = None
        assert ValidationUtils.validate_url('http://www.google.com') == True
			
    @patch('ValidationUtils.urllib')
    def test_validate_url_when_url_is_invalid(self, mock_urllib):
        mock_urllib.request.urlopen.side_effect = Exception
        assert ValidationUtils.validate_url('abcd') == False

    def test_validate_text_when_text_is_valid(self):
        assert ValidationUtils.validate_text('abcd') ==True

    def test_validate_text_when_text_is_empty(self):
        assert ValidationUtils.validate_text('') ==False
    
    def test_validate_text_when_text_is_null(self):
        assert ValidationUtils.validate_text(None) ==False
 	

if __name__ == '__main__':
    unittest.main()