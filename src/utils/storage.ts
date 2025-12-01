import type { StorageData, StorageKey } from '../types/storage';

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
