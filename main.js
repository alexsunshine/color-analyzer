import React, { useState, useEffect, useRef } from 'react';
import { AudioAnalyzer } from './audioAnalyzer';
import { ColorVisualizer } from './colorVisualizer';

const audioAnalyzer = new AudioAnalyzer();
const colorVisualizer = new ColorVisualizer();

export default function SoundColorAnalyzer() {
  const [isRunning, setIsRunning] = useState(false);
  const animationId = useRef(null);

  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  async function startAnalysis() {
    if (!isRunning) {
      await audioAnalyzer.start();
      setIsRunning(true);
      animate();
    }
  }

  function stopAnalysis() {
    if (isRunning) {
      audioAnalyzer.stop();
      setIsRunning(false);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    }
  }

  function animate() {
    const pitch = audioAnalyzer.analyze();
    colorVisualizer.update(pitch);
    animationId.current = requestAnimationFrame(animate);
  }

  function saveSession() {
    const colors = colorVisualizer.getColors();
    const blob = new Blob([JSON.stringify(colors)], {type: 'application/json'});
    saveAs(blob, 'session.json');
  }

  async function loadSession() {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const contents = await file.text();
      const colors = JSON.parse(contents);
      colorVisualizer.setColors(colors);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  function exportToCSV() {
    const colors = colorVisualizer.getColors();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "R,G,B\n";
    colors.forEach(color => {
      csvContent += `${color[0]},${color[1]},${color[2]}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "colors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container">
      <h1>Analizador de Sonido a Color</h1>
      <div className="controls">
        <button onClick={startAnalysis} disabled={isRunning}>Iniciar</button>
        <button onClick={stopAnalysis} disabled={!isRunning}>Detener</button>
        <button onClick={saveSession}>Guardar Sesión</button>
        <button onClick={loadSession}>Cargar Sesión</button>
        <button onClick={exportToCSV}>Exportar a CSV</button>
      </div>
      <canvas id="colorCanvas" ref={colorVisualizer.canvasRef}></canvas>
    </div>
  );
}

