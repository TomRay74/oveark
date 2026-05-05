const STORAGE_KEY = 'oveark_v1';

const $ = id => document.getElementById(id);

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
    const strip = Array.from({ length: word.length }, () =>
      `<div class="letter-box"></div>`
    ).join('');

    const practiceCells = Array.from({ length: cols }, () =>
      `<td class="practice-cell"><div class="letter-strip">${strip}</div></td>`
    ).join('');

    return `<tr>
      <td class="word-cell"><strong>${escapeHtml(word)}</strong></td>
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
  if (data.words       != null) $('words').value       = data.words;
}

// Live preview + autosave on every input
['title', 'instruction', 'columns', 'boxSize', 'words'].forEach(id => {
  $(id).addEventListener('input', () => { buildSheet(); saveState(); });
});

$('generateBtn').addEventListener('click', () => { buildSheet(); saveState(); });
$('printBtn').addEventListener('click', () => window.print());

loadState();
buildSheet();
