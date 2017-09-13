import React from 'react';

const App = () => {
  return (
    <h1>Grainular Synth</h1>

    <button onclick="getFile()">Get File</button>
    <button onclick="start()">Start</button>
    <button onclick="stop()">Stop</button>

    <div class="sliders">
      <div class="input-group">
        <input min="10" max="100" type="range" oninput="setState(this.value, 'attack')" orient="vertical"/>
        <h4>Attack</h4>
      </div>
      <div class="input-group">
        <input min="0" max="200" type="range" oninput="setState(this.value, 'sustain')" orient="vertical"/>
        <h4>Sustain</h4>
      </div>
      <div class="input-group">
        <input min="10" max="100" type="range" oninput="setState(this.value, 'release')" orient="vertical"/>
        <h4>Release</h4>
      </div>
      <div class="input-group">
        <input min="1" max="100" type="range" oninput="setState(this.value, 'density')" orient="vertical"/>
        <h4>Density</h4>
      </div>
      <div class="input-group">
        <input min="0" max="2"  step="0.01" type="range" oninput="setState(this.value, 'playbackRate')" orient="vertical"/>
        <h4>Playback Rate</h4>
      </div>
      <div class="input-group">
        <input min="0" max="1"  step="0.01" type="range" oninput="setState(this.value, 'pan')" orient="vertical"/>
        <h4>Pan</h4>
      </div>
      <div class="input-group">
        <input min="0" max="2"  step="0.01" type="range" oninput="setState(this.value, 'spread')" orient="vertical"/>
        <h4>Spread</h4>
      </div>
    </div>


    <h4>Position</h4>
    <input min="0" max="1" step="0.01" type="range" oninput="setState(this.value, 'position')" style="width: 100%;"/>
    <canvas id="waveform" class="canvas"/>
  );
}
