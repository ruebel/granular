const getContext = () => {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext;
  const context = new AudioContext();
  return context;
};

const createGain = (context, velocity) => {
  const gain = context.createGain();
  gain.gain.value = velocity;
  return gain;
};

const createPan = (context, pan) => {
  const panner = context.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'linear';
  return panner;
};

const getAudioBuffer = async path => {
  const response = await fetch(path);
  const audioData = await response.arrayBuffer();
  return new Promise((resolve, reject) => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer);
    });
  });
};

const getFile = async () => {
  state.loading = true;
  state.buffer = await getAudioBuffer('audio/test.mp3');
  const canvas = document.getElementById('waveform');
  drawWaveform(state.buffer, canvas);
  state.loading = false;
};

const getOffset = (duration, position, spread) => {
  const spreadOffset = Math.random() * spread - spread / 2;
  const offset = position * duration;
  return Math.max(0, offset + spreadOffset);
};

const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

const createGrain = state => {
  const gain = createGain(state.context, 0);
  const pan = createPan(context, state.pan);
  pan.connect(gain);
  gain.connect(state.master);

  return {
    busy: false,
    gain,
    pan
  };
};

const startGrain = (grain, state) => {
  grain.busy = true;
  // Create source
  grain.source = state.context.createBufferSource();
  grain.source.buffer = state.buffer;
  grain.source.connect(grain.pan);
  grain.pan.setPosition(random(-state.pan, state.pan), 0, 0);
  grain.source.playbackRate.value =
    grain.source.playbackRate.value * state.playbackRate;
  // Calculate curve times
  const now = state.context.currentTime;
  const offset = getOffset(state.buffer.duration, state.offset, state.spread);
  const attackTime = state.attack;
  const holdTime = attackTime + state.grainLength;
  const end = holdTime + state.release;
  // Apply curves
  grain.source.start(now, offset, end / 1000 + 0.1);
  grain.gain.gain.exponentialRampToValueAtTime(1, now + attackTime / 1000);
  setTimeout(
    () =>
      grain.gain.gain.exponentialRampToValueAtTime(0.0001, now + end / 1000),
    holdTime
  );
  // Clean up when finished
  setTimeout(() => {
    grain.source.stop();
    grain.source.disconnect();
    grain.busy = false;
  }, end + 5);
};

const killGrain = grain => {
  if (grain.source) {
    grain.source.stop();
    grain.source.disconnect();
  }
  grain.gain.disconnect();
};

const start = () => {
  state.running = true;
  state.interval = setInterval(() => {
    let grain = state.grains.find(g => !g.busy);
    try {
      if (!grain) {
        grain = createGrain(state);
        state.grains = [...state.grains, grain];
      }
      startGrain(grain, state);
    } catch (err) {
      debugger;
      console.error(err);
      stop();
    }
  }, 5 / state.density);
};

const stop = () => {
  state.running = false;
  if (state.interval) {
    clearInterval(state.interval);
  }
};

const context = getContext();
const master = createGain(context, 0.6);
master.connect(context.destination);
const state = {
  attack: 100,
  buffer: null,
  context,
  density: 0.6,
  grains: [],
  grainLength: 100,
  loading: false,
  master,
  offset: 0.5,
  pan: 1,
  playbackRate: 1,
  release: 100,
  running: false,
  spread: 0.2
};
