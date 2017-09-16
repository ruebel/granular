/**
 * Create Gain node using context at supplied velocity
 * context - Audio Context
 * velocity - default gain value
 */
export const createGain = (context, velocity = 0.001) => {
  const gain = context.createGain();
  gain.gain.value = velocity;
  return gain;
};
/**
 * Create a grain instance
 * panVal - how much grain will be panned left or right (-1 - 1)
 * output - output audio node
 * context - Audio Context
 */
export const createGrain = (panVal, output, context) => {
  const gain = createGain(context);
  const pan = createPan(context, panVal);
  pan.connect(gain);
  gain.connect(output);

  return {
    busy: false,
    gain,
    pan
  };
};
/**
 * Create a panning node
 * context - Audio Context
 * pan - amount to pan left to right  (-1 - 1)
 */
const createPan = (context, pan) => {
  const panner = context.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'linear';
  return panner;
};
/**
 * Get the window audio context
 */
export const getContext = () => {
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext;
  const context = new AudioContext();
  return context;
};
/**
 * Get the grain's start positin in the audio buffer
 * duration - how long the audio buffer is
 * position - starting position in the buffer (0 - 1)
 * spread - how much random offset the start position will have
 */
const getPosition = (duration, position, spread) => {
  const spreadOffset = Math.random() * spread - spread / 2;
  const adjustedPos = position * duration;
  return Math.max(0, adjustedPos + spreadOffset);
};
/**
 * Stop and clean up a grain
 */
export const killGrain = grain => {
  if (grain.source) {
    grain.source.stop();
    grain.source.disconnect();
  }
  grain.gain.disconnect();
};
/**
 * Create a random number in a given range
 */
const random = (min, max) => {
  return Math.random() * (max - min) + min;
};
/**
 * Start a grain
 * grain - grain object to start
 * state - current settings for granular engine
 */
export const startGrain = (grain, state) => {
  // Set busy flag so grain doesn't get reused
  grain.busy = true;
  // Create source from buffer
  grain.source = state.context.createBufferSource();
  grain.source.buffer = state.buffer;
  grain.source.connect(grain.pan);
  // Set the pan amount for the grain
  grain.pan.setPosition(random(-state.pan, state.pan), 0, 0);
  // Set the playback rate of the grain
  grain.source.playbackRate.value *= state.playbackRate;
  // Get the starting position in the buffer
  const position = getPosition(
    state.buffer.duration,
    state.position,
    state.spread
  );
  // Calculate curve times
  const now = state.context.currentTime;
  const attackTime = state.attack;
  const sustainTime = attackTime + state.sustain;
  const end = sustainTime + state.release;
  // Apply curves
  grain.source.start(now, position, end / 1000 + 0.1);
  // Attack curve
  grain.gain.gain.exponentialRampToValueAtTime(1, now + attackTime / 1000);
  // Wait sustain amount before invoking release curve
  setTimeout(
    () =>
      // Release curve
      grain.gain.gain.exponentialRampToValueAtTime(0.0001, now + end / 1000),
    // Sustain
    sustainTime
  );
  // Clean up when finished
  setTimeout(() => {
    grain.source.stop();
    grain.source.disconnect();
    grain.busy = false;
  }, end + 5);
};
