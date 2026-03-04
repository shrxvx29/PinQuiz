<<<<<<< HEAD
// Particle background
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const COUNT = 90;

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.5 + 0.3,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push(createParticle());
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);

  function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020314";
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
      g.addColorStop(0, `rgba(148, 163, 255, ${p.alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  loop();
})();

// Quiz data
const questions = [
  {
    type: "MULTIPLE CHOICE",
    text: "When is Saravanan’s birthday?",
    hint: "Think of the date that really matters to you both.",
    answers: [
      { key: "A", label: "14-02-2005", value: "14-02-2005" },
      { key: "B", label: "29-06-2005", value: "29-06-2005", correct: true },
      { key: "C", label: "05-07-2005", value: "05-07-2005" },
      { key: "D", label: "12-06-2005", value: "12-06-2005" },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "When did our first chat begin?",
    hint: "The day your story really started.",
    answers: [
      { key: "A", label: "14-02-2025", value: "14-02-2025" },
      { key: "B", label: "06-06-2025", value: "06-06-2025", correct: true },
      { key: "C", label: "29-06-2025", value: "29-06-2025" },
      { key: "D", label: "01-07-2025", value: "01-07-2025" },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "Where did we first cut adichathu together?",
    hint: "Think of that first place you both really vibed.",
    answers: [
      { key: "A", label: "Beach", value: "Beach" },
      { key: "B", label: "Eco Park", value: "Eco Park" },
      { key: "C", label: "VR Mall", value: "VR Mall" },
      { key: "D", label: "Tower Park", value: "Tower Park", correct: true },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "How did you first approach me to start talking?",
    hint: "Which app did you open before sending that first message?",
    answers: [
      { key: "A", label: "Instagram", value: "Instagram" },
      { key: "B", label: "Telegram", value: "Telegram" },
      { key: "C", label: "WhatsApp", value: "WhatsApp", correct: true },
    ],
  },
  {
    type: "FINAL QUERY",
    text: "What nickname do I lovingly call you?",
    hint: "The one that makes you smile immediately.",
    answers: [
      { key: "A", label: "Angel", value: "Angel", correct: true },
      { key: "B", label: "Hinata", value: "Hinata" },
      { key: "C", label: "Princess", value: "Princess" },
      { key: "D", label: "Ayase", value: "Ayase" },
    ],
  },
];

// Elements
const startupScreen = document.getElementById("startup-screen");
const scanScreen = document.getElementById("scan-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");

const startBtn = document.getElementById("start-btn");
const scanFill = document.getElementById("scan-fill");
const scanLogs = document.getElementById("scan-logs");

const accessPercent = document.getElementById("access-percent");
const accessBarFill = document.getElementById("access-bar-fill");

const questionCounter = document.getElementById("question-counter");
const questionType = document.getElementById("question-type");
const questionText = document.getElementById("question-text");
const questionExtra = document.getElementById("question-extra");
const answersContainer = document.getElementById("answers");
const hintEl = document.getElementById("hint");
const unlockPulse = document.getElementById("unlock-pulse");
const glitchOverlay = document.getElementById("glitch-overlay");

let currentIndex = 0;

// Simple audio feedback using Web Audio
function playTone(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = success ? "triangle" : "square";
    osc.frequency.value = success ? 640 : 200;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      success ? 0.12 : 0.16,
      ctx.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + (success ? 0.25 : 0.35)
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (success ? 0.3 : 0.4));
  } catch (e) {
    // Audio not critical
  }
}

function playUnlockSweep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) {
    // ignore
  }
}

// Boot sequence
startBtn.addEventListener("click", () => {
  startupScreen.classList.add("hidden");
  scanScreen.classList.remove("hidden");
  runScanSequence();
});

function runScanSequence() {
  const lines = [
    "[INIT] Secure kernel boot sequence engaged...",
    "[SCAN] Quantum cipher modules online.",
    "[CHECK] Biometric spoofing countermeasures: ACTIVE.",
    "[LINK] Uplink tunnel established.",
    "[STATUS] Challenge protocol ready.",
  ];

  let idx = 0;
  let progress = 0;

  function addLine() {
    if (idx >= lines.length) return;
    const div = document.createElement("div");
    div.className = "scan-line";
    div.textContent = lines[idx];
    scanLogs.appendChild(div);
    scanLogs.scrollTop = scanLogs.scrollHeight;
    idx++;
  }

  const lineInterval = setInterval(() => {
    addLine();
    if (idx >= lines.length) clearInterval(lineInterval);
  }, 500);

  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 10;
    if (progress >= 100) {
      progress = 100;
      scanFill.style.width = progress + "%";
      clearInterval(progressInterval);
      setTimeout(() => {
        scanScreen.classList.add("hidden");
        loadQuestion(0);
        quizScreen.classList.remove("hidden");
      }, 500);
    } else {
      scanFill.style.width = progress + "%";
    }
  }, 260);
}

function updateAccessLevel() {
  const percent = Math.round(((currentIndex) / questions.length) * 100);
  accessPercent.textContent = percent + "%";
  accessBarFill.style.width = percent + "%";
}

function loadQuestion(index) {
  currentIndex = index;
  if (index >= questions.length) {
    showFinalScreen();
    return;
  }

  const q = questions[index];
  questionCounter.textContent = `Question ${index + 1} / ${questions.length}`;
  questionType.textContent = q.type;
  questionText.textContent = q.text;
  questionExtra.textContent = "";
  answersContainer.innerHTML = "";
  hintEl.textContent = q.hint || "";
  hintEl.className = "hint";

  q.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.dataset.value = ans.value;
    btn.dataset.correct = ans.correct ? "true" : "false";

    const label = document.createElement("div");
    label.className = "answer-label";
    const keyEl = document.createElement("div");
    keyEl.className = "answer-key";
    keyEl.textContent = ans.key;
    const textEl = document.createElement("div");
    textEl.className = "answer-text";
    textEl.textContent = ans.label;
    label.appendChild(keyEl);
    label.appendChild(textEl);

    const meta = document.createElement("div");
    meta.className = "answer-meta";
    meta.textContent = "Tap to submit";

    btn.appendChild(label);
    btn.appendChild(meta);

    btn.addEventListener("click", () => handleAnswer(btn));

    answersContainer.appendChild(btn);
  });

  updateAccessLevel();
}

function handleAnswer(btn) {
  const isCorrect = btn.dataset.correct === "true";
  const allButtons = Array.from(
    answersContainer.querySelectorAll(".answer-btn")
  );

  if (isCorrect) {
    allButtons.forEach((b) => {
      b.classList.add("disabled");
      if (b === btn) {
        b.classList.add("correct");
      }
    });

    hintEl.textContent = "Sequence accepted. Unlocking next gate...";
    hintEl.className = "hint positive";

    unlockPulse.classList.remove("active");
    void unlockPulse.offsetWidth;
    unlockPulse.classList.add("active");

    playTone(true);

    setTimeout(() => {
      quizScreen.classList.add("hidden");
      setTimeout(() => {
        loadQuestion(currentIndex + 1);
        quizScreen.classList.remove("hidden");
      }, 60);
    }, 650);
  } else {
    btn.classList.add("incorrect");
    hintEl.textContent = "Glitch detected. Try a different path.";
    hintEl.className = "hint negative";

    glitchOverlay.classList.remove("active");
    void glitchOverlay.offsetWidth;
    glitchOverlay.classList.add("active");

    playTone(false);

    setTimeout(() => {
      btn.classList.remove("incorrect");
    }, 450);
  }
}

function showFinalScreen() {
  updateAccessLevelToFull();
  quizScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  // retrigger chest + letter animations each time
  finalScreen.classList.remove("treasure-open");
  void finalScreen.offsetWidth;
  finalScreen.classList.add("treasure-open");
  playUnlockSweep();
}

function updateAccessLevelToFull() {
  accessPercent.textContent = "100%";
  accessBarFill.style.width = "100%";
}

=======
// Particle background
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const COUNT = 90;

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.5 + 0.3,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push(createParticle());
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);

  function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020314";
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
      g.addColorStop(0, `rgba(148, 163, 255, ${p.alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  loop();
})();

// Quiz data
const questions = [
  {
    type: "MULTIPLE CHOICE",
    text: "Intha Saravanan oda birthday Epo ?",
    hint: "Think of the date that really matters to you both.",
    answers: [
      { key: "A", label: "29-07-2005", value: "29-07-2005" },
      { key: "B", label: "29-06-2005", value: "29-06-2005", correct: true },
      { key: "C", label: "29-07-2006", value: "29-07-2006" },
      { key: "D", label: "28-06-2006", value: "28-06-2006" },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "When did our first chat begin?",
    hint: "The day your story really started.",
    answers: [
      { key: "A", label: "02-03-2025", value: "02-03-2025" },
      { key: "B", label: "06-06-2025", value: "06-06-2025", correct: true },
      { key: "C", label: "14-06-2025", value: "14-06-2025" },
      { key: "D", label: "27-06-2025", value: "27-06-2025" },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "Nama first cut adichom la antha place ah crt ah soluvom?",
    hint: "Think of that first place you both really vibed.",
    answers: [
      { key: "A", label: "Beach", value: "Beach" },
      { key: "B", label: "Tea Kada", value: "Tea Kada" },
      { key: "C", label: "VR Mall", value: "VR Mall" },
      { key: "D", label: "Tower Park", value: "Tower Park", correct: true },
    ],
  },
  {
    type: "MULTIPLE CHOICE",
    text: "How did you first approach me to start talking?",
    hint: "Which app did you open before sending that first message?",
    answers: [
      { key: "A", label: "Instagram", value: "Instagram" },
      { key: "B", label: "Telegram", value: "Telegram" },
      { key: "C", label: "WhatsApp", value: "WhatsApp", correct: true },
    ],
  },
  {
    type: "FINAL QUERY",
    text: "What nickname do I lovingly call you?",
    hint: "The one that makes you smile immediately.",
    answers: [
      { key: "A", label: "Angel", value: "Angel", correct: true },
      { key: "B", label: "Hinata", value: "Hinata" },
      { key: "C", label: "Princess", value: "Princess" },
      { key: "D", label: "Ayase", value: "Ayase" },
    ],
  },
];

// Elements
const startupScreen = document.getElementById("startup-screen");
const scanScreen = document.getElementById("scan-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");

const startBtn = document.getElementById("start-btn");
const scanFill = document.getElementById("scan-fill");
const scanLogs = document.getElementById("scan-logs");

const accessPercent = document.getElementById("access-percent");
const accessBarFill = document.getElementById("access-bar-fill");

const questionCounter = document.getElementById("question-counter");
const questionType = document.getElementById("question-type");
const questionText = document.getElementById("question-text");
const questionExtra = document.getElementById("question-extra");
const answersContainer = document.getElementById("answers");
const hintEl = document.getElementById("hint");
const unlockPulse = document.getElementById("unlock-pulse");
const glitchOverlay = document.getElementById("glitch-overlay");

let currentIndex = 0;

// Simple audio feedback using Web Audio
function playTone(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = success ? "triangle" : "square";
    osc.frequency.value = success ? 640 : 200;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      success ? 0.12 : 0.16,
      ctx.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + (success ? 0.25 : 0.35)
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (success ? 0.3 : 0.4));
  } catch (e) {
    // Audio not critical
  }
}

function playUnlockSweep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) {
    // ignore
  }
}

