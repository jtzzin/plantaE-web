// Estrutura dos grupos e plantas iniciais do sistema
export interface Planta {
    id: string;
    name: string;
    group: string;
    summary: string;
    ultimaRega?: Date;
    proximaRega?: Date;
  }
  
  // Lista de grupos para uso na vitrine/cadastro
  export const GROUPS = ["Briófitas", "Pteridófitas", "Gimnospermas", "Angiospermas"];
  
  // Lista de exemplo para renderização inicial
  export const PLANTAS_INICIAIS: Planta[] = [
    { id: "1", name: "Samambaia", group: "Pteridófitas", summary: "Sombra, umidade." },
    { id: "2", name: "Monstera deliciosa", group: "Angiospermas", summary: "Meia-sombra, regas médias." },
    { id: "3", name: "Cacto Cereus", group: "Gimnospermas", summary: "Sol, substrato seco." },
  ];
  