import type { PlayerCharacter } from "../model/PlayerCharacter";
import { defaultPC } from "../model/PlayerCharacter";
import { debounce } from "../utils";
import { NUM_SLOTS } from "./SaveSlotTracker";

const saveToLocalStorage = debounce(savePlayerToLocalStorage, 2000);

export function trackAndSavePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number
) {
  saveToLocalStorage(pc, saveSlot);
}

function isOBRAvailable(): boolean {
  return false; // TODO isOBRAvailable
}

export async function clearLocalStorage() {
  for (let i = 0; i < NUM_SLOTS; i++) {
    await asyncLocalStorage.removeItem(getStorageKey(i + 1));
  }
}

export async function savePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number
) {
  if (isOBRAvailable()) {
    console.log("saving to OBR player");
  } else {
    asyncLocalStorage.setItem(getStorageKey(saveSlot), JSON.stringify(pc));
  }
}

function getStorageKey(saveSlot: number) {
  return `sd-character-sheet-slot-${saveSlot}`;
}

export async function loadPlayerFromLocalStorage(
  saveSlot: number
): Promise<PlayerCharacter> {
  if (isOBRAvailable()) {
    console.log("loading Player from OBR");
  } else {
    await maintainBackwardsCompat(saveSlot);
    const pcJson = await asyncLocalStorage.getItem(getStorageKey(saveSlot));
    if (!pcJson) return defaultPC();
    const pc = JSON.parse(pcJson) as PlayerCharacter;
    return pc;
  }
}

async function maintainBackwardsCompat(saveSlot: number) {
  const oldStorageKey = "sd-character-sheet";
  const oldPcJson = await asyncLocalStorage.getItem(oldStorageKey);
  if (!oldPcJson) return;
  await asyncLocalStorage.setItem(getStorageKey(saveSlot), oldPcJson);
  await asyncLocalStorage.removeItem(oldStorageKey);
}

const asyncLocalStorage = {
  setItem: async function (key: string, value: string) {
    return Promise.resolve().then(function () {
      window.localStorage.setItem(key, value);
    });
  },
  getItem: async function (key: string) {
    return Promise.resolve().then(function () {
      return window.localStorage.getItem(key);
    });
  },
  removeItem: async function (key: string) {
    return Promise.resolve().then(function () {
      return window.localStorage.removeItem(key);
    });
  },
};
