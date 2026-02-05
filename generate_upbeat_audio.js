import fs from 'fs';
import { Buffer } from 'buffer';

// Audio parameters
const sampleRate = 44100;
const bpm = 140; // Faster tempo!
const beatDuration = 60 / bpm;

// Frequencies
const notes = {
    'G3': 196.00, 'A3': 220.00, 'B3': 246.94, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
};

// Melody (Duration in beats)
const melody = [
    { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.25 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'C5', duration: 1 }, { note: 'B4', duration: 2 },
    { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.25 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'D5', duration: 1 }, { note: 'C5', duration: 2 },
    { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.25 }, { note: 'G5', duration: 1 }, { note: 'E5', duration: 1 }, { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 }, { note: 'A4', duration: 2 },
    { note: 'F5', duration: 0.75 }, { note: 'F5', duration: 0.25 }, { note: 'E5', duration: 1 }, { note: 'C5', duration: 1 }, { note: 'D5', duration: 1 }, { note: 'C5', duration: 3 }
];

// Simple Bassline (Root notes)
const bassline = [
    { note: 'C4', duration: 6 }, // Bars 1-2 approx
    { note: 'G3', duration: 6 },
    { note: 'C4', duration: 8 },
    { note: 'F4', duration: 4 }, { note: 'C4', duration: 4 }
];

function generateTone(freq, duration, type = 'sine', vol = 0.5) {
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        let wave = 0;

        if (type === 'sine') {
            wave = Math.sin(2 * Math.PI * freq * t);
        } else if (type === 'square') {
            wave = Math.sign(Math.sin(2 * Math.PI * freq * t));
        } else if (type === 'sawtooth') {
            wave = 2 * (freq * t - Math.floor(freq * t + 0.5));
        }

        // Envelope
        let envelope = 1;
        if (i < 500) envelope = i / 500;
        if (i > samples - 2000) envelope = (samples - i) / 2000;

        buffer[i] = wave * vol * envelope;
    }
    return buffer;
}

function generateNoise(duration, vol = 0.3) {
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
        buffer[i] = (Math.random() * 2 - 1) * vol * Math.pow((samples - i) / samples, 2); // Decay
    }
    return buffer;
}

// Mix tracks
const totalDurationBeats = melody.reduce((acc, n) => acc + n.duration, 0);
const totalSamples = Math.floor(sampleRate * totalDurationBeats * beatDuration);
const mixBuffer = new Float32Array(totalSamples);

// 1. Render Melody (Square wave for 8-bit feel)
let currentSample = 0;
melody.forEach(({ note, duration }) => {
    if (notes[note]) {
        const durSec = duration * beatDuration;
        const tone = generateTone(notes[note], durSec * 0.9, 'square', 0.15); // Lower volume to mix
        for (let i = 0; i < tone.length; i++) {
            if (currentSample + i < mixBuffer.length) mixBuffer[currentSample + i] += tone[i];
        }
    }
    currentSample += Math.floor(sampleRate * duration * beatDuration);
});

// 2. Render Bass (Sawtooth)
currentSample = 0;
// Just repeating a simple bass pattern for simplicity to match melody length crudely
const bassPattern = ['C3', 'G2', 'C3', 'F2'];
let bassIdx = 0;
for (let t = 0; t < totalDurationBeats; t += 1) { // 1 beat steps
    const note = bassPattern[bassIdx % bassPattern.length];
    bassIdx++;
    // Frequencies roughly
    const freq = note === 'C3' ? 130.81 : (note === 'G2' ? 98.00 : (note === 'F2' ? 87.31 : 130.81));
    const tone = generateTone(freq, beatDuration * 0.8, 'sawtooth', 0.15);
    const startSample = Math.floor(sampleRate * t * beatDuration);
    for (let i = 0; i < tone.length; i++) {
        if (startSample + i < mixBuffer.length) mixBuffer[startSample + i] += tone[i];
    }
}

// 3. Render Drums (Simple Hi-hat / Kick pattern every beat)
for (let t = 0; t < totalDurationBeats * 2; t += 1) { // 8th notes
    const isKick = t % 2 === 0;
    const dur = beatDuration / 2;
    const startSample = Math.floor(sampleRate * t * dur);

    if (isKick) {
        // Kick (low freq sine sweep)
        const kickSamples = Math.floor(sampleRate * 0.15);
        for (let i = 0; i < kickSamples; i++) {
            if (startSample + i < mixBuffer.length) {
                const sweepFreq = 150 * (1 - i / kickSamples);
                mixBuffer[startSample + i] += Math.sin(2 * Math.PI * sweepFreq * (i / sampleRate)) * 0.3;
            }
        }
    } else {
        // Hi-hat (noise)
        const hat = generateNoise(0.05, 0.1);
        for (let i = 0; i < hat.length; i++) {
            if (startSample + i < mixBuffer.length) mixBuffer[startSample + i] += hat[i];
        }
    }
}


// Convert to 16-bit PCM Buffer
const pcmBuffer = Buffer.alloc(mixBuffer.length * 2);
for (let i = 0; i < mixBuffer.length; i++) {
    // Hard clipper limiter
    let val = mixBuffer[i];
    if (val > 1) val = 1;
    if (val < -1) val = -1;

    const intVal = Math.floor(val * 32767);
    pcmBuffer.writeInt16LE(intVal, i * 2);
}

// WAV Header
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcmBuffer.length, 4);
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
header.writeUInt32LE(pcmBuffer.length, 40);

const finalBuffer = Buffer.concat([header, pcmBuffer]);

if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

fs.writeFileSync('public/birthday-song.wav', finalBuffer);
console.log('Upbeat Audio file generated successfully: public/birthday-song.wav');
