import unittest
from GenerateTrainedModel import CreateClassifier
from unittest.mock import patch
from unittest.mock import Mock

class CreateClassifierTest(unittest.TestCase):
    
    @patch('GenerateTrainedModel.FileUtils')
    def test_get_dataset(self, mock_fileutils):
        classifier = CreateClassifier()
        classifier.get_url = Mock()
        classifier.get_dataset(classifier.get_url)
        mock_fileutils.download_dataset.assert_called_once()

    
#    @patch('GenerateTrainedModel.FileUtils')
#    def test_train_model(self, mock_fileutils):
#        classifier = CreateClassifier('url')
#        classifier.generate_pkl = Mock()
#        CreateClassifier.train_model(classifier)
#        classifier.generate_pkl.assert_called_once()
#        mock_fileutils.upload_model.assert_called_once()
    
 	

if __name__ == '__main__':
    unittest.main()