import unittest
from TextClassification import TextClassification
from unittest.mock import patch
from unittest.mock import Mock  
import nltk
nltk.download('punkt')
from textblob import TextBlob
from TextClassification import POSITIVE, NEGATIVE, NEUTRAL
from MockFile import MOCK_DATASET_URL, MOCK_MODEL1_URL, MOCK_MODEL2_URL, MOCK_EMAIL 


class TestTextClassification(unittest.TestCase):        
    def test_classify_semantic_text_when_polarity_is_positive(self):
        textClassification = TextClassification()
        textClassification.get_polarity = Mock(return_value=3)
        self.assertEqual(TextClassification.classify_semantic_text(textClassification, 'text'), POSITIVE)
        textClassification.get_polarity.assert_called_once()

    def test_classify_semantic_text_when_polarity_is_zero(self):
        textClassification = TextClassification()
        textClassification.get_polarity = Mock(return_value=0)
        self.assertEqual(TextClassification.classify_semantic_text(textClassification, 'text'), NEUTRAL)
        textClassification.get_polarity.assert_called_once()
    
    def test_classify_semantic_text_when_polarity_is_negative(self):
        textClassification = TextClassification()
        textClassification.get_polarity = Mock(return_value=-2)
        self.assertEqual(TextClassification.classify_semantic_text(textClassification, 'text'), NEGATIVE)
        textClassification.get_polarity.assert_called_once()

    def test_3(self):
        t = TextClassification()
        self.assertEqual(t.train_classifier(MOCK_DATASET_URL, MOCK_EMAIL),MOCK_MODEL2_URL) 	

if __name__ == '__main__':
    unittest.main()