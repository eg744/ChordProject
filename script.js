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
	const instrument = document.getElementById('instrument').value;
	const chord = document.getElementById('chord').value;

	const img = document.getElementById('chordImage');

	img.src =
		'https://www.scales-chords.com/api/chord.php?chord=' +
		encodeURIComponent(chord) +
		'&instrument=' +
		instrument;
}

function getChord() {
	fetch('https://your-api-url.com/chords?note=c&type=7')
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((err) => console.error(err));
}

function showChord() {
	const chord = document.getElementById('chord').value;

	let root = chord[0];
	if (chord[1] === '#') root += '#';

	let type =
		chord.includes('m') && !chord.includes('maj') ? 'minor' : 'major';

	renderPiano(root, type);
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

function renderPiano(root, type) {
	const piano = document.getElementById('piano');
	piano.innerHTML = '';

	const chordFormulas = {
		major: [0, 4, 7],
		minor: [0, 3, 7],
	};

	const rootIndex = baseNotes.indexOf(root);
	const intervals = chordFormulas[type];

	// build chord notes (no octave yet)
	const chordNotes = intervals.map((i) => baseNotes[(rootIndex + i) % 12]);

	// build keyboard
	const keyboard = buildKeyboard();

	// WHITE NOTES ONLY (filter)
	const whiteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	const whiteKeys = keyboard.filter((k) => !k.includes('#'));

	// render white keys
	whiteKeys.forEach((noteFull, i) => {
		const note = noteFull.replace(/[0-9]/g, '');

		const key = document.createElement('div');
		key.className = 'white-key';

		if (chordNotes.includes(note)) {
			key.classList.add('active-white');
		}

		piano.appendChild(key);
	});

	// render black keys
	keyboard.forEach((noteFull, i) => {
		if (!noteFull.includes('#')) return;

		const note = noteFull.replace(/[0-9]/g, '');

		const key = document.createElement('div');
		key.className = 'black-key';

		// position math
		const whiteIndex = Math.floor(i / 2);
		key.style.left = whiteIndex * 60 + 40 + 'px';

		if (chordNotes.includes(note)) {
			key.classList.add('active-black');
		}

		piano.appendChild(key);
	});
}

function getAnchoredRootIndex(root) {
	const keyboard = buildKeyboard();

	// place root roughly 1/3 into keyboard
	for (let i = 0; i < keyboard.length; i++) {
		if (keyboard[i].startsWith(root)) {
			return i;
		}
	}
}

function buildChordVoicing(root, type) {
	const intervals = {
		major: [0, 4, 7],
		minor: [0, 3, 7],
	};

	const rootIndex = baseNotes.indexOf(root);

	return intervals[type].map((i) => (rootIndex + i) % 12);
}
