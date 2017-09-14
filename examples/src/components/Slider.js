import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({
  max = 1,
  min = 0,
  onChange,
  propName,
  step = 0.01,
  title,
  value
}) => {
  return (
    <div className="input-group">
      <input
        max={max}
        min={min}
        onChange={event => onChange(event.target.value, propName)}
        orient="vertical"
        step={step}
        type="range"
        value={value}
      />
      <h4>{title}</h4>
    </div>
  );
};

Slider.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  propName: PropTypes.string.isRequired,
  step: PropTypes.number,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default Slider;
