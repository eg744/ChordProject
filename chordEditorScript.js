const templates = {
	piano: `
         <h3>Piano</h3>
         <div id="piano"></div>
      `,
	guitar: `
         <h3>Guitar</h3>
         <div id="guitar"></div>
        
      `,
};

function renderInstrumentUI() {
	const instrument = document.getElementById('instrument-select').value;
	const container = document.getElementById('instrument-ui');

	container.innerHTML = templates[instrument] || '';
}

function addSection() {
	const name = document.getElementById('section-name').value;

	const section = document.createElement('div');
	section.className = 'section';

	section.innerHTML = `
         <h3>${name}</h3>
         <div class="line">
            <div class="chords"></div>
            <div contenteditable="true" class="lyrics"></div>
         </div>
         <button onclick="addLine(this)">+ Line</button>
      `;

	document.getElementById('song-container').appendChild(section);
}

function addLine(button) {
	const section = button.parentElement;

	const line = document.createElement('div');
	line.className = 'line';

	line.innerHTML = `
         <div class="chords"></div>
         <div contenteditable="true" class="lyrics"></div>
      `;

	section.insertBefore(line, button);
}

// Chord insert

let activeLine = null;

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('lyrics')) {
		activeLine = e.target.parentElement;
	}
});

function insertChord() {
	const root = document.getElementById('editor-chord-root').value;
	const quality = document.getElementById('editor-quality').value;

	const chordText = root + (quality === 'minor' ? 'm' : '');

	const chordEl = document.createElement('span');
	chordEl.className = 'chord';
	chordEl.innerText = chordText;

	chordEl.onclick = () => showChordFromTag(root, quality);

	// position above text
	const selection = window.getSelection();
	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	const lineRect = activeLine.getBoundingClientRect();

	const offsetX = rect.left - lineRect.left;

	chordEl.style.left = offsetX + 'px';

	activeLine.querySelector('.chords').appendChild(chordEl);
}

// Guitar

const state = {
	guitar: { root: null, quality: null, shapeIndex: 0 },
};

function showChordFromTag(root, quality) {
	const instrument = document.getElementById('instrument-select').value;

	if (instrument === 'guitar') {
		state.guitar.root = root;
		state.guitar.quality = quality;
		state.guitar.shapeIndex = 0;

		renderGuitarChord(root, quality, 0);
	}

	// Piano
	if (instrument === 'piano') {
		const intervals = buildChord(root, quality, '', {
			add9: false,
			add11: false,
		});

		renderPiano(root, intervals);
	}
}

function nextGuitarShape() {
	state.guitar.shapeIndex++;

	renderGuitarChord(
		state.guitar.root,
		state.guitar.quality,
		state.guitar.shapeIndex,
	);
}
