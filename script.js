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
    btnRandom:           'Tilfeldig',
    btnPaste:            'Lim inn',
    btnClear:            'Tøm',
    btnPDF:              'Lagre som PDF',
    btnGenerate:         'Generer ark',
    btnPrint:            'Skriv ut',
    pdfError:            'PDF-eksport feilet',
    usageLink:           'Hjelp',
    defaultTitle:        'Øveark: Rettskriving',
    defaultInstruction:  'Skriv én bokstav i hver rute.',
    sheetWordHeader:     'Ord',
    sheetPractice:       'Øving',
    coverSubtitle:       'Øveord',
    wordBank: [
      'hus', 'bil', 'hund', 'katt', 'mat', 'sol', 'regn', 'vind', 'snø', 'dag',
      'natt', 'bok', 'rom', 'dør', 'stol', 'bord', 'seng', 'glass', 'brød', 'melk',
      'egg', 'ost', 'fisk', 'eple', 'banan', 'sko', 'jakke', 'bukse', 'lue', 'sokk',
      'penn', 'ball', 'sang', 'dans', 'hoppe', 'løpe', 'lese', 'skrive', 'tegne',
      'smile', 'lære', 'skole', 'leke', 'kopp', 'kniv', 'gaffel', 'suppe', 'kake',
      'blomst', 'fugl', 'tre', 'gress', 'fjell', 'elv', 'sjø', 'hav', 'stein',
      'sky', 'stjerne', 'måne', 'båt', 'tog', 'buss', 'gate', 'hjem', 'by',
      'venn', 'barn', 'søster', 'bror', 'mor', 'far', 'sykkel', 'vindu', 'tallerken',
      'synge', 'danse', 'hjelpe', 'tenke', 'huske', 'verden', 'time', 'uke', 'år',
    ],
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
    btnRandom:           'Random',
    btnPaste:            'Paste',
    btnClear:            'Clear',
    btnPDF:              'Save as PDF',
    btnGenerate:         'Generate sheet',
    btnPrint:            'Print',
    pdfError:            'PDF export failed',
    usageLink:           'Help',
    defaultTitle:        'Worksheet: Spelling',
    defaultInstruction:  'Write one letter in each box.',
    sheetWordHeader:     'Word',
    sheetPractice:       'Practice',
    coverSubtitle:       'Practice words',
    wordBank: [
      'cat', 'dog', 'house', 'car', 'book', 'sun', 'rain', 'wind', 'snow', 'day',
      'night', 'door', 'chair', 'table', 'bed', 'glass', 'bread', 'milk', 'egg',
      'fish', 'apple', 'shoe', 'coat', 'pants', 'hat', 'sock', 'pen', 'ball',
      'song', 'dance', 'jump', 'run', 'read', 'write', 'draw', 'smile', 'learn',
      'school', 'play', 'cup', 'knife', 'fork', 'soup', 'cake', 'flower', 'bird',
      'tree', 'grass', 'hill', 'river', 'lake', 'sea', 'stone', 'cloud', 'star',
      'moon', 'boat', 'train', 'bus', 'street', 'home', 'town', 'friend', 'child',
      'sister', 'brother', 'mother', 'father', 'bike', 'window', 'plate', 'sing',
      'help', 'think', 'world', 'time', 'week', 'year', 'light', 'dark', 'name',
    ],
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
    const cellClass   = useLines ? 'letter-strip lines' : useBare ? 'letter-strip bare' : 'letter-strip';
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
  let data;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
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
  const current = $('words').value;
  if (current.trim() === '' || current === lastRandomWords) {
    fillRandomWords();
  }
  buildSheet();
  saveState();
});

['title', 'instruction', 'columns', 'boxSize', 'style', 'caseMode', 'wordCol', 'words'].forEach(id => {
  $(id).addEventListener('input', () => { buildSheet(); saveState(); });
});

['trace', 'coverPage'].forEach(id => {
  $(id).addEventListener('change', () => { buildSheet(); saveState(); });
});

let lastRandomWords = '';

function fillRandomWords() {
  const bank = TRANSLATIONS[$('lang').value].wordBank;
  lastRandomWords = [...bank].sort(() => Math.random() - 0.5).slice(0, 8).join('\n');
  $('words').value = lastRandomWords;
}

$('randomBtn').addEventListener('click', () => {
  fillRandomWords();
  buildSheet();
  saveState();
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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function savePDF() {
  const btn = $('pdfBtn');
  btn.disabled = true;
  btn.textContent = '…';
  let errorMsg = null;

  try {
    if (!window.html2canvas) {
      await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    }

    const { jsPDF } = window.jspdf;
    const pdf   = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const pages = document.querySelectorAll('.sheet-page');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      const imgH = (canvas.height / canvas.width) * pageW;
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, Math.min(imgH, pageH));
    }

    const filename = ($('title').value.trim() || 'øveark').replace(/[^\w\sæøåÆØÅ-]/g, '') + '.pdf';
    pdf.save(filename);
  } catch {
    errorMsg = t('pdfError');
  } finally {
    btn.disabled = false;
    btn.textContent = errorMsg ?? t('btnPDF');
    if (errorMsg) setTimeout(() => { btn.textContent = t('btnPDF'); }, 3000);
  }
}

$('generateBtn').addEventListener('click', () => { buildSheet(); saveState(); });
$('pdfBtn').addEventListener('click', savePDF);
$('printBtn').addEventListener('click', () => window.print());

/* ── Init ── */
loadState();
applyQueryParams();
applyLanguage();
buildSheet();

function applyQueryParams() {
  const p = new URLSearchParams(location.search);
  if (p.has('lang'))    $('lang').value        = p.get('lang');
  if (p.has('style'))   $('style').value       = p.get('style');
  if (p.has('columns')) $('columns').value     = p.get('columns');
  if (p.has('boxSize')) $('boxSize').value     = p.get('boxSize');
  if (p.has('trace'))   $('trace').checked     = p.get('trace') !== '0';
  if (p.has('title'))   $('title').value       = p.get('title');
  if (p.has('w'))       $('words').value       = p.get('w').split(',').map(s => s.trim()).filter(Boolean).join('\n');
}

async function initVersion() {
  try {
    const res = await fetch('https://api.github.com/repos/TomRay74/oveark/commits?per_page=1');
    if (!res.ok) throw new Error(res.status);
    const link = res.headers.get('Link') || '';
    const m = link.match(/page=(\d+)>; rel="last"/);
    const count = m ? parseInt(m[1]) : 1;
    $('versionLink').textContent = 'v1.0.' + (count - 1);
  } catch {
    const el = $('versionLink');
    if (el) el.style.display = 'none';
  }
}
initVersion();
