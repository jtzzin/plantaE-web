import React from "react";
import { Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// Componente de data/hora: adapta input para web e mobile.
interface Props {
  value: Date;
  onChange: (event: DateTimePickerEvent | null, date?: Date) => void;
  mode?: "date" | "time" | "datetime";
}

export function PlatformDateTimePicker({ value, onChange, mode = "date" }: Props) {
  // Para web: usa <input> nativo HTML5, com estilo visual
  if (Platform.OS === "web") {
    return (
      <input
        type={mode === "time" ? "time" : mode === "datetime" ? "datetime-local" : "date"}
        value={
          mode === "time"
            ? value.toISOString().slice(11, 16)
            : value.toISOString().slice(0, mode === "date" ? 10 : 16)
        }
        onChange={e => {
          // Captura valor do input e transforma em objeto Date
          const v = e.target.value;
          let d: Date;
          if (mode === "date") d = new Date(v + "T" + value.toTimeString().slice(0, 8));
          else if (mode === "time") {
            const [h, m] = v.split(":");
            d = new Date(value);
            d.setHours(Number(h), Number(m));
          } else d = new Date(v);
          onChange(null, d);
        }}
        style={{
          fontSize: 18, margin: "12px 0", borderRadius: 10,
          border: "2px solid #4ADE80", padding: "10px 18px", background: "#181b24", color: "#fff"
        }}
      />
    );
  }
  // Para mobile: usa DateTimePicker nativo
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      mode={mode}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      style={{ margin: 12 }}
      textColor="#4ADE80"
      themeVariant="dark"
    />
  );
}
