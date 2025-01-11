import React from 'react';

export class ColorVisualizer {
  constructor() {
    this.canvasRef = React.createRef();
    this.frecuencias_notas = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
    this.colores_notas = [
      [255, 0, 0], [255, 64, 0], [255, 127, 0], [255, 191, 0],
      [255, 255, 0], [127, 255, 0], [64, 255, 0], [0, 255, 0],
      [0, 255, 64], [0, 255, 127], [0, 255, 191], [0, 255, 255]
    ];
    this.currentColors = new Array(12).fill([0, 0, 0]);
  }

  update(pitch) {
    if (pitch > 0) {
      const noteIndex = this.getNearestNoteIndex(pitch);
      this.currentColors[noteIndex] = this.colores_notas[noteIndex];
    }

    this.draw();
  }

  getNearestNoteIndex(pitch) {
    return this.frecuencias_notas.reduce((nearestIndex, freq, index, arr) => {
      return Math.abs(freq - pitch) < Math.abs(arr[nearestIndex] - pitch) ? index : nearestIndex;
    }, 0);
  }

  draw() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width / this.currentColors.length;
    this.currentColors.forEach((color, index) => {
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(index * width, 0, width, canvas.height);
    });
  }

  getColors() {
    return this.currentColors;
  }

  setColors(colors) {
    this.currentColors = colors;
    this.draw();
  }
}

