const STORAGE_KEY = 'oveark_v1';

const $ = id => document.getElementById(id);

/* ── Translations ── */
const TRANSLATIONS = {
  no: {
    panelTitle:          'Øveark-generator',
    labelTitle:          'Tittel',
    labelInstruction:    'Instruksjon',
    labelColumns:        'Øvingskolonner',
    labelBoxSize:        'Boksstørrelse (cm)',
    labelStyle:          'Stil',
    labelCase:           'Bokstavform',
    labelWordCol:        'Ord-kolonne',
    styleBoxes:          'Bokser',
    styleLines:          'Understrek',
    styleBare:           'Bare bokstaver',
    caseLower:           'små bokstaver',
    caseUpper:           'STORE BOKSTAVER',
    caseTitle:           'Forbokstav stor',
    wordColFull:         'Vis fullt ord',
    wordColHint:         'Første bokstav (B…)',
    wordColHidden:       'Skjul',
    traceLabel:          'Vis lysegrå bokstaver til å spore over',
    coverLabel:          'Legg til forside med øveordene',
    wordsLabel:          'Ordliste',
    wordsHint:           '(ett ord per linje)',
    wordsPlaceholder:    'bord\njord\nfjord\nord\nhard',
    btnPaste:            'Lim inn',
    btnClear:            'Tøm',
    btnGenerate:         'Generer ark',
    btnPrint:            'Skriv ut',
    defaultTitle:        'Øveark: Rettskriving',
    defaultInstruction:  'Skriv én bokstav i hver rute.',
    sheetWordHeader:     'Ord',
    sheetPractice:       'Øving',
    coverSubtitle:       'Øveord',
  },
  en: {
    panelTitle:          'Worksheet Generator',
    labelTitle:          'Title',
    labelInstruction:    'Instruction',
    labelColumns:        'Practice columns',
    labelBoxSize:        'Box size (cm)',
    labelStyle:          'Style',
    labelCase:           'Letter case',
    labelWordCol:        'Word column',
    styleBoxes:          'Boxes',
    styleLines:          'Underline',
    styleBare:           'Letters only',
    caseLower:           'lowercase',
    caseUpper:           'UPPERCASE',
    caseTitle:           'Capitalized',
    wordColFull:         'Show full word',
    wordColHint:         'First letter (B…)',
    wordColHidden:       'Hide',
    traceLabel:          'Show light gray letters to trace over',
    coverLabel:          'Add cover page with practice words',
    wordsLabel:          'Word list',
    wordsHint:           '(one word per line)',
    wordsPlaceholder:    'table\nchair\nfloor\nword\nhard',
    btnPaste:            'Paste',
    btnClear:            'Clear',
    btnGenerate:         'Generate sheet',
    btnPrint:            'Print',
    defaultTitle:        'Worksheet: Spelling',
    defaultInstruction:  'Write one letter in each box.',
    sheetWordHeader:     'Word',
    sheetPractice:       'Practice',
    coverSubtitle:       'Practice words',
  },
};

function t(key) {
  return TRANSLATIONS[$('lang').value]?.[key] ?? key;
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  $('words').placeholder = t('wordsPlaceholder');

  // Update title/instruction only if they still hold a known default
  const allTitles = Object.values(TRANSLATIONS).map(x => x.defaultTitle);
  const allInstr  = Object.values(TRANSLATIONS).map(x => x.defaultInstruction);
  if (allTitles.includes($('title').value))       $('title').value       = t('defaultTitle');
  if (allInstr.includes($('instruction').value))  $('instruction').value = t('defaultInstruction');
}

