let seconds = 0;
let timerInt = null;

// ゲーム状態
let mode = "init";          // init, countdown, response, failed
let eventDelay = 0;         // 次の異変までの残り秒数
let responseWindow = 0;     // 押せる残り秒数
let pressed = false;        // response 内で押されたか
let missCount = 0;          // ミス回数
let recordTime = 0;         // 失敗時のタイム

// DOM
const timerEl  = document.getElementById("timer");
const gameBtn  = document.getElementById("gameBtn");
const missEl   = document.getElementById("miss");
const recordEl = document.getElementById("record");

function format(v) { return v.toString().padStart(2, "0"); }

function drawTimer() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  timerEl.textContent = `${format(m)}:${format(s)}`;
}

function randDelay() {
  return Math.floor(Math.random() * 40)+1;
}

function applyGlitch() {
  const type = Math.floor(Math.random() * 2);
  switch (type) {
    case 0:
      seconds += 1;
      break;
    case 1:
      seconds -= 2;
      break;
  }
  if (seconds < 0) seconds = 0;
}


function updateMiss(delta = 1) {
  missCount += delta;
  missEl.textContent = `ミス: ${missCount}`;
  if (missCount >= 3) gameOver();
}

function gameOver() {
  recordTime = seconds;
  clearInterval(timerInt);
  timerInt = null;
  mode = "failed";
  gameBtn.textContent = "失敗";
  gameBtn.disabled = false;
  recordEl.textContent =
    `記録: ${format(Math.floor(recordTime / 60))}:${format(recordTime % 60)}`;
}

function resetGame() {
  seconds = 0;
  drawTimer();
  missCount = 0;
  missEl.textContent = "ミス: 0";
  recordEl.textContent = "記録: --:--";
  mode = "countdown";
  eventDelay = randDelay();
  responseWindow = 0;
  pressed = false;
  gameBtn.textContent = "押す！";
  gameBtn.disabled = false;
  timerInt = setInterval(tick, 1000);
}

function tick() {
  seconds++;
  drawTimer();

  if (mode === "countdown") {
    if (--eventDelay === 0) {
      applyGlitch();
      drawTimer();
      mode = "response";
      responseWindow = 3;      
      pressed = false;
    }
  } else if (mode === "response") {
    if (--responseWindow === 0) {
      if (!pressed) updateMiss();
      mode = "countdown";
      eventDelay = randDelay();
    }
  }
}

// ボタン押下
gameBtn.addEventListener("click", () => {
  if (mode === "init") {
    resetGame();                          
  } else if (mode === "countdown") {
    updateMiss();                         
  } else if (mode === "response") {
    if (!pressed) {
      pressed = true;                   
    }
  } else if (mode === "failed") {
    mode = "init";
    seconds = 0;
    drawTimer();
    missEl.textContent = "ミス: 0";
    recordEl.textContent = "記録: --:--";
    missCount = 0;
    gameBtn.textContent = "スタート";
  }
});

drawTimer();
missEl.textContent = "ミス: 0";
recordEl.textContent = "記録: --:--";
gameBtn.textContent = "スタート";
