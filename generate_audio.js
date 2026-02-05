import fs from 'fs';
import { Buffer } from 'buffer';

// Audio parameters
const sampleRate = 44100;
const volume = 0.5;

// Note frequencies
const notes = {
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'F5': 698.46,
    'G5': 783.99,
    'A5': 880.00
};

// Happy Birthday melody
const melody = [
    { note: 'G4', duration: 0.4 }, { note: 'G4', duration: 0.4 }, { note: 'A4', duration: 0.8 }, { note: 'G4', duration: 0.8 }, { note: 'C5', duration: 0.8 }, { note: 'B4', duration: 1.6 },
    { note: 'G4', duration: 0.4 }, { note: 'G4', duration: 0.4 }, { note: 'A4', duration: 0.8 }, { note: 'G4', duration: 0.8 }, { note: 'D5', duration: 0.8 }, { note: 'C5', duration: 1.6 },
    { note: 'G4', duration: 0.4 }, { note: 'G4', duration: 0.4 }, { note: 'G5', duration: 0.8 }, { note: 'E5', duration: 0.8 }, { note: 'C5', duration: 0.8 }, { note: 'B4', duration: 0.8 }, { note: 'A4', duration: 1.6 },
    { note: 'F5', duration: 0.4 }, { note: 'F5', duration: 0.4 }, { note: 'E5', duration: 0.8 }, { note: 'C5', duration: 0.8 }, { note: 'D5', duration: 0.8 }, { note: 'C5', duration: 2.4 }
];

function generateSineWave(freq, duration) {
    const samples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(samples * 2);

    for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        const wave = Math.sin(2 * Math.PI * freq * t);

        let envelope = 1;
        if (i < 500) envelope = i / 500;
        if (i > samples - 500) envelope = (samples - i) / 500;

        const amplitude = wave * volume * envelope;

        const val = Math.max(-1, Math.min(1, amplitude)) * 32767;
        buffer.writeInt16LE(Math.floor(val), i * 2);
    }
    return buffer;
}

const buffers = [];
let totalDataSize = 0;

melody.forEach(({ note, duration }) => {
    const freq = notes[note];
    if (freq) {
        const buffer = generateSineWave(freq, duration * 0.8);
        buffers.push(buffer);
        totalDataSize += buffer.length;

        const pauseSamples = Math.floor(sampleRate * (duration * 0.2));
        const pauseBuffer = Buffer.alloc(pauseSamples * 2);
        buffers.push(pauseBuffer);
        totalDataSize += pauseBuffer.length;
    }
});

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + totalDataSize, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(totalDataSize, 40);

const finalBuffer = Buffer.concat([header, ...buffers]);

if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

fs.writeFileSync('public/birthday-song.wav', finalBuffer);
console.log('Audio file generated successfully: public/birthday-song.wav');
