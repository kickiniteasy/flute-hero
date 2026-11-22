const PITCHES = {
  A5: { name: "A5", covers: 0, freq: 880, hint: "all open" },
  G5: { name: "G5", covers: 1, freq: 783.99, hint: "cover the top hole" },
  "F#5": { name: "F#5", covers: 2, freq: 739.99, hint: "cover 2 from the mouth" },
  E5: { name: "E5", covers: 3, freq: 659.25, hint: "cover 3 from the mouth" },
  D5: { name: "D5", covers: 4, freq: 587.33, hint: "cover 4 from the mouth" },
  C5: { name: "C5", covers: 5, freq: 523.25, hint: "cover 5, only the foot hole open" },
  A4: { name: "A4", covers: 6, freq: 440, hint: "all covered" },
};

const LANES = ["A5", "G5", "F#5", "E5", "D5", "C5", "A4"];

const FLUTES = {
  a4: {
    id: "a4",
    name: "A4",
    title: "A4 drone",
    line: "Six holes, covered from the mouth. The drone is the other barrel, its own line.",
    drone: 440,
    notes: [880, 783.99, 739.99, 659.25, 587.33, 523.25, 440],
    names: ["A5", "G5", "F#5", "E5", "D5", "C5", "A4"],
    art: "assets/flute-a4.png",
  },
  fs4: {
    id: "fs4",
    name: "F#4",
    title: "F#4 drone",
    line: "Open is F#5. Cover from the mouth: F5, D#5, C#5, B4, A4, then F#4. The drone is F#4.",
    drone: 369.99,
    notes: [739.99, 698.46, 622.25, 554.37, 493.88, 440, 369.99],
    names: ["F#5", "F5", "D#5", "C#5", "B4", "A4", "F#4"],
    art: "assets/flute-fs4.png",
  },
};
const SHUT_FLUTES = [
  { name: "G" },
  { name: "Low D" },
  { name: "F" },
  { name: "Bamboo" },
];
const TUNE_KEY = "flute-hero-tune";
const PITCH_CLASS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FACTORY = {};
for (const flute of Object.values(FLUTES)) {
  FACTORY[flute.id] = {
    drone: flute.drone,
    notes: flute.notes.slice(),
    names: flute.names.slice(),
  };
}

function spellHz(hz) {
  const midiFloat = 69 + 12 * Math.log2(hz / 440);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);
  const name = PITCH_CLASS[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
  return { name, cents, midi };
}

function readTuneStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(TUNE_KEY) || "{}");
    if (!raw || typeof raw !== "object") return {};
    return raw;
  } catch {
    return {};
  }
}

function applyStoredTune() {
  const saved = readTuneStore();
  for (const flute of Object.values(FLUTES)) {
    const row = saved[flute.id];
    if (!row) continue;
    if (row.drone > 50 && row.drone < 4000) flute.drone = row.drone;
    if (Array.isArray(row.notes)) {
      row.notes.forEach((hz, i) => {
        if (hz > 50 && hz < 4000 && i < flute.notes.length) flute.notes[i] = hz;
      });
    }
    if (Array.isArray(row.names)) {
      row.names.forEach((name, i) => {
        if (typeof name === "string" && name && i < flute.names.length) flute.names[i] = name;
      });
    }
  }
}
applyStoredTune();

function writeTune(id) {
  const saved = readTuneStore();
  const flute = FLUTES[id];
  const factory = FACTORY[id];
  const notes = flute.notes.map((hz, i) => (Math.abs(hz - factory.notes[i]) < 0.05 ? null : Math.round(hz * 100) / 100));
  const names = flute.names.map((name, i) => (name === factory.names[i] ? null : name));
  const drone = Math.abs(flute.drone - factory.drone) < 0.05 ? null : Math.round(flute.drone * 100) / 100;
  const untouched = drone == null && notes.every((hz) => hz == null) && names.every((name) => name == null);
  if (untouched) delete saved[id];
  else saved[id] = { drone, notes, names };
  try {
    localStorage.setItem(TUNE_KEY, JSON.stringify(saved));
  } catch {
    /* the browser can refuse storage */
  }
}

const FLUTE_KEY = "flute-hero-flute";
let fluteId = localStorage.getItem(FLUTE_KEY);
if (!FLUTES[fluteId]) fluteId = "a4";

function currentFlute() {
  return FLUTES[fluteId];
}

function shownNote(id) {
  const info = PITCHES[id];
  if (!info) return id || "";
  return currentFlute().names[info.covers];
}

function freqForCover(covers) {
  return currentFlute().notes[covers];
}

const SONGS = [
  {
    id: "walk",
    title: "The Walk",
    blurb: "Each fingering twice: once with the drone, once without.",
    level: "Easy",
    bpm: 64,
    notes: [
      ["drone", 4, 1],
      ["A5", 4, 1],
      ["A5", 6, 1],
      ["drone", 8, 1],
      ["G5", 8, 1],
      ["G5", 10, 1],
      ["drone", 12, 1],
      ["F#5", 12, 1],
      ["F#5", 14, 1],
      ["drone", 16, 1],
      ["E5", 16, 1],
      ["E5", 18, 1],
      ["drone", 20, 1],
      ["D5", 20, 1],
      ["D5", 22, 1],
      ["drone", 24, 1],
      ["C5", 24, 1],
      ["C5", 26, 1],
      ["drone", 28, 1],
      ["A4", 28, 1],
      ["A4", 30, 1],
      ["drone", 32, 1],
      ["C5", 32, 1],
      ["C5", 34, 1],
      ["drone", 36, 1],
      ["D5", 36, 1],
      ["D5", 38, 1],
      ["drone", 40, 1],
      ["E5", 40, 1],
      ["E5", 42, 1],
      ["drone", 44, 1],
      ["F#5", 44, 1],
      ["F#5", 46, 1],
      ["drone", 48, 1],
      ["G5", 48, 1],
      ["G5", 50, 1],
      ["drone", 52, 1],
      ["A5", 52, 1],
      ["A5", 54, 1],
    ],
  },
  {
    id: "down",
    title: "Down the Barrel",
    blurb: "Fingerings only. The drone line stays empty.",
    level: "Easy",
    bpm: 56,
    notes: [
      ["G5", 4, 2],
      ["F#5", 6, 2],
      ["E5", 8, 2],
      ["D5", 10, 2],
      ["C5", 12, 2],
      ["A4", 14, 4],
    ],
  },
  {
    id: "climb",
    title: "Climb",
    blurb: "Lift holes from the foot until the flute is open.",
    level: "Easy",
    bpm: 72,
    notes: [
      ["A4", 4, 2],
      ["C5", 6, 2],
      ["D5", 8, 2],
      ["E5", 10, 2],
      ["F#5", 12, 2],
      ["drone", 14, 2],
      ["G5", 14, 2],
      ["A5", 16, 4],
    ],
  },
  {
    id: "home",
    title: "Two A's",
    blurb: "The low A and the open flute, an octave apart.",
    level: "Easy",
    bpm: 60,
    notes: [
      ["drone", 4, 2],
      ["A4", 4, 4],
      ["A5", 8, 2],
      ["A4", 10, 2],
      ["G5", 12, 2],
      ["A5", 14, 2],
      ["drone", 16, 2],
      ["A4", 16, 4],
    ],
  },
  {
    id: "river",
    title: "River Stones",
    blurb: "Short notes, and the drone comes up for air.",
    level: "Medium",
    bpm: 96,
    notes: [
      ["drone", 4, 3],
      ["drone", 9, 3],
      ["drone", 14, 3],
      ["drone", 19, 3],
      ["A4", 4, 1],
      ["E5", 5, 1],
      ["F#5", 6, 1],
      ["E5", 7, 1],
      ["D5", 8, 2],
      ["C5", 10, 1],
      ["A4", 11, 1],
      ["A4", 12, 2],
      ["A5", 14, 1],
      ["G5", 15, 1],
      ["F#5", 16, 1],
      ["E5", 17, 1],
      ["D5", 18, 2],
      ["C5", 20, 2],
      ["A4", 22, 4],
    ],
  },
  {
    id: "dusk",
    title: "Dusk Line",
    blurb: "A short phrase, the whole scale, then home.",
    level: "Medium",
    bpm: 84,
    notes: [
      ["drone", 4, 2],
      ["drone", 8, 2],
      ["A4", 4, 2],
      ["E5", 6, 1],
      ["D5", 7, 1],
      ["C5", 8, 2],
      ["A4", 10, 2],
      ["G5", 12, 1],
      ["F#5", 13, 1],
      ["E5", 14, 2],
      ["A5", 16, 1],
      ["G5", 17, 1],
      ["E5", 18, 1],
      ["D5", 19, 1],
      ["drone", 20, 2],
      ["C5", 20, 2],
      ["A4", 22, 4],
    ],
  },
  {
    id: "ford",
    title: "The Ford",
    blurb: "Step across, then the drone holds the far bank.",
    level: "Easy",
    bpm: 72,
    notes: [
      ["E5", 4, 1],
      ["D5", 5, 1],
      ["C5", 6, 2],
      ["A4", 8, 2],
      ["drone", 10, 4],
      ["C5", 10, 2],
      ["E5", 12, 2],
      ["A4", 14, 4],
    ],
  },
  {
    id: "ember",
    title: "Ember",
    blurb: "A small phrase that settles on the low A.",
    level: "Easy",
    bpm: 66,
    notes: [
      ["G5", 4, 2],
      ["E5", 6, 1],
      ["D5", 7, 1],
      ["C5", 8, 2],
      ["drone", 10, 2],
      ["A4", 10, 4],
    ],
  },
  {
    id: "held",
    title: "Held",
    blurb: "The drone stays. The melody answers it.",
    level: "Easy",
    bpm: 60,
    notes: [
      ["drone", 4, 12],
      ["A4", 4, 2],
      ["C5", 6, 2],
      ["D5", 8, 2],
      ["C5", 10, 2],
      ["A4", 12, 4],
    ],
  },
  {
    id: "under",
    title: "Underneath",
    blurb: "Short notes over a drone that does not let go.",
    level: "Medium",
    bpm: 80,
    notes: [
      ["drone", 4, 16],
      ["E5", 4, 1],
      ["D5", 5, 1],
      ["C5", 6, 1],
      ["A4", 7, 1],
      ["C5", 8, 2],
      ["E5", 10, 1],
      ["G5", 11, 1],
      ["E5", 12, 2],
      ["D5", 14, 2],
      ["A4", 16, 4],
    ],
  },
];

const ALBUMS = [
  { id: "barrel", title: "First Barrel", line: "Learn the holes from the mouth down.", wash: "gold", songs: ["walk", "down"] },
  { id: "climb", title: "The Climb", line: "Lift the fingers until the flute is open.", wash: "clay", songs: ["climb", "home"] },
  { id: "river", title: "River", line: "Short steps, and the drone comes up for air.", wash: "river", songs: ["river", "ford"] },
  { id: "dusk", title: "Dusk", line: "A phrase, then home on the low A.", wash: "dusk", songs: ["dusk", "ember"] },
  { id: "drone", title: "The Drone", line: "The other barrel, held while the melody moves.", wash: "deep", songs: ["held", "under"] },
];

const HOLES = [
  [25.5, 47.5],
  [24.8, 53.0],
  [29.1, 58.0],
  [29.8, 63.4],
  [29.8, 69.5],
  [30.5, 76.0],
];
const HOLE_COUNT = 6;
const DRONE_LANE = "drone";
const OPEN_LANE = "open";
const LOOK = 4.6;
const FREE_LOOK = 16;
const TAKES_KEY = "flute-hero-takes";
const WIN = 0.3;
const PERFECT = 0.11;
const OK = 0.2;
const GRADE = {
  perfect: { word: "Perfect", points: 120, hit: true, sparks: 8, color: "#ffcc66" },
  ok: { word: "OK", points: 75, hit: true, sparks: 6, color: "#f6ead4" },
  bad: { word: "Bad", points: 40, hit: true, sparks: 4, color: "#e4b48a" },
  off: { word: "Off", points: 0, hit: false, sparks: 0, color: "#d15d4c" },
  wrong: { word: "Wrong", points: 0, hit: false, sparks: 0, color: "#d15d4c" },
};
const GRADE_RANK = { wrong: 5, off: 4, perfect: 3, ok: 2, bad: 1 };

const down = new Map();
let droneHeld = false;
let audioCtx = null;
let master = null;
let droneGain = null;
let droneOsc = null;
let droneOver = null;
let guideBus = null;
let guideOn = true;
let micOn = false;
let micCovers = null;
let micDrone = false;
let micLabel = "";
let micDetail = "";
let micMelodyDb = -120;
let micDroneDb = -120;
let micError = "";
let micEnergy = 0;
let micHz = 0;
let micHold = { key: "", n: 0 };
let micQuiet = 0;
let micDroneStreak = 0;
let micDroneLatched = false;
let micAnalyser = null;
const EAR_KEY = "flute-hero-ear";
const EARS = {
  bands: { id: "bands", name: "Bands", menu: "A window around each note." },
  peaks: { id: "peaks", name: "Peaks", menu: "The drone only when a second barrel is there." },
  peaks2: { id: "peaks2", name: "Peaks v2", menu: "A held note stays. The drone is decided beside it." },
  held: { id: "held", name: "Held", menu: "The drone stays with the note." },
  yin: { id: "yin", name: "YIN", menu: "One pitch from the wave, the way a tuner library does." },
  mcleod: { id: "mcleod", name: "McLeod", menu: "One pitch from the wave, the way Aubio does." },
};
function earFollowsPitch() {
  return earId === "peaks2" || earId === "yin" || earId === "mcleod";
}
function earSmoothing() {
  if (earId === "yin" || earId === "mcleod") return 0;
  if (earId === "bands" || earId === "peaks2") return 0.45;
  return 0.25;
}
let earId = localStorage.getItem(EAR_KEY);
if (!EARS[earId]) earId = "peaks";
let micPermission = "unknown";
let micPromise = null;
let micStream = null;
let wakeLock = null;
let laneFlashes = [];
let raf = 0;

let song = null;
let tutorialOn = false;
let tuneOn = false;
let tuneIndex = 0;
let tunePhase = "ask";
let tuneRaf = 0;
let tuneSamples = [];
let tuneTakes = [];
let tuneFluteId = "";
let tuneApplied = false;
let tuneFreq = null;
let tutorialStep = 0;
let tutorialPhase = "lesson";
let tutorialHold = 0;
let tutorialAdvanceAt = 0;
let tutorialRaf = 0;
const LESSONS = [
  { covers: 0, hint: "Leave every hole open." },
  { covers: 1, hint: "Cover the hole nearest your mouth." },
  { covers: 2, hint: "Cover two holes, from the mouth down." },
  { covers: 3, hint: "Cover three holes, from the mouth down." },
  { covers: 4, hint: "Cover four holes, from the mouth down." },
  { covers: 5, hint: "Cover five. The hole at the foot stays open." },
  { covers: 6, hint: "Cover all six holes." },
];
let chart = [];
let startAt = 0;
let paused = false;
let pauseBeat = 0;
let score = 0;
let combo = 0;
let bestCombo = 0;
let hits = 0;
let misses = 0;
let grades = { perfect: 0, ok: 0, bad: 0, off: 0, wrong: 0 };
let floaters = [];
let blasts = [];
let frameCall = null;
let motes = [];

const $ = (id) => document.getElementById(id);
const canvas = $("highway");
const ctx2d = canvas.getContext("2d");
const freeCanvas = $("free-highway");
const freeCtx = freeCanvas.getContext("2d");

function mountHoles(root) {
  const box = root.querySelector(".holes");
  HOLES.forEach(([x, y], i) => {
    const el = document.createElement("i");
    el.dataset.i = String(i);
    el.style.left = x + "%";
    el.style.top = y + "%";
    box.appendChild(el);
  });
}

function paintFlute(root, player, target, drone) {
  root.querySelectorAll(".hole, .holes i").forEach((hole) => {
    const i = Number(hole.dataset.i);
    const want = target != null && i < target;
    const have = player != null && i < player;
    const wrong = have && target != null && !want;
    hole.classList.toggle("target", want);
    hole.classList.toggle("wrong", wrong);
    hole.classList.toggle("covered", have && !wrong);
  });
  root.querySelector(".glow")?.classList.toggle("on", drone);
  root.querySelector(".open-mark")?.classList.toggle("on", target === 0);
}

function ensureAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AC();
  master = audioCtx.createGain();
  master.gain.value = 0.8;
  master.connect(audioCtx.destination);
  guideBus = audioCtx.createGain();
  guideBus.gain.value = 0.22;
  guideBus.connect(master);
  droneGain = audioCtx.createGain();
  droneGain.gain.value = 0;
  droneGain.connect(master);
  droneOsc = audioCtx.createOscillator();
  droneOsc.type = "triangle";
  droneOver = audioCtx.createOscillator();
  droneOver.type = "sine";
  tuneDroneVoice();
  const overGain = audioCtx.createGain();
  overGain.gain.value = 0.18;
  droneOsc.connect(droneGain);
  droneOver.connect(overGain);
  overGain.connect(droneGain);
  droneOsc.start();
  droneOver.start();
  ensureTrackBus();
}

function ensureTrackBus() {
  if (!audioCtx || trackGain) return;
  trackGain = audioCtx.createGain();
  trackGain.gain.value = trackLevel / 100;
  trackGain.connect(master);
}

function applyTrackVolume() {
  if (trackGain) trackGain.gain.value = trackLevel / 100;
}

function blip(freq, when, gain, dur, bus) {
  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const g2 = audioCtx.createGain();
  osc.type = "sine";
  osc2.type = "triangle";
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 2;
  g2.gain.value = 0.18;
  osc.connect(g);
  osc2.connect(g2);
  g2.connect(g);
  g.connect(bus || master);
  const t = when ?? audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
  g.gain.setValueAtTime(gain, t + Math.max(0.05, dur - 0.07));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc2.start(t);
  osc.stop(t + dur + 0.02);
  osc2.stop(t + dur + 0.02);
}

function tuneDroneVoice() {
  if (!droneOsc || !audioCtx) return;
  const hz = currentFlute().drone;
  const t = audioCtx.currentTime;
  droneOsc.frequency.setValueAtTime(hz, t);
  if (droneOver) droneOver.frequency.setValueAtTime(hz * 2, t);
}

function setDrone(on) {
  if (!droneGain) return;
  const t = audioCtx.currentTime;
  droneGain.gain.cancelScheduledValues(t);
  droneGain.gain.setTargetAtTime(on ? 0.07 : 0.0001, t, 0.08);
}

function songBeat() {
  if (!audioCtx || !song) return 0;
  if (paused) return pauseBeat;
  return ((audioCtx.currentTime - startAt) * song.bpm) / 60;
}

function codeToCover(code) {
  if (code === "Digit0" || code === "Numpad0" || code === "Backquote") return 0;
  const digit = code.startsWith("Digit")
    ? Number(code.slice(5))
    : code.startsWith("Numpad")
      ? Number(code.slice(6))
      : NaN;
  if (digit >= 1 && digit <= 6) return digit;
  return null;
}

function playerCovers() {
  if (micOn && micCovers != null) return micCovers;
  let latest = null;
  let time = -1;
  for (const [cover, at] of down) {
    if (at > time) {
      latest = cover;
      time = at;
    }
  }
  return latest;
}

function playerDrone() {
  if (micOn) return micDrone;
  return droneHeld;
}

function youLine() {
  const covers = playerCovers();
  const drone = playerDrone();
  const id = micOn && micLabel ? micLabel : covers == null ? "" : LANES[covers] || "";
  const note = id ? shownNote(id) : "";
  if (micOn && !note && !drone) return "Listening";
  if (note && drone) return `${note} · drone`;
  if (drone) return "Drone";
  return note;
}

function lanePlayed(lane, covers, drone) {
  if (lane === DRONE_LANE) return Boolean(drone);
  if (covers == null) return false;
  if (lane === OPEN_LANE) return true;
  return lane < covers;
}

function expectation(beat) {
  let melody = null;
  let drone = false;
  for (const note of chart) {
    if (note.state === "miss") continue;
    if (beat < note.t - WIN || beat > note.t + note.d) continue;
    if (note.kind === "drone") drone = true;
    else if (!melody || note.t < melody.t) melody = note;
  }
  return { melody, drone, active: melody != null || drone };
}

function laneMark(lane, covers, drone, expect) {
  const on = lanePlayed(lane, covers, drone);
  if (!on) return "off";
  if (!expect.active) return "you";
  if (lane === DRONE_LANE) return expect.drone ? "right" : "wrong";
  if (!expect.melody) return "you";
  return covers === expect.melody.covers ? "right" : "wrong";
}

function youVerdict(beat) {
  const covers = playerCovers();
  const drone = playerDrone();
  if (covers == null && !drone) return "";
  const expect = expectation(beat);
  if (!expect.active) return "you";
  const melodyOk = !expect.melody || covers === expect.melody.covers;
  const droneOk = expect.drone ? drone : !drone;
  return melodyOk && droneOk ? "right" : "wrong";
}

