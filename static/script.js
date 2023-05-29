// Create global variables for tile counter, timer, and reveal mode
var counter;
var seconds = 0;
var interval;
var mode = 0;


// Main game function
function runGame(board, bombs) {
  
    // Create object for all tiles
    var tiles = document.querySelectorAll('.tile');

    switch(mode) {

        case 0: 

            // Make sure reveal mode does not appear on
            document.getElementById('revealstext').style = 'color: #eeeeee; background-color: #111111;';
            document.getElementById('reveals').style = 'color: #eeeeee; background-color: #111111;';

            // Add click event listeners
            tiles.forEach(tile => {

                // Get image on tile
                image = tile.src

                // If exiting reveal mode, restore normal tile
                if (image.match('static/reveal.png'))
                {
                    tile.setAttribute('src', "/static/tile.png");
                    image = tile.src;
                }

                // Check that current tile is untouched
                if (image.match('static/tile.png') || image.match('static/flag.png'))
                {
                    // Add left click listener
                    tile.onclick = function(event) {
                        
                        // Check if timer has already started; if not, start
                        if (seconds == '0')
                        {
                            seconds++;
                            interval = setInterval(startTimer, 1000);
                        }
                        
                        // Get element location
                        let i = parseInt(event.target.dataset.i);
                        let j = parseInt(event.target.dataset.j);

                        // If tile is a flag, do nothing
                        if (event.target.src.match('static/flag.png'))
                        {
                            return;
                        }

                        // If tile is a bomb, end game and reveal other bombs
                        else if (board[i][j] == 9)
                        {
                            // Stop timer
                            clearInterval(interval);

                            // Change image
                            tile.setAttribute('src', "/static/clickbomb.png");

                            // Show bombs
                            showBombs(board);

                            // Show message
                            document.getElementById('msgblock').removeAttribute('hidden');
                            document.getElementById('message').innerHTML = 'oh no! try again'
                        }

                        // If space is blank, remove tile and check surrounding tiles
                        else if (board[i][j] == 0)
                        {
                            // Remove tile
                            tile.setAttribute('src', "");

                            // Remove event listener
                            tile.onclick = null;
                            tile.oncontextmenu = null;

                            // Check surrounding cells for more blanks and update counter
                            counter -= (1 + checkSurroundingCells(board, i, j));
                        }

                        // If space is touching a bomb, reveal number
                        else
                        {
                            // Change image to number tile
                            tile.setAttribute('src', '/static/' + board[i][j] + '.png');

                            // Remove event listener
                            tile.onclick = null;
                            tile.oncontextmenu = null;

                            // Update game counter
                            counter--;
                        }

                        // Check for win
                        if (counter == 0)
                        {
                            // Execute win function
                            win(board);
                        }

                    };

                    // Add right click listener
                    tile.oncontextmenu = function(event) {

                        // Check if timer has already started; if not, start
                        if (seconds == '0')
                        {
                            seconds++;
                            interval = setInterval(startTimer, 1000);
                        }
                        
                        // Toggle flag placement
                        if (event.target.src.match('/static/tile.png'))
                        {
                            event.target.src = 'static/flag.png';
                        }
                        else if (event.target.src.match('/static/flag.png'))
                        {
                            event.target.src = 'static/tile.png';
                        }
                    };
                }

            });

            break;

        case 1:

            // Show reveal mode is active
            document.getElementById('revealstext').style = 'color: #111111; background-color: #eeeeee;';
            document.getElementById('reveals').style = 'color: #111111; background-color: #eeeeee;'
        
            tiles.forEach(tile => {
    
                tile.oncontextmenu = null;

                if (tile.src.match("static/tile.png"))
                {
                    tile.onclick = function(event) {

                        // Check if timer has already started; if not, start
                        if (seconds == '0')
                        {
                            seconds++;
                            interval = setInterval(startTimer, 1000);
                        }
                        
                        // Remove left click event listeners from all tiles
                        tiles.forEach(tile => {

                            tile.onclick = null;

                        });
                        
                        // Set current tile to reveal selection
                        event.target.src = '/static/reveal.png'
                        
                        // Get tile location
                        let i = parseInt(event.target.dataset.i);
                        let j = parseInt(event.target.dataset.j);
                        
                        // Set adjacent images to reveal selection and add event listeners
                        
                        // Vertical adjacent
                        for (let k = -1; k < 2; k += 2)
                        {
                            // Get element
                            adj = document.getElementById((i + k) + ':' + j);

                            // Check element is on board
                            if ((i + k >= 0 && i + k < board.length) && adj.src.match('/static/tile.png'))
                            {
                                // Change tile to reveal selection
                                adj.setAttribute('src', '/static/reveal.png');

                                // Add subsequent event listener
                                adj.onclick = function() {

                                    // Reveal adj element
                                    reveal(document.getElementById((i + k) + ':' + j), (i + k), j, board);

                                    // Reveal central tile
                                    reveal(tile, i, j, board);

                                    // Update reveals counter
                                    let reveals = document.getElementById('reveals');
                                    reveals.innerHTML = parseInt(reveals.innerHTML) - 1;

                                    // If counter is 0, remove mode event listener
                                    if (reveals.innerHTML == '0')
                                    {
                                        document.onkeydown = null;
                                    }

                                    // Change mode
                                    mode--;

                                    // Check for win
                                    if (counter == 0)
                                    {
                                        // Execute win function
                                        win(board);
                                    }
                                    else
                                    {
                                        // Run game in normal mode
                                        runGame(board, bombs);
                                    }
                                    
                                };
                            }
                        }

                        // Horizontal adjacent
                        for (let l = -1; l < 2; l += 2)
                        {
                            // Get element
                            adj = document.getElementById(i + ':' + (j + l));

                            // Check element is on board
                            if ((j + l >= 0 && j + l < board[0].length) && adj.src.match('/static/tile.png'))
                            {     
                                // Change tile to reveal selection
                                adj.setAttribute('src', '/static/reveal.png');
                                    
                                // Add subsequent event listener
                                adj.onclick = function() {

                                    // Reveal adj element
                                    reveal(document.getElementById(i + ':' + (j + l)), i, (j + l), board)
                                        
                                    // Reveal central tile
                                    reveal(tile, i, j, board);

                                    // Update reveals counter
                                    let reveals = document.getElementById('reveals');
                                    reveals.innerHTML = parseInt(reveals.innerHTML) - 1;

                                    // If counter is 0, remove mode event listener
                                    if (reveals.innerHTML == '0')
                                    {
                                        document.onkeydown = null;
                                    }

                                    // Change mode    
                                    mode--;
                                        
                                    // Check for win
                                    if (counter == 0)
                                    {
                                        // Execute win function
                                        win(board);
                                    }
                                    else
                                    {
                                        // Run game in normal mode
                                        runGame(board, bombs);
                                    }
                                    
                                };
                            }
                        }

                    };

                }

            });
    
    }

    // Check if there are reveals left to use
    if (parseInt(document.getElementById('reveals').innerHTML) != 0)
    {
        // Add key event listener for mode change
        document.onkeydown = function(event) {

            if (event.key == " ")
            {
                event.preventDefault();
                
                switch(mode) {

                    case 0:

                        mode++
                        break;

                    case 1:

                        mode--;

                }

                runGame(board, bombs);
            }

        };
    }

    // If not, prevent spacebar from scrolling down anyway
    else
    {
        document.onkeydown = function(event) {
            event.preventDefault();
        }
    }

}


