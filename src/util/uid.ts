// src/utils/uid.ts

/**
 * Gera um UUID v4 (universal, compatível com web/mobile/outros)
 * Usa crypto se disponível, senão faz fallback mais simples
 */
export function uid(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      // Suporte nativo em browsers modernos e Node.js
      return crypto.randomUUID();
    }
    // Fallback: gera 32 chars hex + traços (válido p/ chaves simples)
    const a = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return (
      a() +
      a() +
      "-" +
      a() +
      "-" +
      a() +
      "-" +
      a() +
      "-" +
      a() +
      a() +
      a()
    );
  }
  