function flashLanes(lanes) {
  const at = performance.now();
  for (const lane of lanes) laneFlashes.push({ lane, at });
  if (laneFlashes.length > 48) laneFlashes.splice(0, laneFlashes.length - 48);
}

async function keepAwake() {
  if (!navigator.wakeLock || document.visibilityState !== "visible") return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch {
    wakeLock = null;
  }
}

function targetAt(beat) {
  let current = null;
  let next = null;
  let droneNow = null;
  let droneNext = null;
  for (const note of chart) {
    if (note.kind === "drone") {
      if (beat >= note.t && beat < note.t + note.d) droneNow = note;
      else if (note.t > beat && !droneNext) droneNext = note;
      continue;
    }
    if (beat >= note.t && beat < note.t + note.d) current = note;
    else if (note.t > beat && !next) next = note;
  }
  return { current, next, droneNow, droneNext };
}

function songEnd() {
  return chart.reduce((m, n) => Math.max(m, n.t + n.d), 0);
}

function startSong(id) {
  ensureAudio();
  keepAwake();
  audioCtx.resume();
  song = SONGS.find((s) => s.id === id);
  chart = song.notes.map(([pitch, t, d]) => {
    if (pitch === "drone") {
      return {
        kind: "drone",
        pitch: "Drone",
        t,
        d,
        lane: DRONE_LANE,
        freq: currentFlute().drone,
        covers: null,
        state: "pending",
        holdJudged: false,
        broke: false,
        guided: false,
      };
    }
    const info = PITCHES[pitch];
    return {
      kind: "melody",
      pitch,
      t,
      d,
      lane: info.covers === 0 ? OPEN_LANE : info.covers - 1,
      freq: freqForCover(info.covers),
      covers: info.covers,
      state: "pending",
      holdJudged: false,
      broke: false,
      guided: false,
    };
  });
  score = 0;
  combo = 0;
  bestCombo = 0;
  hits = 0;
  misses = 0;
  grades = { perfect: 0, ok: 0, bad: 0, off: 0, wrong: 0 };
  laneFlashes = [];
  floaters = [];
  blasts = [];
  frameCall = null;
  paused = false;
  startAt = audioCtx.currentTime + 0.12;
  guideBus.gain.value = guideOn ? 0.2 : 0;
  setDrone(false);
  $("call").className = "call";
  $("hit-count").textContent = "0";
  $("combo").textContent = "0";
  $("combo").classList.remove("hot");
  $("score").textContent = "0";
  $("song-name").textContent = song.title;
  $("song-blurb").textContent = song.blurb;
  showScreen("screen-play");
  setPauseButton(false);
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}

function leaveTutorial() {
  tutorialOn = false;
  tutorialAdvanceAt = 0;
  cancelAnimationFrame(tutorialRaf);
}

function stopSong(screen = "screen-map") {
  cancelAnimationFrame(raf);
  setDrone(false);
  song = null;
  paused = false;
  showScreen(screen);
}

function showScreen(id) {
  if (id !== "screen-tune") stopTune();
  for (const s of ["screen-title", "screen-map", "screen-select", "screen-play", "screen-free", "screen-flutes", "screen-tutorial", "screen-tune"]) {
    $(s).classList.toggle("hidden", s !== id);
  }
  $("screen-results").classList.add("hidden");
  resize();
}

function finish() {
  cancelAnimationFrame(raf);
  setDrone(false);
  const judged = hits + misses;
  const acc = judged ? Math.round((hits / judged) * 100) : 0;
  $("result-title").textContent = song.title;
  $("result-line").textContent =
    acc >= 90 ? "The barrel stayed with you." : acc >= 60 ? "The shape is there." : "Walk it again, slower.";
  $("result-score").textContent = String(score);
  $("result-acc").textContent = `${acc}%`;
  $("result-combo").textContent = String(bestCombo);
  for (const name of ["perfect", "ok", "bad", "off", "wrong"]) {
    $(`result-${name}`).textContent = String(grades[name]);
  }
  $("screen-results").classList.remove("hidden");
}

function timingGrade(delta) {
  if (delta <= PERFECT) return "perfect";
  if (delta <= OK) return "ok";
  return "bad";
}

const CALL_ICON = {
  perfect: "sparkles",
  ok: "star",
  bad: "music",
  off: "music-3",
  wrong: "music-2",
};

function showCall(call) {
  const el = $("call");
  el.className = "call";
  $("call-word").textContent = call.word;
  $("call-points").textContent = call.points > 0 ? `+${call.points}` : "";
  $("call-use").setAttribute("href", `assets/icons.svg#${CALL_ICON[call.quality]}`);
  void el.offsetWidth;
  el.className = `call show ${call.quality}`;
}

function land(note, quality) {
  const spec = GRADE[quality];
  note.state = spec.hit ? "hit" : "miss";
  note.quality = quality;
  grades[quality] += 1;
  let gained = 0;
  if (spec.hit) {
    combo += 1;
    bestCombo = Math.max(bestCombo, combo);
    gained = Math.round(spec.points * (1 + Math.min(combo, 16) * 0.08));
    score += gained;
    hits += 1;
    flashLanes(noteLanes(note));
    if (!guideOn) blip(note.freq, audioCtx.currentTime, 0.12, 0.18, master);
  } else {
    combo = 0;
    misses += 1;
  }
  blasts.push({
    lane: note.lane,
    at: performance.now(),
    life: spec.hit ? 620 : 460,
    sparks: spec.sparks,
    color: spec.color,
    rainbow: quality === "perfect",
    miss: !spec.hit,
    spin: Math.random() * Math.PI,
  });
  if (blasts.length > 36) blasts.splice(0, blasts.length - 36);
  const rank = GRADE_RANK[quality];
  if (!frameCall || rank > frameCall.rank) {
    frameCall = { quality, word: spec.word, points: gained, rank };
  } else if (gained) frameCall.points += gained;
}

function judge(beat) {
  const covers = playerCovers();
  const droneOn = playerDrone();
  frameCall = null;
  for (const note of chart) {
    const matched = note.kind === "drone" ? droneOn : covers === note.covers;
    const sounding = covers != null || droneOn;
    if (note.state === "pending" && beat >= note.t - WIN && beat <= note.t + WIN && matched) {
      const delta = beat <= note.t ? 0 : beat - note.t;
      land(note, timingGrade(delta));
    } else if (note.state === "pending" && beat >= note.t - WIN && beat <= note.t + WIN && !matched && sounding) {
      note.clash = true;
    } else if (note.state === "pending" && beat > note.t + WIN) {
      land(note, note.clash ? "wrong" : "off");
    } else if (note.state === "hit" && !note.holdJudged) {
      if (beat > note.t + 0.22 && beat < note.t + note.d && !matched) note.broke = true;
      if (beat >= note.t + note.d - 0.04) {
        note.holdJudged = true;
        if (!note.broke) score += 30;
      }
    }
    if (guideOn && !note.guided) {
      const when = startAt + (note.t * 60) / song.bpm;
      const dur = (note.d * 60) / song.bpm;
      if (when > audioCtx.currentTime && when < audioCtx.currentTime + 2.5) {
        blip(note.freq, when, note.kind === "drone" ? 0.4 : 0.85, dur, guideBus);
        note.guided = true;
      } else if (when <= audioCtx.currentTime) note.guided = true;
    }
  }
  if (frameCall) showCall(frameCall);
}

function fitFlutes() {
  document.querySelectorAll(".flute-wrap").forEach((root) => {
    if (root.id === "play-flute" || root.id === "free-flute" || root.id === "tutorial-flute" || root.id === "tune-flute") return;
    const h = root.clientHeight;
    if (h) root.style.width = (h * 141) / 1058 + "px";
  });
}

function fitPlayFlute(id = "play-flute") {
  const wrap = $(id);
  if (!wrap || wrap.clientHeight < 80) return;
  const viewTop = 0.12;
  const viewEnd = 0.84;
  const h = wrap.clientHeight;
  const imgH = h / (viewEnd - viewTop);
  const imgW = imgH * (141 / 1058);
  const body = wrap.querySelector(".flute-body");
  wrap.style.width = imgW + "px";
  body.style.width = imgW + "px";
  body.style.height = imgH + "px";
  body.style.transform = `translateY(${-viewTop * imgH}px)`;
}

function resizeCanvas(c) {
  if (!c) return;
  const rect = c.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
}

function resize() {
  fitFlutes();
  fitPlayFlute("play-flute");
  fitPlayFlute("free-flute");
  fitPlayFlute("tutorial-flute");
  fitPlayFlute("tune-flute");
  resizeCanvas(canvas);
  resizeCanvas(freeCanvas);
}

function paintTutorial() {
  const flute = currentFlute();
  const lesson = LESSONS[tutorialStep];
  const done = tutorialPhase === "done";
  $("tutorial-title").textContent = "Tutorial";
  $("tutorial-blurb").textContent = done ? flute.title : `${tutorialStep + 1} / ${LESSONS.length}`;
  $("tutorial-note").textContent = done ? "The barrel" : flute.names[lesson.covers];
  $("tutorial-hint").textContent = done
    ? "Seven fingerings, from the mouth down. The drone is the other barrel, and it can sit under any of them."
    : lesson.hint;
  $("tutorial-key").textContent = done ? "" : `Key ${lesson.covers}`;
  $("tutorial-key").classList.toggle("hidden", done);
  const next = $("tutorial-next");
  next.textContent = done ? "Songs" : "Next";
  next.classList.toggle("solid", done);
  next.classList.toggle("text-btn", !done);
}

function advanceTutorial() {
  tutorialHold = 0;
  tutorialAdvanceAt = 0;
  if (tutorialPhase === "done") return;
  if (tutorialStep >= LESSONS.length - 1) {
    tutorialPhase = "done";
    paintTutorial();
    return;
  }
  tutorialStep += 1;
  paintTutorial();
}

function paintTuner(cents, idle) {
  const tuner = $("tutorial-tuner");
  const way = $("tutorial-way");
  const num = $("tutorial-cents");
  const needle = $("tutorial-needle");
  tuner.classList.remove("in", "low", "high", "idle");
  if (cents == null) {
    way.textContent = idle;
    num.textContent = "";
    needle.style.left = "50%";
    tuner.classList.add("idle");
    return;
  }
  const rounded = Math.round(cents);
  const peg = Math.max(-50, Math.min(50, rounded));
  needle.style.left = `${50 + peg}%`;
  if (Math.abs(rounded) <= 15) {
    way.textContent = "In tune";
    num.textContent = "On the note";
    tuner.classList.add("in");
    return;
  }
  if (rounded < 0) {
    way.textContent = "Low";
    num.textContent = `${Math.abs(rounded)} cents low`;
    tuner.classList.add("low");
    return;
  }
  way.textContent = "High";
  num.textContent = `${rounded} cents high`;
  tuner.classList.add("high");
}

function tutorialFrame() {
  if (!tutorialOn) return;
  const lesson = LESSONS[tutorialStep];
  const covers = playerCovers();
  const drone = playerDrone();
  const heard = $("tutorial-heard");
  const tuner = $("tutorial-tuner");
  paintFlute($("tutorial-flute"), covers, tutorialPhase === "lesson" ? lesson.covers : null, drone);
  if (tutorialPhase === "done") {
    tuner.classList.add("hidden");
    heard.classList.remove("hidden");
    heard.textContent = youLine();
    heard.classList.remove("right");
  } else {
    tuner.classList.remove("hidden");
    heard.classList.add("hidden");
    const targetHz = currentFlute().notes[lesson.covers];
    let cents = null;
    if (micOn && micHz > 0) cents = 1200 * Math.log2(micHz / targetHz);
    else if (!micOn && covers != null) cents = 1200 * Math.log2(currentFlute().notes[covers] / targetHz);
    paintTuner(cents, micOn ? "Listening" : "Play");
    if (cents != null && Math.abs(cents) <= 15) {
      tutorialHold += 1;
      if (tutorialHold >= 8 && !tutorialAdvanceAt) tutorialAdvanceAt = performance.now() + 520;
    } else {
      tutorialHold = 0;
      tutorialAdvanceAt = 0;
    }
  }
  if (tutorialAdvanceAt && performance.now() >= tutorialAdvanceAt) advanceTutorial();
  tutorialRaf = requestAnimationFrame(tutorialFrame);
}

function startTutorial() {
  ensureAudio();
  keepAwake();
  audioCtx.resume();
  tutorialOn = true;
  tutorialStep = 0;
  tutorialPhase = "lesson";
  tutorialHold = 0;
  tutorialAdvanceAt = 0;
  showScreen("screen-tutorial");
  paintTutorial();
  $("tutorial-heard").classList.add("hidden");
  $("tutorial-tuner").classList.remove("hidden");
  paintTuner(null, micOn ? "Listening" : "Play");
  cancelAnimationFrame(tutorialRaf);
  tutorialRaf = requestAnimationFrame(tutorialFrame);
}

const TUNE_FINGERS = ["All open", "The top hole", "Two holes", "Three holes", "Four holes", "Five holes", "All covered"];
const TAKE_KEY = "flute-hero-tune-takes";

function tunePlan() {
  const steps = [
    {
      kind: "drone",
      ask: "The drone",
      name: "Drone",
      hint: "Play only the drone barrel. Leave the melody silent.",
    },
  ];
  for (const lesson of LESSONS) {
    const closed = lesson.covers === 6 ? "Cover all six holes on the melody barrel." : lesson.hint;
    steps.push({
      kind: "note",
      covers: lesson.covers,
      ask: "The note",
      name: TUNE_FINGERS[lesson.covers],
      hint: `${closed} Leave the drone off.`,
    });
    steps.push({
      kind: "both",
      covers: lesson.covers,
      ask: "With the drone",
      name: TUNE_FINGERS[lesson.covers],
      hint: `${closed} Hold the drone under it.`,
    });
  }
  return steps;
}

function readTakeStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(TAKE_KEY) || "{}");
    if (!raw || typeof raw !== "object") return {};
    return raw;
  } catch {
    return {};
  }
}

function loadTuneTakes(id) {
  const rows = readTakeStore()[id];
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    if (!row || !(row.hz > 0)) return null;
    return { hz: row.hz, secondHz: row.secondHz > 0 ? row.secondHz : 0 };
  });
}

function saveTuneTakes() {
  const saved = readTakeStore();
  saved[tuneFluteId || fluteId] = tuneTakes;
  try {
    localStorage.setItem(TAKE_KEY, JSON.stringify(saved));
  } catch {
    /* the browser can refuse storage */
  }
}

function nearHz(a, b, cents = 45) {
  return a > 0 && b > 0 && Math.abs(1200 * Math.log2(a / b)) < cents;
}

function noteOf(hz) {
  if (!(hz > 0)) return "";
  return spellHz(hz).name;
}

function hzPair(hz, secondHz) {
  if (!(hz > 0)) return "";
  let text = `${Math.round(hz)} Hz`;
  if (secondHz > 0) text += ` · and ${Math.round(secondHz)} Hz`;
  return text;
}

function hzWords(hz, secondHz) {
  if (!(hz > 0)) return "Not recorded";
  let text = `${hzPair(hz)} · ${noteOf(hz)}`;
  if (secondHz > 0) text += ` · and ${hzPair(secondHz)} · ${noteOf(secondHz)}`;
  return text;
}

function stepTitle(step) {
  if (!step || step.kind === "drone") return "Drone";
  if (step.kind === "both") return `${step.name} and the drone`;
  return step.name;
}

function paintTuneFlute(step) {
  const target = step && step.kind !== "drone" ? step.covers : null;
  const drone = !step || step.kind !== "note";
  paintFlute($("tune-flute"), null, target, drone);
}

function paintTuneAsk() {
  const step = tunePlan()[tuneIndex];
  const count = tunePlan().length;
  $("tune-title").textContent = "Tune";
  $("tune-blurb").textContent = `${currentFlute().name} · ${tuneIndex + 1} / ${count}`;
  $("tune-ask").textContent = step.kind === "drone" ? "Drone only" : step.kind === "both" ? "Note and drone" : "Note only";
  $("tune-ask").classList.toggle("with-drone", step.kind !== "note");
  $("tune-name").textContent = stepTitle(step);
  $("tune-name").classList.toggle("with-drone", step.kind !== "note");
  $("tune-hint").textContent = step.hint;
  $("tune-chart").textContent = "";
  $("tune-prev").classList.toggle("hidden", tuneIndex === 0);
  $("tune-next").textContent = tuneIndex >= count - 1 ? "Review" : "Next";
  $("tune-mic").classList.remove("hidden");
  $("tune-use").classList.add("hidden");
  $("tune-chart-btn").classList.add("hidden");
  $("tune-play").classList.remove("hidden");
  $("tune-flute").classList.remove("hidden");
  $("tune-review").classList.add("hidden");
  const img = $("tune-flute").querySelector("img");
  const src = currentFlute().art;
  if (img && img.getAttribute("src") !== src) img.src = src;
  paintTuneFlute(step);
}

function paintTuneReadout(cents, headline, sub, mode) {
  const tuner = $("tune-meter");
  const way = $("tune-way");
  const num = $("tune-cents");
  const needle = $("tune-needle");
  tuner.classList.remove("in", "low", "high", "idle", "off");
  if (cents == null) {
    way.textContent = headline;
    num.textContent = sub || "";
    needle.style.left = "50%";
    tuner.classList.add("idle");
    return;
  }
  const peg = Math.max(-50, Math.min(50, Math.round(cents)));
  needle.style.left = `${50 + peg}%`;
  way.textContent = headline;
  num.textContent = sub;
  tuner.classList.add(mode);
}

function takeTuneSample() {
  if (!(micHz > 0)) {
    tuneSamples = [];
    return 0;
  }
  tuneSamples.push(micHz);
  if (tuneSamples.length > 12) tuneSamples.shift();
  if (tuneSamples.length < 6) return 0;
  const sorted = tuneSamples.slice().sort((a, b) => a - b);
  const spread = Math.abs(1200 * Math.log2(sorted[sorted.length - 1] / sorted[0]));
  if (spread > 30) return 0;
  return sorted[Math.floor(sorted.length / 2)];
}

function harmonicOf(hz, other) {
  const cents = Math.abs(1200 * Math.log2(hz / other));
  return Math.abs(cents - 1200) < 60 || Math.abs(cents - 1902) < 50;
}

function tuneSecond(leadHz) {
  if (!micAnalyser || !(leadHz > 0) || !audioCtx) return 0;
  if (!tuneFreq || tuneFreq.length !== micAnalyser.frequencyBinCount) {
    tuneFreq = new Float32Array(micAnalyser.frequencyBinCount);
  }
  micAnalyser.getFloatFrequencyData(tuneFreq);
  const binHz = audioCtx.sampleRate / micAnalyser.fftSize;
  const lo = Math.max(1, Math.floor(60 / binHz));
  const hi = Math.min(tuneFreq.length - 2, Math.ceil(4000 / binHz));
  const peaks = [];
  for (let i = lo; i < hi; i++) {
    if (tuneFreq[i] <= tuneFreq[i - 1] || tuneFreq[i] < tuneFreq[i + 1] || tuneFreq[i] < -58) continue;
    const left = tuneFreq[i - 1];
    const right = tuneFreq[i + 1];
    const denom = left - 2 * tuneFreq[i] + right;
    const delta = denom === 0 ? 0 : (0.5 * (left - right)) / denom;
    peaks.push({ hz: (i + delta) * binHz, db: tuneFreq[i] });
  }
  peaks.sort((a, b) => b.db - a.db);
  let leadDb = -120;
  for (const peak of peaks) {
    if (nearHz(peak.hz, leadHz, 50)) leadDb = Math.max(leadDb, peak.db);
  }
  if (leadDb < -100 && peaks.length) leadDb = peaks[0].db;
  for (const peak of peaks) {
    if (nearHz(peak.hz, leadHz, 50)) continue;
    if (harmonicOf(peak.hz, leadHz)) continue;
    if (peak.db < leadDb - 18) continue;
    return peak.hz;
  }
  return 0;
}

const TUNE_TAU = 2048;
const tuneDiff = new Float32Array(TUNE_TAU + 1);
const tuneCmnd = new Float32Array(TUNE_TAU + 1);

