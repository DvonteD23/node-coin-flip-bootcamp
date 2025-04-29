const form          = document.getElementById('game-form');
const modeSelect    = document.getElementById('mode-select');
const player2Sect   = document.getElementById('player2-section');
const singleGuess   = document.getElementById('single-guess');
const twoGuess      = document.getElementById('two-guess');
const headsBtn      = document.getElementById('heads-btn');
const tailsBtn      = document.getElementById('tails-btn');
const playBtn       = document.getElementById('play-btn');
const resultDiv     = document.getElementById('result');


modeSelect.addEventListener('change', () => {
  const isTwo = modeSelect.value === 'two';
  player2Sect.classList.toggle('hidden', !isTwo);
  singleGuess.classList.toggle('hidden', isTwo);
  twoGuess.classList.toggle('hidden', !isTwo);
});


const playSingle = guess => {
  const data = new URLSearchParams(new FormData(form));
  data.set('mode', 'single');
  data.set('guess', guess);

  fetch(`/api?${data}`)
    .then(r => r.json())
    .then(({ flip, win, error }) => {
      if (error) throw new Error(error);
      resultDiv.textContent =
        `You guessed ${guess}. Coin: ${flip}. ` +
        (win ? 'Winner' : 'Loser');
      resultDiv.className = `result ${win ? 'win' : 'lose'}`;
    })
    .catch(err => {
      resultDiv.textContent = 'Error: ' + err.message;
      resultDiv.className = 'result lose';
    });
};

const playTwo = () => {
  const data = new URLSearchParams(new FormData(form));
  data.set('mode', 'two');

  fetch(`/api?${data}`)
    .then(r => r.json())
    .then(({ flip, win1, win2, error }) => {
      if (error) throw new Error(error);
      resultDiv.innerHTML =
        `Coin: ${flip}.<br>` +
        `Player 1 ${win1 ? 'win' : 'lose '}<br>` +
        `Player 2 ${win2 ? 'win' : 'lose'}`;
      resultDiv.className = 'result';
    })
    .catch(err => {
      resultDiv.textContent = 'Error: ' + err.message;
      resultDiv.className = 'result lose';
    });
};

headsBtn.addEventListener('click', () => playSingle('heads'));
tailsBtn.addEventListener('click', () => playSingle('tails'));
playBtn.addEventListener('click', playTwo);