// Function for random bomb placement
function placeBomb(board) {

    // Generate random number for row and column placement
    let i = Math.floor(Math.random() * board.length);
    let j = Math.floor(Math.random() * board[0].length);

    // If selection is already a bomb, find one that isn't
    if (board[i][j] != 9)
    {
        board[i][j] = 9;
    }
    else
    {
        placeBomb(board);
    }
    return;

}


// Function to populate array with bomb proximity numbers
function populate(board) {

    // Iterate through rows
    for (let i = 0; i < board.length; i++)
    {
        // Iterate through cells
        for (let j = 0; j < board[0].length; j++)
        {
            //Check if curent cell is a bomb
            if (board[i][j] != 9)
            {
                // Check surrounding cells for bombs
                for (let k = -1; k < 2; k++)
                {
                    for (let l = -1; l < 2; l++)
                    {
                        if ((i + k >= 0 && i + k < board.length) && (j + l >= 0 && j + l < board[0].length))
                        {
                            // If neighboring cell is a bomb, update number
                            if (board[i + k][j + l] == 9)
                            {
                                board[i][j]++;
                            }
                        }
                    }
                }
            }
            else
            {
                continue;
            }        
        };
    };

}


function setCounter(board, bombs) {

    // Initialise counter to check for win
    counter = (board.length * board[0].length) - bombs;

}


