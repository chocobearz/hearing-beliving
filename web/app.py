# -*- coding: utf-8 -*-
import os
import math

from flask import Flask, render_template, request, flash, redirect, jsonify
from werkzeug.utils import secure_filename
import subprocess
import sys
sys.path.append("../python")
sys.path.append("..")
import time
import audio_processing
from flask import send_file
import csv
import pandas as pd
from pathlib import Path  # For writing videos into the data folder

UPLOAD_FOLDER = 'static/uploads/'
FEATURE_DIR = "/mnt/c/Users/ptut0/Documents/shouts/Edyson/web/static/data/"
FEATURE_DATA = None

app = Flask(__name__)
app.secret_key = 'hejhej00'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# with open("examples.txt", "r") as examples_file:
#     examples = {line.split("\t")[0]:line.split("\t")[1] for line in examples_file}

@app.route('/')
def upload_file():
    #subprocess.call('rm /uploads/*', shell=True)
    return render_template('index.html')

@app.route('/get_audio_file_with_coords', methods=['GET'])
def get_audio_file_with_coords():
    audio_filename = request.arg("filename")
    return None

# When audio is submitted, checks if audio is valid, uploads it, and sends parameters
# to audio_processing which in turn generates files needed for browser, then 
# redirects and loads browser.
@app.route('/process_audio', methods=['GET', 'POST'])
def process_audio() -> str:
    feature_filename = request.form['text']
    FEATURE_DATA = pd.read_csv(os.path.join(FEATURE_DIR, feature_filename))
    session_key = str(time.time()).split(".")[0] + str(time.time()).split(".")[1]
    audio_processing.main(session_key, feature_filename)
    return redirect("/"+session_key)

# Loads audio browser by session_key
@app.route('/<string:session_key>', methods=['GET', 'POST'])
def load_browser(session_key) -> str:
    data_dir = "static/data/" + session_key + "/"
    print(data_dir)
    if os.path.isdir(data_dir):
        with open(data_dir + "data.csv", "r") as f:
            reader = csv.reader(f, skipinitialspace=True)
            header = next(reader)
            data = [{k: v for k, v in zip(header, line)} for line in reader]
        audioPaths = []
        for obj in data:
            audioPaths.append(f"static/data/audio/{obj['filename']}")
        return render_template('audioBrowser.html', 
                                data=data, 
                                datapoints=len(data),
                                session_key=session_key
                            )
    else:
        return "<h3>Something went wrong, the files for the this audio session does not exist</h3>"

if __name__ == '__main__':
    #app.run(debug=True)

    app.run(host='0.0.0.0', debug=False, port=3134)

