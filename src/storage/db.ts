// src/storage/db.ts
import storage from "../util/storage";

export interface PlantInstance {
  instanceId: string;
  plantId: string;
  active: boolean;
  history: {
    at: number;
    type: "manual" | "lembrete" | "adubacao";
    note?: string;
  }[];
}

const STORAGE_KEY = "@plantas";

export async function upsert(instance: PlantInstance): Promise<void> {
  const all = await loadAll();
  const i = all.findIndex((pi) => pi.instanceId === instance.instanceId);
  if (i >= 0) {
    all[i] = instance;
  } else {
    all.push(instance);
  }
  await storage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export async function loadAll(): Promise<PlantInstance[]> {
  const json = await storage.getItem(STORAGE_KEY);
  if (json) {
    try {
      return JSON.parse(json) as PlantInstance[];
    } catch {
      return [];
    }
  }
  return [];
}

export async function remove(instanceId: string): Promise<void> {
  const all = await loadAll();
  const updated = all.filter((p) => p.instanceId !== instanceId);
  await storage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
