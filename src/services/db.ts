import storage from "../util/storage";
import { Planta } from "../data/plants";

// Funções de CRUD usando o storage
const KEY = "plantas-db";

// Retorna todas as plantas cadastradas no storage
export async function listarPlantas(): Promise<Planta[]> {
  const raw = await storage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

// Adiciona nova planta ao storage
export async function cadastrarPlanta(planta: Planta): Promise<void> {
  const todas = await listarPlantas();
  await storage.setItem(KEY, JSON.stringify([...todas, planta]));
}

// Exclui planta a partir do id
export async function excluirPlanta(id: string): Promise<void> {
  const todas = await listarPlantas();
  await storage.setItem(KEY, JSON.stringify(todas.filter(p => p.id !== id)));
}

// Atualiza dados da planta (ex: após a rega)
export async function atualizarPlanta(nova: Planta): Promise<void> {
  const todas = await listarPlantas();
  await storage.setItem(KEY, JSON.stringify(todas.map(p => p.id === nova.id ? nova : p)));
}
