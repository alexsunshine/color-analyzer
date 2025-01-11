export function yinPitchDetection(buffer, sampleRate, threshold = 0.1) {
  const bufferLength = buffer.length;
  const yinBuffer = new Float32Array(bufferLength / 2);

  // Step 1: Autocorrelation
  for (let t = 0; t < yinBuffer.length; t++) {
    yinBuffer[t] = 0;
    for (let i = 0; i < yinBuffer.length; i++) {
      const diff = buffer[i] - buffer[i + t];
      yinBuffer[t] += diff * diff;
    }
  }

  // Step 2 and 3: Cumulative mean normalized difference function
  let runningSum = 0;
  yinBuffer[0] = 1;
  for (let t = 1; t < yinBuffer.length; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }

  // Step 4: Absolute threshold
  let tau;
  for (tau = 2; tau < yinBuffer.length; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < yinBuffer.length && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      return sampleRate / tau;
    }
  }

  return -1; // No pitch found
}

