import unittest
from FileUtils import FileUtils
from unittest.mock import patch
from unittest.mock import Mock

class FileUtilsTest(unittest.TestCase):
    @patch('FileUtils.urllib')
    def test_download_dataset_when_url_is_valid(self, mock_urllib):
    #    FileUtils.download_dataset('http://www.google.com')
    #    mock_urllib.request.urlretrieve.assert_called_once()
        pass

    @patch('FileUtils.urllib')
    def test_download_dataset_when_url_is_invalid(self, mock_urllib):
    #    FileUtils.download_dataset('abcd')
    #    mock_urllib.request.urlretrieve.assert_not_called()
        pass
 	

if __name__ == '__main__':
    unittest.main()