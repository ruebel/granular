import React from 'react';
import Button from './Button';
import Grainular from 'grainular';
import Title from './Title';
import Waveform from './Waveform';
import { getAudioBuffer, getContext } from './utils';

class App extends React.PureComponent {
  state = {
    buffer: null,
    running: false
  };

  componentDidMount() {
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
      running: true
    });
  };

  stop = () => {
    this.setState({
      running: false
    });
  };

  render() {
    return (
      <div>
        <Grainular
          buffer={this.state.buffer}
          context={this.state.context}
          run={this.state.running}
        />
        <Title>Grainular Synth</Title>
        <Button onClick={this.getFile}>Get File</Button>
        <Button onClick={this.start}>Start</Button>
        <Button onClick={this.stop}>Stop</Button>

        <div className="sliders">
          <div className="input-group">
            <input
              min="10"
              max="100"
              type="range"
              onInput={value => this.setValue(value, 'attack')}
              orient="vertical"
            />
            <h4>Attack</h4>
          </div>
          <div className="input-group">
            <input
              min="0"
              max="200"
              type="range"
              onInput={value => this.setValue(value, 'sustain')}
              orient="vertical"
            />
            <h4>Sustain</h4>
          </div>
          <div className="input-group">
            <input
              min="10"
              max="100"
              type="range"
              onInput={value => this.setValue(value, 'release')}
              orient="vertical"
            />
            <h4>Release</h4>
          </div>
          <div className="input-group">
            <input
              min="1"
              max="100"
              type="range"
              onInput={value => this.setValue(value, 'density')}
              orient="vertical"
            />
            <h4>Density</h4>
          </div>
          <div className="input-group">
            <input
              min="0"
              max="2"
              step="0.01"
              type="range"
              onInput={value => this.setValue(value, 'playbackRate')}
              orient="vertical"
            />
            <h4>Playback Rate</h4>
          </div>
          <div className="input-group">
            <input
              min="0"
              max="1"
              step="0.01"
              type="range"
              onInput={value => this.setValue(value, 'pan')}
              orient="vertical"
            />
            <h4>Pan</h4>
          </div>
          <div className="input-group">
            <input
              min="0"
              max="2"
              step="0.01"
              type="range"
              onInput={value => this.setValue(value, 'spread')}
              orient="vertical"
            />
            <h4>Spread</h4>
          </div>
        </div>
        <h4>Position</h4>
        <input
          min="0"
          max="1"
          step="0.01"
          type="range"
          onInput={value => this.setValue(value, 'position')}
          style={{ width: '100%' }}
        />
        <Waveform buffer={this.state.buffer} />
      </div>
    );
  }
}

export default App;
