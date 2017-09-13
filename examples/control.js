import grainular from 'grainular';

const loadFile = () => {
  grainular.loadFile('audio/test.mp3').then(() => {
    const canvas = document.getElementById('waveform');
    drawWaveform(state.buffer, canvas);
  });
};

const setState = (val, prop) => {
  grainular.setState({
    [prop]: Number.parseFloat(val)
  });
};
