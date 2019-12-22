import urllib.request
import ValidationUtils
import uuid
import re
import requests
from GoogleDriveAPI import GoogleAPI
from google_drive_downloader import GoogleDriveDownloader as gdd

class FileUtils:

    def __init__(self):
        pass

	# downloads dataset from the URL and saves it to the specified path
    def download(self, url, is_dataset):
        if not self.does_url_exist(url):
            return None
        # create a random name for the file
        u = uuid.uuid4()
        name = "./data/"+u.hex

        # Add file extention based on the file type
        if is_dataset:
            name += "_dataset.csv"
        else:
            name += "_model.pkl"

        file_Id = self.get_file_id(url)
        gdd.download_file_from_google_drive(file_id=file_Id,dest_path=name,unzip=False)

        return name                            
        

    def does_url_exist(self, url):
        return int(requests.get(url).status_code) < 400
    
    def get_file_id(self, url):
        link_arr = url.split("?id=")
        if len(link_arr) < 2:
            split = re.split("d/", url)
            split = re.split("/edit|/view",split[1])
            file_id = split[0]
            return file_id
        else:
            file_Id=link_arr[1]
            return file_Id

    def upload_model(self, path, email):
        #upload pkl file to google drive and return URL
        google_api = GoogleAPI()
        return google_api.upload(path, email)
