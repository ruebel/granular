const drawWaveform = (buffer, canvas) => {
  const wave = buffer.getChannelData(0);
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
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

const drawPoint = (ctx, x, y, width, height) => {
  const trans = (x % 2) / 2;
  ctx.translate(trans, 0);
  ctx.strokeRect(x, y, width, height);
  ctx.translate(-trans, 0);
};

const getBounds = values => {
  return {
    max: Math.max(-1.0, ...values),
    min: Math.min(1.0, ...values)
  };
};
