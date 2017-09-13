export const getAudioBuffer = async path => {
  const response = await fetch(path);
  const audioData = await response.arrayBuffer();
  return new Promise((resolve, reject) => {
    context.decodeAudioData(audioData, buffer => {
      return resolve(buffer);
    });
  });
};
