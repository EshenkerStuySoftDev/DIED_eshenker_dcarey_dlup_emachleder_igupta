# Team DIED: Ethan Shenker, Ishita Gupta, Dragos Lup, Dean Carey, Ethan Macheleder
# SoftDev Pd 1
# P5 - This is the End
# 2021-06-05

from flask import Flask, render_template, session, request, redirect, url_for
from uuid import uuid4
from time import localtime, strftime

import db_builder
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


@app.route("/snake")
def snake():
    return render_template("snake.html")

@app.route("/breaker")
def breaker():
    return render_template("breaker.html")

@app.route("/boom")
def boom():
    return render_template("minesweeper.html")

@app.route("/wack")
def wack():
    return render_template("whackamole.html")

if __name__ == '__main__':
    app.debug = True
    app.run()