function tunePitch(samples, sampleRate) {
  const tauMin = Math.max(2, Math.floor(sampleRate / 4000));
  const tauMax = Math.min(TUNE_TAU, Math.floor(samples.length / 2) - 1, Math.floor(sampleRate / 60));
  if (tauMax <= tauMin) return 0;
  const span = Math.floor(samples.length / 2);
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let j = 0; j < span; j++) {
      const delta = samples[j] - samples[j + tau];
      sum += delta * delta;
    }
    tuneDiff[tau] = sum;
  }
  tuneCmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += tuneDiff[tau];
    tuneCmnd[tau] = running === 0 ? 1 : (tuneDiff[tau] * tau) / running;
  }
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (tuneCmnd[t] < 0.15) {
      while (t + 1 <= tauMax && tuneCmnd[t + 1] < tuneCmnd[t]) t += 1;
      tau = t;
      break;
    }
  }
  if (tau < 0) {
    let best = tauMin;
    let bestV = tuneCmnd[tauMin];
    for (let t = tauMin + 1; t <= tauMax; t++) {
      if (tuneCmnd[t] < bestV) {
        bestV = tuneCmnd[t];
        best = t;
      }
    }
    if (bestV > 0.45) return 0;
    tau = best;
  }
  return sampleRate / periodAt(tuneCmnd, tau, tauMax);
}

function recordTune(hz) {
  const secondHz = tuneSecond(hz);
  const prev = tuneTakes[tuneIndex];
  if (prev && nearHz(prev.hz, hz, 12) && (!secondHz || nearHz(prev.secondHz, secondHz, 12))) return prev;
  const take = {
    hz: Math.round(hz * 100) / 100,
    secondHz: secondHz ? Math.round(secondHz * 100) / 100 : 0,
  };
  tuneTakes[tuneIndex] = take;
  saveTuneTakes();
  return take;
}

function tuneFrame() {
  if (!tuneOn || tunePhase !== "ask") return;
  const step = tunePlan()[tuneIndex];
  paintTuneFlute(step);
  const hz = takeTuneSample();
  const heard = $("tune-heard");
  if (!(hz > 0)) {
    const take = tuneTakes[tuneIndex];
    if (take?.hz) {
      paintTuneReadout(null, take.secondHz ? `${noteOf(take.hz)} · ${noteOf(take.secondHz)}` : noteOf(take.hz), hzPair(take.hz, take.secondHz));
      heard.textContent = "Recorded";
      heard.classList.add("kept");
      heard.classList.remove("warn");
    } else {
      paintTuneReadout(null, micOn ? "Listening" : "Play", "");
      heard.textContent = micOn ? "Play a steady pitch. It records." : "The microphone is off.";
      heard.classList.remove("kept", "warn");
    }
  } else {
    const take = recordTune(hz);
    paintTuneReadout(null, take.secondHz ? `${noteOf(take.hz)} · ${noteOf(take.secondHz)}` : noteOf(take.hz), hzPair(take.hz, take.secondHz));
    $("tune-meter").classList.remove("idle");
    $("tune-meter").classList.add("in");
    heard.textContent = "Recorded";
    heard.classList.add("kept");
    heard.classList.remove("warn");
  }
  tuneRaf = requestAnimationFrame(tuneFrame);
}

function tuneLine(text, warn) {
  const p = document.createElement("p");
  p.textContent = text;
  if (warn) p.className = "warn";
  return p;
}

function fluteIsFactory() {
  const flute = currentFlute();
  const factory = FACTORY[flute.id];
  if (Math.abs(flute.drone - factory.drone) >= 0.05) return false;
  return factory.notes.every((hz, i) => Math.abs(flute.notes[i] - hz) < 0.05 && flute.names[i] === factory.names[i]);
}

function paintTuneReview() {
  const plan = tunePlan();
  const any = tuneTakes.some((take) => take?.hz);
  const lead = document.createElement("p");
  lead.className = "tune-lead";
  lead.textContent = any
    ? "What was played. The note beside each pitch is the nearest name."
    : "Play each fingering alone, then the same fingering with the drone.";
  const heading = document.createElement("h2");
  heading.textContent = currentFlute().title;
  const rows = [heading, lead];
  plan.forEach((step, i) => {
    if (step.kind === "both") return;
    const article = document.createElement("article");
    const title = document.createElement("b");
    title.textContent = step.kind === "note" ? step.name : stepTitle(step);
    const lines = [];
    if (step.kind === "drone") lines.push(tuneLine(tuneTakes[i]?.hz ? hzWords(tuneTakes[i].hz, tuneTakes[i].secondHz) : "Not recorded"));
    else {
      const alone = tuneTakes[i];
      const pair = tuneTakes[i + 1];
      lines.push(tuneLine(alone?.hz ? `Alone · ${hzWords(alone.hz, alone.secondHz)}` : "Alone · not recorded"));
      lines.push(tuneLine(pair?.hz ? `With the drone · ${hzWords(pair.hz, pair.secondHz)}` : "With the drone · not recorded"));
    }
    article.append(title, ...lines);
    rows.push(article);
  });
  $("tune-review").replaceChildren(...rows);
  const exp = $("tune-use");
  exp.textContent = "Export";
  exp.disabled = !any;
}

function showTuneReview() {
  tunePhase = "review";
  $("tune-title").textContent = "Tune";
  $("tune-blurb").textContent = "Recorded";
  $("tune-play").classList.add("hidden");
  $("tune-flute").classList.add("hidden");
  $("tune-review").classList.remove("hidden");
  $("tune-mic").classList.add("hidden");
  $("tune-prev").classList.remove("hidden");
  $("tune-use").classList.remove("hidden");
  $("tune-chart-btn").classList.add("hidden");
  $("tune-next").textContent = "Done";
  paintTuneReview();
}

function stopTune() {
  tuneOn = false;
  tuneSamples = [];
  cancelAnimationFrame(tuneRaf);
}

function openTune() {
  if (tuneFluteId !== fluteId) {
    tuneFluteId = fluteId;
    tuneTakes = loadTuneTakes(fluteId);
    tuneIndex = 0;
    tunePhase = "ask";
    tuneApplied = false;
  }
  tuneOn = true;
  showScreen("screen-tune");
  if (tunePhase === "review") showTuneReview();
  else paintTuneAsk();
  cancelAnimationFrame(tuneRaf);
  tuneRaf = requestAnimationFrame(tuneFrame);
  startMic(true);
}

function closeTune() {
  stopTune();
  showScreen("screen-flutes");
  paintFluteScreen();
}

function advanceTune() {
  if (!tuneOn) return;
  if (tunePhase === "review") {
    closeTune();
    return;
  }
  if (tuneIndex >= tunePlan().length - 1) {
    showTuneReview();
    return;
  }
  tuneIndex += 1;
  tuneSamples = [];
  paintTuneAsk();
}

function retreatTune() {
  if (!tuneOn) return;
  if (tunePhase === "review") {
    tunePhase = "ask";
    tuneIndex = tunePlan().length - 1;
    tuneSamples = [];
    paintTuneAsk();
    return;
  }
  if (tuneIndex === 0) return;
  tuneIndex -= 1;
  tuneSamples = [];
  paintTuneAsk();
}

function tuneReport() {
  const flute = currentFlute();
  const plan = tunePlan();
  const takes = plan.map((step, i) => {
    const take = tuneTakes[i];
    return {
      step: i + 1,
      fingering: stepTitle(step),
      drone: step.kind !== "note",
      hz: take?.hz || null,
      note: take?.hz ? noteOf(take.hz) : null,
      secondHz: take?.secondHz || null,
      secondNote: take?.secondHz ? noteOf(take.secondHz) : null,
    };
  });
  const lines = [flute.title, ""];
  for (const row of takes) {
    const heard = row.hz ? `${Math.round(row.hz)} Hz · ${row.note}` : "not recorded";
    const extra = row.secondHz ? ` · and ${Math.round(row.secondHz)} Hz · ${row.secondNote}` : "";
    lines.push(`${row.fingering}: ${heard}${extra}`);
  }
  return {
    payload: { flute: flute.id, title: flute.title, recordedAt: new Date().toISOString(), takes },
    text: lines.join("\n"),
  };
}

async function exportTune() {
  const flute = currentFlute();
  const report = tuneReport();
  const blob = new Blob([JSON.stringify(report.payload, null, 2)], { type: "application/json" });
  const file = new File([blob], `${flute.id}-tune.json`, { type: "application/json" });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `${flute.title} tuning`, text: report.text });
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: `${flute.title} tuning`, text: report.text });
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function restoreTuneChart() {
  const flute = currentFlute();
  const factory = FACTORY[flute.id];
  flute.drone = factory.drone;
  factory.notes.forEach((hz, i) => {
    flute.notes[i] = hz;
  });
  factory.names.forEach((name, i) => {
    flute.names[i] = name;
  });
  writeTune(flute.id);
  tuneApplied = false;
  tuneDroneVoice();
  paintDronePill();
  paintTuneReview();
}

function frame() {
  if (!song) return;
  const beat = songBeat();
  judge(beat);
  const { current, next } = targetAt(beat);
  const covers = playerCovers();
  const show = current || (next && next.t - beat < 1.2 ? next : null);
  const count = $("count");
  const n = (Math.floor(Math.max(0, beat)) % 4) + 1;
  if (count.textContent !== String(n)) count.textContent = String(n);
  count.classList.toggle("down", n === 1);
  const youDrone = playerDrone();
  $("drone-pill").classList.toggle("on", youDrone);
  const heard = $("heard");
  heard.textContent = youLine();
  heard.classList.remove("right", "wrong", "you");
  const verdict = youVerdict(beat);
  if (verdict) heard.classList.add(verdict);
  paintFlute($("play-flute"), covers, show ? PITCHES[show.pitch].covers : null, youDrone);
  const scoreEl = $("score");
  if (scoreEl.textContent !== String(score)) {
    scoreEl.textContent = String(score);
    scoreEl.classList.remove("tick");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("tick");
  }
  $("hit-count").textContent = String(hits);
  const comboEl = $("combo");
  comboEl.textContent = String(combo);
  comboEl.classList.toggle("hot", combo > 1);
  draw(beat);
  if (beat > songEnd() + 2) finish();
  else raf = requestAnimationFrame(frame);
}

let droneLook = localStorage.getItem("flute-hero-drone") === "rainbow" ? "rainbow" : "gold";

function droneInk(x0, x1, y, context = ctx2d) {
  if (droneLook !== "rainbow") return "#ffcc66";
  const g = context.createLinearGradient(x0, y, Math.max(x1, x0 + 1), y);
  for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, `hsl(${i * 48}, 92%, 62%)`);
  return g;
}

