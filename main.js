const audioAnalyzer = new AudioAnalyzer();
const colorVisualizer = new ColorVisualizer('colorCanvas');

let isRunning = false;
let animationId;

document.getElementById('startButton').addEventListener('click', startAnalysis);
document.getElementById('stopButton').addEventListener('click', stopAnalysis);
document.getElementById('saveButton').addEventListener('click', saveSession);
document.getElementById('loadButton').addEventListener('click', loadSession);
document.getElementById('exportButton').addEventListener('click', exportToCSV);

async function startAnalysis() {
    if (!isRunning) {
        try {
            await audioAnalyzer.start();
            isRunning = true;
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
            animate();
        } catch (error) {
            console.error('Error starting audio analysis:', error);
            alert('No se pudo acceder al micrófono. Por favor, asegúrate de que tienes permisos de micrófono habilitados.');
        }
    }
}

function stopAnalysis() {
    if (isRunning) {
        audioAnalyzer.stop();
        isRunning = false;
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
        cancelAnimationFrame(animationId);
    }
}

function animate() {
    const pitch = audioAnalyzer.analyze();
    colorVisualizer.update(pitch);
    animationId = requestAnimationFrame(animate);
}

function saveSession() {
    const colors = colorVisualizer.getColors();
    const blob = new Blob([JSON.stringify(colors)], {type: 'application/json'});
    saveAs(blob, 'session.json');
}

function loadSession() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const colors = JSON.parse(contents);
                colorVisualizer.setColors(colors);
            };
            reader.readAsText(file);
        }
    };
    input.click();
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

// Prevenir el zoom en doble toque en dispositivos móviles
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

// Desactivar el desplazamiento del documento al arrastrar en el canvas
document.getElementById('colorCanvas').addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