// Boot sequence
startBtn.addEventListener("click", () => {
  startupScreen.classList.add("hidden");
  scanScreen.classList.remove("hidden");
  runScanSequence();
});

function runScanSequence() {
  const lines = [
    "[INIT] Secure kernel boot sequence engaged...",
    "[SCAN] Quantum cipher modules online.",
    "[CHECK] Biometric spoofing countermeasures: ACTIVE.",
    "[LINK] Uplink tunnel established.",
    "[STATUS] Challenge protocol ready.",
  ];

  let idx = 0;
  let progress = 0;

  function addLine() {
    if (idx >= lines.length) return;
    const div = document.createElement("div");
    div.className = "scan-line";
    div.textContent = lines[idx];
    scanLogs.appendChild(div);
    scanLogs.scrollTop = scanLogs.scrollHeight;
    idx++;
  }

  const lineInterval = setInterval(() => {
    addLine();
    if (idx >= lines.length) clearInterval(lineInterval);
  }, 500);

  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 10;
    if (progress >= 100) {
      progress = 100;
      scanFill.style.width = progress + "%";
      clearInterval(progressInterval);
      setTimeout(() => {
        scanScreen.classList.add("hidden");
        loadQuestion(0);
        quizScreen.classList.remove("hidden");
      }, 500);
    } else {
      scanFill.style.width = progress + "%";
    }
  }, 260);
}

