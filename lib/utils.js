'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Create Gain node using context at supplied velocity
 * context - Audio Context
 * velocity - default gain value
 */
var createGain = exports.createGain = function createGain(context) {
  var velocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.001;

  var gain = context.createGain();
  gain.gain.value = velocity;
  return gain;
};
/**
 * Create a grain instance
 * panVal - how much grain will be panned left or right (-1 - 1)
 * output - output audio node
 * context - Audio Context
 */
var createGrain = exports.createGrain = function createGrain(panVal, output, context) {
  var gain = createGain(context);
  var pan = createPan(context, panVal);
  pan.connect(gain);
  gain.connect(output);

  return {
    busy: false,
    gain: gain,
    pan: pan
  };
};
/**
 * Create a panning node
 * context - Audio Context
 * pan - amount to pan left to right  (-1 - 1)
 */
var createPan = function createPan(context, pan) {
  var panner = context.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'linear';
  return panner;
};
/**
 * Get the window audio context
 */
var getContext = exports.getContext = function getContext() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
  var context = new AudioContext();
  return context;
};
/**
 * Get the grain's start positin in the audio buffer
 * duration - how long the audio buffer is
 * position - starting position in the buffer (0 - 1)
 * spread - how much random offset the start position will have
 */
var getPosition = function getPosition(duration, position, spread) {
  var spreadOffset = Math.random() * spread - spread / 2;
  var adjustedPos = position * duration;
  return Math.max(0, adjustedPos + spreadOffset);
};
/**
 * Stop and clean up a grain
 */
var killGrain = exports.killGrain = function killGrain(grain) {
  if (grain.source) {
    grain.source.stop();
    grain.source.disconnect();
  }
  grain.gain.disconnect();
};
/**
 * Create a random number in a given range
 */
var random = function random(min, max) {
  return Math.random() * (max - min) + min;
};
/**
 * Start a grain
 * grain - grain object to start
 * state - current settings for granular engine
 */
var startGrain = exports.startGrain = function startGrain(grain, state) {
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
  var position = getPosition(state.buffer.duration, state.position, state.spread);
  // Calculate curve times
  var now = state.context.currentTime;
  var attackTime = state.attack;
  var sustainTime = attackTime + state.sustain;
  var end = sustainTime + state.release;
  // Apply curves
  grain.source.start(now, position, end / 1000 + 0.1);
  // Attack curve
  grain.gain.gain.exponentialRampToValueAtTime(1, now + attackTime / 1000);
  // Wait sustain amount before invoking release curve
  setTimeout(function () {
    return (
      // Release curve
      grain.gain.gain.exponentialRampToValueAtTime(0.0001, now + end / 1000)
    );
  },
  // Sustain
  sustainTime);
  // Clean up when finished
  setTimeout(function () {
    grain.source.stop();
    grain.source.disconnect();
    grain.busy = false;
  }, end + 5);
};