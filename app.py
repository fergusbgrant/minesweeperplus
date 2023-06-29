from flask import Flask, render_template, flash, request, redirect
from datetime import date
import sqlite3


# Configure application
app = Flask(__name__)
app.secret_key = "blahblahblah"


@app.route("/")
def index():

    return render_template("index.html")


@app.route("/beginner", methods=["GET", "POST"])
def beginner():
    
    if request.method == "POST":

        submit_score(request, 1)

        flash("your score was submitted successfully")
        return redirect("/highscores")
        
    if request.method == "GET":
    
        # Create board
        board = create_board(9)

        # Assign number of bombs
        bombs = 10

        # Assign number of reveals
        reveals = 1

        return render_template("game.html", board=board, bombs=bombs, reveals=reveals)


@app.route("/intermediate", methods=["GET", "POST"])
def intermediate():

    if request.method == "POST":

        submit_score(request, 2)

        flash("your score was submitted successfully")
        return redirect("/highscores")
    
    if request.method == "GET":

        # Create board
        board = create_board(16)

        # Assign number of bombs
        bombs = 40

        # Assign number of reveals
        reveals = 2

        return render_template("game.html", board=board, bombs=bombs, reveals=reveals)


@app.route("/expert", methods=["GET", "POST"])
def expert():
    
    if request.method == "POST":

        submit_score(request, 3)

        flash("your score was submitted successfully")
        return redirect("/highscores")
    
    if request.method == "GET":
    
        # Create board
        board = create_board(16, 30)

        # Assign number of bombs
        bombs = 99

        # Assign number of reveals
        reveals = 3

        return render_template("game.html", board=board, bombs=bombs, reveals=reveals)
    

@app.route("/highscores")
def highscores():

    # Connect to database
    connection = sqlite3.connect("scores.db")
    db = connection.cursor()

    beginner = db.execute("SELECT date, name, time FROM scores WHERE difficulty_id = 1 ORDER BY time LIMIT 5").fetchall()
    intermediate = db.execute("SELECT date, name, time FROM scores WHERE difficulty_id = 2 ORDER BY time LIMIT 5").fetchall()
    expert = db.execute("SELECT date, name, time FROM scores WHERE difficulty_id = 3 ORDER BY time LIMIT 5").fetchall()

    # Close database connection
    db.close()
    connection.close()

    return render_template("highscores.html", beginner=beginner, intermediate=intermediate, expert=expert)


@app.route("/instructions")
def instructions():

    return render_template ("instructions.html")


def create_board(height, width=None):

    # Check to see if only one argument provided
    if width == None:
        return create_board(height, height)

    # Declare two-dimensional list for board
    board = []

    # Iterate through board to append list for each row
    for i in range(height):

        board.append([])
        board[i] = []

        # Iterate through each row to assign 0 to each tile
        for j in range(width):
            
            board[i].append(0)

    return board


def submit_score(request, difficulty_id):

    # Connect to database
    connection = sqlite3.connect("scores.db")
    db = connection.cursor()

    # Get data for database entry
    today = date.today()
    name = request.form.get("name")
    time = request.form.get("time")

    # Insert score into database
    db.execute("INSERT INTO scores (date, name, difficulty_id, time) VALUES (?, ?, ?, ?)", 
            [today, name, difficulty_id, time])
    connection.commit()

    # Close database connection
    db.close()
    connection.close()


def create_app():
    return app