function updateAccessLevel() {
  const percent = Math.round(((currentIndex) / questions.length) * 100);
  accessPercent.textContent = percent + "%";
  accessBarFill.style.width = percent + "%";
}

function loadQuestion(index) {
  currentIndex = index;
  if (index >= questions.length) {
    showFinalScreen();
    return;
  }

  const q = questions[index];
  questionCounter.textContent = `Question ${index + 1} / ${questions.length}`;
  questionType.textContent = q.type;
  questionText.textContent = q.text;
  questionExtra.textContent = "";
  answersContainer.innerHTML = "";
  hintEl.textContent = q.hint || "";
  hintEl.className = "hint";

  q.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.dataset.value = ans.value;
    btn.dataset.correct = ans.correct ? "true" : "false";

    const label = document.createElement("div");
    label.className = "answer-label";
    const keyEl = document.createElement("div");
    keyEl.className = "answer-key";
    keyEl.textContent = ans.key;
    const textEl = document.createElement("div");
    textEl.className = "answer-text";
    textEl.textContent = ans.label;
    label.appendChild(keyEl);
    label.appendChild(textEl);

    const meta = document.createElement("div");
    meta.className = "answer-meta";
    meta.textContent = "Tap to submit";

    btn.appendChild(label);
    btn.appendChild(meta);

    btn.addEventListener("click", () => handleAnswer(btn));

    answersContainer.appendChild(btn);
  });

  updateAccessLevel();
}

