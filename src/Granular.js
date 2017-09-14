import React from 'react';
import PropTypes from 'prop-types';
import { createGain, createGrain, killGrain, startGrain } from './utils';

class Granular extends React.PureComponent {
  state = {
    grains: [],
    master: null
  };

  componentDidMount() {
    const master = createGain(this.props.context, this.props.gain);
    if (this.props.output) {
      master.connect(this.props.output);
    } else {
      master.connect(this.props.context.destination);
    }
    this.setState({
      master
    });
  }

  componentWillReceiveProps(next) {
    if (next.run !== this.props.run) {
      if (next.run) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.stop();
    this.state.grains.forEach(killGrain);
  }

  start = () => {
    if (this.props.run) return;
    if (!this.props.buffer) {
      console.warn('No audio buffer provided!');
      return;
    }

    this.setState(state => ({
      interval: setInterval(this.tick, 1000 / this.props.density)
    }));
  };

  stop = () => {
    if (this.state.run) return;
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    this.setState({
      interval: null
    });
  };

  tick = () => {
    let grain = this.state.grains.find(g => !g.busy);
    try {
      if (!grain) {
        grain = createGrain(
          this.props.pan,
          this.state.master,
          this.props.context
        );
        this.setState(state => ({
          grains: [...state.grains, grain]
        }));
      }
      startGrain(grain, this.props);
    } catch (err) {
      console.error(err);
      this.stop();
    }
  };

  render() {
    return null;
  }
}

Granular.defaultProps = {
  attack: 100,
  buffer: null,
  context: null,
  density: 0.1,
  gain: 0.6,
  output: null,
  pan: 1,
  playbackRate: 1,
  position: 0.5,
  release: 100,
  run: false,
  spread: 0.2,
  sustain: 100
};

/* eslint-disable */
Granular.propTypes = {
  attack: PropTypes.number,
  buffer: PropTypes.object,
  context: PropTypes.object.isRequired,
  density: PropTypes.number,
  gain: PropTypes.number,
  output: PropTypes.object,
  pan: PropTypes.number,
  playbackRate: PropTypes.number,
  position: PropTypes.number,
  release: PropTypes.number,
  run: PropTypes.bool,
  spread: PropTypes.number,
  sustain: PropTypes.number
};

export default Granular;
