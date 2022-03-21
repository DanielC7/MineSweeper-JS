// Html will be loaded before our JS code (Could also just put our JS script in the bottom of the Html file..)
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 10;
  const bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  let timeCount = null;

  // Create Board
  function createBoard() {
    // Get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gamesArray = emptyArray.concat(bombArray);
    const shuffledArray = gamesArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener("click", function (e) {
        click(square);
      });

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      if (squares[i].classList.contains("valid")) {
        //check square to the left
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) {
          total++;
        }
        //check square top right
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        ) {
          total++;
        }
        //check square above
        if (i > 10 && squares[i - width].classList.contains("bomb")) {
          total++;
        }
        //check square top left
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        ) {
          total++;
        }
        //check square to the right
        if (
          i < 98 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        ) {
          total++;
        }
        //check square bottom left
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        ) {
          total++;
        }
        //check square bottom right
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        ) {
          total++;
        }
        //check square below
        if (i < 89 && squares[i + width].classList.contains("bomb")) {
          total++;
        }

        squares[i].setAttribute("data", total);
      }
    }

    startTimer();
  }
  createBoard();

  // Start timer
  function startTimer() {
    const timer = document.getElementById("tLabel");
    timer.innerHTML = 0;
    let seconds = 0;
    timeCount = setInterval(() => {
      ++seconds;
      timer.innerHTML = seconds;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timeCount);
    timeCount = null;
  }

  // Add flag with right click
  function addFlag(square) {
    if (isGameOver) {
      return;
    }
    if (!square.classList.contains("checked")) {
      if (!square.classList.contains("flag") && flags < bombAmount) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        checkForWin();
      } else if (square.classList.contains("flag")) {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
      }
    }
    document.querySelector("#fLabel").innerHTML = bombAmount - flags;
  }

  //click on square actions
  function click(square) {
    let currentId = square.id;
    if (isGameOver) {
      return;
    }
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    ) {
      return;
    }
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total > 0) {
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //check square above
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  function gameOver(square) {
    // console.log("BOOOOO, GAME OVER!!");
    alert("BOOOOO, GAME OVER!!");
    isGameOver = true;

    //Show all bomb locations
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
    //pause timer
    stopTimer();
  }

  // Check for win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        // console.log("YOU WIN!!");
        alert("YOU WIN!!");
        isGameOver = true;
        stopTimer();
      }
    }
  }

  document.getElementById("resetBtn").onclick = function () {
    restartGame();
  };

  function restartGame() {
    stopTimer();
    flags = 0;
    isGameOver = false;
    squares = [];

    let child = grid.lastElementChild;
    while (child) {
      grid.removeChild(child);
      child = grid.lastElementChild;
    }

    createBoard();
  }
});
