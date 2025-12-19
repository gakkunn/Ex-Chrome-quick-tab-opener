import { isValidUrl } from '../utils/url';
import { getStorageData, isValidGroupNumber, setStorageData } from '../utils/storage';
import { SLOT_IDS, GROUP_KEYS, MAX_GROUP_ITEMS } from '../types/storage';
import type { GroupKey, SlotId, StorageData } from '../types/storage';

type GroupContext = {
  key: GroupKey;
  idx: number;
  n: number;
};

// i18n helper function
const getMessage = (key: string, substitutions?: string | string[]): string => {
  return chrome.i18n.getMessage(key, substitutions) || key;
};

const setDocumentLanguage = (): void => {
  const locale = chrome.i18n.getMessage('@@ui_locale') || 'en';
  document.documentElement.lang = locale;

  const dir = chrome.i18n.getMessage('@@bidi_dir');
  if (dir === 'rtl' || dir === 'ltr') {
    document.documentElement.dir = dir;
  } else {
    document.documentElement.removeAttribute('dir');
  }
};

const getSubstitutions = (el: HTMLElement): string | string[] | undefined => {
  const subs = el.getAttribute('data-i18n-subs');
  return subs ? subs.split(',') : undefined;
};

// Initialize i18n for static HTML elements
function initI18n(): void {
  // Update document title
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n');
    if (key) {
      document.title = getMessage(key);
    }
  }

  // Update elements with data-i18n attribute
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;

    const substitutions = getSubstitutions(el);
    const message = getMessage(key, substitutions);

    if (el.tagName === 'TITLE') {
      document.title = message;
    } else {
      const allowHtml = el.getAttribute('data-i18n-html');
      if (allowHtml !== null && allowHtml !== 'false') {
        el.innerHTML = message;
      } else {
        el.textContent = message;
      }
    }
  });

  // Update placeholders
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = getMessage(key);
    }
  });
}

const getElementById = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;

const getSlotInput = (id: SlotId): HTMLInputElement | null => getElementById<HTMLInputElement>(id);

const getPinCheckbox = (): HTMLInputElement | null =>
  getElementById<HTMLInputElement>('pinByDefault');

const getGroupListElement = (n: number): HTMLElement | null =>
  getElementById<HTMLElement>(`group${n}-list`);

const parseGroupIndex = (el: HTMLElement | null): number | null => {
  if (!el) return null;
  const value = Number.parseInt(el.getAttribute('data-group') || '', 10);
  return isValidGroupNumber(value) ? value : null;
};

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
    show(getMessage('error_max_urls', [String(n), String(MAX_GROUP_ITEMS)]), true);
    return;
  }

  const row = document.createElement('div');
  row.className = 'row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = getMessage('placeholder_url');
  input.value = value;
  input.style.flex = '1 1 auto';

  const del = document.createElement('button');
  del.textContent = getMessage('button_delete');
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

  const pinEl = getPinCheckbox();
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
      errors.push(getMessage('error_invalid_slot_url', [String(idx + 1), value]));
    }
  });

  forEachGroupList((listEl, { n }) => {
    collectGroupValues(listEl).forEach((value, inputIdx) => {
      if (value.length > 0 && !isValidUrl(value)) {
        errors.push(getMessage('error_invalid_group_url', [String(n), String(inputIdx + 1), value]));
      }
    });
  });

  if (errors.length > 0) {
    const errorMessage =
      errors.length === 1
        ? errors[0]
        : `${getMessage('error_count', [String(errors.length)])}\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n${getMessage('error_and_more', [String(errors.length - 5)])}` : ''}`;
    show(errorMessage, true);
    return;
  }

  const payload: Partial<StorageData> = {};

  forEachSlotInput((input, _, id) => {
    payload[id] = input.value.trim();
  });

  const pinEl = getPinCheckbox();
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

  show(getMessage('msg_saved'));
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
  setDocumentLanguage();
  // Initialize i18n first
  initI18n();

  load();

  document.querySelectorAll<HTMLButtonElement>('button.add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = parseGroupIndex(btn);
      if (n) {
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
      const n = parseGroupIndex(btn);
      if (!n) return;

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
