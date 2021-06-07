from flask import Flask, render_template, session, request, redirect, url_for
from uuid import uuid4
from helpers import a_clean, get_greeting, tup_clean, a_remove, convert
from time import localtime, strftime

import datetime             # how to get current date / time
import sqlite3
import os
import sys
import urllib
import json


app = Flask(__name__)
app.secret_key = os.urandom(32)
dir = os.path.dirname(__file__) or "."
dir += "/"


'''
root landing page
'''
@app.route("/", methods=["POST", "GET"])
def root():
    if session.get("username"): # if the user is logged in, send them to their home page
        return user_page()
    return render_template("home.html")