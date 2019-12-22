from __future__ import print_function
import sys
import io
import pip
import httplib2
import os
from mimetypes import MimeTypes
import pickle


try:
    from googleapiclient.errors import HttpError
    from googleapiclient.discovery import build
    import oauth2client
    from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
    from oauth2client import client
    from oauth2client import tools
    from oauth2client import file
    
    import pickle
    import os.path
    from googleapiclient.discovery import build
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    import io


except ImportError:
    print('goole-api-python-client is not installed. Try:')
    print('sudo pip install --upgrade google-api-python-client')
    sys.exit(1)
import sys

SCOPES = 'https://www.googleapis.com/auth/drive'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Guerdon'

class Flag:
    auth_host_name = 'localhost'
    noauth_local_webserver = False
    auth_host_port = [8080, 8090]
    logging_level = 'ERROR'

try:
    import argparse
    flags = Flag()
except ImportError:
    flags = None

class GoogleAPI:

    def __init__(self):
        pass

    def get_credentials(self):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
        return creds

    def share(self, file_id, email):
        def callback(request_id, response, exception):
            if exception:
                # Handle error
                print(exception)
            else:
                print(response.get('id'))

        credentials = self.get_credentials()
        # http = credentials.authorize(httplib2.Http())
        service = build('drive', 'v3', credentials=credentials)
        try:
            batch = service.new_batch_http_request(callback=callback)
            user_permission = {
                'type': 'user',
                'role': 'reader',
                'emailAddress': email
            }
            batch.add(service.permissions().create(
                fileId=file_id,
                body=user_permission,
                fields='id',
            ))
            batch.execute()
        except Exception as e:
            print(e)

        
    def upload(self, path, email):
        mime = MimeTypes()
        credentials = self.get_credentials()
        # http = credentials.authorize(httplib2.Http())
        # service = discovery.build('drive', 'v3', http=http)
        service = build('drive', 'v3', credentials=credentials)



        file_metadata = {
            'name': os.path.basename(path),
        }
        

        media = MediaFileUpload(path, mimetype=mime.guess_type(os.path.basename(path))[0])#, resumable=True)
        try:
            file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
            print(file.get('id'))
        except HttpError:
            print('The file is corrupted')
            pass
        
        self.share(file.get('id'), email)
        link = 'https://drive.google.com/open?id=' + file.get('id')
        print('Uploaded file to {url}'.format(url='https://drive.google.com/open?id=' + file.get('id')))
        return link