# minesweeper+
#### Hosted: <https://minesweeperplus-fergusbgrant.koyeb.app>
#### Video Demo:  <https://youtu.be/piP5NvhgW2c>
#### Description:

## Project Overview

In traditional Minesweeper, which is ostensibly a game of logic, the player is often required to take gambles during gameplay due to logical impasses presented on the board. Although some situations that appear to be gambles at one point in the game can often be solved by approaching the tiles in question from a different direction, there are often unavoidable gambles that occur in the corners or along the sides of the board. This can be extremely frustrating when the player has played an otherwise flawless game using their skills of logic and inference, and is then forced to gamble in order to win. The aim of minesweeper+ is to offset this problem by giving the player a limited number of chances to reveal what is beneath two adjacent tiles, thus allowing for more games that are winnable by logic alone.

The project involved building a web application from the ground up to clone the functionality of regular Minesweeper, and building the additional mechanic on top of that. The app was built using Flask, the app aesthetic was created primarily with Bootstrap, and the game logic was written primarily in JavaScript, with some game initialisation functions taking place in the Python app script.

## Project Files

### app.py

This is the script used by Flask for the web application. In this file, there are routes for the main index page, for each of the three difficulties (beginner, intermediate, expert), for the page that displays high scores, and for the page that contains instructions regarding the added game mechanic. Additionally, there are two functions. 

The 'create_board' function is designed to take either one or two numbers as arguments, and create a two-dimensional list (with all elements set to 0) of a size determined by the numeric argument(s); this will contain the bomb placement information that underlies each game. The function is designed such that if only one argument is provided, it will create a list or 'board' where both dimensions are the same length, but different lengths can be specified by providing a second argument. This was a design choice based on the board dimensions of regular Minesweeper (beginner: 9x9, 10 bombs; intermediate: 16x16, 40 bombs; expert: 16x30, 99 bombs).

The 'submit_score' function executes when a player wins a game, and chooses to submit their score on the web page. The function connects to the 'scores.db' database in the folder, gets the game information and the name submitted by the user, and writes this to the database. The function also takes the appropriate difficulty ID as an argument, and this is to prevent the player spoofing the difficulty in which a score was achieved by editing the HTML form before submitting.

The '/index' route is designed to simply display a homepage from which any of the other pages can be accessed; thus, rendering the appropriate template is all that's required.

The '/beginner,' '/intermediate,' and '/expert' routes are all designed to, if reached by GET, create a board of appropriate size using the 'create_board' function, specify the number of bombs, and specify the number of reveals allowed during each game. These pieces of information are then passed to the game template that is rendered. If the player wins a game, they have the option to submit their score via a form using POST. The POST script for each of these routes writes the submitted score to the database, redirects the player to the '/highscores' route, and flashes that the score was submitted successfully.

The '/highscores' route is designed to access the database, get the 5 best scores for each of the three difficulties, and pass these to the template being rendered.

As with the '/index' route, the '/instructions' route is designed to simply display the page containing the instructions for the added mechanic; simply rendering the appropriate template is, again, all that's required.

### scores.db

This is the database used to contain scores submitted by victorious players. It is designed to hold the date on which a score was achieved, the name of the player, the difficulty of the game, and the time taken to win the game. There are two tables: one for the scores, and one for the difficulties. This design was chosen so that a numeric 'difficulty_id' could be used in the 'scores' table, which is more memory efficient than storing the name of each difficulty over and over again.

### templates/index.html

This is the template for the app's 'homepage,' so to speak. It is designed to simply be a landing page that lets the user navigate to a game of any difficulty, to the instructions page, or to the high scores page. This is also the template that is extended using Jinja to be the basis of the layout for each of the other templates.

### templates/instructions.html

This template merely extends the index layout using Jinja, and contains text detailing how to use the mechanic that was added to the game.

### templates/highscores.html

This template is designed so that, using Jinja, it iterates through the lists of high scores that were passed to the template by the app when rendering, and displays the 5 best scores for each difficulty that exist in the database.

### templates/game.html

This template is used by each difficulty route in the app, and uses the board, number of bombs, and number of reveals that were passed to it by the app. It is designed such that it sets the timer initially at 0, shows the number of reveals that are available to the player depending on the difficulty they have selected, and uses Jinja to create a tile on the page for each element in the board. The attributes of each tile image are designed to take the i and j values from the nested loop as follows:

id="i:j"
data-i="i"
data-j="j"

This ensures that both the tiles on the game page and the underlying board list can be easily accessed in the script using the same indices.

Additionally, this template contains an empty message container and a hidden form. The message container is populated when the player either wins or loses, and the form is shown when the player wins, allowing them to submit their score to the database.

There is some JavaScript in this template, but that will be covered later under the game logic.

### static/ .png Files

