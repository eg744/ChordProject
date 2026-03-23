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

// function showChord() {
// 	const instrument = document.getElementById('instrument').value;
// 	const chord = document.getElementById('chord').value;

// 	const img = document.getElementById('chordImage');

// 	img.src =
// 		'https://www.scales-chords.com/api/chord.php?chord=' +
// 		encodeURIComponent(chord) +
// 		'&instrument=' +
// 		instrument;
// }

// function getChord() {
// 	fetch('https://your-api-url.com/chords?note=c&type=7')
// 		.then((res) => res.json())
// 		.then((data) => console.log(data))
// 		.catch((err) => console.error(err));
// }

// renderPiano('', '');

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
