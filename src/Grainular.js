import React from 'react';
import PropTypes from 'prop-types';
import {
  createGain,
  createGrain,
  getContext,
  killGrain,
  startGrain
} from './utils';

class Grainular extends React.PureComponent {
  state = {
    buffer: null,
    context: null,
    grains: [],
    master: null
  };

  componentDidMount() {
    const context = this.props.context || getContext();
    const master = createGain(context, this.props.gain);
    if (this.props.output) {
      master.connect(this.props.output);
    } else {
      master.connect(context.destination);
    }
    this.setState({
      context,
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

  componentWillUnmount() {
    this.stop();
    this.state.grains.forEach(killGrain);
  }

  start = () => {
    if (this.props.run) return;

    this.setState(state => ({
      interval: setInterval(() => {
        let grain = state.grains.find(g => !g.busy);
        try {
          if (!grain) {
            grain = createGrain(this.props, state.master, state.context);
            this.setState(state => ({
              grains: [...state.grains, grain]
            }));
          }
          startGrain(grain, this.props, state.context);
        } catch (err) {
          console.error(err);
          this.stop();
        }
      }, 5 / this.props.density)
    }));
  };

  stop = () => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    this.setState({
      interval: null
    });
  };

  render() {
    return null;
  }
}

Grainular.defaultProps = {
  attack: 100,
  buffer: null,
  context: null,
  density: 0.6,
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
Grainular.propTypes = {
  attack: PropTypes.number,
  buffer: PropTypes.object,
  context: PropTypes.object,
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

export default Grainular;
