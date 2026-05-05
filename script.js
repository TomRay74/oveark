const STORAGE_KEY = 'oveark_v1';

const $ = id => document.getElementById(id);

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

function buildSheet() {
  const title       = $('title').value.trim() || 'Øveark';
  const instruction = $('instruction').value.trim();
  const cols        = Math.max(1, Math.min(6, parseInt($('columns').value) || 3));
  const boxSize     = parseFloat($('boxSize').value) || 1.3;
  const useLines    = $('style').value === 'lines';
  const traceMode   = $('trace').checked;
  const caseMode    = $('caseMode').value;

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
    `<th>Øving ${i + 1}</th>`
  ).join('');

  const rows = words.map(word => {
    const displayWord = applyCase(word, caseMode);
    const cellClass   = useLines ? 'letter-strip lines' : 'letter-strip';
    const boxEl       = useLines ? 'letter-line' : 'letter-box';
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

    return `<tr>
      <td class="word-cell"><strong>${escapeHtml(displayWord)}</strong></td>
      ${practiceCells}
    </tr>`;
  }).join('');

  $('sheet').innerHTML = `
    <div class="sheet-page">
      <h1>${escapeHtml(title)}</h1>
      <p class="instruction">${escapeHtml(instruction)}</p>
      <table class="sheet-table">
        <thead>
          <tr>
            <th class="word-col">Ord</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    title:       $('title').value,
    instruction: $('instruction').value,
    columns:     $('columns').value,
    boxSize:     $('boxSize').value,
    style:       $('style').value,
    caseMode:    $('caseMode').value,
    trace:       $('trace').checked,
    words:       $('words').value,
  }));
}

function loadState() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!data) return;
  if (data.title       != null) $('title').value       = data.title;
  if (data.instruction != null) $('instruction').value = data.instruction;
  if (data.columns     != null) $('columns').value     = data.columns;
  if (data.boxSize     != null) $('boxSize').value     = data.boxSize;
  if (data.style       != null) $('style').value       = data.style;
  if (data.caseMode    != null) $('caseMode').value    = data.caseMode;
  if (data.trace       != null) $('trace').checked     = data.trace;
  if (data.words       != null) $('words').value       = data.words;
}

// Live preview + autosave on every input
['title', 'instruction', 'columns', 'boxSize', 'style', 'caseMode', 'words'].forEach(id => {
  $(id).addEventListener('input', () => { buildSheet(); saveState(); });
});

$('trace').addEventListener('change', () => { buildSheet(); saveState(); });

$('generateBtn').addEventListener('click', () => { buildSheet(); saveState(); });
$('printBtn').addEventListener('click', () => window.print());

loadState();
buildSheet();
