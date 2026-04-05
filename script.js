const chords = [
	'C',
	'Cm',
	'C7',
	'Cmaj7',
	'D',
	'Dm',
	'D7',
	'E',
	'Em',
	'F',
	'Fm',
	'G',
	'G7',
	'A',
	'Am',
	'B',
	'Bm',
];

function showChord() {
	const root = document.getElementById('chord').value;
	const quality = document.getElementById('quality').value;

	const seventh = document.getElementById('seventh').value;

	const add9 = document.getElementById('add9')?.checked;
	const add11 = document.getElementById('add11')?.checked;

	// build chord intervals
	const intervals = buildChord(root, quality, seventh, {
		add9: add9,
		add11: add11,
	});

	renderPiano(root, intervals);
	renderGuitar(root, intervals);
}

const baseNotes = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B',
];

// build 2 octaves
function buildKeyboard() {
	const keys = [];
	for (let octave = 0; octave < 2; octave++) {
		baseNotes.forEach((note) => {
			keys.push(note + octave);
		});
	}
	return keys;
}

function renderPiano(root, intervals) {
	const piano = document.getElementById('piano');
	piano.innerHTML = '';

	const keyboard = buildKeyboard();
	const rootIndex = baseNotes.indexOf(root);

	// STEP 1: anchor root
	const startIndex = getAnchoredRootIndex(root);

	// STEP 2: build actual note positions
	const activeIndexes = intervals.map((i) => startIndex + i);

	// WHITE KEYS
	const whiteKeys = keyboard.filter((k) => !k.includes('#'));

	whiteKeys.forEach((noteFull) => {
		const key = document.createElement('div');
		key.className = 'white-key';

		const fullIndex = keyboard.indexOf(noteFull);

		if (activeIndexes.includes(fullIndex)) {
			key.classList.add('active-white');
		}

		piano.appendChild(key);
	});

	// BLACK KEYS
	keyboard.forEach((noteFull, i) => {
		if (!noteFull.includes('#')) return;

		const key = document.createElement('div');
		key.className = 'black-key';

		const whiteIndex = keyboard
			.slice(0, i)
			.filter((n) => !n.includes('#')).length;

		key.style.left = whiteIndex * 60 - 20 + 'px';

		if (activeIndexes.includes(i)) {
			key.classList.add('active-black');
		}

		piano.appendChild(key);
	});
}

function getAnchoredRootIndex(root) {
	const keyboard = buildKeyboard();
	const maxStart = keyboard.length - 8; // leave room for chord

	// Root note is leftmost. Octave is leftmost.
	for (let i = 0; i < keyboard.length; i++) {
		if (keyboard[i].startsWith(root)) {
			return Math.min(i, maxStart);
		}
	}

	return 0;
}

function buildChord(root, quality, seventh, extensions) {
	const formulas = {
		major: [0, 4, 7],
		minor: [0, 3, 7],
		diminished: [0, 3, 6],
		augmented: [0, 4, 8],
		sus2: [0, 2, 7],
		sus4: [0, 5, 7],

		dominant7: [10],
		major7: [11],
		minor7: [10],
	};

	let intervals = [...formulas[quality]];

	if (seventh != '') intervals.push([...formulas[seventh]]);

	if (extensions.add9) intervals.push(14);
	if (extensions.add11) intervals.push(17);

	// normalize to 0–11 (per octave. EX: Cadd9 over 2 octave == Cadd2 over 1 octave)
	intervals = intervals.map((i) => i % 24);

	return [...new Set(intervals)];
}

// ===========GUITAR INFO================

// function getChordNotes(root, intervals) {
// 	const rootIndex = baseNotes.indexOf(root);

// 	return intervals.map((i) => baseNotes[(rootIndex + i) % 12]);
// }

// function getFretboardPositions(root, intervals, board) {
// 	const chordNotes = getChordNotes(root, intervals);

// 	const FRET_START = 0;
// 	const FRET_SPAN = 5;
// 	const FRET_END = FRET_START + FRET_SPAN;

// 	const positions = [];

// 	board.forEach((string, stringIndex) => {
// 		string.forEach((note, fretIndex) => {
// 			// ✅ ONLY keep frets in the window
// 			if (fretIndex < FRET_START || fretIndex > FRET_END) return;

// 			if (chordNotes.includes(note)) {
// 				positions.push({
// 					string: stringIndex,
// 					fret: fretIndex,
// 					note: note,
// 				});
// 			}
// 		});
// 	});

// 	return positions;
// }

// function findBestFretWindow(board, chordNotes) {
// 	const MAX_SPAN = 5;

