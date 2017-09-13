export const createGain = (context, velocity) => {
  const gain = context.createGain();
  gain.gain.value = velocity;
  return gain;
};

export const createGrain = (state, master, context) => {
  const gain = createGain(context, 0);
  const pan = createPan(context, state.pan);
  pan.connect(gain);
  gain.connect(master);

  return {
    busy: false,
    gain,
    pan
  };
};

const createPan = (context, pan) => {
  const panner = context.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'linear';
  return panner;
};

export const getContext = () => {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext;
  const context = new AudioContext();
  return context;
};

const getPosition = (duration, position, spread) => {
  const spreadOffset = Math.random() * spread - spread / 2;
  const adjustedPos = position * duration;
  return Math.max(0, adjustedPos + spreadOffset);
};

export const killGrain = grain => {
  if (grain.source) {
    grain.source.stop();
    grain.source.disconnect();
  }
  grain.gain.disconnect();
};

const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const startGrain = (grain, state, context) => {
  grain.busy = true;
  // Create source
  grain.source = context.createBufferSource();
  grain.source.buffer = state.buffer;
  grain.source.connect(grain.pan);
  grain.pan.setPosition(random(-state.pan, state.pan), 0, 0);
  grain.source.playbackRate.value *= state.playbackRate;
  // Calculate curve times
  const now = context.currentTime;
  const position = getPosition(
    state.buffer.duration,
    state.position,
    state.spread
  );
  const attackTime = state.attack;
  const holdTime = attackTime + state.sustain;
  const end = holdTime + state.release;
  // Apply curves
  grain.source.start(now, position, end / 1000 + 0.1);
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