function laneColor(lane, alpha = 1) {
  const hex = lane === DRONE_LANE ? "#ffcc66" : lane === OPEN_LANE ? "#fff6e4" : "#f6ead4";
  if (alpha >= 1) return hex;
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function noteLanes(note) {
  if (note.kind === "drone") return [DRONE_LANE];
  const lanes = [OPEN_LANE];
  for (let i = 0; i < (note.covers || 0); i++) lanes.push(i);
  return lanes;
}

function trackIndex(lane) {
  if (lane === DRONE_LANE) return 0;
  if (lane === OPEN_LANE) return 1;
  return 2 + lane;
}

function allTracks() {
  return [DRONE_LANE, OPEN_LANE, 0, 1, 2, 3, 4, 5];
}

function fluteColumn(canvasEl = canvas, fluteId = "play-flute") {
  const cRect = canvasEl.getBoundingClientRect();
  const scaleX = canvasEl.width / Math.max(1, cRect.width);
  const scaleY = canvasEl.height / Math.max(1, cRect.height);
  const flute = document.getElementById(fluteId)?.getBoundingClientRect();
  const holes = [...document.querySelectorAll(`#${fluteId} .holes i`)];
  const hole = holes[0]?.getBoundingClientRect();
  let hitX = canvasEl.width * 0.12;
  if (holes.length && cRect.width) {
    const mid =
      holes.reduce((sum, el) => {
        const r = el.getBoundingClientRect();
        return sum + r.left + r.width / 2;
      }, 0) / holes.length;
    hitX = (mid - cRect.left) * scaleX;
  } else if (flute?.width) {
    hitX = (flute.left + flute.width * 0.28 - cRect.left) * scaleX;
  }
  const leftX = flute?.width ? (flute.left - cRect.left) * scaleX : 0;
  const radius = hole?.height ? Math.max(11, (hole.height / 2) * scaleY) : 16;
  return { hitX, leftX, radius, scaleY, cRect, canvasEl };
}

function laneAnchor(lane, column, fluteId = "play-flute") {
  const col = column || fluteColumn();
  const canvasEl = col.canvasEl || canvas;
  const el =
    lane === DRONE_LANE
      ? document.querySelector(`#${fluteId} .glow`)
      : lane === OPEN_LANE
        ? document.querySelector(`#${fluteId} .open-mark`)
        : document.querySelectorAll(`#${fluteId} .holes i`)[lane];
  if (!el || !col.cRect.width) {
    const i = trackIndex(lane);
    return { x: col.hitX, y: canvasEl.height * (0.16 + i * 0.09), r: col.radius, leftX: col.leftX };
  }
  const r = el.getBoundingClientRect();
  return {
    x: col.hitX,
    y: (r.top + r.height / 2 - col.cRect.top) * col.scaleY,
    r: col.radius,
    leftX: col.leftX,
  };
}

function xFor(beat, now, hitX) {
  const endX = canvas.width * 0.94;
  return hitX + ((beat - now) / LOOK) * (endX - hitX);
}

function roundRect(x, y, w, h, radius, context = ctx2d) {
  const rad = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  context.beginPath();
  context.moveTo(x + rad, y);
  context.arcTo(x + w, y, x + w, y + h, rad);
  context.arcTo(x + w, y + h, x, y + h, rad);
  context.arcTo(x, y + h, x, y, rad);
  context.arcTo(x, y, x + w, y, rad);
  context.closePath();
}

function droneSpans(start, end) {
  const spans = [];
  for (const note of chart) {
    if (note.kind !== "drone") continue;
    const a = Math.max(start, note.t);
    const b = Math.min(end, note.t + note.d);
    if (b > a + 0.001) spans.push([a, b]);
  }
  return spans;
}

function drawSpark(x, y, size, color) {
  ctx2d.beginPath();
  ctx2d.moveTo(x, y - size);
  ctx2d.lineTo(x + size * 0.28, y - size * 0.28);
  ctx2d.lineTo(x + size, y);
  ctx2d.lineTo(x + size * 0.28, y + size * 0.28);
  ctx2d.lineTo(x, y + size);
  ctx2d.lineTo(x - size * 0.28, y + size * 0.28);
  ctx2d.lineTo(x - size, y);
  ctx2d.lineTo(x - size * 0.28, y - size * 0.28);
  ctx2d.closePath();
  ctx2d.fillStyle = color;
  ctx2d.fill();
}

function drawBlasts(column) {
  const now = performance.now();
  for (const blast of blasts) {
    const age = (now - blast.at) / blast.life;
    if (age >= 1) continue;
    const a = laneAnchor(blast.lane, column);
    const fade = 1 - age;
    ctx2d.save();
    ctx2d.globalAlpha = fade;
    if (blast.miss) {
      const s = a.r * (0.55 + age * 0.7);
      ctx2d.strokeStyle = blast.color;
      ctx2d.lineWidth = Math.max(3, a.r * 0.16);
      ctx2d.lineCap = "round";
      ctx2d.beginPath();
      ctx2d.moveTo(a.x - s, a.y - s);
      ctx2d.lineTo(a.x + s, a.y + s);
      ctx2d.moveTo(a.x + s, a.y - s);
      ctx2d.lineTo(a.x - s, a.y + s);
      ctx2d.stroke();
    } else {
      const radius = a.r * (1.05 + age * 1.7);
      ctx2d.lineWidth = Math.max(2, a.r * 0.12);
      if (blast.rainbow) {
        for (let i = 0; i < 6; i++) {
          ctx2d.strokeStyle = `hsl(${i * 60 + 8}, 90%, 66%)`;
          ctx2d.beginPath();
          ctx2d.arc(a.x, a.y, radius, (i / 6) * Math.PI * 2, ((i + 1) / 6) * Math.PI * 2);
          ctx2d.stroke();
        }
      } else {
        ctx2d.strokeStyle = blast.color;
        ctx2d.beginPath();
        ctx2d.arc(a.x, a.y, radius, 0, Math.PI * 2);
        ctx2d.stroke();
      }
      for (let i = 0; i < blast.sparks; i++) {
        const ang = blast.spin + (i / blast.sparks) * Math.PI * 2;
        const dist = a.r * (0.35 + age * 2.4);
        const spark = a.r * (0.42 - age * 0.22);
        const color = blast.rainbow ? `hsl(${(i * 48 + blast.spin * 40) % 360}, 92%, 66%)` : blast.color;
        drawSpark(a.x + Math.cos(ang) * dist, a.y + Math.sin(ang) * dist, Math.max(3, spark), color);
      }
    }
    ctx2d.restore();
  }
}

function draw(beat) {
  const w = canvas.width;
  const h = canvas.height;
  ctx2d.clearRect(0, 0, w, h);
  const column = fluteColumn();
  const tracks = allTracks().map((lane) => ({ lane, ...laneAnchor(lane, column) }));
  const endX = w * 0.94;

  for (const t of tracks) {
    ctx2d.strokeStyle = laneColor(t.lane, 0.55);
    ctx2d.lineWidth = Math.max(2, t.r * 0.16);
    ctx2d.beginPath();
    ctx2d.moveTo(t.leftX, t.y);
    ctx2d.lineTo(endX, t.y);
    ctx2d.stroke();
  }

  const first = Math.floor(beat);
  const last = Math.ceil(beat + LOOK);
  ctx2d.lineWidth = 1;
  for (let b = first; b <= last; b++) {
    for (const t of tracks) {
      const x = xFor(b, beat, t.x);
      if (x < t.x || x > endX) continue;
      ctx2d.strokeStyle = b % 4 === 0 ? "rgba(255,246,228,0.16)" : "rgba(255,246,228,0.07)";
      ctx2d.beginPath();
      ctx2d.moveTo(x, t.y - t.r * 0.35);
      ctx2d.lineTo(x, t.y + t.r * 0.35);
      ctx2d.stroke();
    }
  }

  if (song) {
  for (const note of chart) {
    if (note.t + note.d < beat - 1 || note.t > beat + LOOK + 1) continue;
    const lanes = noteLanes(note);
    for (const lane of lanes) {
      const a = laneAnchor(lane, column);
      const xAttack = xFor(note.t, beat, a.x);
      const xRelease = xFor(note.t + note.d, beat, a.x);
      const left = Math.max(xAttack, a.leftX);
      const right = xRelease;
      if (right < a.leftX || left > endX + 40) continue;
      const missed = note.state === "miss";
      const rainbow = !missed && note.kind === "drone" && droneLook === "rainbow";
      const color = missed ? "#8a4038" : rainbow ? droneInk(left, right, a.y) : laneColor(lane, 0.9);
      const thick = Math.max(7, a.r * (note.kind === "drone" ? 0.62 : 0.42));
      ctx2d.save();
      ctx2d.shadowColor = missed ? "#8a4038" : rainbow ? "#ffffff" : laneColor(lane, 1);
      ctx2d.shadowBlur = missed ? 0 : 16;
      ctx2d.fillStyle = color;
      roundRect(left, a.y - thick / 2, Math.max(0, right - left), thick, thick / 2);
      ctx2d.fill();
      ctx2d.restore();
      if (missed || note.kind === "drone") continue;
      const bold = thick * 1.45;
      for (const [t0, t1] of droneSpans(note.t, note.t + note.d)) {
        const x0 = xFor(t0, beat, a.x);
        const x1 = xFor(t1, beat, a.x);
        const gLeft = Math.max(Math.min(x0, x1), a.leftX);
        const gRight = Math.max(x0, x1);
        if (gRight - gLeft < 1) continue;
        const ink = droneInk(gLeft, gRight, a.y);
        ctx2d.save();
        ctx2d.shadowColor = droneLook === "rainbow" ? "#ffffff" : "#ffcc66";
        ctx2d.shadowBlur = 18;
        ctx2d.fillStyle = ink;
        roundRect(gLeft, a.y - bold / 2, gRight - gLeft, bold, bold / 2);
        ctx2d.fill();
        ctx2d.restore();
      }
    }
  }

  for (const note of chart) {
    if (note.t < beat - 0.4 || note.t > beat + LOOK + 0.2) continue;
    const lanes = noteLanes(note);
    for (const lane of lanes) {
      const a = laneAnchor(lane, column);
      const x = xFor(note.t, beat, a.x);
      if (x < a.x || x > endX + 30) continue;
      const missed = note.state === "miss";
      const withDrone = !missed && note.kind !== "drone" && droneSpans(note.t, note.t + 0.05).length > 0;
      const useDrone = note.kind === "drone" || withDrone;
      const radius = a.r * (useDrone ? 1.05 : 0.92);
      const rainbow = useDrone && droneLook === "rainbow";
      const color = missed ? "#8a4038" : rainbow ? droneInk(x - radius, x + radius, a.y) : useDrone ? "#ffcc66" : laneColor(lane, 1);
      ctx2d.save();
      ctx2d.shadowColor = missed ? "#8a4038" : rainbow ? "#ffffff" : typeof color === "string" ? color : "#ffcc66";
      ctx2d.shadowBlur = missed ? 0 : 22;
      ctx2d.fillStyle = color;
      ctx2d.beginPath();
      ctx2d.arc(x, a.y, radius, 0, Math.PI * 2);
      ctx2d.fill();
      ctx2d.shadowBlur = 0;
      ctx2d.fillStyle = missed ? "#2a1210" : "#1a120c";
      ctx2d.beginPath();
      ctx2d.arc(x, a.y, radius * 0.28, 0, Math.PI * 2);
      ctx2d.fill();
      ctx2d.restore();
    }
  }
  }

  const coversNow = playerCovers();
  const droneYou = playerDrone();
  const expect = expectation(beat);
  const flashNow = performance.now();
  for (const t of tracks) {
    const mark = laneMark(t.lane, coversNow, droneYou, expect);
    const on = mark !== "off";
    let burst = 0;
    if (mark === "right") {
      for (const flash of laneFlashes) {
        if (flash.lane !== t.lane) continue;
        const left = 1 - (flashNow - flash.at) / 380;
        if (left > burst) burst = left;
      }
    }
    ctx2d.beginPath();
    ctx2d.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    ctx2d.lineWidth = Math.max(3, t.r * (on ? 0.22 : 0.12));
    if (mark === "wrong") ctx2d.fillStyle = "#d15d4c";
    else if (burst > 0.45) ctx2d.fillStyle = "#fff6e4";
    else if (on && t.lane === DRONE_LANE) ctx2d.fillStyle = droneInk(t.x - t.r, t.x + t.r, t.y);
    else if (on) ctx2d.fillStyle = laneColor(t.lane, 1);
    else ctx2d.fillStyle = "rgba(9, 8, 7, 0.92)";
    ctx2d.fill();
    ctx2d.strokeStyle = mark === "wrong" ? "#ffb0a4" : on || burst > 0 ? "#fff6e4" : laneColor(t.lane, 0.4);
    ctx2d.stroke();
    ctx2d.beginPath();
    ctx2d.arc(t.x, t.y, Math.max(3, t.r * (on ? 0.26 : 0.16)), 0, Math.PI * 2);
    ctx2d.fillStyle = on ? "#1a120c" : "rgba(246, 234, 212, 0.28)";
    ctx2d.fill();
    if (burst > 0) {
      ctx2d.save();
      ctx2d.globalAlpha = burst;
      ctx2d.strokeStyle = "#fff6e4";
      ctx2d.lineWidth = 3;
      ctx2d.beginPath();
      ctx2d.arc(t.x, t.y, t.r * (1.08 + (1 - burst) * 0.85), 0, Math.PI * 2);
      ctx2d.stroke();
      ctx2d.restore();
    }
  }

  ctx2d.textAlign = "right";
  ctx2d.textBaseline = "middle";
  ctx2d.font = `600 ${Math.max(12, w * 0.013)}px ui-sans-serif, system-ui, sans-serif`;
  for (const t of tracks) {
    const label = t.lane === DRONE_LANE ? "Drone" : t.lane === OPEN_LANE ? "Mouth" : String(t.lane + 1);
    const mark = laneMark(t.lane, coversNow, droneYou, expect);
    ctx2d.fillStyle = mark === "wrong" ? "#d15d4c" : mark === "off" ? "rgba(246,234,212,0.4)" : t.lane === DRONE_LANE ? "#ffcc66" : laneColor(t.lane, 1);
    ctx2d.fillText(label, w * 0.985, t.y);
  }

  for (const floater of floaters) {
    const age = performance.now() - floater.at;
    if (age > 700) continue;
    const a = laneAnchor(floater.lane, column);
    ctx2d.globalAlpha = 1 - age / 700;
    ctx2d.fillStyle = floater.good ? "#f6ead4" : "#e07060";
    ctx2d.font = `600 ${Math.max(14, w * 0.016)}px ui-sans-serif, system-ui, sans-serif`;
    ctx2d.textAlign = "left";
    ctx2d.fillText(floater.text, a.x + a.r + 8, a.y - age * 0.04);
    ctx2d.globalAlpha = 1;
  }

  drawBlasts(column);
}


const TONE_PROM = 12;
const PEAKS2_PROM = 3;

function toneAt(freq, sampleRate, fftSize, hz) {
  const binHz = sampleRate / fftSize;
  const center = hz / binHz;
  const i0 = Math.max(1, Math.floor(center) - 3);
  const i1 = Math.min(freq.length - 2, Math.ceil(center) + 3);
  let peak = -120;
  let bin = i0;
  for (let i = i0; i <= i1; i++) {
    if (freq[i] > peak) {
      peak = freq[i];
      bin = i;
    }
  }
  const left = freq[bin - 1];
  const right = freq[bin + 1];
  const denom = left - 2 * peak + right;
  const delta = denom === 0 ? 0 : (0.5 * (left - right)) / denom;
  const floors = [];
  for (let i = bin - 8; i <= bin + 8; i++) {
    if (i < 1 || i >= freq.length || Math.abs(i - bin) <= 3) continue;
    floors.push(freq[i]);
  }
  floors.sort((a, b) => a - b);
  const floor = floors.length ? floors[Math.floor(floors.length / 2)] : -120;
  return { db: peak, hz: (bin + delta) * binHz, prom: peak - floor };
}

function extraPeak(freq, sampleRate, fftSize, hz, radiusHz) {
  const binHz = sampleRate / fftSize;
  const a = Math.max(1, Math.floor((hz - radiusHz) / binHz));
  const b = Math.min(freq.length - 2, Math.ceil((hz + radiusHz) / binHz));
  let peakDb = -120;
  let peakBin = a;
  for (let i = a; i <= b; i++) {
    if (freq[i] > peakDb) {
      peakDb = freq[i];
      peakBin = i;
    }
  }
  for (let i = a + 1; i < b; i++) {
    if (Math.abs(i - peakBin) < 2) continue;
    if (freq[i] > freq[i - 1] && freq[i] > freq[i + 1] && freq[i] > peakDb - 8) return true;
  }
  return false;
}

function secondBarrel(freq, sampleRate, fftSize, low) {
  if (!(low.prom >= TONE_PROM)) return false;
  for (const k of [2, 3, 4]) {
    const partial = toneAt(freq, sampleRate, fftSize, low.hz * k);
    if (partial.prom >= TONE_PROM && Math.abs(low.hz * k - partial.hz) > 8) return true;
    if (extraPeak(freq, sampleRate, fftSize, low.hz * k, 14 * k)) return true;
  }
  return extraPeak(freq, sampleRate, fftSize, low.hz, 30);
}

function nearTarget(tone) {
  return Math.abs(tone.hz - tone.target) <= Math.max(36, tone.target * 0.05);
}

function fatTone(freq, sampleRate, fftSize, hz) {
  const binHz = sampleRate / fftSize;
  const center = hz / binHz;
  const i0 = Math.max(1, Math.floor(center) - 3);
  const i1 = Math.min(freq.length - 2, Math.ceil(center) + 3);
  let peak = -120;
  let bin = i0;
  for (let i = i0; i <= i1; i++) {
    if (freq[i] > peak) {
      peak = freq[i];
      bin = i;
    }
  }
  const left = freq[bin - 1];
  const right = freq[bin + 1];
  const denom = left - 2 * peak + right;
  const delta = denom === 0 ? 0 : (0.5 * (left - right)) / denom;
  const floors = [];
  for (let i = bin - 16; i <= bin + 16; i++) {
    if (i < 1 || i >= freq.length || Math.abs(i - bin) <= 7) continue;
    floors.push(freq[i]);
  }
  floors.sort((a, b) => a - b);
  const floor = floors.length ? floors[Math.floor(floors.length / 2)] : -120;
  return { db: peak, hz: (bin + delta) * binHz, prom: peak - floor };
}

function seriesScore(freq, sampleRate, fftSize, fundamental) {
  const weights = [1, 0.6, 0.35];
  let score = 0;
  let db = -120;
  let prom = 0;
  let hz = fundamental;
  for (let k = 0; k < weights.length; k++) {
    const hzK = fundamental * (k + 1);
    const hit = k === 0 ? fatTone(freq, sampleRate, fftSize, hzK) : toneAt(freq, sampleRate, fftSize, hzK);
    const near = Math.abs(hit.hz - hzK) <= Math.max(28, hzK * 0.04);
    if (k === 0) {
      db = hit.db;
      prom = hit.prom;
      hz = hit.hz;
      if (!near) break;
    }
    if (near) score += Math.max(0, hit.prom) * weights[k];
  }
  return { score, db, prom, hz };
}

function droneStands(freq, sampleRate, fftSize, droneHz, melodyHz) {
  const hit = toneAt(freq, sampleRate, fftSize, droneHz);
  const binHz = sampleRate / fftSize;
  const center = Math.round(hit.hz / binHz);
  const floors = [];
  for (let i = center - 10; i <= center + 10; i++) {
    if (i < 1 || i >= freq.length - 1 || Math.abs(i - center) <= 2) continue;
    const hz = i * binHz;
    if (melodyHz && Math.abs(hz - melodyHz) <= Math.max(24, melodyHz * 0.06)) continue;
    floors.push(freq[i]);
  }
  floors.sort((a, b) => a - b);
  const floor = floors.length ? floors[Math.floor(floors.length / 2)] : -120;
  return {
    db: hit.db,
    hz: hit.hz,
    prom: hit.db - floor,
    near: Math.abs(hit.hz - droneHz) <= Math.max(28, droneHz * 0.04),
  };
}

function pickMelody(freq, sampleRate, fftSize) {
  const flute = currentFlute();
  const tones = flute.notes.map((target, covers) => {
    const series = seriesScore(freq, sampleRate, fftSize, target);
    return { name: flute.names[covers], id: LANES[covers], covers, target, ...series };
  });
  const low = tones.find((tone) => tone.covers === 6);
  const upper = tones
    .filter((tone) => tone.covers !== 6 && tone.db > -64 && tone.prom >= PEAKS2_PROM && nearTarget(tone))
    .sort((a, b) => b.db - a.db || b.score - a.score);
  let melody = upper[0] || null;
  const lowNear = low.db > -64 && low.prom >= PEAKS2_PROM && nearTarget(low);
  if (melody && melody.covers === 0 && lowNear && melody.db <= low.db + 3) {
    const third = toneAt(freq, sampleRate, fftSize, low.target * 3);
    const sixth = toneAt(freq, sampleRate, fftSize, low.target * 6);
    const openConfirms = sixth.prom >= PEAKS2_PROM && sixth.db > third.db + 1;
    if (!openConfirms) {
      const next = upper[1];
      if (next && next.db > melody.db - 6) melody = next;
    }
  }
  if (!melody && lowNear) melody = low;
  const beside = melody && melody.covers !== 6 ? melody.target : 0;
  const droneHit = droneStands(freq, sampleRate, fftSize, flute.drone, beside);
  const droneNear = droneHit.prom >= PEAKS2_PROM && droneHit.near;
  let drone = false;
  if (melody && melody.covers !== 6) drone = droneNear && droneHit.db >= melody.db - 20;
  else if (melody && melody.covers === 6) drone = secondBarrel(freq, sampleRate, fftSize, low);
  return { melody, drone, low, flute };
}

function heardMelody(freq, sampleRate, fftSize) {
  const { melody, drone, low, flute } = pickMelody(freq, sampleRate, fftSize);
  const melodyDb = melody ? melody.db : -120;
  const droneHz = Math.round(flute.drone);
  if (!melody) {
    return {
      covers: null,
      drone: false,
      label: "",
      melodyDb,
      droneDb: low.db,
      detail: low.prom > 4 ? `No clear note · ${droneHz} Hz ${Math.round(low.db)} dB` : "No pitch",
    };
  }
  return {
    covers: melody.covers,
    drone,
    label: melody.id,
    melodyDb,
    droneDb: low.db,
    detail: `${melody.name} ${Math.round(melody.db)} dB · ${droneHz} Hz ${Math.round(low.db)} dB, prominence ${Math.round(low.prom)} · ${drone ? "drone on" : "drone off"}`,
  };
}

function bandWindows(flute) {
  const melody = flute.notes
    .map((hz, covers) => ({ hz, covers }))
    .filter((note) => note.covers !== 6)
    .sort((a, b) => a.hz - b.hz);
  const bands = melody.map((note, i) => {
    const below = i === 0 ? flute.drone : melody[i - 1].hz;
    const above = i === melody.length - 1 ? note.hz * 1.24 : melody[i + 1].hz;
    return {
      covers: note.covers,
      id: LANES[note.covers],
      lo: note.hz - (note.hz - below) * 0.42,
      hi: i === melody.length - 1 ? note.hz * 1.1 : note.hz + (above - note.hz) * 0.42,
    };
  });
  return { bands, droneLo: flute.drone * 0.92, droneHi: flute.drone * 1.068 };
}

function bandPeak(freq, sampleRate, fftSize, lo, hi) {
  const binHz = sampleRate / fftSize;
  const a = Math.max(0, Math.floor(lo / binHz));
  const b = Math.min(freq.length - 1, Math.ceil(hi / binHz));
  let peak = -120;
  for (let i = a; i <= b; i++) if (freq[i] > peak) peak = freq[i];
  return peak;
}

function hearBands(freq, sampleRate, fftSize) {
  const flute = currentFlute();
  const { bands, droneLo, droneHi } = bandWindows(flute);
  const droneDb = bandPeak(freq, sampleRate, fftSize, droneLo, droneHi);
  let best = null;
  for (const band of bands) {
    const db = bandPeak(freq, sampleRate, fftSize, band.lo, band.hi);
    if (!best || db > best.db) best = { covers: band.covers, id: band.id, db };
  }
  const octaveOfDrone = best && best.covers === 0 && best.db < droneDb + 2;
  const melody = best && best.db > -50 && !octaveOfDrone ? best : null;
  const melodyDb = best ? best.db : -120;
  if (melody) {
    const drone = droneDb > -46 && droneDb > melody.db - 14;
    return {
      covers: melody.covers,
      drone,
      label: melody.id,
      melodyDb,
      droneDb,
      detail: `${shownNote(melody.id)} ${Math.round(melody.db)} dB · drone ${Math.round(droneDb)} dB · ${drone ? "drone on" : "drone off"}`,
    };
  }
  if (droneDb > -46) {
    const lowId = LANES[6];
    return {
      covers: 6,
      drone: true,
      label: lowId,
      melodyDb,
      droneDb,
      detail: octaveOfDrone
        ? `${shownNote(best.id)} sat on the drone's octave, so this is ${shownNote(lowId)} and the drone`
        : `${Math.round(flute.drone)} Hz ${Math.round(droneDb)} dB · the low note and the drone share this pitch`,
    };
  }
  return {
    covers: null,
    drone: false,
    label: "",
    melodyDb,
    droneDb,
    detail: best ? `Loudest ${shownNote(best.id)} ${Math.round(best.db)} dB, under the line to call a note` : "No pitch",
  };
}

function apartFromScale(freq, sampleRate, fftSize, centerHz, targets) {
  const binHz = sampleRate / fftSize;
  const center = Math.round(centerHz / binHz);
  const floors = [];
  for (let i = center - 12; i <= center + 12; i++) {
    if (i < 1 || i >= freq.length - 1 || Math.abs(i - center) <= 2) continue;
    const hz = i * binHz;
    if (targets.some((target) => Math.abs(hz - target) <= binHz * 2.4)) continue;
    floors.push(freq[i]);
  }
  floors.sort((a, b) => a - b);
  return floors.length ? floors[Math.floor(floors.length / 2)] : -120;
}

function dronePartial(tone, fundamental) {
  if (!(fundamental > 0)) return false;
  for (let k = 2; k <= 5; k++) {
    if (Math.abs(tone.hz - fundamental * k) <= 18) return true;
  }
  return false;
}

function hearHeld(freq, sampleRate, fftSize) {
  const flute = currentFlute();
  const tones = flute.names.map((name, covers) => {
    const target = flute.notes[covers];
    const heard = toneAt(freq, sampleRate, fftSize, target);
    return { name, id: LANES[covers], covers, target, db: heard.db, hz: heard.hz, prom: heard.prom };
  });
  const low = tones.find((tone) => tone.covers === 6);
  let pool = tones.filter((tone) => tone.prom >= TONE_PROM && Math.abs(tone.hz - tone.target) <= 22);
  pool = pool.filter((tone) => {
    return !pool.some(
      (other) =>
        other !== tone &&
        Math.abs(other.hz - tone.hz) < 12 &&
        Math.abs(other.hz - other.target) + 0.5 < Math.abs(tone.hz - tone.target),
    );
  });
  const lowHit = pool.find((tone) => tone.covers === 6);
  const openHit = pool.find((tone) => tone.covers === 0);
  if (lowHit && openHit && openHit.db <= lowHit.db + 0.5) {
    const third = toneAt(freq, sampleRate, fftSize, low.target * 3);
    const sixth = toneAt(freq, sampleRate, fftSize, low.target * 6);
    const highConfirms = sixth.prom >= TONE_PROM && sixth.db > third.db;
    if (!highConfirms) pool = pool.filter((tone) => tone.covers !== 0);
  }
  const others = flute.notes.filter((_, covers) => covers !== 6);
  const droneProm = low.db - apartFromScale(freq, sampleRate, fftSize, low.hz, others);
  const droneNear = Math.abs(low.hz - flute.drone) <= 22 && droneProm >= 7;
  let upper = pool.filter((tone) => tone.covers !== 6);
  if (droneNear) {
    const voiced = upper.filter((tone) => !dronePartial(tone, low.hz) || tone.db >= low.db + 3);
    if (voiced.length) upper = voiced;
  }
  let melody = null;
  const pick = upper.length ? upper : pool;
  for (const tone of pick) if (!melody || tone.db > melody.db) melody = tone;
  let drone = false;
  if (!melody && droneNear) melody = low;
  if (melody && melody.covers !== 6) drone = droneNear && low.db >= melody.db - 22;
  else if (melody && melody.covers === 6) drone = secondBarrel(freq, sampleRate, fftSize, low);
  const melodyDb = melody ? melody.db : -120;
  const droneHz = Math.round(flute.drone);
  if (!melody) {
    return {
      covers: null,
      drone: false,
      label: "",
      melodyDb,
      droneDb: low.db,
      detail: low.prom > 4 ? `No clear note · ${droneHz} Hz ${Math.round(low.db)} dB` : "No pitch",
    };
  }
  return {
    covers: melody.covers,
    drone,
    label: melody.id,
    melodyDb,
    droneDb: low.db,
    detail: `${melody.name} ${Math.round(melody.db)} dB · ${droneHz} Hz ${Math.round(low.db)} dB, prominence ${Math.round(droneProm)} · ${drone ? "drone on" : "drone off"}`,
  };
}

function hearPeaks(freq, sampleRate, fftSize) {
  const flute = currentFlute();
  const tones = flute.names.map((name, covers) => {
    const target = flute.notes[covers];
    const heard = toneAt(freq, sampleRate, fftSize, target);
    return { name, id: LANES[covers], covers, target, db: heard.db, hz: heard.hz, prom: heard.prom };
  });
  const low = tones.find((tone) => tone.covers === 6);
  let pool = tones.filter((tone) => tone.prom >= TONE_PROM && Math.abs(tone.hz - tone.target) <= 22);
  pool = pool.filter((tone) => {
    return !pool.some(
      (other) =>
        other !== tone &&
        Math.abs(other.hz - tone.hz) < 12 &&
        Math.abs(other.hz - other.target) + 0.5 < Math.abs(tone.hz - tone.target),
    );
  });
  const lowHit = pool.find((tone) => tone.covers === 6);
  const openHit = pool.find((tone) => tone.covers === 0);
  if (lowHit && openHit && openHit.db <= lowHit.db + 0.5) {
    const third = toneAt(freq, sampleRate, fftSize, low.target * 3);
    const sixth = toneAt(freq, sampleRate, fftSize, low.target * 6);
    const highConfirms = sixth.prom >= TONE_PROM && sixth.db > third.db;
    if (!highConfirms) pool = pool.filter((tone) => tone.covers !== 0);
  }
  const upper = pool.filter((tone) => tone.covers !== 6);
  let melody = null;
  const pick = upper.length ? upper : pool;
  for (const tone of pick) if (!melody || tone.db > melody.db) melody = tone;
  const droneTone = low.prom >= TONE_PROM && Math.abs(low.hz - flute.drone) <= 22;
  let drone = false;
  if (!melody && droneTone) melody = low;
  if (melody && melody.covers !== 6) drone = droneTone;
  else if (melody && melody.covers === 6) drone = secondBarrel(freq, sampleRate, fftSize, low);
  const melodyDb = melody ? melody.db : -120;
  const droneDb = low.db;
  const droneHz = Math.round(flute.drone);
  if (!melody) {
    return {
      covers: null,
      drone: false,
      label: "",
      melodyDb,
      droneDb,
      detail: low.prom > 4 ? `No clear note · ${droneHz} Hz ${Math.round(low.db)} dB` : "No pitch",
    };
  }
  const droneWord = drone ? "drone on" : "drone off";
  return {
    covers: melody.covers,
    drone,
    label: melody.id,
    melodyDb,
    droneDb,
    detail: `${melody.name} ${Math.round(melody.db)} dB · ${droneHz} Hz ${Math.round(low.db)} dB, prominence ${Math.round(low.prom)} · ${droneWord}`,
  };
}

function hearPeaks2(freq, sampleRate, fftSize) {
  return heardMelody(freq, sampleRate, fftSize);
}

const WAVE_TAU = 256;
const waveDiff = new Float32Array(WAVE_TAU + 1);
const waveCmnd = new Float32Array(WAVE_TAU + 1);

function periodAt(arr, tau, tauMax) {
  const left = tau > 0 ? arr[tau - 1] : arr[tau];
  const mid = arr[tau];
  const right = tau < tauMax ? arr[tau + 1] : arr[tau];
  const denom = left - 2 * mid + right;
  if (denom === 0) return tau;
  const next = tau + (0.5 * (left - right)) / denom;
  return next > 1 ? next : tau;
}

function waveBounds(sampleRate, length) {
  const tauMin = Math.max(2, Math.floor(sampleRate / 1400));
  const tauMax = Math.min(WAVE_TAU, Math.floor(length / 2) - 1, Math.floor(sampleRate / 250));
  return { tauMin, tauMax, span: Math.floor(length / 2) };
}

function yinPitch(samples, sampleRate) {
  const { tauMin, tauMax, span } = waveBounds(sampleRate, samples.length);
  if (tauMax <= tauMin) return 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let j = 0; j < span; j++) {
      const delta = samples[j] - samples[j + tau];
      sum += delta * delta;
    }
    waveDiff[tau] = sum;
  }
  waveCmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += waveDiff[tau];
    waveCmnd[tau] = running === 0 ? 1 : (waveDiff[tau] * tau) / running;
  }
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (waveCmnd[t] < 0.15) {
      while (t + 1 <= tauMax && waveCmnd[t + 1] < waveCmnd[t]) t += 1;
      tau = t;
      break;
    }
  }
  if (tau < 0) {
    let best = tauMin;
    let bestV = waveCmnd[tauMin];
    for (let t = tauMin + 1; t <= tauMax; t++) {
      if (waveCmnd[t] < bestV) {
        bestV = waveCmnd[t];
        best = t;
      }
    }
    if (bestV > 0.45) return 0;
    tau = best;
  }
  return sampleRate / periodAt(waveCmnd, tau, tauMax);
}

