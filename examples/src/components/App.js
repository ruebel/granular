import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import Granular from '../lib/Granular';
import Slider from './Slider';
import Title from './Title';
import Waveform from './Waveform';
import { getAudioBuffer, getContext } from './utils';

const Sliders = styled.div`
  display: flex;
  width: 100%;
  margin: 1.5em 0;
`;

const Wrapper = styled.div`
  background: linear-gradient(
    to top left,
    ${p => p.theme.color.background},
    ${p => p.theme.color.backgroundSecondary}
  );
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0.8em;
`;

class App extends React.PureComponent {
  state = {
    attack: 20,
    buffer: null,
    context: null,
    density: 500,
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
      <Wrapper>
        <Granular {...this.state} />
        <Title>Granular Synth</Title>
        <Button onClick={this.getFile}>Get File</Button>
        <Button onClick={this.start}>Start</Button>
        <Button onClick={this.stop}>Stop</Button>

        <Sliders>
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
            max={4000}
            min={10}
            onChange={this.setValue}
            propName="density"
            step={1}
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
          <Slider
            onChange={this.setValue}
            propName="gain"
            title="Gain"
            value={this.state.gain}
          />
        </Sliders>
        <Slider
          min={0}
          max={1}
          orient="horizontal"
          onChange={this.setValue}
          propName="position"
          step={0.01}
          title="Position"
          value={this.state.position}
        />
        <Waveform buffer={this.state.buffer} />
      </Wrapper>
    );
  }
}

export default App;
