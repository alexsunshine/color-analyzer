import { yinPitchDetection } from './yin';

export class AudioAnalyzer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
    }

    async start() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
    }

    stop() {
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
    }

    analyze() {
        this.analyser.getFloatTimeDomainData(this.dataArray);
        const pitch = yinPitchDetection(this.dataArray, this.audioContext.sampleRate);
        return pitch;
    }
}

