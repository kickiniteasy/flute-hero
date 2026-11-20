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
const WIN = 0.3;
const PERFECT = 0.11;

const down = new Map();
let droneHeld = false;
let audioCtx = null;
let master = null;
let droneGain = null;
let droneOsc = null;
let guideBus = null;
let guideOn = true;
let micOn = false;
let micCovers = null;
let micDrone = false;
let micLabel = "";
let micStream = null;
let wakeLock = null;
let laneFlashes = [];
let raf = 0;

let song = null;
let chart = [];
let startAt = 0;
let paused = false;
let pauseBeat = 0;
let score = 0;
let combo = 0;
let bestCombo = 0;
let hits = 0;
let misses = 0;
let floaters = [];
let motes = [];

const $ = (id) => document.getElementById(id);
const canvas = $("highway");
const ctx2d = canvas.getContext("2d");

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
  droneOsc.frequency.value = 440;
  const over = audioCtx.createOscillator();
  over.type = "sine";
  over.frequency.value = 880;
  const overGain = audioCtx.createGain();
  overGain.gain.value = 0.18;
  droneOsc.connect(droneGain);
  over.connect(overGain);
  overGain.connect(droneGain);
  droneOsc.start();
  over.start();
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
  const names = ["A5", "G5", "F#5", "E5", "D5", "C5", "A4"];
  const note = micOn && micLabel ? micLabel : covers == null ? "" : names[covers];
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

function dueChart(beat) {
  let melody = null;
  let drone = false;
  for (const note of chart) {
    const judging =
      note.state === "hit"
        ? beat <= note.t + note.d
        : note.state === "pending" && beat >= note.t - WIN && beat <= note.t + WIN;
    if (!judging) continue;
    if (note.kind === "drone") drone = true;
    else melody = note;
  }
  return { melody, drone };
}

function laneVerdict(lane, beat) {
  const covers = playerCovers();
  const drone = playerDrone();
  const on = lanePlayed(lane, covers, drone);
  const due = dueChart(beat);
  if (lane === DRONE_LANE) {
    if (due.drone && drone) return "right";
    if (!due.drone && drone && due.melody) return "wrong";
    return on ? "you" : "idle";
  }
  if (!due.melody) return on ? "you" : "idle";
  if (covers === due.melody.covers && on) return "right";
  if (on) return "wrong";
  return "idle";
}

function youVerdict(beat) {
  const due = dueChart(beat);
  const covers = playerCovers();
  const drone = playerDrone();
  if (covers == null && !drone) return "";
  if (!due.melody && !due.drone) return "you";
  const melodyOk = !due.melody || covers === due.melody.covers;
  const droneOk = due.drone ? drone : !drone;
  return melodyOk && droneOk ? "right" : "wrong";
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
  return lanePlayed(lane, expect.melody.covers, false) ? "right" : "wrong";
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
        freq: 440,
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
      freq: info.freq,
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
  laneFlashes = [];
  floaters = [];
  paused = false;
  startAt = audioCtx.currentTime + 0.12;
  guideBus.gain.value = guideOn ? 0.2 : 0;
  setDrone(false);
  $("song-name").textContent = song.title;
  $("song-blurb").textContent = song.blurb;
  $("screen-title").classList.add("hidden");
  $("screen-play").classList.remove("hidden");
  $("screen-results").classList.add("hidden");
  resize();
  $("pause").textContent = "Pause";
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}

function stopSong() {
  cancelAnimationFrame(raf);
  setDrone(false);
  song = null;
  $("screen-play").classList.add("hidden");
  $("screen-results").classList.add("hidden");
  $("screen-title").classList.remove("hidden");
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
  $("screen-results").classList.remove("hidden");
}

