'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Granular = function (_React$Component) {
  _inherits(Granular, _React$Component);

  function Granular() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Granular);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Granular.__proto__ || Object.getPrototypeOf(Granular)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      grains: [],
      master: null
    }, _this.start = function () {
      // No need to start if we are already running
      if (_this.state.interval) return;
      // We cannot start if we don't have a buffer
      if (!_this.props.buffer) {
        console.warn('No audio buffer provided!');
        return;
      }
      // Setup interval to handle grains
      _this.setState(function (state) {
        return {
          interval: setInterval(_this.tick, 1000 / _this.props.density)
        };
      });
    }, _this.stop = function () {
      // Stop the interval
      if (_this.state.interval) {
        clearInterval(_this.state.interval);
      }
      // Clean up
      _this.setState({
        interval: null
      });
    }, _this.tick = function () {
      // Find a grain that isn't busy
      var grain = _this.state.grains.find(function (g) {
        return !g.busy;
      });
      try {
        if (!grain) {
          // If we couldn't find a grain create a new one
          grain = (0, _utils.createGrain)(_this.props.pan, _this.state.master, _this.props.context);
          // Add the grain reference to our state
          _this.setState(function (state) {
            return {
              grains: [].concat(_toConsumableArray(state.grains), [grain])
            };
          });
        }
        (0, _utils.startGrain)(grain, _this.props);
      } catch (err) {
        console.error(err);
        _this.stop();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Granular, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Create our master gain channel
      var master = (0, _utils.createGain)(this.props.context, this.props.gain);
      if (this.props.output) {
        // Connect to given output
        master.connect(this.props.output);
      } else {
        // Connect to context if no output was given
        master.connect(this.props.context.destination);
      }
      this.setState({
        master: master
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      var _this2 = this;

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
        this.setState(function (state) {
          return {
            interval: setInterval(_this2.tick, 1000 / _this2.props.density)
          };
        });
      } else if (next.gain !== this.props.gain) {
        // Change the master gain
        var master = this.state.master;
        master.gain.value = Math.max(0.001, Math.min(1, next.gain));
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      // We only render audio so no need to call render
      return false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // Clean up timer and grains
      this.stop();
      this.state.grains.forEach(_utils.killGrain);
    }
  }, {
    key: 'render',
    value: function render() {
      // We are only rendering audio!
      return null;
    }
  }]);

  return Granular;
}(_react2.default.Component);

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
  attack: _propTypes2.default.number,
  buffer: _propTypes2.default.object,
  context: _propTypes2.default.object.isRequired,
  density: _propTypes2.default.number,
  gain: _propTypes2.default.number,
  output: _propTypes2.default.object,
  pan: _propTypes2.default.number,
  playbackRate: _propTypes2.default.number,
  position: _propTypes2.default.number,
  release: _propTypes2.default.number,
  run: _propTypes2.default.bool,
  spread: _propTypes2.default.number,
  sustain: _propTypes2.default.number
};

exports.default = Granular;