function mcleodPitch(samples, sampleRate) {
  const { tauMin, tauMax, span } = waveBounds(sampleRate, samples.length);
  if (tauMax <= tauMin) return 0;
  let best = 0;
  for (let tau = tauMin; tau <= tauMax; tau++) {
    let ac = 0;
    let norm = 0;
    for (let j = 0; j < span; j++) {
      const left = samples[j];
      const right = samples[j + tau];
      ac += left * right;
      norm += left * left + right * right;
    }
    const value = norm > 0 ? (2 * ac) / norm : 0;
    waveDiff[tau] = value;
    if (value > best) best = value;
  }
  if (best < 0.6) return 0;
  const cutoff = best * 0.93;
  let tau = -1;
  for (let t = tauMin + 1; t < tauMax; t++) {
    if (waveDiff[t] >= waveDiff[t - 1] && waveDiff[t] >= waveDiff[t + 1] && waveDiff[t] >= cutoff) {
      tau = t;
      break;
    }
  }
  if (tau < 0) return 0;
  return sampleRate / periodAt(waveDiff, tau, tauMax);
}

function hearWave(hz, freq, sampleRate, fftSize) {
  if (!(hz > 0)) {
    return { covers: null, drone: false, label: "", melodyDb: -120, droneDb: -120, detail: "No pitch" };
  }
  const flute = currentFlute();
  let covers = 0;
  let off = Infinity;
  for (let i = 0; i < flute.notes.length; i++) {
    const cents = Math.abs(1200 * Math.log2(hz / flute.notes[i]));
    if (cents < off) {
      off = cents;
      covers = i;
    }
  }
  if (off > 50) {
    return { covers: null, drone: false, label: "", melodyDb: -120, droneDb: -120, detail: `${Math.round(hz)} Hz` };
  }
  const target = flute.notes[covers];
  const tone = fatTone(freq, sampleRate, fftSize, target);
  let drone = false;
  let droneDb = -120;
  if (covers === 6) {
    drone = secondBarrel(freq, sampleRate, fftSize, { target, db: tone.db, prom: tone.prom, hz: tone.hz });
    droneDb = tone.db;
  } else {
    const stood = droneStands(freq, sampleRate, fftSize, flute.drone, target);
    droneDb = stood.db;
    drone = stood.prom >= 3 && stood.near && stood.db > -64 && stood.db >= tone.db - 20;
  }
  return {
    covers,
    drone,
    label: LANES[covers],
    melodyDb: tone.db,
    droneDb,
    detail: `${flute.names[covers]} ${Math.round(hz)} Hz`,
  };
}

function hearFlute(freq, sampleRate, fftSize, waveHz) {
  if (earId === "bands") return hearBands(freq, sampleRate, fftSize);
  if (earId === "held") return hearHeld(freq, sampleRate, fftSize);
  if (earId === "peaks2") return hearPeaks2(freq, sampleRate, fftSize);
  if (earId === "yin" || earId === "mcleod") return hearWave(waveHz, freq, sampleRate, fftSize);
  return hearPeaks(freq, sampleRate, fftSize);
}

let micGeneration = 0;

function sayMic(text) {
  micError = text;
  if (!$("screen-play").classList.contains("hidden")) $("heard").textContent = text;
}

function stopMic() {
  micGeneration += 1;
  micOn = false;
  micCovers = null;
  micDrone = false;
  micLabel = "";
  micDetail = "";
  micMelodyDb = -120;
  micDroneDb = -120;
  micEnergy = 0;
  micHz = 0;
  micError = "";
  micPromise = null;
  micHold = { key: "", n: 0 };
  micQuiet = 0;
  micDroneStreak = 0;
  micDroneLatched = false;
  micAnalyser = null;
  micStream?.getTracks().forEach((t) => t.stop());
  micStream = null;
  setMicButton(false);
  $("heard").textContent = "";
}

function startMic(fromGesture) {
  if (micOn) return Promise.resolve(true);
  if (micPromise) return micPromise;
  ensureAudio();
  keepAwake();
  const resume = audioCtx.resume();
  if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
    micPermission = navigator.mediaDevices?.getUserMedia ? "insecure" : "unsupported";
    if (fromGesture) sayMic("Open the https link. This address keeps the mic closed.");
    return Promise.resolve(false);
  }
  const generation = ++micGeneration;
  const pending = navigator.mediaDevices
    .getUserMedia({
      audio: {
        echoCancellation: { ideal: false },
        noiseSuppression: { ideal: false },
        autoGainControl: { ideal: false },
      },
    })
    .then(async (stream) => {
      if (generation !== micGeneration || micOn) {
        stream.getTracks().forEach((t) => t.stop());
        return micOn;
      }
      micStream = stream;
      resume.catch(() => {});
      micPermission = "granted";
      return openMic(stream);
    })
    .catch((error) => {
      if (generation !== micGeneration || !fromGesture) return false;
      const name = error?.name || "";
      if (name === "NotFoundError" || name === "OverconstrainedError") micPermission = "missing";
      else if (name === "NotReadableError" || name === "AbortError") micPermission = "busy";
      else micPermission = "denied";
      micError = name;
      if (fromGesture) sayMic("The microphone stayed closed. Allow it when the browser asks.");
      return false;
    });
  const tracked = pending.finally(() => {
    if (micPromise === tracked) micPromise = null;
  });
  micPromise = tracked;
  return tracked;
}

function toggleMic() {
  if (micOn) stopMic();
  else startMic(true);
}

function settleDrone(on) {
  if (on) micDroneStreak = micDroneStreak > 0 ? micDroneStreak + 1 : 1;
  else micDroneStreak = micDroneStreak < 0 ? micDroneStreak - 1 : -1;
  if (micDroneStreak >= 2) micDroneLatched = true;
  if (micDroneStreak <= (earFollowsPitch() ? -3 : -5)) micDroneLatched = false;
  return micDroneLatched;
}

function resetEarHold() {
  micHold = { key: "", n: 0 };
  micQuiet = 0;
  micDroneStreak = 0;
  micDroneLatched = false;
}

function commitHeard(heard) {
  if (earFollowsPitch()) {
    commitPeaks2(heard);
    return;
  }
  micDetail = heard.detail;
  micMelodyDb = heard.melodyDb;
  micDroneDb = heard.droneDb;
  if (earId === "bands") {
    micCovers = heard.covers;
    micDrone = heard.drone;
    micLabel = heard.label || "";
    return;
  }
  if (heard.covers == null && !heard.drone) {
    resetEarHold();
    micCovers = null;
    micDrone = false;
    micLabel = "";
    return;
  }
  if (earId === "held") {
    const key = `${heard.covers ?? "-"}:${heard.label}`;
    micHold = key === micHold.key ? { key, n: micHold.n + 1 } : { key, n: 1 };
    if (micHold.n >= 3) {
      micCovers = heard.covers;
      micLabel = heard.label;
    }
    micDrone = settleDrone(heard.drone);
    return;
  }
  const key = `${heard.covers ?? "-"}:${heard.drone ? 1 : 0}:${heard.label}`;
  micHold = key === micHold.key ? { key, n: micHold.n + 1 } : { key, n: 1 };
  if (micHold.n < 3) return;
  micCovers = heard.covers;
  micDrone = heard.drone;
  micLabel = heard.label;
}

function commitPeaks2(heard) {
  micDetail = heard.detail;
  micDroneDb = heard.droneDb;
  const silent = heard.covers == null && !heard.drone;
  if (silent) {
    micQuiet += 1;
    if (micQuiet < 8) return;
    resetEarHold();
    micCovers = null;
    micDrone = false;
    micLabel = "";
    micMelodyDb = -120;
    return;
  }
  micQuiet = 0;
  const key = `${heard.covers ?? "-"}:${heard.label}`;
  micHold = key === micHold.key ? { key, n: micHold.n + 1 } : { key, n: 1 };
  const switching = Boolean(micLabel) && (heard.label !== micLabel || heard.covers !== micCovers);
  if (!switching || micHold.n >= 3 || heard.melodyDb >= micMelodyDb + 4) {
    micCovers = heard.covers;
    micLabel = heard.label || "";
    micMelodyDb = heard.melodyDb;
  }
  micDrone = settleDrone(heard.drone);
}

function openMic(stream) {
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  micAnalyser = analyser;
  analyser.fftSize = 4096;
  analyser.minDecibels = -110;
  analyser.maxDecibels = 0;
  analyser.smoothingTimeConstant = earSmoothing();
  source.connect(analyser);
  const time = new Float32Array(analyser.fftSize);
  const freq = new Float32Array(analyser.frequencyBinCount);
  micOn = true;
  micError = "";
  micHold = { key: "", n: 0 };
  micQuiet = 0;
  setMicButton(true);
  const listen = () => {
    if (!micOn) return;
    analyser.getFloatTimeDomainData(time);
    let energy = 0;
    for (let i = 0; i < time.length; i += 8) energy += time[i] * time[i];
    energy = Math.sqrt(energy / (time.length / 8));
    micEnergy = energy;
    if (energy < 0.015) {
      micHz = 0;
      commitHeard({ covers: null, drone: false, label: "", melodyDb: -120, droneDb: -120, detail: "Quiet" });
    } else {
      analyser.getFloatFrequencyData(freq);
      const sampleRate = audioCtx.sampleRate;
      const wantWave = tutorialOn || earId === "yin" || earId === "mcleod";
      const waveHz = tuneOn
        ? tunePitch(time, sampleRate)
        : wantWave
          ? earId === "mcleod"
            ? mcleodPitch(time, sampleRate)
            : yinPitch(time, sampleRate)
          : 0;
      micHz = waveHz;
      commitHeard(hearFlute(freq, sampleRate, analyser.fftSize, waveHz));
    }
    requestAnimationFrame(listen);
  };
  listen();
  return true;
}

let eatMicClick = false;
function listenForMicGesture() {
  const kick = (event) => {
    if (micOn) {
      window.removeEventListener("pointerdown", kick, true);
      window.removeEventListener("keydown", kick, true);
      return;
    }
    if (event.target?.closest?.("#menu-panel")) return;
    if (event.target?.closest?.("#mic, #free-mic")) eatMicClick = true;
    window.removeEventListener("pointerdown", kick, true);
    window.removeEventListener("keydown", kick, true);
    startMic(true);
  };
  window.addEventListener("pointerdown", kick, true);
  window.addEventListener("keydown", kick, true);
}

let freeBpm = Number(localStorage.getItem("flute-hero-bpm"));
if (!(freeBpm >= 40 && freeBpm <= 208)) freeBpm = 80;
freeBpm = Math.round(freeBpm);
let preferredBpm = freeBpm;
let metroOn = localStorage.getItem("flute-hero-metro") !== "off";
function storedLevel(key, fallback) {
  const raw = localStorage.getItem(key);
  const n = Number(raw);
  if (raw == null || raw === "" || !(n >= 0 && n <= 100)) return fallback;
  return Math.round(n);
}
let metroLevel = storedLevel("flute-hero-metro-vol", 30);
let trackLevel = storedLevel("flute-hero-track-vol", 80);
let freeBeats = Number(localStorage.getItem("flute-hero-meter"));
if (![2, 3, 4, 5, 6, 7].includes(freeBeats)) freeBeats = 4;
let trackGain = null;
let trackBuffer = null;
let trackName = "";
let trackId = "";
let trackPeaks = [];
let trackBpmGuess = null;
let trackSource = null;
let trackPlaying = false;
let trackStartBeat = null;
let trackPreview = null;
let trackLoading = false;
let trackLoadToken = 0;
const BACKING_TRACKS = [
  { id: "earth", name: "Rhythm of the Earth", url: "assets/tracks/rhythm-of-the-earth.mp3" },
  { id: "forest", name: "Rhythm of the Forest", url: "assets/tracks/rhythm-of-the-forest.mp3" },
];
let countInMode = "";
let countInRebased = false;
let recordTrackAt = null;
let replayTrackOffset = null;
let tapTimes = [];
let freeRunning = false;
let freeRaf = 0;
let freeOrigin = 0;
let nextClickBeat = 0;
let freeState = "live";
let freeNotes = [];
let freeLive = null;
let freeHold = null;
let recordNotes = [];
let recordOriginBeat = 0;
let recordBpm = freeBpm;
let countInEnd = 0;
let pendingTake = null;
let replayNotes = null;
let replayId = "";
let replayName = "";
let freeNotice = "";
let freeNoticeUntil = 0;

function freeBeat() {
  if (!audioCtx) return 0;
  return ((audioCtx.currentTime - freeOrigin) * freeBpm) / 60;
}

function setFreeBpm(n, reset) {
  n = Math.max(40, Math.min(208, Math.round(Number(n)) || 80));
  if (!reset && audioCtx && freeRunning) {
    const beat = freeBeat();
    freeBpm = n;
    freeOrigin = audioCtx.currentTime - (beat * 60) / freeBpm;
    nextClickBeat = Math.floor(beat) + 1;
  } else {
    freeBpm = n;
    if (audioCtx && freeRunning) {
      freeOrigin = audioCtx.currentTime;
      nextClickBeat = 0;
    }
  }
  const label = $("bpm-value");
  if (label) label.textContent = String(freeBpm);
  if (freeState === "live") {
    preferredBpm = freeBpm;
    try {
      localStorage.setItem("flute-hero-bpm", String(freeBpm));
    } catch {
      /* the browser can refuse storage */
    }
  }
}

function tempoLocked() {
  return freeState === "recording" || freeState === "countin" || trackPlaying;
}

function trackTempoId() {
  if (!trackBuffer) return "";
  return `${trackId}|${trackName}|${Math.round(trackBuffer.duration)}`;
}

function savedTempoTouch() {
  try {
    const saved = JSON.parse(localStorage.getItem("flute-hero-bpm-touch") || "null");
    if (saved && saved.id === trackTempoId() && saved.bpm >= 40 && saved.bpm <= 208) return Math.round(saved.bpm);
  } catch {
    /* the browser can refuse storage */
  }
  return null;
}

function rememberTempoTouch() {
  const id = trackTempoId();
  if (!id) return;
  try {
    localStorage.setItem("flute-hero-bpm-touch", JSON.stringify({ id, bpm: freeBpm }));
  } catch {
    /* the browser can refuse storage */
  }
}

function nudgeBpm(delta) {
  if (tempoLocked()) return;
  setFreeBpm(freeBpm + delta, false);
  rememberTempoTouch();
}