/* ── Helpers ── */
function applyCase(word, mode) {
  if (mode === 'upper') return word.toUpperCase();
  if (mode === 'title') return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  return word.toLowerCase();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Sheet builders ── */
function buildCoverPage(title, words, caseMode) {
  const items = words
    .map(w => `<li>${escapeHtml(applyCase(w, caseMode))}</li>`)
    .join('');
  return `
    <div class="sheet-page cover-page">
      <h1>${escapeHtml(title)}</h1>
      <p class="cover-subtitle">${escapeHtml(t('coverSubtitle'))}</p>
      <ol class="cover-word-list">${items}</ol>
    </div>`;
}

function buildSheet() {
  const title       = $('title').value.trim() || t('defaultTitle');
  const instruction = $('instruction').value.trim();
  const cols        = Math.max(1, Math.min(6, parseInt($('columns').value) || 3));
  const boxSize     = parseFloat($('boxSize').value) || 1.3;
  const styleVal    = $('style').value;
  const useLines    = styleVal === 'lines';
  const useBare     = styleVal === 'bare';
  const traceMode   = $('trace').checked;
  const caseMode    = $('caseMode').value;
  const wordCol     = $('wordCol').value;
  const showCover   = $('coverPage').checked;

  const words = $('words').value
    .split('\n')
    .map(w => w.trim())
    .filter(w => w.length > 0);

  document.documentElement.style.setProperty('--box-size', boxSize + 'cm');

  if (words.length === 0) {
    $('sheet').innerHTML = '';
    return;
  }

  const headerCells = Array.from({ length: cols }, (_, i) =>
    `<th>${escapeHtml(t('sheetPractice'))} ${i + 1}</th>`
  ).join('');

  const rows = words.map((word, index) => {
    const displayWord = applyCase(word, caseMode);
    const cellClass   = useLines ? 'letter-strip lines' : 'letter-strip';
    const boxEl       = useLines ? 'letter-line' : useBare ? 'letter-bare' : 'letter-box';
    const letters     = [...displayWord];

    const strip = letters.map(letter => {
      const inner = traceMode
        ? `<span class="trace-letter">${escapeHtml(letter)}</span>`
        : '';
      return `<div class="${boxEl}">${inner}</div>`;
    }).join('');

    const practiceCells = Array.from({ length: cols }, () =>
      `<td class="practice-cell"><div class="${cellClass}">${strip}</div></td>`
    ).join('');

    let wordCell;
    if (wordCol === 'full') {
      wordCell = `<td class="word-cell"><strong>${escapeHtml(displayWord)}</strong></td>`;
    } else if (wordCol === 'hint') {
      const hint = escapeHtml([...displayWord][0]) + '…';
      wordCell = `<td class="word-cell"><strong>${hint}</strong></td>`;
    } else {
      wordCell = `<td class="word-cell number-cell"><strong>${index + 1}.</strong></td>`;
    }

    return `<tr>${wordCell}${practiceCells}</tr>`;
  }).join('');

  const wordHeader = wordCol === 'hidden'
    ? `<th class="word-col number-col">#</th>`
    : `<th class="word-col">${escapeHtml(t('sheetWordHeader'))}</th>`;

  const practiceSheet = `
    <div class="sheet-page">
      <h1>${escapeHtml(title)}</h1>
      <p class="instruction">${escapeHtml(instruction)}</p>
      <table class="sheet-table">
        <thead><tr>${wordHeader}${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  $('sheet').innerHTML = showCover
    ? buildCoverPage(title, words, caseMode) + practiceSheet
    : practiceSheet;
}

/* ── Persistence ── */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    lang:        $('lang').value,
    title:       $('title').value,
    instruction: $('instruction').value,
    columns:     $('columns').value,
    boxSize:     $('boxSize').value,
    style:       $('style').value,
    caseMode:    $('caseMode').value,
    wordCol:     $('wordCol').value,
    trace:       $('trace').checked,
    coverPage:   $('coverPage').checked,
    words:       $('words').value,
  }));
}

function loadState() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!data) return;
  if (data.lang        != null) $('lang').value        = data.lang;
  if (data.title       != null) $('title').value       = data.title;
  if (data.instruction != null) $('instruction').value = data.instruction;
  if (data.columns     != null) $('columns').value     = data.columns;
  if (data.boxSize     != null) $('boxSize').value     = data.boxSize;
  if (data.style       != null) $('style').value       = data.style;
  if (data.caseMode    != null) $('caseMode').value    = data.caseMode;
  if (data.wordCol     != null) $('wordCol').value     = data.wordCol;
  if (data.trace       != null) $('trace').checked     = data.trace;
  if (data.coverPage   != null) $('coverPage').checked = data.coverPage;
  if (data.words       != null) $('words').value       = data.words;
}

/* ── Event listeners ── */
$('lang').addEventListener('change', () => {
  applyLanguage();
  buildSheet();
  saveState();
});

['title', 'instruction', 'columns', 'boxSize', 'style', 'caseMode', 'wordCol', 'words'].forEach(id => {
  $(id).addEventListener('input', () => { buildSheet(); saveState(); });
});

['trace', 'coverPage'].forEach(id => {
  $(id).addEventListener('change', () => { buildSheet(); saveState(); });
});

$('clearBtn').addEventListener('click', () => {
  $('words').value = '';
  buildSheet();
  saveState();
});

$('pasteBtn').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    $('words').value = text;
    buildSheet();
    saveState();
  } catch {
    $('words').focus();
  }
});

$('generateBtn').addEventListener('click', () => { buildSheet(); saveState(); });
$('printBtn').addEventListener('click', () => window.print());

/* ── Init ── */
loadState();
applyLanguage();
buildSheet();
