import {
  GROUP_KEYS,
  MAX_GROUP_ITEMS,
  SLOT_IDS,
  type GroupKey,
  type SlotId,
  type StorageData,
  type StorageKey,
} from '../types/storage';

export async function getPinDefault(): Promise<boolean> {
  const result = await chrome.storage.sync.get('pinByDefault');
  return result.pinByDefault !== undefined ? Boolean(result.pinByDefault) : true;
}

export async function getStorageData<K extends readonly StorageKey[]>(
  keys: K
): Promise<Pick<StorageData, K[number]>> {
  return chrome.storage.sync.get(keys) as Promise<Pick<StorageData, K[number]>>;
}

export async function setStorageData(data: Partial<StorageData>): Promise<void> {
  return chrome.storage.sync.set(data);
}

export const SLOT_COUNT = SLOT_IDS.length;
export const GROUP_COUNT = GROUP_KEYS.length;

export const isValidSlotNumber = (n: number): n is number =>
  Number.isInteger(n) && n >= 1 && n <= SLOT_COUNT;

export const isValidGroupNumber = (n: number): n is number =>
  Number.isInteger(n) && n >= 1 && n <= GROUP_COUNT;

export function toSlotId(n: number): SlotId | null {
  return isValidSlotNumber(n) ? SLOT_IDS[n - 1] : null;
}

export function toGroupKey(n: number): GroupKey | null {
  return isValidGroupNumber(n) ? GROUP_KEYS[n - 1] : null;
}

export async function readSlot(n: number): Promise<string | undefined> {
  const slotId = toSlotId(n);
  if (!slotId) return undefined;

  const data = await getStorageData([slotId]);
  const value = data[slotId];
  return typeof value === 'string' ? value : undefined;
}

export async function readGroup(n: number): Promise<string[]> {
  const groupKey = toGroupKey(n);
  if (!groupKey) return [];

  const data = await getStorageData([groupKey]);
  const rawList = data[groupKey];

  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((u) => String(u ?? '').trim())
    .filter((u) => u.length > 0)
    .slice(0, MAX_GROUP_ITEMS);
}