function judge(beat) {
  const covers = playerCovers();
  const droneOn = playerDrone();
  for (const note of chart) {
    const matched = note.kind === "drone" ? droneOn : covers === note.covers;
    if (note.state === "pending" && beat >= note.t - WIN && beat <= note.t + WIN && matched) {
      const delta = beat <= note.t ? 0 : beat - note.t;
      note.state = "hit";
      note.quality = delta <= PERFECT ? "perfect" : "good";
      const bonus = note.quality === "perfect" ? 100 : 55;
      combo += 1;
      bestCombo = Math.max(bestCombo, combo);
      score += Math.round(bonus * (1 + Math.min(combo, 16) * 0.08));
      hits += 1;
      flashLanes(noteLanes(note));
      floaters.push({
        text: note.quality === "perfect" ? "Clean" : "Good",
        lane: note.lane,
        at: performance.now(),
        good: true,
      });
      if (!guideOn) blip(note.freq, audioCtx.currentTime, 0.12, 0.18, master);
    } else if (note.state === "pending" && beat > note.t + WIN) {
      note.state = "miss";
      combo = 0;
      misses += 1;
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
}

function fitFlutes() {
  document.querySelectorAll(".flute-wrap").forEach((root) => {
    if (root.id === "play-flute") return;
    const h = root.clientHeight;
    if (h) root.style.width = (h * 141) / 1058 + "px";
  });
}

function fitPlayFlute() {
  const wrap = $("play-flute");
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

function resize() {
  fitFlutes();
  fitPlayFlute();
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
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
  $("score").textContent = String(score);
  $("combo").textContent = String(combo);
  draw(beat);
  if (beat > songEnd() + 2) finish();
  else raf = requestAnimationFrame(frame);
}

let droneLook = localStorage.getItem("flute-hero-drone") === "rainbow" ? "rainbow" : "gold";

function droneInk(x0, x1, y) {
  if (droneLook !== "rainbow") return "#ffcc66";
  const g = ctx2d.createLinearGradient(x0, y, Math.max(x1, x0 + 1), y);
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

function fluteColumn() {
  const cRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / Math.max(1, cRect.width);
  const scaleY = canvas.height / Math.max(1, cRect.height);
  const flute = document.getElementById("play-flute")?.getBoundingClientRect();
  const holes = [...document.querySelectorAll("#play-flute .holes i")];
  const hole = holes[0]?.getBoundingClientRect();
  let hitX = canvas.width * 0.12;
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
  return { hitX, leftX, radius, scaleY, cRect };
}

function laneAnchor(lane, column) {
  const col = column || fluteColumn();
  const el =
    lane === DRONE_LANE
      ? document.querySelector("#play-flute .glow")
      : lane === OPEN_LANE
        ? document.querySelector("#play-flute .open-mark")
        : document.querySelectorAll("#play-flute .holes i")[lane];
  if (!el || !col.cRect.width) {
    const i = trackIndex(lane);
    return { x: col.hitX, y: canvas.height * (0.16 + i * 0.09), r: col.radius, leftX: col.leftX };
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

function roundRect(x, y, w, h, radius) {
  const rad = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx2d.beginPath();
  ctx2d.moveTo(x + rad, y);
  ctx2d.arcTo(x + w, y, x + w, y + h, rad);
  ctx2d.arcTo(x + w, y + h, x, y + h, rad);
  ctx2d.arcTo(x, y + h, x, y, rad);
  ctx2d.arcTo(x, y, x + w, y, rad);
  ctx2d.closePath();
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
}


const MELODY_BANDS = [
  [5, "C5", 490, 548],
  [4, "D5", 552, 625],
  [3, "E5", 630, 700],
  [2, "F#5", 705, 748],
  [1, "G5", 752, 845],
  [0, "A5", 850, 970],
];

async function toggleMic() {
  ensureAudio();
  keepAwake();
  const resume = audioCtx.resume();
  if (micOn) {
    micOn = false;
    micCovers = null;
    micDrone = false;
    micStream?.getTracks().forEach((t) => t.stop());
    $("mic").textContent = "Use the flute";
    $("mic").classList.remove("on");
    $("heard").textContent = "";
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
    $("heard").textContent = "Open the https link. iPhone keeps the mic closed on http.";
    return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: { ideal: false },
        noiseSuppression: { ideal: false },
        autoGainControl: { ideal: false },
      },
    });
    await resume;
  } catch {
    $("heard").textContent = "The microphone stayed closed. Allow it when Safari asks.";
    return;
  }
  const source = audioCtx.createMediaStreamSource(micStream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.45;
  source.connect(analyser);
  const time = new Float32Array(analyser.fftSize);
  const freq = new Float32Array(analyser.frequencyBinCount);
  const bandPeak = (lo, hi) => {
    const hz = audioCtx.sampleRate / analyser.fftSize;
    const a = Math.max(0, Math.floor(lo / hz));
    const b = Math.min(freq.length - 1, Math.ceil(hi / hz));
    let peak = -120;
    for (let i = a; i <= b; i++) if (freq[i] > peak) peak = freq[i];
    return peak;
  };
  micOn = true;
  $("mic").textContent = "Mic on";
  $("mic").classList.add("on");
  const listen = () => {
    if (!micOn) return;
    analyser.getFloatTimeDomainData(time);
    let energy = 0;
    for (let i = 0; i < time.length; i += 8) energy += time[i] * time[i];
    energy = Math.sqrt(energy / (time.length / 8));
    if (energy < 0.015) {
      micCovers = null;
      micDrone = false;
      micLabel = "";
    } else {
      analyser.getFloatFrequencyData(freq);
      const droneDb = bandPeak(405, 470);
      let best = null;
      for (const [covers, name, lo, hi] of MELODY_BANDS) {
        const db = bandPeak(lo, hi);
        if (!best || db > best.db) best = { covers, name, db };
      }
      const quiet = -50;
      const octaveOfDrone = best && best.covers === 0 && best.db < droneDb + 2;
      const melody = best && best.db > quiet && !octaveOfDrone ? best : null;
      if (melody) {
        micCovers = melody.covers;
        micLabel = melody.name;
        micDrone = droneDb > -46 && droneDb > melody.db - 14;
      } else if (droneDb > -46) {
        micCovers = 6;
        micLabel = "A4";
        micDrone = true;
      } else {
        micCovers = null;
        micDrone = false;
        micLabel = "";
      }
    }
    requestAnimationFrame(listen);
  };
  listen();
}

function bootSongs() {
  const list = $("song-list");
  SONGS.forEach((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "song";
    btn.innerHTML = `<b>${s.title}</b><span>${s.blurb}</span><em>${s.level}</em>`;
    btn.addEventListener("click", () => startSong(s.id));
    list.appendChild(btn);
  });
}

let titleCovers = 0;
function tickTitle() {
  titleCovers = (titleCovers + 1) % 7;
  paintFlute($("title-flute"), titleCovers, titleCovers, titleCovers === 6 || titleCovers === 0);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (e.repeat) return;
    droneHeld = true;
    if (audioCtx && !micOn) blip(440, undefined, 0.06, 0.14, master);
    return;
  }
  const cover = codeToCover(e.code);
  if (cover == null) {
    if (e.code === "Escape") {
      if (!$("menu-panel").classList.contains("hidden")) {
        $("menu-panel").classList.add("hidden");
        return;
      }
      if (song) stopSong();
    }
    return;
  }
  e.preventDefault();
  if (e.repeat) return;
  down.set(cover, performance.now());
  if (audioCtx && !micOn) blip(LANES.map((id) => PITCHES[id]).find((p) => p.covers === cover).freq, undefined, 0.08, 0.16, master);
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

$("back").addEventListener("click", stopSong);
$("results-songs").addEventListener("click", stopSong);
$("again").addEventListener("click", () => song && startSong(song.id));
$("pause").addEventListener("click", async () => {
  if (!audioCtx || !song) return;
  if (!paused) {
    pauseBeat = songBeat();
    paused = true;
    await audioCtx.suspend();
    $("pause").textContent = "Play";
  } else {
    paused = false;
    startAt = audioCtx.currentTime - (pauseBeat * 60) / song.bpm;
    await audioCtx.resume();
    $("pause").textContent = "Pause";
  }
});
$("guide").addEventListener("click", () => {
  guideOn = !guideOn;
  $("guide").textContent = guideOn ? "Guide on" : "Guide off";
  $("guide").classList.toggle("on", guideOn);
  if (guideBus) guideBus.gain.value = guideOn ? 0.2 : 0;
});
$("mic").addEventListener("click", () => toggleMic());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && (song || micOn)) keepAwake();
});
window.addEventListener("resize", resize);

mountHoles($("title-flute"));
mountHoles($("play-flute"));
paintFlute($("title-flute"), 0, 0, false);
bootSongs();
function toggleMenu() {
  $("menu-panel").classList.toggle("hidden");
}
$("menu").addEventListener("click", toggleMenu);
$("menu-title").addEventListener("click", toggleMenu);
$("drone-look").value = droneLook;
$("drone-look").addEventListener("change", (e) => {
  droneLook = e.target.value === "rainbow" ? "rainbow" : "gold";
  localStorage.setItem("flute-hero-drone", droneLook);
});
setInterval(tickTitle, 700);
resize();
new ResizeObserver(resize).observe(canvas);
