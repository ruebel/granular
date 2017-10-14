import React from 'react';
import PropTypes from 'prop-types';
import { createGain, createGrain, killGrain, startGrain } from './utils';

class Granular extends React.Component {
  state = {
    grains: [],
    master: null
  };

  componentDidMount() {
    // Create our master gain channel
    const master = createGain(this.props.context, this.props.gain);
    if (this.props.output) {
      // Connect to given output
      master.connect(this.props.output);
    } else {
      // Connect to context if no output was given
      master.connect(this.props.context.destination);
    }
    this.setState({
      master
    });
  }

  componentWillReceiveProps(next) {
    if (next.run !== this.props.run) {
      // Detect if we need to start or stop the engine
      if (next.run) {
        this.start();
      } else {
        this.stop();
      }
    } else if (next.density !== this.props.density && this.state.interval) {
      // A change in density means we have to adust the interval time
      clearInterval(this.state.interval);
      this.setState(state => ({
        interval: setInterval(this.tick, 1000 / this.props.density)
      }));
    } else if (next.gain !== this.props.gain) {
      // Change the master gain
      const master = this.state.master;
      master.gain.value = Math.max(0.001, Math.min(1, next.gain));
    }
  }

  shouldComponentUpdate() {
    // We only render audio so no need to call render
    return false;
  }

  componentWillUnmount() {
    // Clean up timer and grains
    this.stop();
    this.state.grains.forEach(killGrain);
  }

  start = () => {
    // No need to start if we are already running
    if (this.state.interval) return;
    // We cannot start if we don't have a buffer
    if (!this.props.buffer) {
      console.warn('No audio buffer provided!');
      return;
    }
    // Setup interval to handle grains
    this.setState(state => ({
      interval: setInterval(this.tick, 1000 / this.props.density)
    }));
  };

  stop = () => {
    // Stop the interval
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    // Clean up
    this.setState({
      interval: null
    });
  };

  tick = () => {
    // Find a grain that isn't busy
    let grain = this.state.grains.find(g => !g.busy);
    try {
      if (!grain) {
        // If we couldn't find a grain create a new one
        grain = createGrain(
          this.props.pan,
          this.state.master,
          this.props.context
        );
        // Add the grain reference to our state
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
    // We are only rendering audio!
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
