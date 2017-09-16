import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { drawWaveform } from './utils';
import { color } from '../../styles/theme';

const Canvas = styled.canvas`
  image-rendering: -webkit-optimize-contrast !important;
  width: 100%;
  height: 300px;
  display: ${p => (p.drawing ? 'none' : 'block')};
`;

class Waveform extends React.PureComponent {
  state = {
    resizing: null
  };

  componentDidMount() {
    window.addEventListener('resize', this.debounceDraw);
  }

  componentWillReceiveProps(next) {
    if (next.buffer !== this.props.buffer) {
      this.draw(next.buffer);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.draw);
  }

  shouldComponentUpdate() {
    return false;
  }

  debounceDraw = () => {
    clearTimeout(this.state.resizing);
    const resizing = setTimeout(this.draw, 200);
    this.setState({
      resizing
    });
  };

  draw = buffer => {
    drawWaveform(buffer || this.props.buffer, this.canvas, color.primary);
  };

  render() {
    return (
      <Canvas
        innerRef={canvas => {
          this.canvas = canvas;
        }}
        drawing={this.state.drawing}
      />
    );
  }
}

Waveform.propTypes = {
  buffer: PropTypes.object
};

export default Waveform;
