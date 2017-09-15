const drawPoint = (ctx, x, y, width, height) => {
  ctx.strokeRect(x, y, width, height);
};

export const drawWaveform = (buffer, canvas, style) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!buffer) return;
  const wave = buffer.getChannelData(0);
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = 300);
  ctx.lineWidth = 1;
  ctx.strokeWidth = 1;
  ctx.strokeStyle = style;

  const step = Math.ceil(wave.length / width);
  const maxAmp = height / 2;

  for (let i = 0; i < width; i++) {
    const bounds = getBounds(wave.slice(i * step, i * step + step));
    drawPoint(
      ctx,
      i,
      (1 + bounds.min) * maxAmp,
      1,
      Math.max(1, (bounds.max - bounds.min) * maxAmp)
    );
  }
};

const getBounds = values => {
  return {
    max: Math.max(-1.0, ...values),
    min: Math.min(1.0, ...values)
  };
};
