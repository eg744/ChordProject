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

let currentShapeIndex = 0;

function showPianoChord() {
	const root = document.getElementById('piano-chord').value;
	const quality = document.getElementById('piano-quality').value;
	const seventh = document.getElementById('piano-seventh').value;

	const add9 = document.getElementById('piano-add9')?.checked;
	const add11 = document.getElementById('piano-add11')?.checked;

	const intervals = buildChord(root, quality, seventh, {
		add9,
		add11,
	});

	renderPiano(root, intervals);
}

function showGuitarChord() {
	currentShapeIndex = 0;

	const root = document.getElementById('guitar-chord').value;
	const quality = document.getElementById('guitar-quality').value;
	// const seventh = document.getElementById('guitar-seventh').value;

	// const add9 = document.getElementById('guitar-add9')?.checked;
	// const add11 = document.getElementById('guitar-add11')?.checked;

	// const intervals = buildChord(root, quality, seventh, {
	// 	add9,
	// 	add11,
	// });

	renderGuitarChord(root, quality);
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

const tuning = ['E', 'A', 'D', 'G', 'B', 'E']; // low to high

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

// Basic chord dictionary
const guitarChordShapes = {
	C: {
		major: [
			[null, 3, 2, 0, 1, 0],
			[3, 3, 2, 0, 1, 0],
			[8, 10, 10, 9, 8, 8],
		],
		minor: [
			[null, 3, 5, 5, 4, 3],
			[8, 10, 10, 8, 8, 8],
		],
	},

	G: {
		major: [
			[3, 2, 0, 0, 0, 3],
			[3, 5, 5, 4, 3, 3],
		],
		minor: [[3, 5, 5, 3, 3, 3]],
	},

	A: {
		major: [
			[null, 0, 2, 2, 2, 0],
			[5, 7, 7, 6, 5, 5],
		],
		minor: [
			[null, 0, 2, 2, 1, 0],
			[5, 7, 7, 5, 5, 5],
		],
	},

	D: {
		major: [
			[null, null, 0, 2, 3, 2],
			[5, 5, 7, 7, 7, 5],
		],
		minor: [
			[null, null, 0, 2, 3, 1],
			[5, 5, 7, 5, 5, 5],
		],
	},

	E: {
		major: [
			[0, 2, 2, 1, 0, 0],
			[12, 14, 14, 13, 12, 12],
		],
		minor: [
			[0, 2, 2, 0, 0, 0],
			[12, 14, 14, 12, 12, 12],
		],
	},

	F: {
		major: [
			[1, 3, 3, 2, 1, 1],
			[null, null, 3, 2, 1, 1],
		],
		minor: [[1, 3, 3, 1, 1, 1]],
	},

	B: {
		major: [
			[null, 2, 4, 4, 4, 2],
			[7, 9, 9, 8, 7, 7],
		],
		minor: [
			[null, 2, 4, 4, 3, 2],
			[7, 9, 9, 7, 7, 7],
		],
	},
};

function nextGuitarShape() {
	currentShapeIndex++;

	const root = document.getElementById('guitar-chord').value;
	const quality = document.getElementById('guitar-quality').value;

	renderGuitarChord(root, quality);
}

function renderGuitarChord(root, quality) {
	const container = document.getElementById('guitar');
	container.innerHTML = '';

	const shapes = guitarChordShapes[root]?.[quality];

	if (!shapes || shapes.length === 0) {
		container.textContent = 'Chord not available';
		return;
	}

	const label = document.createElement('div');
	label.textContent = `Shape ${(currentShapeIndex % shapes.length) + 1} / ${shapes.length}`;
	container.appendChild(label);

	const shape = shapes[currentShapeIndex % shapes.length];

	const frets = shape.filter((f) => f !== null);
	const minFret = Math.min(...frets.filter((f) => f > 0));
	const startFret = minFret > 1 ? minFret : 0;
	const endFret = startFret + 5;

	const fretRow = document.createElement('div');
	fretRow.className = 'fret-row';

	for (let f = startFret; f <= endFret; f++) {
		const fretLabel = document.createElement('div');
		fretLabel.className = 'fret-label';
		fretLabel.textContent = f;
		fretRow.appendChild(fretLabel);
	}

	container.appendChild(fretRow);

	const stringNames = ['E', 'A', 'D', 'G', 'B', 'E'];

	// reverse for correct orientation
	const reversedShape = [...shape].reverse();
	const reversedStrings = [...stringNames].reverse();

	reversedShape.forEach((fretValue, stringIndex) => {
		const row = document.createElement('div');
		row.className = 'string';

		// string label
		const label = document.createElement('div');
		label.className = 'string-label';
		label.textContent = reversedStrings[stringIndex];
		row.appendChild(label);

		for (let f = startFret; f <= endFret; f++) {
			const fret = document.createElement('div');
			fret.className = 'fret';

			if (fretValue === null && f === startFret) {
				fret.textContent = 'X';
			} else if (fretValue === 0 && f === 0 && startFret === 0) {
				fret.textContent = 'O';
			} else if (fretValue === f) {
				fret.classList.add('active');
			}

			row.appendChild(fret);
		}

		container.appendChild(row);
	});
}

// ==Editor page==
// function addSection() {
//    const name = document.getElementById('section-name').value;

//    const section = document.createElement('div');
//    section.className = 'section';

//    section.innerHTML = `
//         <h3>${name}</h3>
//         <div class="line">
//             <div class="chords"></div>
//             <div contenteditable="true" class="lyrics"></div>
//         </div>
//         <button onclick="addLine(this)">+ Line</button>
//     `;

//    document.getElementById('song-container').appendChild(section);
// }

// function addLine(button) {
//    const section = button.parentElement;

//    const line = document.createElement('div');
//    line.className = 'line';

//    line.innerHTML = `
//         <div class="chords"></div>
//         <div contenteditable="true" class="lyrics"></div>
//     `;

//    section.insertBefore(line, button);
// }

// let activeLyricsDiv = null;

// // track where user is typing
// document.addEventListener('click', (e) => {
//    if (e.target.classList.contains('lyrics')) {
//       activeLyricsDiv = e.target;
//    }
// });

// let activeLine = null;

// document.addEventListener('click', (e) => {
//    if (e.target.classList.contains('lyrics')) {
//       activeLine = e.target.parentElement;
//    }
// });

// function insertChord() {
//    const root = document.getElementById('editor-chord-root').value;
//    const quality = document.getElementById('editor-quality').value;

//    const chordText = root + (quality === 'minor' ? 'm' : '');

//    const chordEl = document.createElement('span');
//    chordEl.className = 'chord';
//    chordEl.innerText = chordText;

//    chordEl.onclick = () => showChordFromTag(root, quality);

//    // get cursor position inside lyrics
//    const selection = window.getSelection();
//    const range = selection.getRangeAt(0);
//    const rect = range.getBoundingClientRect();

//    const lineRect = activeLine.getBoundingClientRect();

//    const offsetX = rect.left - lineRect.left;

//    chordEl.style.left = offsetX + 'px';

//    activeLine.querySelector('.chords').appendChild(chordEl);
// }
