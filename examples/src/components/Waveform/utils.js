/**
 * Convienence function to draw a point in waveform
 */
const drawPoint = (ctx, x, y, width, height) => {
  ctx.strokeRect(x, y, width, height);
};
/**
 * Draw a waveform on a canvas
 * buffer - waveform buffer
 * canvas - HTML5 canvas reference
 * style - line style to use (color)
 */
export const drawWaveform = (buffer, canvas, style) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!buffer) return;
  // get the wave data
  const wave = buffer.getChannelData(0);
  // get our canvas size
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = 300);
  // set up line style
  ctx.lineWidth = 1;
  ctx.strokeWidth = 1;
  ctx.strokeStyle = style;
  // find how many steps we are going to draw
  const step = Math.ceil(wave.length / width);
  // find the max height we can draw
  const maxAmp = height / 2;
  // draw each step in the wave
  for (let i = 0; i < width; i++) {
    // get the max and min values at this step
    const bounds = getBounds(wave.slice(i * step, i * step + step));
    // draw a line from min to max at this step
    drawPoint(
      ctx,
      i,
      (1 + bounds.min) * maxAmp,
      1,
      Math.max(1, (bounds.max - bounds.min) * maxAmp)
    );
  }
};
/**
 * Get the max and min values of an array
 */
const getBounds = values => {
  return {
    max: Math.max(-1.0, ...values),
    min: Math.min(1.0, ...values)
  };
};
