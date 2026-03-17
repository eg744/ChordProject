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

function showChordOld() {
	const instrument = document.getElementById('instrument').value;
	const chord = document.getElementById('chord').value;

	const container = document.getElementById('chord-container');

	// create a fresh element
	// const ins = document.createElement('ins');

	ins.className = 'scales_chords_api';
	ins.setAttribute('chord', chord);
	ins.setAttribute('instrument', instrument);
	ins.id = 'scapiobjid1';
	// ins.setAttribute('output', 'image');
	// ins.setAttribute('width', '120px');
	// ins.setAttribute('height', '160px');
	// ins.setAttribute('nolink', 'true');

	container.innerHTML = '';
	container.appendChild(ins);

	// tell API to scan for new elements
	// if (window.scales_chords_api) {
	// 	scales_chords_api.load();
	// }
}

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