function loadTakes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TAKES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeTakes(takes) {
  try {
    localStorage.setItem(TAKES_KEY, JSON.stringify(takes));
    return true;
  } catch {
    freeNotice = "The browser would not store that. Download the file instead.";
    freeNoticeUntil = performance.now() + 3600;
    return false;
  }
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `t${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function nextTakeName() {
  const names = new Set(loadTakes().map((take) => take.name));
  let n = names.size + 1;
  while (names.has(`Take ${n}`)) n += 1;
  return `Take ${n}`;
}

function formatTake(take) {
  const end = (take.notes || []).reduce((m, n) => Math.max(m, n.t + n.d), 0);
  const sec = Math.round((end * 60) / (take.bpm || 80));
  return `${sec}s`;
}

function hideSave() {
  $("save-bar").classList.add("hidden");
}

function glyphButton(label, markup, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "text-btn icon-btn tiny";
  btn.setAttribute("aria-label", label);
  btn.innerHTML = markup;
  btn.addEventListener("click", onClick);
  return btn;
}

const ICON_PLAY = `<svg class="icon icon-line" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"></path></svg>`;
const ICON_STOP = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.6"></rect></svg>`;
const ICON_FILE = `<svg class="icon icon-line" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"></path><path d="m7.5 11.5 4.5 4.5 4.5-4.5"></path><path d="M5 20h14"></path></svg>`;
const ICON_X = `<svg class="icon icon-line" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"></path></svg>`;

function renderTakes() {
  const takes = loadTakes();
  $("takes").classList.toggle("hidden", takes.length === 0);
  const list = $("takes-list");
  list.replaceChildren();
  for (const take of takes) {
    const playing = replayId === take.id && freeState === "replay";
    const row = document.createElement("div");
    row.className = playing ? "take playing" : "take";
    const name = document.createElement("b");
    name.textContent = take.name || "Take";
    const meta = document.createElement("span");
    meta.textContent = `${take.bpm} bpm · ${formatTake(take)}`;
    const play = glyphButton(playing ? "Stop" : "Play", playing ? ICON_STOP : ICON_PLAY, () => playSaved(take.id));
    const file = glyphButton("Download", ICON_FILE, () => downloadTake(take));
    const del = glyphButton(`Delete ${take.name || "take"}`, ICON_X, () => deleteTake(take.id));
    row.append(name, meta, play, file, del);
    list.append(row);
  }
}

function downloadTake(take) {
  const blob = new Blob([JSON.stringify(take, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = String(take.name || "take")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "take";
  a.href = url;
  a.download = `flute-${slug}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function persistTake(take) {
  const all = loadTakes();
  all.unshift(take);
  storeTakes(all.slice(0, 40));
  renderTakes();
}

function pendingFromInput() {
  if (!pendingTake) return null;
  const name = $("take-name").value.trim() || pendingTake.name || nextTakeName();
  return { ...pendingTake, name };
}

function slim(note) {
  return {
    pitch: note.pitch || "",
    covers: note.pitch && PITCHES[note.pitch] ? PITCHES[note.pitch].covers : null,
    drone: Boolean(note.drone),
    t: Math.round(note.t * 1000) / 1000,
    d: Math.round(Math.max(0, note.d) * 1000) / 1000,
  };
}

function pushRecord(note) {
  let t = note.t - recordOriginBeat;
  let d = note.d;
  if (t < 0) {
    d += t;
    t = 0;
  }
  if ((d * 60) / (recordBpm || freeBpm) < 0.05) return;
  recordNotes.push(slim({ ...note, t, d }));
}

function closeFreeLive(nowBeat) {
  if (!freeLive) return;
  const note = freeLive;
  freeLive = null;
  note.d = nowBeat - note.t;
  if ((note.d * 60) / freeBpm < 0.05) return;
  const saved = slim(note);
  if (freeState !== "replay" && freeState !== "review") freeNotes.push(saved);
  if (freeState === "recording") pushRecord(note);
}

function openFreeLive(at, det) {
  freeLive = {
    key: det.key,
    pitch: det.pitch,
    covers: det.covers,
    drone: det.drone,
    t: at,
    d: 0,
  };
}

function detectedEvent() {
  const covers = playerCovers();
  const drone = Boolean(playerDrone());
  let pitch = "";
  if (micOn && micLabel) pitch = micLabel;
  else if (!micOn && covers != null) pitch = LANES[covers] || "";
  if (!pitch && !drone) return null;
  const info = pitch ? PITCHES[pitch] : null;
  const key = earFollowsPitch() ? pitch || "drone" : `${pitch}|${drone ? 1 : 0}`;
  return {
    key,
    pitch,
    covers: info ? info.covers : null,
    drone,
  };
}

function followFlute(beat) {
  if (freeState === "replay" || freeState === "review") return;
  const det = detectedEvent();
  const key = det ? det.key : "";
  if (!freeHold || freeHold.key !== key) freeHold = { key, at: audioCtx.currentTime, det };
  const liveKey = freeLive ? freeLive.key : "";
  if (key === liveKey) {
    if (!freeLive) return;
    if (earFollowsPitch() && Boolean(freeLive.drone) !== Boolean(det && det.drone)) {
      closeFreeLive(beat);
      if (det) openFreeLive(beat, det);
    } else freeLive.d = beat - freeLive.t;
    return;
  }
  if (audioCtx.currentTime - freeHold.at >= 0.07) {
    const at = beat - (0.07 * freeBpm) / 60;
    closeFreeLive(freeLive ? Math.max(freeLive.t, at) : at);
    if (freeHold.det) openFreeLive(at, freeHold.det);
  }
  const keep = beat - (FREE_LOOK + 4);
  if (freeNotes.length > 80) freeNotes = freeNotes.filter((n) => n.t + n.d >= keep);
}

function stopPreview() {
  const src = trackPreview;
  trackPreview = null;
  if (!src) return;
  try { src.onended = null; } catch { /* already gone */ }
  try { src.stop(); } catch { /* already stopped */ }
  try { src.disconnect(); } catch { /* already gone */ }
}

function stopTrack() {
  stopPreview();
  const src = trackSource;
  trackSource = null;
  trackPlaying = false;
  if (!src) return;
  try { src.onended = null; } catch { /* already gone */ }
  try { src.stop(); } catch { /* already stopped */ }
  try { src.disconnect(); } catch { /* already gone */ }
}

function startTrackAt(when, offsetSec = 0) {
  if (!trackBuffer || !audioCtx) return;
  ensureTrackBus();
  stopTrack();
  const offset = Math.max(0, offsetSec);
  if (offset >= trackBuffer.duration - 0.02) return;
  const src = audioCtx.createBufferSource();
  src.buffer = trackBuffer;
  src.connect(trackGain);
  src.onended = () => {
    if (trackSource !== src) return;
    trackSource = null;
    trackPlaying = false;
  };
  const t = Math.max(when, audioCtx.currentTime);
  src.start(t, offset);
  trackSource = src;
  trackPlaying = true;
  const beatAt = ((t - freeOrigin) * freeBpm) / 60;
  trackStartBeat = beatAt - (offset * freeBpm) / 60;
}

function cueReplayTrack() {
  if (!audioCtx || replayTrackOffset == null || !trackBuffer) {
    stopTrack();
    return;
  }
  startTrackAt(freeOrigin, replayTrackOffset);
}

function takeTrackOffset() {
  if (!trackBuffer || trackStartBeat == null) return null;
  const offset = ((recordOriginBeat - trackStartBeat) * 60) / (recordBpm || freeBpm);
  if (!(offset >= -0.05 && offset < trackBuffer.duration - 0.05)) return null;
  return Math.round(Math.max(0, offset) * 1000) / 1000;
}

function recordedTake(name) {
  const take = {
    id: uid(),
    name: name || nextTakeName(),
    bpm: recordBpm,
    created: Date.now(),
    notes: recordNotes.map((n) => ({ ...n })),
  };
  if (recordTrackAt != null && trackName) {
    take.track = trackName;
    take.trackAt = recordTrackAt;
  }
  return take;
}

function beginReplay(notes, bpm, id, name, trackOffset) {
  replayNotes = notes || [];
  replayId = id || "";
  replayName = name || "";
  replayTrackOffset = Number.isFinite(trackOffset) ? trackOffset : null;
  freeNotes = [];
  freeLive = null;
  freeHold = null;
  freeBpm = bpm || preferredBpm;
  $("bpm-value").textContent = String(freeBpm);
  if (audioCtx) {
    freeOrigin = audioCtx.currentTime;
    nextClickBeat = 0;
    cueReplayTrack();
  }
  renderTakes();
}

function endReplay() {
  stopTrack();
  trackStartBeat = null;
  replayNotes = null;
  replayId = "";
  replayName = "";
  replayTrackOffset = null;
  pendingTake = null;
  freeNotes = [];
  freeLive = null;
  freeHold = null;
  hideSave();
  freeState = "live";
  setFreeBpm(preferredBpm, true);
  renderTakes();
}

function playSaved(id) {
  if (freeState === "review" && pendingTake) {
    const take = pendingFromInput();
    if (take) persistTake(take);
    pendingTake = null;
    hideSave();
  }
  if (replayId === id && freeState === "replay") {
    endReplay();
    return;
  }
  const take = loadTakes().find((item) => item.id === id);
  if (!take) return;
  freeState = "replay";
  const sameTrack = take.track && take.track === trackName && Number.isFinite(take.trackAt);
  beginReplay(take.notes, take.bpm || preferredBpm, take.id, take.name, sameTrack ? take.trackAt : null);
}

function deleteTake(id) {
  storeTakes(loadTakes().filter((take) => take.id !== id));
  if (replayId === id) endReplay();
  else renderTakes();
}

function commitPending() {
  const take = pendingFromInput();
  if (!take || !take.notes?.length) {
    endReplay();
    return;
  }
  persistTake(take);
  pendingTake = null;
  endReplay();
}

function stopRecording() {
  closeFreeLive(freeBeat());
  if (!recordNotes.length) {
    freeState = "live";
    freeNotice = "Nothing landed.";
    freeNoticeUntil = performance.now() + 2600;
    return;
  }
  pendingTake = recordedTake(nextTakeName());
  $("take-name").value = pendingTake.name;
  $("save-bar").classList.remove("hidden");
  freeState = "review";
  beginReplay(pendingTake.notes, pendingTake.bpm, "", pendingTake.name, pendingTake.trackAt);
  $("take-name").focus();
}

function cancelCountIn() {
  const rebased = countInRebased;
  countInRebased = false;
  countInMode = "";
  if (rebased) {
    stopTrack();
    trackStartBeat = null;
  }
  freeState = "live";
  if (rebased && audioCtx) {
    freeOrigin = audioCtx.currentTime;
    nextClickBeat = 0;
  }
}

function beginAlignedStart(mode) {
  ensureAudio();
  audioCtx.resume();
  const beats = freeBeats;
  const startWhen = audioCtx.currentTime + (beats * 60) / freeBpm;
  freeOrigin = startWhen;
  nextClickBeat = -beats;
  freeNotes = [];
  freeLive = null;
  freeHold = null;
  countInEnd = 0;
  countInRebased = true;
  countInMode = mode === "record" ? "record" : "play";
  recordTrackAt = null;
  freeState = "countin";
  if (trackBuffer) startTrackAt(startWhen, 0);
}

function enterRecording(originBeat) {
  recordOriginBeat = originBeat;
  recordBpm = freeBpm;
  recordNotes = [];
  recordTrackAt = takeTrackOffset();
  freeState = "recording";
}

function onTrackPlay() {
  if (!trackBuffer) return;
  if (freeState === "recording" || freeState === "countin" || freeState === "review") return;
  if (trackPlaying || trackPreview) {
    stopTrack();
    if ($("free-settings").open) paintTrackCard();
    return;
  }
  if (freeState === "replay") {
    if (audioCtx) {
      freeOrigin = audioCtx.currentTime;
      nextClickBeat = 0;
      cueReplayTrack();
    }
    return;
  }
  beginAlignedStart("play");
}

function resetFree() {
  if (freeState === "recording" || freeState === "review") return;
  if (freeState === "replay") {
    if (!audioCtx) return;
    freeOrigin = audioCtx.currentTime;
    nextClickBeat = 0;
    cueReplayTrack();
    return;
  }
  stopTrack();
  trackStartBeat = null;
  freeNotes = [];
  freeLive = null;
  freeHold = null;
  countInMode = "";
  countInRebased = false;
  freeState = "live";
  if (audioCtx) {
    freeOrigin = audioCtx.currentTime;
    nextClickBeat = 0;
  }
}

function onRecord() {
  if (freeState === "review") return;
  if (freeState === "countin") {
    cancelCountIn();
    return;
  }
  if (freeState === "recording") {
    stopRecording();
    return;
  }
  if (freeState === "replay") {
    endReplay();
    return;
  }
  if (trackBuffer && !trackPlaying) {
    beginAlignedStart("record");
    return;
  }
  const beat = freeBeat();
  const m = freeBeats;
  let bar = Math.ceil(beat / m) * m;
  if (bar - beat < 0.05) bar += m;
  if (bar - beat < m - 0.5) bar += m;
  countInEnd = bar;
  countInMode = "record";
  countInRebased = false;
  recordTrackAt = null;
  freeState = "countin";
}

function leaveFree(screen = "screen-map") {
  if (freeState === "recording") {
    closeFreeLive(freeBeat());
    if (recordNotes.length) persistTake(recordedTake(nextTakeName()));
  } else if (pendingTake) {
    const take = pendingFromInput();
    if (take) persistTake(take);
  }
  freeRunning = false;
  cancelAnimationFrame(freeRaf);
  pendingTake = null;
  replayNotes = null;
  replayId = "";
  replayName = "";
  freeState = "live";
  freeBpm = preferredBpm;
  hideSave();
  stopTrack();
  trackStartBeat = null;
  replayTrackOffset = null;
  closeFreeSettings();
  showScreen(screen);
}

async function startFree() {
  if (freeRunning) return;
  ensureAudio();
  keepAwake();
  freeRunning = true;
  freeState = "live";
  pendingTake = null;
  replayNotes = null;
  replayId = "";
  replayName = "";
  freeNotes = [];
  freeLive = null;
  freeHold = null;
  recordNotes = [];
  freeBpm = preferredBpm;
  freeOrigin = audioCtx.currentTime;
  nextClickBeat = 0;
  hideSave();
  showScreen("screen-free");
  setMetroButton();
  $("bpm-value").textContent = String(freeBpm);
  renderTakes();
  if (!trackBuffer && !trackLoading) restoreBacking();
  cancelAnimationFrame(freeRaf);
  freeRaf = requestAnimationFrame(freeFrame);
  audioCtx.resume();
  const ok = await startMic(true);
  if (!ok && !micOn && !micError) sayMic("The microphone stayed closed. Allow it when the browser asks.");
}

function setMetroButton() {
  const btn = $("free-metro");
  btn.classList.toggle("on", metroOn);
  btn.setAttribute("aria-pressed", metroOn ? "true" : "false");
  btn.setAttribute("aria-label", metroOn ? "Metronome on" : "Metronome off");
}

function metroClick(when, accent) {
  if (!audioCtx || !master || metroLevel <= 0) return;
  const level = metroLevel / 100;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = accent ? 1760 : 1175;
  osc.connect(g);
  g.connect(master);
  const t = Math.max(when, audioCtx.currentTime);
  const peak = (accent ? 0.48 : 0.32) * level;
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.start(t);
  osc.stop(t + 0.06);
}

function serviceMetro() {
  if (!metroOn || !audioCtx) return;
  const beat = freeBeat();
  if (nextClickBeat < beat - 1) nextClickBeat = Math.ceil(beat);
  const horizon = beat + 0.75;
  let guard = 0;
  while (nextClickBeat <= horizon && guard < 8) {
    const when = freeOrigin + (nextClickBeat * 60) / freeBpm;
    if (when >= audioCtx.currentTime - 0.01) metroClick(when, nextClickBeat % freeBeats === 0);
    nextClickBeat += 1;
    guard += 1;
  }
}

function barBeat(beat) {
  const m = freeBeats;
  const n = Math.floor(Number.isFinite(beat) ? beat : 0);
  return ((n % m) + m) % m + 1;
}

function freeNoteLine() {
  const covers = playerCovers();
  const id = micOn && micLabel ? micLabel : covers == null ? "" : LANES[covers] || "";
  if (id) return { text: shownNote(id), hot: true };
  if (freeNotice && performance.now() < freeNoticeUntil && freeState === "live") return { text: freeNotice, warn: true };
  return { text: "" };
}

function paintFreeChrome(beat) {
  const title = $("free-title");
  const blurb = $("free-blurb");
  const n = barBeat(beat);
  const count = $("free-count");
  if (count.textContent !== String(n)) count.textContent = String(n);
  count.classList.toggle("down", n === 1);
  const drone = playerDrone();
  const note = freeNoteLine();
  const chip = $("free-note");
  chip.textContent = note.text;
  chip.classList.toggle("on", Boolean(note.hot));
  chip.classList.toggle("warn", Boolean(note.warn));
  chip.classList.toggle("drone", Boolean(note.hot && drone));
  chip.classList.toggle("rainbow", droneLook === "rainbow");
  const locked = tempoLocked();
  $("bpm-down").disabled = locked;
  $("bpm-up").disabled = locked;
  const play = $("free-play");
  const trackOn = trackPlaying || Boolean(trackPreview);
  play.classList.toggle("hidden", !trackBuffer);
  play.classList.toggle("is-on", trackOn);
  play.disabled = !trackPreview && (freeState === "recording" || freeState === "countin" || freeState === "review" || (freeState === "replay" && replayTrackOffset == null));
  play.setAttribute("aria-label", trackOn ? "Stop track" : trackName ? `Play ${trackName}` : "Play track");
  $("free-reset").disabled = freeState === "recording" || freeState === "review";
  const rec = $("free-record");
  rec.classList.toggle("hidden", freeState === "review");
  rec.classList.toggle("on", freeState === "countin");
  rec.classList.toggle("hot", freeState === "recording");
  const stopping = freeState === "recording" || freeState === "replay";
  rec.dataset.state = stopping ? "stop" : freeState === "countin" ? "cancel" : "record";
  rec.setAttribute("aria-label", stopping ? "Stop" : freeState === "countin" ? "Cancel" : "Record");
  title.classList.toggle("rec", freeState === "recording");
  if (freeState === "countin") {
    title.textContent = "Free Play";
    blurb.textContent = "Starts on 1.";
  } else if (freeState === "recording") {
    const recBeat = Math.max(0, beat - recordOriginBeat);
    title.textContent = "Recording";
    blurb.textContent = `Bar ${Math.floor(recBeat / freeBeats) + 1}`;
  } else if (freeState === "review") {
    title.textContent = "Keep this take?";
    blurb.textContent = "";
  } else if (freeState === "replay") {
    title.textContent = replayName || "Free Play";
    blurb.textContent = "";
  } else {
    title.textContent = "Free Play";
    blurb.textContent = "";
  }
  blurb.classList.toggle("hidden", !blurb.textContent);
  if ($("free-settings").open) {
    const busy = freeState === "recording" || freeState === "countin";
    $("free-meter").disabled = locked;
    $("free-tap").disabled = locked;
    $("track-pick").disabled = busy || trackLoading;
    $("track-file").disabled = busy || trackLoading;
    $("track-file").closest("label").classList.toggle("is-off", busy || trackLoading);
    $("track-clear").disabled = !trackBuffer || busy || trackLoading;
    const preview = $("track-preview");
    preview.disabled = !trackBuffer || busy || trackLoading;
    preview.textContent = trackPreview || trackPlaying ? "Stop" : "Play";
  }
}

function xPast(time, now, hitX, width) {
  const endX = width * 0.94;
  return hitX + ((now - time) / FREE_LOOK) * (endX - hitX);
}

function expandEvent(ev) {
  const out = [];
  if (!ev || !(ev.d > 0)) return out;
  if (ev.drone) out.push({ kind: "drone", t: ev.t, d: ev.d });
  if (ev.pitch && PITCHES[ev.pitch]) out.push({ kind: "melody", covers: PITCHES[ev.pitch].covers, t: ev.t, d: ev.d });
  return out;
}

function eventsOnChart(beat) {
  if (freeState === "replay" || freeState === "review") return replayNotes || [];
  const list = freeNotes.slice();
  if (freeLive) list.push({ ...freeLive, d: Math.max(freeLive.d, beat - freeLive.t, 0.03) });
  return list;
}

function drawFree(beat) {
  const w = freeCanvas.width;
  const h = freeCanvas.height;
  freeCtx.clearRect(0, 0, w, h);
  const column = fluteColumn(freeCanvas, "free-flute");
  const tracks = allTracks().map((lane) => ({ lane, ...laneAnchor(lane, column, "free-flute") }));
  const endX = w * 0.94;
  for (const t of tracks) {
    freeCtx.strokeStyle = laneColor(t.lane, 0.55);
    freeCtx.lineWidth = Math.max(2, t.r * 0.16);
    freeCtx.beginPath();
    freeCtx.moveTo(t.x, t.y);
    freeCtx.lineTo(endX, t.y);
    freeCtx.stroke();
  }
  const first = Math.floor(beat - FREE_LOOK);
  const last = Math.ceil(beat);
  freeCtx.lineWidth = 1;
  freeCtx.textAlign = "center";
  freeCtx.textBaseline = "bottom";
  freeCtx.font = `600 ${Math.max(11, w * 0.012)}px ui-sans-serif, system-ui, sans-serif`;
  for (let b = first; b <= last; b++) {
    const x = xPast(b, beat, column.hitX, w);
    if (x < column.hitX || x > endX) continue;
    for (const t of tracks) {
      freeCtx.strokeStyle = b % freeBeats === 0 ? "rgba(255,246,228,0.2)" : "rgba(255,246,228,0.07)";
      freeCtx.beginPath();
      freeCtx.moveTo(x, t.y - t.r * 0.35);
      freeCtx.lineTo(x, t.y + t.r * 0.35);
      freeCtx.stroke();
    }
    if (b >= 0 && b % freeBeats === 0) {
      freeCtx.fillStyle = "rgba(246,234,212,0.45)";
      freeCtx.fillText(String(b / freeBeats + 1), x, Math.max(16, tracks[0].y - tracks[0].r - 6));
    }
  }
  const idle = { melody: null, drone: false, active: false };
  for (const ev of eventsOnChart(beat)) {
    for (const note of expandEvent(ev)) {
      if (note.t > beat || note.t + note.d < beat - FREE_LOOK - 0.5) continue;
      for (const lane of noteLanes(note)) {
        const a = laneAnchor(lane, column, "free-flute");
        const xNewer = xPast(note.t + note.d, beat, a.x, w);
        const xOlder = xPast(note.t, beat, a.x, w);
        const left = Math.max(Math.min(xNewer, xOlder), a.x);
        const right = Math.min(Math.max(xNewer, xOlder), endX + 8);
        if (right - left < 1 && (xOlder < a.x || xOlder > endX + 30)) continue;
        const rainbow = note.kind === "drone" && droneLook === "rainbow";
        const color = rainbow ? droneInk(left, right, a.y, freeCtx) : laneColor(lane, 0.9);
        const thick = Math.max(7, a.r * (note.kind === "drone" ? 0.62 : 0.42));
        freeCtx.save();
        freeCtx.shadowColor = rainbow ? "#ffffff" : laneColor(lane, 1);
        freeCtx.shadowBlur = 16;
        freeCtx.fillStyle = color;
        roundRect(left, a.y - thick / 2, Math.max(0, right - left), thick, thick / 2, freeCtx);
        freeCtx.fill();
        freeCtx.restore();
        if (xOlder < a.x || xOlder > endX + 20) continue;
        const radius = a.r * (note.kind === "drone" ? 1.05 : 0.92);
        const head = rainbow ? droneInk(xOlder - radius, xOlder + radius, a.y, freeCtx) : note.kind === "drone" ? "#ffcc66" : laneColor(lane, 1);
        freeCtx.save();
        freeCtx.shadowColor = rainbow ? "#ffffff" : head;
        freeCtx.shadowBlur = 22;
        freeCtx.fillStyle = head;
        freeCtx.beginPath();
        freeCtx.arc(xOlder, a.y, radius, 0, Math.PI * 2);
        freeCtx.fill();
        freeCtx.shadowBlur = 0;
        freeCtx.fillStyle = "#1a120c";
        freeCtx.beginPath();
        freeCtx.arc(xOlder, a.y, radius * 0.28, 0, Math.PI * 2);
        freeCtx.fill();
        freeCtx.restore();
      }
    }
  }
  const coversNow = playerCovers();
  const droneYou = playerDrone();
  for (const t of tracks) {
    const mark = laneMark(t.lane, coversNow, droneYou, idle);
    const on = mark !== "off";
    freeCtx.beginPath();
    freeCtx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    freeCtx.lineWidth = Math.max(3, t.r * (on ? 0.22 : 0.12));
    if (on && t.lane === DRONE_LANE) freeCtx.fillStyle = droneInk(t.x - t.r, t.x + t.r, t.y, freeCtx);
    else if (on) freeCtx.fillStyle = laneColor(t.lane, 1);
    else freeCtx.fillStyle = "rgba(9, 8, 7, 0.92)";
    freeCtx.fill();
    freeCtx.strokeStyle = on ? "#fff6e4" : laneColor(t.lane, 0.4);
    freeCtx.stroke();
    freeCtx.beginPath();
    freeCtx.arc(t.x, t.y, Math.max(3, t.r * (on ? 0.26 : 0.16)), 0, Math.PI * 2);
    freeCtx.fillStyle = on ? "#1a120c" : "rgba(246, 234, 212, 0.28)";
    freeCtx.fill();
  }
  freeCtx.textAlign = "right";
  freeCtx.textBaseline = "middle";
  freeCtx.font = `600 ${Math.max(12, w * 0.013)}px ui-sans-serif, system-ui, sans-serif`;
  for (const t of tracks) {
    const label = t.lane === DRONE_LANE ? "Drone" : t.lane === OPEN_LANE ? "Mouth" : String(t.lane + 1);
    const mark = laneMark(t.lane, coversNow, droneYou, idle);
    freeCtx.fillStyle = mark === "off" ? "rgba(246,234,212,0.4)" : t.lane === DRONE_LANE ? "#ffcc66" : laneColor(t.lane, 1);
    freeCtx.fillText(label, w * 0.985, t.y);
  }
}

function freeFrame() {
  if (!freeRunning) return;
  if (freeCanvas.width < 10) resize();
  const beat = freeBeat();
  if (freeState === "countin" && beat >= countInEnd) {
    const mode = countInMode;
    countInMode = "";
    countInRebased = false;
    if (mode === "play") freeState = "live";
    else enterRecording(countInEnd);
  }
  followFlute(beat);
  serviceMetro();
  paintFreeChrome(beat);
  const covers = playerCovers();
  paintFlute($("free-flute"), covers, covers, playerDrone());
  drawFree(beat);
  if ((freeState === "replay" || freeState === "review") && replayNotes) {
    const end = replayNotes.reduce((m, n) => Math.max(m, n.t + n.d), 0);
    if (beat > Math.max(end, 1) + 2) {
      if (freeState === "review") {
        freeOrigin = audioCtx.currentTime;
        nextClickBeat = 0;
        cueReplayTrack();
      } else endReplay();
    }
  }
  if (freeRunning) freeRaf = requestAnimationFrame(freeFrame);
}

let albumIndex = 0;

function turnAlbum(delta) {
  const next = albumIndex + delta;
  if (next < 0 || next >= ALBUMS.length) return;
  albumIndex = next;
  paintAlbum();
}

function paintAlbum() {
  const album = ALBUMS[albumIndex];
  $("story-bars").replaceChildren(
    ...ALBUMS.map((item, i) => {
      const bar = document.createElement("button");
      bar.type = "button";
      bar.className = i < albumIndex ? "done" : i === albumIndex ? "on" : "";
      bar.setAttribute("aria-label", item.title);
      bar.addEventListener("click", () => {
        albumIndex = i;
        paintAlbum();
      });
      return bar;
    }),
  );
  const frame = $("story-frame");
  frame.className = `story-frame ${album.wash}`;
  const kicker = document.createElement("p");
  kicker.className = "eyebrow";
  kicker.textContent = `${String(albumIndex + 1).padStart(2, "0")}  /  0${ALBUMS.length}`;
  const heading = document.createElement("h2");
  heading.className = "story-title";
  heading.textContent = album.title;
  const line = document.createElement("p");
  line.className = "story-line";
  line.textContent = album.line;
  const list = document.createElement("div");
  list.className = "story-songs";
  for (const id of album.songs) {
    const tune = SONGS.find((song) => song.id === id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "story-song";
    const copy = document.createElement("span");
    const title = document.createElement("b");
    title.textContent = tune.title;
    const blurb = document.createElement("small");
    blurb.textContent = tune.blurb;
    copy.append(title, blurb);
    const level = document.createElement("em");
    level.textContent = tune.level;
    btn.append(copy, level);
    btn.addEventListener("click", () => startSong(tune.id));
    list.append(btn);
  }
  frame.replaceChildren(kicker, heading, line, list);
  $("story-prev").disabled = albumIndex === 0;
  $("story-next").disabled = albumIndex === ALBUMS.length - 1;
}

let titleCovers = 0;
function tickTitle() {
  titleCovers = (titleCovers + 1) % 7;
  const drone = titleCovers === 6 || titleCovers === 0;
  paintFlute($("title-flute"), titleCovers, titleCovers, drone);
}

window.addEventListener("keydown", (e) => {
  if (e.target?.closest?.("input, textarea")) return;
  if ($("free-settings").open) {
    if (e.code === "Escape") {
      e.preventDefault();
      closeFreeSettings();
    }
    return;
  }
  if ($("menu-panel").open) {
    if (e.code === "Escape") {
      e.preventDefault();
      if (menuPage === "root") closeMenu();
      else showMenu(menuParent[menuPage] || "root");
    }
    return;
  }
  if ((e.code === "ArrowLeft" || e.code === "ArrowRight") && !$("screen-select").classList.contains("hidden")) {
    e.preventDefault();
    turnAlbum(e.code === "ArrowRight" ? 1 : -1);
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    if (e.repeat) return;
    droneHeld = true;
    if (audioCtx && !micOn) blip(currentFlute().drone, undefined, 0.06, 0.14, master);
    return;
  }
  const cover = codeToCover(e.code);
  if (cover == null) {
    if (e.code === "Escape") {
      if (freeRunning) leaveFree();
      else if (tutorialOn) {
        leaveTutorial();
        showScreen("screen-map");
      }       else if (song) stopSong();
      else if (!$("screen-tune").classList.contains("hidden")) closeTune();
      else if (!$("screen-flutes").classList.contains("hidden")) showScreen("screen-map");
      else if (!$("screen-select").classList.contains("hidden")) showScreen("screen-map");
    }
    return;
  }
  e.preventDefault();
  if (e.repeat) return;
  down.set(cover, performance.now());
  if (audioCtx && !micOn) blip(freqForCover(cover), undefined, 0.08, 0.16, master);
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    droneHeld = false;
    return;
  }
  const cover = codeToCover(e.code);
  if (cover == null) return;
  if (down.get(cover)) down.delete(cover);
});

$("back").addEventListener("click", () => stopSong("screen-map"));
$("results-songs").addEventListener("click", () => stopSong("screen-select"));
$("again").addEventListener("click", () => song && startSong(song.id));
$("restart").addEventListener("click", () => song && startSong(song.id));
function setPauseButton(isPaused) {
  const btn = $("pause");
  btn.classList.toggle("is-paused", isPaused);
  btn.setAttribute("aria-label", isPaused ? "Play" : "Pause");
}

$("pause").addEventListener("click", async () => {
  if (!audioCtx || !song) return;
  if (!paused) {
    pauseBeat = songBeat();
    paused = true;
    await audioCtx.suspend();
    setPauseButton(true);
  } else {
    paused = false;
    startAt = audioCtx.currentTime - (pauseBeat * 60) / song.bpm;
    await audioCtx.resume();
    setPauseButton(false);
  }
});
function setMicButton(on) {
  for (const id of ["mic", "free-mic", "tutorial-mic", "tune-mic"]) {
    const btn = $(id);
    if (!btn) continue;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Microphone on" : "Use the flute");
  }
}

function setGuideButton(on) {
  const btn = $("guide");
  btn.classList.toggle("on", on);
  btn.classList.toggle("is-muted", !on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.setAttribute("aria-label", on ? "Sound on" : "Sound off");
}

$("guide").addEventListener("click", () => {
  guideOn = !guideOn;
  setGuideButton(guideOn);
  if (guideBus) guideBus.gain.value = guideOn ? 0.2 : 0;
});
for (const id of ["mic", "free-mic", "tutorial-mic", "tune-mic"]) {
  $(id).addEventListener("click", (event) => {
    if (!eatMicClick) return;
    eatMicClick = false;
    event.stopImmediatePropagation();
  }, true);
  $(id).addEventListener("click", () => toggleMic());
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && (song || micOn || freeRunning || tutorialOn || tuneOn)) keepAwake();
});
window.addEventListener("resize", resize);

mountHoles($("title-flute"));
mountHoles($("play-flute"));
mountHoles($("free-flute"));
mountHoles($("tutorial-flute"));
mountHoles($("tune-flute"));
paintFlute($("title-flute"), 0, 0, false);
paintAlbum();
function buildLabel() {
  const src = document.currentScript?.src || "";
  try {
    return new URL(src, location.href).searchParams.get("v") || "?";
  } catch {
    return "?";
  }
}

const PAGES_URL = "https://kickiniteasy.github.io/flute-hero/";
const menuParent = { settings: "root", detection: "settings", microphone: "settings", developer: "settings" };
const menuTitle = { root: "Flute Hero", settings: "Settings", detection: "Note detection", microphone: "Microphone", developer: "Developer" };
let menuPage = "root";
let micWatch = 0;

function placeKind() {
  const ua = navigator.userAgent || "";
  const iPhone = /iPhone/.test(ua);
  const iPad = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const iOS = iPhone || iPad || /iPod/.test(ua);
  const android = /Android/i.test(ua);
  const mobile = iOS || android || /Mobile/i.test(ua);
  let browser = "This browser";
  if (/Edg\/|EdgiOS/.test(ua)) browser = "Edge";
  else if (/CriOS|Chrome\//.test(ua)) browser = "Chrome";
  else if (/FxiOS|Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";
  const host = location.hostname;
  const local = host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".local") || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
  return {
    iOS,
    mobile,
    browser,
    safari: browser === "Safari",
    host: location.host,
    local,
    github: host.endsWith("github.io"),
    https: location.protocol === "https:",
    secure: window.isSecureContext,
  };
}

function deviceLabel(place) {
  if (/iPhone/.test(navigator.userAgent || "")) return "iPhone";
  if (place.iOS) return "iPad";
  if (/Android/i.test(navigator.userAgent || "")) return "Android";
  if (place.mobile) return "Phone";
  return "Computer";
}

function addressLabel(place) {
  if (!place.https && place.secure) return "http on this computer, treated as safe";
  if (!place.https) return place.local ? "http, on this computer" : "http";
  if (place.github) return "https, on GitHub";
  if (place.local) return "https, on this computer";
  return "https";
}

function permissionLabel() {
  if (micOn) return "On";
  if (micPermission === "granted") return "Allowed, currently off";
  if (micPermission === "denied") return "Blocked";
  if (micPermission === "missing") return "No microphone found";
  if (micPermission === "busy") return "In use by something else";
  if (micPermission === "insecure") return "Closed on this address";
  if (micPermission === "unsupported") return "This browser cannot ask";
  return "Not asked yet";
}

function micFix(place) {
  const browser = place.iOS && place.safari ? "Mobile Safari" : place.browser;
  const where = `${deviceLabel(place)}, ${browser}. The address is ${addressLabel(place)} (${place.host}).`;
  if (micPermission === "unsupported") {
    return `${where} This browser has no microphone for a web page. That cannot be fixed here. Open ${PAGES_URL} in Safari or Chrome.`;
  }
  if (!place.secure || micPermission === "insecure") {
    const local = place.local
      ? " A local https page works only after this device trusts its certificate. If the browser says the connection is not private, the microphone stays closed."
      : "";
    return `${where} The microphone stays closed because this is not a trusted https page. That cannot be fixed on this address. Open ${PAGES_URL} instead.${local}`;
  }
  if (micOn) {
    return `${where} The microphone is on. Play a note. The bar should rise, and a note name should appear when the pitch is loud enough.`;
  }
  if (micPermission === "missing") {
    return `${where} The page may ask, but no microphone was found. On a computer, plug one in and choose it as the input. On a phone, leave this page and come back, then tap Ask again.`;
  }
  if (micPermission === "busy") {
    return `${where} Another app is holding the microphone. Close other recording apps, then tap Ask again.`;
  }
  if (micPermission === "denied") {
    if (place.iOS && place.safari) {
      return `${where} Safari blocked this site. Tap Ask again. If no prompt appears, it was already denied. Tap the page menu on the left of the address bar, then More, then Website Settings, and set Microphone to Ask. Also set Settings → Apps → Safari → Microphone to Ask, not Deny. Then tap Ask again.`;
    }
    if (place.iOS) {
      return `${where} This is not Safari. Open Settings → Apps → ${place.browser} and turn Microphone on, then tap Ask again. If it still stays closed, open ${PAGES_URL} in Safari.`;
    }
    if (place.safari) {
      return `${where} Safari blocked this site. Tap Ask again. If no prompt appears, open Safari → Settings → Websites → Microphone and set this site to Allow.`;
    }
    if (place.browser === "Chrome") {
      return `${where} Chrome blocked this site. Tap the lock or controls icon in the address bar, set Microphone to Allow, then tap Ask again.`;
    }
    return `${where} The browser blocked this site. Tap Ask again and choose Allow. If no prompt appears, allow the microphone for this site in the browser's site settings, then tap Ask again.`;
  }
  if (micPermission === "granted") {
    return `${where} The microphone is allowed, and it is off. Tap Ask again to turn it on.`;
  }
  if (place.iOS && place.safari && place.local) {
    return `${where} Tap Ask again and choose Allow. This local address works only if the phone already trusts its certificate. If the prompt never comes, use ${PAGES_URL}.`;
  }
  if (place.iOS && !place.safari) {
    return `${where} Tap Ask again. ${place.browser} on an iPhone also needs Settings → Apps → ${place.browser} → Microphone on. The sure path is ${PAGES_URL} in Safari.`;
  }
  return `${where} Tap Ask again and choose Allow. The browser should ask once, then remember this site.`;
}

function paintMicFacts() {
  const place = placeKind();
  const rows = [
    ["Device", deviceLabel(place)],
    ["Browser", place.iOS && place.safari ? "Mobile Safari" : place.browser],
    ["Address", addressLabel(place)],
    ["Microphone", permissionLabel()],
  ];
  $("mic-facts").replaceChildren(
    ...rows.map(([name, value]) => {
      const row = document.createElement("div");
      row.className = "mic-fact";
      const dt = document.createElement("dt");
      dt.textContent = name;
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }),
  );
  $("mic-fix").textContent = micFix(place);
}

function paintMicTest() {
  if (!micOn) {
    $("mic-test-state").textContent = "Off";
    $("mic-test-note").textContent = "The microphone is off, so there is nothing to hear yet.";
    $("mic-meter-bar").style.width = "0%";
    return;
  }
  const level = Math.max(0, Math.min(1, micEnergy / 0.12));
  $("mic-test-state").textContent = micLabel ? `On · ${shownNote(micLabel)}` : "On · quiet";
  $("mic-test-note").textContent = micDetail || "Listening";
  $("mic-meter-bar").style.width = `${Math.round(level * 100)}%`;
}

function watchMic() {
  cancelAnimationFrame(micWatch);
  const tick = () => {
    if (!$("menu-panel").open || menuPage !== "microphone") return;
    paintMicTest();
    micWatch = requestAnimationFrame(tick);
  };
  tick();
}

async function refreshMicPermission() {
  if (micOn) {
    micPermission = "granted";
    return;
  }
  if (!window.isSecureContext) {
    micPermission = navigator.mediaDevices?.getUserMedia ? "insecure" : "unsupported";
    return;
  }
  if (!navigator.permissions?.query) return;
  try {
    const status = await navigator.permissions.query({ name: "microphone" });
    if (status.state === "granted") micPermission = "granted";
    else if (status.state === "denied") micPermission = "denied";
    else if (micPermission === "denied" || micPermission === "granted") micPermission = "unknown";
  } catch {
    /* Safari does not report microphone permission this way. */
  }
}

function paintEar() {
  const ear = EARS[earId] || EARS.peaks;
  const flute = currentFlute();
  const line = $("ear-menu-line");
  if (line) line.textContent = `${ear.name}. ${ear.menu}`;
  document.querySelectorAll("[data-ear]").forEach((btn) => {
    const on = btn.dataset.ear === earId;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const img = $("ear-flute-img");
  if (img && img.getAttribute("src") !== flute.art) img.src = flute.art;
  const name = $("ear-flute-name");
  if (name) name.textContent = flute.title;
  const note = $("ear-flute-line");
  if (note) note.textContent = "In hand. The ears listen for this flute.";
}

function setEar(id) {
  if (!EARS[id] || id === earId) return;
  earId = id;
  try {
    localStorage.setItem(EAR_KEY, id);
  } catch {
    /* the browser can refuse storage */
  }
  resetEarHold();
  micCovers = null;
  micDrone = false;
  micLabel = "";
  if (micAnalyser) micAnalyser.smoothingTimeConstant = earSmoothing();
  paintEar();
}

function showMenu(page) {
  menuPage = page;
  for (const el of document.querySelectorAll("[data-menu]")) {
    el.classList.toggle("hidden", el.dataset.menu !== page);
  }
  const root = page === "root";
  $("menu-word").classList.toggle("hidden", !root);
  $("menu-heading").classList.toggle("hidden", root);
  $("menu-heading").textContent = menuTitle[page] || "Flute Hero";
  $("menu-panel").setAttribute("aria-labelledby", root ? "menu-word" : "menu-heading");
  $("menu-back").classList.toggle("hidden", root);
  if (page === "detection") paintEar();
  if (page === "microphone") {
    paintMicFacts();
    paintMicTest();
    watchMic();
    refreshMicPermission().then(() => {
      if (menuPage === "microphone") paintMicFacts();
    });
  }
}

function goSongs() {
  leaveTutorial();
  if (freeRunning) leaveFree("screen-select");
  else if (song) stopSong("screen-select");
  else showScreen("screen-select");
}

function goFlutes() {
  leaveTutorial();
  if (freeRunning) leaveFree();
  else if (song) stopSong();
  showScreen("screen-flutes");
}

function goTutorial() {
  if (freeRunning) leaveFree("screen-map");
  if (song) {
    cancelAnimationFrame(raf);
    setDrone(false);
    song = null;
    paused = false;
    $("screen-results").classList.add("hidden");
  }
  startTutorial();
}

function goFree() {
  leaveTutorial();
  if (freeRunning) return;
  if (song) {
    cancelAnimationFrame(raf);
    setDrone(false);
    song = null;
    paused = false;
  }
  $("screen-results").classList.add("hidden");
  startFree();
}

async function askMicAgain() {
  if (micOn) stopMic();
  await startMic(true);
  if (menuPage === "microphone") {
    paintMicFacts();
    paintMicTest();
  }
}

function setMenuOpen(open) {
  $("app-menu").setAttribute("aria-expanded", open ? "true" : "false");
}
function openMenu() {
  const panel = $("menu-panel");
  if (panel.open) return;
  showMenu("root");
  panel.showModal();
  setMenuOpen(true);
}
function closeMenu() {
  const panel = $("menu-panel");
  if (!panel.open) return;
  panel.close();
}
function toggleMenu() {
  if ($("menu-panel").open) closeMenu();
  else openMenu();
}
const version = buildLabel();
$("build-version").textContent = version === "?" ? "?" : `v${version}`;
$("menu-panel").addEventListener("close", () => setMenuOpen(false));
$("menu-close").addEventListener("click", closeMenu);
$("menu-back").addEventListener("click", () => showMenu(menuParent[menuPage] || "root"));
$("menu-body").addEventListener("click", (event) => {
  const ear = event.target.closest("[data-ear]");
  if (ear) {
    setEar(ear.dataset.ear);
    return;
  }
  const go = event.target.closest("[data-go]");
  if (!go) return;
  if (go.dataset.go === "tutorial") {
    closeMenu();
    goTutorial();
  } else if (go.dataset.go === "songs") {
    closeMenu();
    goSongs();
  } else if (go.dataset.go === "free") {
    closeMenu();
    goFree();
  } else if (go.dataset.go === "flutes") {
    closeMenu();
    goFlutes();
  } else showMenu(go.dataset.go);
});
$("mic-ask").addEventListener("click", () => askMicAgain());
$("app-menu").addEventListener("click", toggleMenu);
$("begin").addEventListener("click", () => showScreen("screen-map"));
$("pick-tutorial").addEventListener("click", () => goTutorial());
$("pick-songs").addEventListener("click", () => showScreen("screen-select"));
$("pick-flutes").addEventListener("click", () => showScreen("screen-flutes"));
$("pick-free").addEventListener("click", () => startFree());
$("select-back").addEventListener("click", () => showScreen("screen-map"));
$("flutes-back").addEventListener("click", () => showScreen("screen-map"));
$("tune-back").addEventListener("click", closeTune);
$("tune-next").addEventListener("click", advanceTune);
$("tune-prev").addEventListener("click", retreatTune);
$("tune-use").addEventListener("click", () => exportTune());
$("tune-chart-btn").addEventListener("click", restoreTuneChart);
$("tutorial-back").addEventListener("click", () => {
  leaveTutorial();
  showScreen("screen-map");
});
$("tutorial-next").addEventListener("click", () => {
  if (!tutorialOn) return;
  if (tutorialPhase === "done") {
    leaveTutorial();
    showScreen("screen-select");
    return;
  }
  advanceTutorial();
});

function paintDronePill() {
  const pill = $("drone-pill");
  if (pill) pill.textContent = `Drone · ${spellHz(currentFlute().drone).name}`;
}

function selectFlute(id) {
  if (!FLUTES[id] || id === fluteId) return;
  fluteId = id;
  try {
    localStorage.setItem(FLUTE_KEY, id);
  } catch {
    /* the browser can refuse storage */
  }
  tuneDroneVoice();
  applyFluteArt();
  paintFluteScreen();
  if (tuneOn) {
    tuneFluteId = fluteId;
    tuneTakes = [];
    tuneIndex = 0;
    tunePhase = "ask";
    tuneApplied = false;
    paintTuneAsk();
  }
}

function applyFluteArt() {
  const src = currentFlute().art;
  for (const id of ["title-flute", "play-flute", "free-flute", "tutorial-flute", "tune-flute"]) {
    const img = document.querySelector(`#${id} img`);
    if (img && img.getAttribute("src") !== src) img.src = src;
  }
}

function fluteFigure(name, src) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  const title = document.createElement("b");
  title.textContent = name;
  return { img, title };
}

function paintFluteScreen() {
  const flute = currentFlute();
  const hero = $("flute-in-hand");
  const img = document.createElement("img");
  img.src = flute.art;
  img.alt = "";
  const copy = document.createElement("div");
  const eye = document.createElement("p");
  eye.className = "eyebrow";
  eye.textContent = "In hand";
  const heading = document.createElement("h2");
  const sounding = spellHz(flute.drone).name;
  heading.textContent = sounding === flute.name ? flute.title : `${sounding} drone`;
  const line = document.createElement("p");
  line.textContent = flute.line;
  const tune = document.createElement("button");
  tune.id = "flute-tune-open";
  tune.type = "button";
  tune.className = "solid tune-open";
  tune.textContent = "Tune";
  tune.addEventListener("click", openTune);
  copy.append(eye, heading, line, tune);
  hero.replaceChildren(img, copy);

  const caseEl = $("flute-case");
  const picks = [];
  for (const other of Object.values(FLUTES)) {
    if (other.id === flute.id) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flute-pick";
    button.setAttribute("aria-label", `Choose ${other.name}`);
    const figure = fluteFigure(other.name, other.art);
    const state = document.createElement("span");
    state.textContent = "Choose";
    button.append(figure.img, figure.title, state);
    button.addEventListener("click", () => selectFlute(other.id));
    picks.push(button);
  }
  for (const shut of SHUT_FLUTES) {
    const article = document.createElement("article");
    const figure = fluteFigure(shut.name, "assets/flute.png");
    const state = document.createElement("span");
    state.textContent = "Shut";
    article.append(figure.img, figure.title, state);
    picks.push(article);
  }
  caseEl.replaceChildren(...picks);
  paintDronePill();
  applyFluteArt();
  paintEar();
}

paintFluteScreen();
$("open-title").addEventListener("click", () => {
  closeMenu();
  showScreen("screen-title");
});
$("story-prev").addEventListener("click", () => turnAlbum(-1));
$("story-next").addEventListener("click", () => turnAlbum(1));
let swipeX = null;
$("story-frame").addEventListener("pointerdown", (event) => {
  if (event.target.closest(".story-song")) {
    swipeX = null;
    return;
  }
  swipeX = event.clientX;
});
$("story-frame").addEventListener("pointerup", (event) => {
  if (swipeX == null) return;
  const dx = event.clientX - swipeX;
  swipeX = null;
  if (Math.abs(dx) < 48) return;
  turnAlbum(dx < 0 ? 1 : -1);
});
function syncFreeSettings() {
  $("metro-volume").value = String(metroLevel);
  $("metro-volume-read").textContent = String(metroLevel);
  $("track-volume").value = String(trackLevel);
  $("track-volume-read").textContent = String(trackLevel);
  $("free-meter").value = String(freeBeats);
}

function trackStatus() {
  if (trackLoading) return "Music under the flute. Loading…";
  const about = trackBpmGuess ? `, about ${trackBpmGuess} bpm` : "";
  if (trackPreview) return `Music under the flute. Playing${about}.`;
  if (trackPlaying) return `Music under the flute. Playing with the beat${about}.`;
  if (trackBuffer) return `Music under the flute. Ready to play${about}.`;
  return "Music under the flute. None selected.";
}

function paintTrackCard() {
  const status = $("track-status");
  const canvas = $("track-wave");
  const pick = $("track-pick");
  const busy = freeState === "recording" || freeState === "countin";
  status.textContent = trackStatus();
  pick.value = trackLoading ? trackPending : (trackId || "");
  pick.disabled = busy || trackLoading;
  $("track-file").disabled = busy || trackLoading;
  $("track-file").closest("label").classList.toggle("is-off", busy || trackLoading);
  $("track-clear").disabled = !trackBuffer || busy || trackLoading;
  const preview = $("track-preview");
  preview.disabled = !trackBuffer || busy || trackLoading;
  preview.textContent = trackPreview || trackPlaying ? "Stop" : "Play";
  preview.setAttribute("aria-label", trackPreview || trackPlaying ? "Stop the backing track" : "Play the backing track");
  if (!trackBuffer) {
    canvas.classList.add("hidden");
    return;
  }
  canvas.classList.remove("hidden");
  requestAnimationFrame(() => {
    if (!trackPeaks.length) return;
    const w = Math.max(280, Math.floor(canvas.clientWidth || canvas.parentElement?.clientWidth || 280));
    const h = 48;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    const gap = 2;
    const bw = Math.max(1, (w - gap * (trackPeaks.length - 1)) / trackPeaks.length);
    ctx.fillStyle = "#f0c36a";
    trackPeaks.forEach((p, i) => {
      const bh = Math.max(2, p * (h - 6));
      ctx.fillRect(i * (bw + gap), (h - bh) / 2, bw, bh);
    });
  });
}

function peaksFromBuffer(buffer) {
  const buckets = 80;
  const channels = [];
  for (let c = 0; c < buffer.numberOfChannels; c++) channels.push(buffer.getChannelData(c));
  const length = channels[0].length;
  const size = Math.max(1, Math.floor(length / buckets));
  const step = Math.max(1, Math.floor(size / 40));
  const peaks = [];
  for (let i = 0; i < buckets; i++) {
    let peak = 0;
    const start = i * size;
    const end = Math.min(length, start + size);
    for (let j = start; j < end; j += step) {
      for (let c = 0; c < channels.length; c++) {
        const v = Math.abs(channels[c][j]);
        if (v > peak) peak = v;
      }
    }
    peaks.push(peak);
  }
  return peaks;
}

function decodeFile(raw) {
  const copy = raw.slice(0);
  try {
    const pending = audioCtx.decodeAudioData(copy);
    if (pending && typeof pending.then === "function") return pending;
  } catch {
    /* older browsers want the callback form */
  }
  return new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(raw.slice(0), resolve, reject);
  });
}

function rememberBacking(id) {
  try {
    if (id === "earth" || id === "forest") localStorage.setItem("flute-hero-backing", id);
    else localStorage.removeItem("flute-hero-backing");
  } catch {
    /* the browser can refuse storage */
  }
}

function showFileOption(name) {
  const option = $("track-pick").querySelector('option[value="file"]');
  option.hidden = false;
  option.textContent = name || "Your file";
}

function hideFileOption() {
  const option = $("track-pick").querySelector('option[value="file"]');
  option.hidden = true;
  option.textContent = "Your file";
}

function correlateFlux(env, frames, minLag, maxLag) {
  const flux = new Float32Array(frames);
  for (let i = 1; i < frames; i++) {
    const d = env[i] - env[i - 1];
    if (d > 0) flux[i] = d;
  }
  let mean = 0;
  for (let i = 0; i < frames; i++) mean += flux[i];
  mean /= frames;
  let energy = 0;
  for (let i = 0; i < frames; i++) {
    flux[i] -= mean;
    energy += flux[i] * flux[i];
  }
  energy /= frames || 1;
  const corr = new Float32Array(maxLag + 1);
  if (energy < 1e-10) return corr;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    const n = frames - lag;
    for (let i = 0; i < n; i++) sum += flux[i] * flux[i + lag];
    corr[lag] = sum / n / energy;
  }
  return corr;
}

function estimateBpm(buffer) {
  const rate = buffer.sampleRate;
  const total = buffer.length;
  if (!rate || total < rate * 1.1) return null;
  let from = 0;
  let to = total;
  if (total > rate * 50) {
    from = Math.floor(rate * 8);
    to = Math.min(total, from + Math.floor(rate * 36));
  } else if (total > rate * 48) {
    to = Math.floor(rate * 48);
  }
  const channels = [];
  for (let c = 0; c < buffer.numberOfChannels; c++) channels.push(buffer.getChannelData(c));
  const frame = Math.max(1, Math.round(rate / 200));
  const frames = Math.floor((to - from) / frame);
  if (frames < 80) return null;
  const aLow = Math.exp((-2 * Math.PI * 140) / rate);
  const aHigh = Math.exp((-2 * Math.PI * 1400) / rate);
  const low = new Float32Array(frames);
  const high = new Float32Array(frames);
  const full = new Float32Array(frames);
  let lp = 0;
  let hp = 0;
  let x1 = 0;
  let accLow = 0;
  let accHigh = 0;
  let accFull = 0;
  let count = 0;
  let f = 0;
  for (let i = from; i < to && f < frames; i++) {
    let s = 0;
    for (let c = 0; c < channels.length; c++) s += channels[c][i];
    s /= channels.length;
    lp = aLow * lp + (1 - aLow) * s;
    hp = aHigh * (hp + s - x1);
    x1 = s;
    accLow += lp * lp;
    accHigh += hp * hp;
    accFull += s * s;
    count += 1;
    if (count === frame) {
      low[f] = accLow;
      high[f] = accHigh;
      full[f] = accFull;
      accLow = 0;
      accHigh = 0;
      accFull = 0;
      count = 0;
      f += 1;
    }
  }
  const envRate = rate / frame;
  const minLag = Math.max(1, Math.round((envRate * 60) / 208));
  const maxLag = Math.min(frames - 2, Math.round((envRate * 60) / 40));
  if (maxLag <= minLag + 2) return null;
  const corrLow = correlateFlux(low, frames, minLag, maxLag);
  const corrHigh = correlateFlux(high, frames, minLag, maxLag);
  const corrFull = correlateFlux(full, frames, minLag, maxLag);
  const at = (corr, lag) => {
    if (lag <= 1 || lag >= corr.length - 1) return 0;
    const i = Math.floor(lag);
    const frac = lag - i;
    return (1 - frac) * corr[i] + frac * corr[i + 1];
  };
  const ownAt = new Float32Array(209);
  const scoreAt = new Float32Array(209);
  let bestBpm = 0;
  let bestScore = 0;
  for (let bpm = 40; bpm <= 208; bpm++) {
    const lag = (envRate * 60) / bpm;
    const raw = 1.15 * at(corrLow, lag) + at(corrHigh, lag) + 0.65 * at(corrFull, lag);
    const z = Math.log(bpm / 102) / Math.LN2;
    const score = raw * Math.exp(-0.5 * (z / 0.55) ** 2);
    ownAt[bpm] = raw;
    scoreAt[bpm] = score;
    if (score > bestScore) {
      bestScore = score;
      bestBpm = bpm;
    }
  }
  if (!bestBpm || bestScore < 0.05) return null;
  const doubled = bestBpm * 2;
  if (doubled <= 208 && ownAt[doubled] >= ownAt[bestBpm] * 0.92) {
    bestBpm = doubled;
    bestScore = scoreAt[doubled];
  }
  let rival = 0;
  for (let bpm = 40; bpm <= 208; bpm++) {
    if (Math.abs(bpm - bestBpm) <= 4) continue;
    const ratio = bpm > bestBpm ? bpm / bestBpm : bestBpm / bpm;
    if (ratio < 1.14 || Math.abs(ratio - 2) < 0.08) continue;
    if (scoreAt[bpm] > rival) rival = scoreAt[bpm];
  }
  if (rival > 0 && bestScore < rival * 1.12) return null;
  return bestBpm;
}

function tempoHint() {
  if (trackBpmGuess) return `Guessed ${trackBpmGuess} bpm. Nudge it if the click misses.`;
  return "Tap along to set the tempo.";
}

function applyTrackTempo() {
  if (freeState !== "live" || tempoLocked()) return;
  const touched = savedTempoTouch();
  if (touched) setFreeBpm(touched, false);
  else if (trackBpmGuess) setFreeBpm(trackBpmGuess, false);
  const hint = $("free-tap-hint");
  if (hint && tapTimes.length < 2) hint.textContent = tempoHint();
}

function useTrack(audio, name, id) {
  stopTrack();
  trackStartBeat = null;
  trackBuffer = audio;
  trackName = name;
  trackId = id;
  trackPeaks = peaksFromBuffer(audio);
  trackBpmGuess = estimateBpm(audio);
  applyTrackTempo();
  trackLoading = false;
  trackPending = "";
  if (id === "file") showFileOption(name);
  else hideFileOption();
  rememberBacking(id);
  paintTrackCard();
}

let trackPending = "";

async function loadBacking(item) {
  if (!item || freeState === "recording" || freeState === "countin") return;
  const token = ++trackLoadToken;
  trackPending = item.id;
  trackLoading = true;
  paintTrackCard();
  ensureAudio();
  try { await audioCtx.resume(); } catch { /* the click already asked it to run */ }
  try {
    const response = await fetch(item.url);
    if (!response.ok) throw new Error("missing");
    const audio = await decodeFile(await response.arrayBuffer());
    if (token !== trackLoadToken) return;
    useTrack(audio, item.name, item.id);
  } catch {
    if (token !== trackLoadToken) return;
    trackLoading = false;
    trackPending = "";
    paintTrackCard();
    freeNotice = "That track would not play.";
    freeNoticeUntil = performance.now() + 2800;
  }
}

function restoreBacking() {
  let id = "";
  try { id = localStorage.getItem("flute-hero-backing") || ""; } catch { /* ignore */ }
  const item = BACKING_TRACKS.find((track) => track.id === id);
  if (item) loadBacking(item);
}

async function loadTrackFile(file) {
  if (!file || freeState === "recording" || freeState === "countin") return;
  const token = ++trackLoadToken;
  trackPending = "file";
  trackLoading = true;
  paintTrackCard();
  ensureAudio();
  try { await audioCtx.resume(); } catch { /* the click already asked it to run */ }
  try {
    const audio = await decodeFile(await file.arrayBuffer());
    if (token !== trackLoadToken) return;
    useTrack(audio, file.name.replace(/\.[^.]+$/, "") || "Your file", "file");
  } catch {
    if (token !== trackLoadToken) return;
    trackLoading = false;
    trackPending = "";
    paintTrackCard();
    freeNotice = "That file would not play.";
    freeNoticeUntil = performance.now() + 2800;
  }
}

function clearTrack() {
  if (freeState === "recording" || freeState === "countin") return;
  trackLoadToken += 1;
  trackLoading = false;
  trackPending = "";
  stopTrack();
  trackBuffer = null;
  trackName = "";
  trackId = "";
  trackPeaks = [];
  trackBpmGuess = null;
  trackStartBeat = null;
  hideFileOption();
  rememberBacking("");
  paintTrackCard();
}

async function toggleTrackPreview() {
  if (!trackBuffer || freeState === "recording" || freeState === "countin") return;
  if (trackPreview || trackPlaying) {
    stopTrack();
    paintTrackCard();
    return;
  }
  ensureAudio();
  try { await audioCtx.resume(); } catch { /* the click already asked it to run */ }
  ensureTrackBus();
  const src = audioCtx.createBufferSource();
  src.buffer = trackBuffer;
  src.connect(trackGain);
  src.onended = () => {
    if (trackPreview !== src) return;
    trackPreview = null;
    paintTrackCard();
  };
  src.start();
  trackPreview = src;
  paintTrackCard();
}

function setFreeBeats(n) {
  n = Number(n);
  if (![2, 3, 4, 5, 6, 7].includes(n)) n = 4;
  if (tempoLocked()) {
    $("free-meter").value = String(freeBeats);
    return;
  }
  freeBeats = n;
  try { localStorage.setItem("flute-hero-meter", String(freeBeats)); } catch { /* ignore */ }
}

function onTapTempo() {
  if (tempoLocked()) return;
  const now = performance.now();
  const last = tapTimes[tapTimes.length - 1];
  if (last == null || now - last > 2000) tapTimes = [];
  tapTimes.push(now);
  if (tapTimes.length > 6) tapTimes.shift();
  const hint = $("free-tap-hint");
  if (tapTimes.length < 2) {
    hint.textContent = "Tap the beat.";
    return;
  }
  let sum = 0;
  for (let i = 1; i < tapTimes.length; i++) sum += tapTimes[i] - tapTimes[i - 1];
  setFreeBpm(Math.round(60000 / (sum / (tapTimes.length - 1))), false);
  rememberTempoTouch();
  hint.textContent = `${freeBpm} bpm`;
}

function openFreeSettings() {
  tapTimes = [];
  $("free-tap-hint").textContent = tempoHint();
  syncFreeSettings();
  paintTrackCard();
  const panel = $("free-settings");
  if (!panel.open) panel.showModal();
}

function closeFreeSettings() {
  const panel = $("free-settings");
  if (panel.open) panel.close();
}

$("free-back").addEventListener("click", () => leaveFree());
$("free-reset").addEventListener("click", resetFree);
$("free-play").addEventListener("click", onTrackPlay);
$("free-settings-open").addEventListener("click", openFreeSettings);
$("free-settings-close").addEventListener("click", closeFreeSettings);
$("metro-volume").addEventListener("input", (e) => {
  metroLevel = Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0)));
  $("metro-volume-read").textContent = String(metroLevel);
  try { localStorage.setItem("flute-hero-metro-vol", String(metroLevel)); } catch { /* ignore */ }
});
$("track-volume").addEventListener("input", (e) => {
  trackLevel = Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0)));
  $("track-volume-read").textContent = String(trackLevel);
  applyTrackVolume();
  try { localStorage.setItem("flute-hero-track-vol", String(trackLevel)); } catch { /* ignore */ }
});
$("free-meter").addEventListener("change", (e) => setFreeBeats(e.target.value));
$("free-tap").addEventListener("click", onTapTempo);
$("track-pick").addEventListener("change", (e) => {
  const id = e.target.value;
  if (id === "file") {
    e.target.value = trackId || "";
    return;
  }
  if (!id) {
    clearTrack();
    return;
  }
  if (id === trackId && trackBuffer) return;
  const item = BACKING_TRACKS.find((track) => track.id === id);
  if (item) loadBacking(item);
  else e.target.value = trackId || "";
});
$("track-preview").addEventListener("click", toggleTrackPreview);
$("track-file").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (file) loadTrackFile(file);
});
$("track-clear").addEventListener("click", clearTrack);
$("bpm-down").addEventListener("click", () => nudgeBpm(-1));
$("bpm-up").addEventListener("click", () => nudgeBpm(1));
$("free-metro").addEventListener("click", () => {
  metroOn = !metroOn;
  try {
    localStorage.setItem("flute-hero-metro", metroOn ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (metroOn && audioCtx) nextClickBeat = Math.floor(freeBeat()) + 1;
  setMetroButton();
});
$("free-record").addEventListener("click", onRecord);
$("take-keep").addEventListener("click", commitPending);
$("take-discard").addEventListener("click", () => {
  pendingTake = null;
  endReplay();
});
$("take-file").addEventListener("click", () => {
  const take = pendingFromInput();
  if (take) downloadTake(take);
});
$("take-name").addEventListener("keydown", (e) => {
  e.stopPropagation();
  if (e.key === "Enter") {
    e.preventDefault();
    commitPending();
  }
});
setMetroButton();
syncFreeSettings();
$("bpm-value").textContent = String(freeBpm);
$("drone-look").value = droneLook;
$("drone-look").addEventListener("change", (e) => {
  droneLook = e.target.value === "rainbow" ? "rainbow" : "gold";
  localStorage.setItem("flute-hero-drone", droneLook);
});
setInterval(tickTitle, 700);
listenForMicGesture();
startMic(false);
resize();
new ResizeObserver(resize).observe(canvas);
new ResizeObserver(resize).observe(freeCanvas);
