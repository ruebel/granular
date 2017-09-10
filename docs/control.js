const setAttack = val => {
  state.attack = Number.parseFloat(val);
};

const setDensity = val => {
  state.density = Number.parseFloat(val);
  if (state.running) {
    stop();
  }
  start();
};

const setGrainLength = val => {
  state.grainLength = Number.parseFloat(val);
};

const setOffset = val => {
  const offset = Number.parseFloat(val) / 100;
  state.offset = offset;
};

const setPan = val => {
  state.pan = Number.parseFloat(val);
};

const setPlaybackRate = val => {
  state.playbackRate = Number.parseFloat(val);
};

const setRelease = val => {
  state.release = Number.parseFloat(val);
};

const setSpread = val => {
  state.spread = Number.parseFloat(val);
};
