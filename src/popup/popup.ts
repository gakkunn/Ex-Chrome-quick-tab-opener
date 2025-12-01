import { isValidUrl } from '../utils/url';
import { getStorageData, setStorageData } from '../utils/storage';
import { SLOT_IDS, GROUP_KEYS, MAX_GROUP_ITEMS } from '../types/storage';
import type { GroupKey, SlotId, StorageData } from '../types/storage';

type GroupContext = {
  key: GroupKey;
  idx: number;
  n: number;
};

const getSlotInput = (id: SlotId): HTMLInputElement | null =>
  document.getElementById(id) as HTMLInputElement | null;

const getGroupListElement = (n: number): HTMLElement | null =>
  document.getElementById(`group${n}-list`);

const forEachSlotInput = (
  callback: (input: HTMLInputElement, idx: number, id: SlotId) => void
): void => {
  SLOT_IDS.forEach((id, idx) => {
    const input = getSlotInput(id);
    if (input) {
      callback(input, idx, id);
    }
  });
};

const forEachGroupList = (callback: (listEl: HTMLElement, ctx: GroupContext) => void): void => {
  GROUP_KEYS.forEach((key, idx) => {
    const n = idx + 1;
    const listEl = getGroupListElement(n);
    if (listEl) {
      callback(listEl, { key, idx, n });
    }
  });
};

function renderGroup(n: number, items?: string[]): void {
  const listEl = getGroupListElement(n);
  if (!listEl) return;

  listEl.innerHTML = '';
  (items || []).forEach((value) => {
    addGroupItem(n, value);
  });
}

function addGroupItem(n: number, value = ''): void {
  const listEl = getGroupListElement(n);
  if (!listEl) return;

  if (listEl.children.length >= MAX_GROUP_ITEMS) {
    show(`Error: Group ${n} can contain up to ${MAX_GROUP_ITEMS} URLs.`, true);
    return;
  }

  const row = document.createElement('div');
  row.className = 'row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Example: https://example.com';
  input.value = value;
  input.style.flex = '1 1 auto';

  const del = document.createElement('button');
  del.textContent = 'Delete';
  del.addEventListener('click', () => {
    row.remove();
  });

  row.appendChild(input);
  row.appendChild(del);
  listEl.appendChild(row);
}

function collectGroupValues(listEl: HTMLElement): string[] {
  return Array.from(listEl.querySelectorAll<HTMLInputElement>('input[type="text"]')).map((input) =>
    input.value.trim()
  );
}

function cleanEmptyGroupRows(listEl: HTMLElement): void {
  Array.from(listEl.children).forEach((row) => {
    const input = row.querySelector<HTMLInputElement>('input[type="text"]');
    if (input && input.value.trim().length === 0) {
      row.remove();
    }
  });
}

async function load(): Promise<void> {
  const keys = [...SLOT_IDS, ...GROUP_KEYS, 'pinByDefault'] as const;
  const data = await getStorageData(keys);

  forEachSlotInput((input, _, id) => {
    input.value = data[id] ?? '';
  });

  const pinEl = document.getElementById('pinByDefault') as HTMLInputElement | null;
  if (pinEl) {
    pinEl.checked = data.pinByDefault !== undefined ? Boolean(data.pinByDefault) : true;
  }

  forEachGroupList((_, { n, key }) => {
    const values = Array.isArray(data[key]) ? data[key] : [];
    renderGroup(n, values);
  });
}

async function save(): Promise<void> {
  const errors: string[] = [];

  forEachSlotInput((input, idx) => {
    const value = input.value.trim();
    if (value.length > 0 && !isValidUrl(value)) {
      errors.push(`Slot ${idx + 1} contains an invalid URL: "${value}"`);
    }
  });

  forEachGroupList((listEl, { n }) => {
    collectGroupValues(listEl).forEach((value, inputIdx) => {
      if (value.length > 0 && !isValidUrl(value)) {
        errors.push(`Group ${n} URL ${inputIdx + 1} is invalid: "${value}"`);
      }
    });
  });

  if (errors.length > 0) {
    const errorMessage =
      errors.length === 1
        ? errors[0]
        : `${errors.length} errors found:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...and ${errors.length - 5} more` : ''}`;
    show(errorMessage, true);
    return;
  }

  const payload: Partial<StorageData> = {};

  forEachSlotInput((input, _, id) => {
    payload[id] = input.value.trim();
  });

  const pinEl = document.getElementById('pinByDefault') as HTMLInputElement | null;
  if (pinEl) {
    payload.pinByDefault = Boolean(pinEl.checked);
  }

  forEachGroupList((listEl, { key }) => {
    const values = collectGroupValues(listEl)
      .filter((value) => value.length > 0)
      .slice(0, MAX_GROUP_ITEMS);
    payload[key] = values;
  });

  await setStorageData(payload);

  forEachGroupList((listEl) => {
    cleanEmptyGroupRows(listEl);
  });

  show('Saved.');
}

function show(text: string, isError = false): void {
  const msgEl = document.getElementById('msg');
  const el = msgEl?.querySelector('small');
  if (!el || !msgEl) {
    return;
  }

  el.textContent = text;
  msgEl.classList.remove('error', 'success');

  if (isError) {
    msgEl.classList.add('error');
  } else {
    msgEl.classList.add('success');
  }

  const lines = text.split('\n').length;
  const duration = isError ? Math.max(3000, lines * 1000) : 3000;

  setTimeout(() => {
    el.textContent = '';
    msgEl.classList.remove('error', 'success');
  }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
  load();

  document.querySelectorAll<HTMLButtonElement>('button.add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = Number(btn.getAttribute('data-group') || '0');
      if (n >= 1 && n <= 9) {
        addGroupItem(n);
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('.shortcuts-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.toggle-group').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = Number(btn.getAttribute('data-group') || '0');
      if (n < 1 || n > 9) return;

      const listEl = getGroupListElement(n);
      if (!listEl) return;

      const collapsed = listEl.classList.toggle('collapsed');
      btn.textContent = collapsed ? '▼' : '▲';
      btn.setAttribute('aria-expanded', String(!collapsed));

      const addBtn = document.querySelector<HTMLButtonElement>(`button.add[data-group="${n}"]`);
      if (addBtn) {
        if (collapsed) {
          addBtn.classList.add('hidden');
        } else {
          addBtn.classList.remove('hidden');
        }
      }
    });
  });
});

document.getElementById('save')?.addEventListener('click', save);