function handleAnswer(btn) {
  const isCorrect = btn.dataset.correct === "true";
  const allButtons = Array.from(
    answersContainer.querySelectorAll(".answer-btn")
  );

  if (isCorrect) {
    allButtons.forEach((b) => {
      b.classList.add("disabled");
      if (b === btn) {
        b.classList.add("correct");
      }
    });

    hintEl.textContent = "Sequence accepted. Unlocking next gate...";
    hintEl.className = "hint positive";

    unlockPulse.classList.remove("active");
    void unlockPulse.offsetWidth;
    unlockPulse.classList.add("active");

    playTone(true);

    // If this is the final question, go straight to the treasure scene
    if (currentIndex === questions.length - 1) {
      setTimeout(() => {
        showFinalScreen();
      }, 650);
    } else {
      // Otherwise, simply advance to the next question while keeping the quiz visible
      setTimeout(() => {
        loadQuestion(currentIndex + 1);
      }, 650);
    }
  } else {
    btn.classList.add("incorrect");
    hintEl.textContent = "Glitch detected. Try a different path.";
    hintEl.className = "hint negative";

    glitchOverlay.classList.remove("active");
    void glitchOverlay.offsetWidth;
    glitchOverlay.classList.add("active");

    playTone(false);

    setTimeout(() => {
      btn.classList.remove("incorrect");
    }, 450);
  }
}

function showFinalScreen() {
  updateAccessLevelToFull();
  quizScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  // retrigger chest + letter animations each time
  finalScreen.classList.remove("treasure-open");
  void finalScreen.offsetWidth;
  finalScreen.classList.add("treasure-open");
  playUnlockSweep();
}

function updateAccessLevelToFull() {
  accessPercent.textContent = "100%";
  accessBarFill.style.width = "100%";
}

>>>>>>> e797cb1 (Updated PinQuiz website)
