FROM python:3.6
WORKDIR .
EXPOSE 8000
COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN python -m textblob.download_corpora

COPY . .
CMD ["python","-u","app.py","--noauth_local_webserver"]