function startTimer() {
    
    // Update timer element in template
    document.getElementById('timer').innerHTML = seconds;

    // Add a second
    seconds++;

}


// Function for checking surrounding cells
function checkSurroundingCells(board, i, j) {

    // Initialise counter to track cells changed
    var cells_changed = 0;

    // Iterate through surrounding cells
    for (let k = -1; k < 2; k++)
    {
        for (let l = -1; l < 2; l++)
        {
            // Check that current position is on the board
            if ((i + k >= 0 && i + k < board.length) && (j + l >= 0 && j + l < board[0].length))
            {
                // Get tile object
                let tile = document.getElementById((i + k) + ':' + (j + l))
                
                // Check that current position is an untouched tile
                if (tile.src.match('static/tile.png'))
                {
                    // If current position is the central space, or if the space is a bomb, leave
                    if ((k == 0 && l == 0) || board[i + k][j + l] == 9)
                    {
                        continue;
                    }

                    // If space is touching a bomb, reveal number
                    else if (board[i + k][j + l] > 0 && board[i + k][j + l] < 9)
                    {
                        tile.setAttribute('src', '/static/' + board[i + k][j + l] + '.png');

                        // Remove tile event listener
                            tile.onclick = null;
                            tile.oncontextmenu = null;

                        // Count cell
                        cells_changed++;
                    }

                    // If space is empty, remove tile and check surrounding cells
                    else
                    {
                        // Remove tile
                        tile.setAttribute('src', '');

                        // Remove tile event listener
                        tile.onclick = null;
                        tile.oncontextmenu = null;
                        
                        // Count cell + cells changed by recursions
                        cells_changed += 1 + checkSurroundingCells(board, (i + k), (j + l));
                    }
                }
            }
        }
    }

    return cells_changed;

}


function showBombs(board) {

    // Iterate through board
    for (let i = 0; i < board.length; i++)
    {
        for (let j = 0; j < board[0].length; j++)
        {
            // Get current tile object
            let tile = document.getElementById(i + ':' + j);
            
            // Show where unflagged bombs are
            if (board[i][j] == 9 && (!tile.src.match('static/clickbomb.png') && !tile.src.match('static/flag.png')))
            {
                tile.setAttribute('src', '/static/bomb.png');
            }

            // Show incorrect flags
            else if (board[i][j] != 9 && tile.src.match('static/flag'))
            {
                tile.setAttribute('src', 'static/notbomb.png');
            }

            // Remove tile event listener
            tile.onclick = null;
            tile.oncontextmenu = null;
        }
    }

}


function reveal(element, i, j, board) {  

    // If space is empty, remove tile
    if (board[i][j] == 0)
    {
        element.setAttribute('src', '');
        element.onclick = null;
        element.oncontextmenu = null;
        counter--;
    }

    // If space is a bomb, change to flag
    else if (board[i][j] == 9)
    {
        element.setAttribute('src', 'static/flag.png');
    }

    // If board is a number, show number
    else
    {
        element.setAttribute('src', '/static/' + board[i][j] + '.png');
        element.onclick = null;
        element.oncontextmenu = null;
        counter--;
    }

}


function win(board) {

    // Stop timer
    clearInterval(interval);

    // Update score form with time value
    setInterval(function() {
        document.getElementById('time').setAttribute('value', (seconds - 1));
    }, 5);

    // Place flags on unmarked bombs
    for (let i = 0; i < board.length; i++)
    {
        for (let j = 0; j < board[0].length; j++)
        {
            // Get current tile object
            let tile = document.getElementById(i + ':' + j);
            
            // Show where unflagged bombs are
            if (board[i][j] == 9 && tile.src.match('static/tile.png'))
            {
                tile.setAttribute('src', '/static/flag.png');
            }

            // Remove tile event listener
            tile.onclick = null;
            tile.oncontextmenu = null;
        }
    }

    // Remove spacebar event listener
    document.onkeydown = null;

    // Show message
    document.getElementById('msgblock').removeAttribute('hidden');
    document.getElementById('message').innerHTML = '<p id="message">you win!</p><p>submit your score below</p>';

    // Show form
    document.getElementById('score').removeAttribute('hidden');

}