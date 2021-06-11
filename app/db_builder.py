import sqlite3


DB_FILE = "data.db"
text_factory = str


# makes users and entries table in database if they do not exist already
def createTables():
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS minesweeper (rank INTEGER, player TEXT, score INTEGER);""")
    c.execute("""CREATE TABLE IF NOT EXISTS pacman (rank INTEGER, player TEXT, score INTEGER);""")
    c.execute("""CREATE TABLE IF NOT EXISTS whackamole (rank INTEGER, player TEXT, score INTEGER);""")
    c.execute("""CREATE TABLE IF NOT EXISTS snake (rank INTEGER, player TEXT, score INTEGER);""")
    c.execute("""CREATE TABLE IF NOT EXISTS brick (rank INTEGER, player TEXT, score INTEGER);""")
    db.commit()
    db.close()

#createTables()

def initialize(game, rank):
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    c.execute("INSERT INTO " + game + " (rank, player, score) VALUES (" + str(rank) + "," + '"-"' + ",0);")
    db.commit()
    db.close()

def reset(game):
    i = 1
    while i <= 10:
        initialize(game, i)
        i += 1

def wipe():
    reset("minesweeper")
    reset("pacman")
    reset("whackamole")
    reset("snake")
    reset("brick")

def startup():
    createTables()
    wipe()

#startup()

'''
# adds user info to user table
def register(username, password, location, fruits):
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    command = "INSERT INTO users (username, password, location, exp, fruits) VALUES (?,?,?,0,?);"
    c.execute(command, (username, password, location, fruits))
    db.commit()
    db.close()

# returns whether or not username is in user table
def checkUsername(username):
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    found = False
    for row in c.execute("SELECT * FROM users;"):
        found = found or (username == row[1])
    db.commit()
    db.close()
    return found
'''

# prints score table
def printDatabase():
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    print("--------Minesweeper Hi-Scores--------")
    for row in c.execute("SELECT * FROM minesweeper;"):
        print(row)
    print("---------Whack-a-mole Hi-Scores--------")
    for row in c.execute("SELECT * FROM whackamole;"):
        print(row)
    print("-----------Snake Hi-Scores-----------")
    for row in c.execute("SELECT * FROM snake;"):
        print(row)
    print("-----------Brick Breaker Hi-Scores-----------")
    for row in c.execute("SELECT * FROM brick;"):
        print(row)
    db.commit()
    db.close()

printDatabase()

# returns information about a user from the specified column
def getInfo(game, rank, col):
    if rank <= 10:
        db = sqlite3.connect(DB_FILE)
        db.text_factory = text_factory
        c = db.cursor()
        info = c.execute("SELECT " + col + " FROM " + game + "WHERE rank=?;", [rank]).fetchone()
        db.commit()
        db.close()
        return info
    return None

def updateScore(game, rank, player, score):
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    if rank < 10:
        temp = getInfo(game, rank, "score")
        bump = getInfo(game, rank, "players")
    command = "INSERT INTO ? (rank, player, score) VALUES (?,?,?);"
    c.execute(command, (game, rank, player, score))
    if rank < 10:
       updateScore(game, rank+1, bump, temp)
    db.commit()
    db.close()

'''
def clearUsers():
    db = sqlite3.connect(DB_FILE)
    db.text_factory = text_factory
    c = db.cursor()
    c.execute("DELETE from users;")
    db.commit()
    db.close()
'''
