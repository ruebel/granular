import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { drawWaveform } from './utils';

const Canvas = styled.canvas`
  height: 300px;
  width: 100%;
`;

class Waveform extends React.PureComponent {
  componentWillReceiveProps(next) {
    drawWaveform(next.buffer, this.canvas);
  }

  render() {
    return (
      <Canvas
        innerRef={canvas => {
          this.canvas = canvas;
        }}
      />
    );
  }
}

Waveform.propTypes = {
  buffer: PropTypes.object
};

export default Waveform;
