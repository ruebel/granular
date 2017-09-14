import React from 'react';
import Button from './Button';
import Granular from '../lib/Granular';
import Slider from './Slider';
import Title from './Title';
import Waveform from './Waveform';
import { getAudioBuffer, getContext } from './utils';

class App extends React.PureComponent {
  state = {
    attack: 20,
    buffer: null,
    context: null,
    density: 0.1,
    gain: 0.6,
    output: null,
    pan: 1,
    playbackRate: 1,
    position: 0.5,
    release: 20,
    run: false,
    spread: 0.2,
    sustain: 100
  };

  componentWillMount() {
    const context = getContext();
    this.setState({
      context
    });
  }

  getFile = async path => {
    const buffer = await getAudioBuffer('audio/test.mp3', this.state.context);
    this.setState({ buffer });
  };

  setValue = (val, prop) => {
    this.setState({
      [prop]: Number.parseFloat(val)
    });
  };

  start = () => {
    this.setState({
      run: true
    });
  };

  stop = () => {
    this.setState({
      run: false
    });
  };

  render() {
    return (
      <div>
        <Granular {...this.state} />
        <Title>Granular Synth</Title>
        <Button onClick={this.getFile}>Get File</Button>
        <Button onClick={this.start}>Start</Button>
        <Button onClick={this.stop}>Stop</Button>

        <div className="sliders">
          <Slider
            max={100}
            min={10}
            onChange={this.setValue}
            propName="attack"
            step={1}
            title="Attack"
            value={this.state.attack}
          />
          <Slider
            max={200}
            onChange={this.setValue}
            propName="sustain"
            step={1}
            title="Sustain"
            value={this.state.sustain}
          />
          <Slider
            max={100}
            min={10}
            onChange={this.setValue}
            propName="release"
            step={1}
            title="Release"
            value={this.state.release}
          />
          <Slider
            max={1}
            min={0.01}
            onChange={this.setValue}
            propName="density"
            step={0.01}
            title="Density"
            value={this.state.density}
          />
          <Slider
            max={2}
            onChange={this.setValue}
            propName="playbackRate"
            title="Playback Rate"
            value={this.state.playbackRate}
          />
          <Slider
            onChange={this.setValue}
            propName="pan"
            title="Pan"
            value={this.state.pan}
          />
          <Slider
            max={2}
            onChange={this.setValue}
            propName="spread"
            title="Spread"
            value={this.state.spread}
          />
        </div>
        <h4>Position</h4>
        <input
          min="0"
          max="1"
          step="0.01"
          type="range"
          onChange={event => this.setValue(event.target.value, 'position')}
          style={{ width: '100%' }}
          value={this.state.position}
        />
        <Waveform buffer={this.state.buffer} />
      </div>
    );
  }
}

export default App;
