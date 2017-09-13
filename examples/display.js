const drawPoint = (ctx, x, y, width, height) => {
  ctx.strokeRect(x, y, width, height);
};

const drawWaveform = (buffer, canvas) => {
  const wave = buffer.getChannelData(0);
  const ctx = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = 300);
  ctx.lineWidth = 1;
  ctx.strokeWidth = 1;
  ctx.strokeStyle = 'green';

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