These are the 25x25px images that are used for the game tiles. They include the plain tile image, the flag image, the bomb proximity number images, the images to show which bomb the player clicked and where the other bombs are, the image to show misplaced flags, and the image to show the player's selection when in reveal mode.

### static/styles.css

This is the CSS file that is linked to the index template, and is thus linked to all the templates.

### static/script.js

This is the script file that contains almost all of the game logic.


## Game Logic

Other than the initialisation functions written in the Python script, the game functions are all written in the 'script.js' file. The main function in the file is the 'runGame' function, within which most of the other abstracted functions execute. However, the 'runGame' function is designed to run recursively, and runs differently depending on which 'mode' is set in the script. Because some global functionality that exists outside this reiteration is required, such as the timer, the mode setting, and the counter that tracks a game's progress, some of the game initialisation functions are executed in the 'game.html' template, so as not to re-execute every time the 'runGame' function is executed. Firstly, we will look at the 'script' element within the 'games.html' template.

The script begins by listening for the DOM being loaded. When this occurs, it first stores in variables the board and the number of bombs that were passed to the template by Flask.

**placeBomb()**

The placeBomb function is designed to randomly place a bomb (represented by the number 9) on the game board. It does this by randomly generating numbers in the appropriate range to use as indices. Furthermore, it is designed to run recursively, such that it will continue generating random numbers until it finds a space on the board that does not contain a bomb.

**populate()**

The populate function is designed to iterate through each non-bomb space on the board, and check the surrounding spaces for bombs. If one of the surrounding spaces is a bomb, the integer (which was originally set to 0 in the Python script) in the central space increments. The maximum value for a non-bomb space is 8, hence the choice to use the number 9 to represent a bomb.

**setCounter()**

The setCounter function simply sets the number of tiles that need to be revealed in order for the game to be won, and does this by calculating the total number of tiles and subtracting the number of bombs. This value is stored in a global variable in script.js so that it can be accessed throughout.

**runGame()**

With this function, we can now move fully to the script.js file. The runGame function is the main game function, which sets up click listeners for the tiles, and the space bar listener for changing mode. Although normal Minesweeper can be run with one set of click listeners for right and left click, the addition of the extra mechanic posed a design problem; there would have to be another way of clicking on a tile that wouldn't execute the normal gameplay click, but instead select a tile, an adjacent tile of which could subsequently be selected, and both revealed. Rather than set up another listener based on another mouse event, such as a click of a third button, a hover, a held click, etc., the choice was made to stick to simple left and right clicks, and implement a listener for the space bar, which would change the 'mode' of the game.

When the runGame function is first executed in the 'game.html' template, the global variable for the game mode is set to 0. Within the runGame function, there is a switch that executes different blocks of code based on the current mode setting. The '0' setting is the mode for normal gameplay, and sets up click listeners for left and right clicks as seen in normal Minesweeper; left click to reveal a tile, and right click to toggle the placement of a flag. However, when the space bar is pressed, the mode variable is changed to 1 (or toggled back to 0 if already set to 1), and the runGame function is executed again, which executes the code block for 'reveal' mode. The 'onclick' method was used to set up click listeners (as opposed to 'addEventListener'), because this method overwrites any 'onclick' listener that already exists for an element. Although this feature probably seems restrictive in a lot of web-design circumstances, it turned out to be ideal for changing event listeners between modes.

**starTimer()**

The startTimer function executes when the player makes any click action, and sets a function to increment the global seconds variable by 1 each second (this interval is also stored in a global variable), and update the timer element in the game template.

**checkSurroundingCells()**

If you are lucky enough to click on an empty space in normal Minesweeper, you'll observe that a number of tiles are often revealed, particularly if there is a group or chain of empty spaces. The checkSurroundingCells function is the function that achieves this, and executes when the player clicks on an empty space in normal mode. It is designed to iterate through the spaces around the space that was originally clicked, and check their contents. If a surrounding space is a bomb, or is flagged, the tile is left untouched. If a surrounding space is touching a bomb, the number tile is revealed. If a surrounding space is another empty space, the function is called again with that space as the central space.

**showBombs()**

The showBombs function executes when the player loses the game, and iterates through the board to remove all event listeners, show the location of all unflagged bombs, and show any flags that were placed incorrectly.

**reveal()**

This function is executed when a selection of two adjacent tiles is made in 'reveal' mode. If a space is empty, it simply removes the tile. If a space contains a bomb, it places a flag, and if the space is touching a bomb, it reveals the proximity number.

**win()**

The win function executes when the player wins the game (as tracked by the counter variable, which is updated from various locations within the file). It first clears the global interval variable to stop the timer, and updates the hidden time element of the submission form with the current timer value. It then iterates through the board and removes any event listeners, and places flags on any unflagged bombs. It then removes the spacebar event listener, and reveals the score submission form underneath the game board.