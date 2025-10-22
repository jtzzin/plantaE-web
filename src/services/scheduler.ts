// src/services/scheduler.ts

// Defina o tipo PlantInstance
export interface PlantInstance {
    instanceId: string;
    plantId: string;
    active: boolean;
    history: {
      at: number; // timestamp
      type: "manual" | "lembrete" | "adubacao";
      note?: string;
    }[];
  }
  
  /**
   * Função dummy para "agendar" a próxima rega.
   * No futuro, pode calcular próximas datas, salvar em storage/DB etc.
   * Por enquanto só retorna uma Promise<void> para manter interface.
   */
  export async function planFirst(instance: PlantInstance, date: Date): Promise<void> {
    // Aqui você pode fazer qualquer lógica.
    // Para um projeto simples, só um await resolve/void já serve!
    return;
  }
  