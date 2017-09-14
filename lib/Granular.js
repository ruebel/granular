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

var Granular = function (_React$PureComponent) {
  _inherits(Granular, _React$PureComponent);

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
      if (_this.props.run) return;
      if (!_this.props.buffer) {
        console.warn('No audio buffer provided!');
        return;
      }

      _this.setState(function (state) {
        return {
          interval: setInterval(_this.tick, 1000 / _this.props.density)
        };
      });
    }, _this.stop = function () {
      if (_this.state.run) return;
      if (_this.state.interval) {
        clearInterval(_this.state.interval);
      }
      _this.setState({
        interval: null
      });
    }, _this.tick = function () {
      var grain = _this.state.grains.find(function (g) {
        return !g.busy;
      });
      try {
        if (!grain) {
          grain = (0, _utils.createGrain)(_this.props.pan, _this.state.master, _this.props.context);
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
      var master = (0, _utils.createGain)(this.props.context, this.props.gain);
      if (this.props.output) {
        master.connect(this.props.output);
      } else {
        master.connect(this.props.context.destination);
      }
      this.setState({
        master: master
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      if (next.run !== this.props.run) {
        if (next.run) {
          this.start();
        } else {
          this.stop();
        }
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stop();
      this.state.grains.forEach(_utils.killGrain);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Granular;
}(_react2.default.PureComponent);

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