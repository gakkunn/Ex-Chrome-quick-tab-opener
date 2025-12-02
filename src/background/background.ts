import { normalizeUrl } from '../utils/url';
import {
  getPinDefault,
  isValidGroupNumber,
  isValidSlotNumber,
  readGroup,
  readSlot,
} from '../utils/storage';

type TabPlacement = {
  baseIndex?: number;
  windowId?: number;
};

type CommandTarget = 'slot' | 'group';

async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0) {
      return tabs[0];
    }
  } catch {
    // ignore
  }
  return null;
}

async function getTabPlacement(): Promise<TabPlacement> {
  const activeTab = await getActiveTab();
  if (!activeTab) {
    return {};
  }

  const placement: TabPlacement = {};
  if (typeof activeTab.index === 'number') {
    placement.baseIndex = activeTab.index + 1;
  }
  if (typeof activeTab.windowId === 'number') {
    placement.windowId = activeTab.windowId;
  }
  return placement;
}

function applyPlacement(
  props: chrome.tabs.CreateProperties,
  placement: TabPlacement,
  offset: number
): void {
  if (typeof placement.windowId === 'number') {
    props.windowId = placement.windowId;
  }
  if (typeof placement.baseIndex === 'number') {
    props.index = placement.baseIndex + offset;
  }
}

async function openUrls(urls: string[], pinned: boolean, activeFirst: boolean): Promise<void> {
  const placement = await getTabPlacement();
  const createTasks = urls.map((rawUrl, index) => {
    const normalized = normalizeUrl(rawUrl);
    const createProps: chrome.tabs.CreateProperties = {
      url: normalized,
      pinned,
      active: activeFirst ? index === 0 : false,
    };
    applyPlacement(createProps, placement, index);
    return chrome.tabs.create(createProps);
  });
  await Promise.all(createTasks);
}

async function openSlot(n: number): Promise<void> {
  try {
    const url = await readSlot(n);

    if (!url) {
      chrome.runtime.openOptionsPage();
      return;
    }

    const pinned = await getPinDefault();
    await openUrls([url], pinned, true);
  } catch (error) {
    console.error(`Failed to open slot ${n}`, error);
  }
}

async function openGroup(n: number): Promise<void> {
  try {
    const cleaned = await readGroup(n);

    if (cleaned.length === 0) {
      chrome.runtime.openOptionsPage();
      return;
    }

    const pinned = await getPinDefault();
    await openUrls(cleaned, pinned, true);
  } catch (error) {
    console.error(`Failed to open group ${n}`, error);
  }
}

async function refreshCommandStatus(): Promise<void> {
  try {
    const commands = await chrome.commands.getAll();
    const isTarget = ({ name }: chrome.commands.Command): boolean =>
      /^(open_slot_\d+|open_group_\d+)$/.test(name ?? '');
    const target = commands.filter(isTarget);
    const hasAnyAssigned = target.some(({ shortcut }) => Boolean(shortcut));

    if (!hasAnyAssigned) {
      await chrome.action.setBadgeBackgroundColor({ color: '#d9534f' });
      await chrome.action.setBadgeText({ text: '!' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.warn('Failed to inspect command bindings', error);
  }
}

const COMMAND_PATTERN = /^open_(slot|group)_(\d+)$/;
const commandHandlers: Record<CommandTarget, (n: number) => Promise<void>> = {
  slot: openSlot,
  group: openGroup,
};

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_ui') {
    chrome.runtime.openOptionsPage();
    return;
  }

  const match = command.match(COMMAND_PATTERN);
  if (!match) {
    return;
  }

  const [, type, value] = match;
  const targetNumber = Number.parseInt(value, 10);

  if (
    Number.isNaN(targetNumber) ||
    (type === 'slot' && !isValidSlotNumber(targetNumber)) ||
    (type === 'group' && !isValidGroupNumber(targetNumber))
  ) {
    return;
  }

  const handler = commandHandlers[type as CommandTarget];
  if (handler) {
    void handler(targetNumber);
  }
});

refreshCommandStatus();
chrome.runtime.onInstalled.addListener(() => {
  refreshCommandStatus();
});
chrome.runtime.onStartup.addListener(() => {
  refreshCommandStatus();
});
