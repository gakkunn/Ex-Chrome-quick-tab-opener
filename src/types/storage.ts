export type SlotId =
  | 'slot1'
  | 'slot2'
  | 'slot3'
  | 'slot4'
  | 'slot5'
  | 'slot6'
  | 'slot7'
  | 'slot8'
  | 'slot9';

export type GroupKey =
  | 'group1'
  | 'group2'
  | 'group3'
  | 'group4'
  | 'group5'
  | 'group6'
  | 'group7'
  | 'group8'
  | 'group9';

export interface StorageData {
  slot1?: string;
  slot2?: string;
  slot3?: string;
  slot4?: string;
  slot5?: string;
  slot6?: string;
  slot7?: string;
  slot8?: string;
  slot9?: string;
  group1?: string[];
  group2?: string[];
  group3?: string[];
  group4?: string[];
  group5?: string[];
  group6?: string[];
  group7?: string[];
  group8?: string[];
  group9?: string[];
  pinByDefault?: boolean;
}

export const SLOT_IDS: SlotId[] = [
  'slot1',
  'slot2',
  'slot3',
  'slot4',
  'slot5',
  'slot6',
  'slot7',
  'slot8',
  'slot9',
];

export const GROUP_KEYS: GroupKey[] = [
  'group1',
  'group2',
  'group3',
  'group4',
  'group5',
  'group6',
  'group7',
  'group8',
  'group9',
];

export const MAX_GROUP_ITEMS = 10;

export type StorageKey = SlotId | GroupKey | 'pinByDefault';
