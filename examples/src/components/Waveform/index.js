import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { drawWaveform } from './utils';
import { color } from '../../styles/theme';

const Canvas = styled.canvas`
  image-rendering: -webkit-optimize-contrast !important;
  width: 100%;
  height: 300px;
`;

class Waveform extends React.PureComponent {
  componentWillReceiveProps(next) {
    if (next.buffer !== this.props.buffer) {
      drawWaveform(next.buffer, this.canvas, color.primary);
    }
  }

  shouldComponentUpdate() {
    return false;
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
