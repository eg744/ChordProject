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

	const keyboard = buildKeyboard();

	// STEP 1: get chord notes (intervals)
	const chordIndexes = buildChordVoicing(root, type);

	// STEP 2: find where to place root (anchor)
	const startIndex = getAnchoredRootIndex(root);

	// STEP 3: build actual notes WITH position
	const activeIndexes = chordIndexes.map((i) => startIndex + i);

	// WHITE KEYS
	const whiteKeys = keyboard.filter((k) => !k.includes('#'));

	whiteKeys.forEach((noteFull, i) => {
		const key = document.createElement('div');
		key.className = 'white-key';

		// find this note's index in full keyboard
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

		// position relative to white keys
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

function buildChordVoicing(root, type) {
	const intervals = {
		major: [0, 4, 7],
		minor: [0, 3, 7],
	};

	return intervals[type];
}
