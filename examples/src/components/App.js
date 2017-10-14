import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import FileInput from './FileInput';
import Granular from '../lib/Granular';
import Slider from './Slider';
import Title from './Title';
import Waveform from 'waveform-react';
import { getAudioBuffer, getContext } from './utils';
import { color } from '../styles/theme';

const Sliders = styled.div`
  display: flex;
  width: 100%;
  margin: 1.5em 0;
`;

const WaveformWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
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

  getFile = async (path = 'audio/test.mp3') => {
    const buffer = await getAudioBuffer(path, this.state.context);
    this.setState({ buffer });
  };

  handleFile = event => {
    const files = event.target.files;
    const file = window.URL.createObjectURL(files[0]);
    this.getFile(file);
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
        <Button onClick={() => this.getFile()}>Example File</Button>
        <FileInput accept="audio/*" onChange={this.handleFile} />
        <Button
          disabled={!this.state.buffer || this.state.run}
          onClick={this.start}
        >
          Start
        </Button>
        <Button disabled={!this.state.run} onClick={this.stop}>
          Stop
        </Button>

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
        <WaveformWrapper>
          <Waveform
            buffer={this.state.buffer}
            markerStyle={{
              color: color.tertiary,
              width: 4
            }}
            onPositionChange={pos => this.setValue(pos, 'position')}
            position={this.state.position}
            responsive
            showPosition
            waveStyle={{
              animate: true,
              color: color.primary,
              pointWidth: 1
            }}
          />
        </WaveformWrapper>
      </Wrapper>
    );
  }
}

export default App;