// 	for (let start = 0; start < 8; start++) {
// 		const end = start + MAX_SPAN;

// 		let count = 0;

// 		board.forEach((string) => {
// 			for (let f = start; f <= end; f++) {
// 				if (chordNotes.includes(string[f])) {
// 					count++;
// 					break; // one note per string is enough
// 				}
// 			}
// 		});

// 		if (count >= 3) return start; // good enough chord
// 	}

// 	return 0;
// }

// const start = findBestFretWindow(board, chordNotes);

// const tuning = ['E', 'A', 'D', 'G', 'B', 'E']; // low → high

// function buildFretboard(frets = 12) {
// 	const board = [];

// 	tuning.forEach((openNote) => {
// 		const string = [];

// 		let startIndex = baseNotes.indexOf(openNote);

// 		for (let f = 0; f <= frets; f++) {
// 			const note = baseNotes[(startIndex + f) % 12];
// 			string.push(note);
// 		}

// 		board.push(string);
// 	});

// 	return board;
// }

// function renderGuitar(root, intervals) {
// 	const container = document.getElementById('guitar');
// 	container.innerHTML = '';

// 	const board = buildFretboard(12);
// 	const positions = getFretboardPositions(root, intervals);

// 	board.forEach((string, sIndex) => {
// 		const row = document.createElement('div');
// 		row.className = 'string';

// 		string.forEach((note, fIndex) => {
// 			const fret = document.createElement('div');
// 			fret.className = 'fret';

// 			if (
// 				positions.some((p) => p.string === sIndex && p.fret === fIndex)
// 			) {
// 				fret.classList.add('active');
// 			}

// 			row.appendChild(fret);
// 		});

// 		container.appendChild(row);
// 	});
// }

// function getFretboardPositions(root, intervals) {
// 	const chordNotes = getChordNotes(root, intervals);
// 	const board = buildFretboard();

// 	const positions = [];

// 	board.forEach((string, stringIndex) => {
// 		string.forEach((note, fretIndex) => {
// 			if (chordNotes.includes(note)) {
// 				positions.push({
// 					string: stringIndex,
// 					fret: fretIndex,
// 					note: note,
// 				});
// 			}
// 		});
// 	});

// 	return positions;
// }

const tuning = ['E', 'A', 'D', 'G', 'B', 'E']; // low → high

function buildFretboard(frets = 12) {
	const board = [];

	tuning.forEach((openNote) => {
		const string = [];
		let startIndex = baseNotes.indexOf(openNote);

		for (let f = 0; f <= frets; f++) {
			const note = baseNotes[(startIndex + f) % 12];
			string.push(note);
		}

		board.push(string);
	});

	return board;
}

function getChordNotes(root, intervals) {
	const rootIndex = baseNotes.indexOf(root);
	return intervals.map((i) => baseNotes[(rootIndex + i) % 12]);
}

function findBestFretWindow(board, chordNotes) {
	const MAX_SPAN = 5;

	for (let start = 0; start < 8; start++) {
		const end = start + MAX_SPAN;

		let count = 0;

		board.forEach((string) => {
			for (let f = start; f <= end; f++) {
				if (chordNotes.includes(string[f])) {
					count++;
					break;
				}
			}
		});

		if (count >= 3) return start;
	}

	return 0;
}

function getFretboardPositions(root, intervals, board, start, span = 5) {
	const chordNotes = getChordNotes(root, intervals);
	const end = start + span;

	const positions = [];

	board.forEach((string, stringIndex) => {
		string.forEach((note, fretIndex) => {
			if (fretIndex < start || fretIndex > end) return;

			if (chordNotes.includes(note)) {
				positions.push({
					string: stringIndex,
					fret: fretIndex,
					note: note,
				});
			}
		});
	});

	return positions;
}

function renderGuitar(root, intervals) {
	const container = document.getElementById('guitar');
	container.innerHTML = '';

	const board = buildFretboard(12);
	const chordNotes = getChordNotes(root, intervals);

	// ✅ find best position dynamically
	const start = findBestFretWindow(board, chordNotes);
	const span = 5;

	const positions = getFretboardPositions(
		root,
		intervals,
		board,
		start,
		span,
	);

	board.forEach((string, sIndex) => {
		const row = document.createElement('div');
		row.className = 'string';

		string.forEach((note, fIndex) => {
			// ✅ only render visible window
			if (fIndex < start || fIndex > start + span) return;

			const fret = document.createElement('div');
			fret.className = 'fret';

			if (
				positions.some((p) => p.string === sIndex && p.fret === fIndex)
			) {
				fret.classList.add('active');
			}

			row.appendChild(fret);
		});

		container.appendChild(row);
	});
}
