'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createGain = exports.createGain = function createGain(context) {
  var velocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.001;

  var gain = context.createGain();
  gain.gain.value = velocity;
  return gain;
};

var createGrain = exports.createGrain = function createGrain(state, master, context) {
  var gain = createGain(context);
  var pan = createPan(context, state.pan);
  pan.connect(gain);
  gain.connect(master);

  return {
    busy: false,
    gain: gain,
    pan: pan
  };
};

var createPan = function createPan(context, pan) {
  var panner = context.createPanner();
  panner.panningModel = 'equalpower';
  panner.distanceModel = 'linear';
  return panner;
};

var getContext = exports.getContext = function getContext() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
  var context = new AudioContext();
  return context;
};

var getPosition = function getPosition(duration, position, spread) {
  var spreadOffset = Math.random() * spread - spread / 2;
  var adjustedPos = position * duration;
  return Math.max(0, adjustedPos + spreadOffset);
};

var killGrain = exports.killGrain = function killGrain(grain) {
  if (grain.source) {
    grain.source.stop();
    grain.source.disconnect();
  }
  grain.gain.disconnect();
};

var random = function random(min, max) {
  return Math.random() * (max - min) + min;
};

var startGrain = exports.startGrain = function startGrain(grain, state, context) {
  grain.busy = true;
  // Create source
  grain.source = context.createBufferSource();
  grain.source.buffer = state.buffer;
  grain.source.connect(grain.pan);
  grain.pan.setPosition(random(-state.pan, state.pan), 0, 0);
  grain.source.playbackRate.value *= state.playbackRate;
  // Calculate curve times
  var now = context.currentTime;
  var position = getPosition(state.buffer.duration, state.position, state.spread);
  var attackTime = state.attack;
  var holdTime = attackTime + state.sustain;
  var end = holdTime + state.release;
  // Apply curves
  grain.source.start(now, position, end / 1000 + 0.1);
  grain.gain.gain.exponentialRampToValueAtTime(1, now + attackTime / 1000);
  setTimeout(function () {
    return grain.gain.gain.exponentialRampToValueAtTime(0.0001, now + end / 1000);
  }, holdTime);
  // Clean up when finished
  setTimeout(function () {
    grain.source.stop();
    grain.source.disconnect();
    grain.busy = false;
  }, end + 5);
};