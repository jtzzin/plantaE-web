import { Platform } from "react-native";

// Storage genérico: web usa localStorage, mobile usa AsyncStorage
export interface StorageLike {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

const storage: StorageLike = Platform.OS === "web" && typeof window !== "undefined"
  ? {
      setItem: (k, v) => Promise.resolve(localStorage.setItem(k, v)),
      getItem: (k) => Promise.resolve(localStorage.getItem(k)),
      removeItem: (k) => Promise.resolve(localStorage.removeItem(k)),
    }
  : require("@react-native-async-storage/async-storage").default;

export default storage;
