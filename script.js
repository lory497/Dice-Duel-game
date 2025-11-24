'use strict';

// SElecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpen = document.querySelector('.btn--rules');
const btnsClose = document.querySelectorAll('.return');

let scores, currentScore, activePlayer, playing;

const nextPlayer = new Audio('audio/next-turn.mp3');
const diceRoll = new Audio('audio/dice-142528.mp3');
const gameStart = new Audio('audio/game-menu-start.mp3');

// RULES functionality

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpen.addEventListener('click', function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

for (let i = 0; i < btnsClose.length; i++) {
  btnsClose[i].addEventListener('click', closeModal);
}

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// GAME initialization

const init = function () {
  // Starting conditions
  score0El.textContent = 0;
  score1El.textContent = 0;

  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  btnOpen.classList.remove('hidden');

  /// remove winner and active player class
  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  document.getElementById('name--0').textContent = 'Player 1';
  document.getElementById('name--1').textContent = 'Player 2';

  // set current scores and scores to 0
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  gameStart.play();
};

const switchPlayer = function () {
  nextPlayer.play();
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

init();

// Rolling dice functionality

btnRoll.addEventListener('click', function () {
  btnOpen.classList.add('hidden');

  if (playing) {
    diceRoll.play();
    //1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log(dice);

    //2. Display dice

    diceEl.classList.remove('hidden');

    const faceRotation = {
      1: { x: 0, y: 0 },
      2: { x: -90, y: 0 },
      3: { x: 0, y: 90 },
      4: { x: 0, y: -90 },
      5: { x: 90, y: 0 },
      6: { x: 180, y: 0 },
    };

    const rollDice = () => {
      console.log('Rolled:', dice);

      const spinX = 360 * (Math.floor(Math.random() * 4) + 3); // 3–6 full spins
      const spinY = 360 * (Math.floor(Math.random() * 4) + 3);

      const { x: faceX, y: faceY } = faceRotation[dice];

      const finalX = spinX + faceX;
      const finalY = spinY + faceY;

      diceEl.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
    };

    rollDice();

    //3. Check for rolled 1: if true switch to next player
    if (dice !== 1) {
      //Add dice to current score
      currentScore += dice; //currentScore = currentScore + dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      //switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. add current score to active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2. check if player's score is <= 100
    if (scores[activePlayer] >= 100) {
      //Finish the game
      playing = false;
      diceEl.classList.add('hidden');
      const winnerEl = document.querySelector(`.player--${activePlayer} .name`);
      winnerEl.textContent = 'Winner! 🎉';
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      // switch to next player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
