// src/components/PlatformDateTimePicker.tsx
import React from "react";
import { Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface Props {
  value: Date;
  onChange: (event: DateTimePickerEvent | null, date?: Date) => void;
  mode?: "date" | "time" | "datetime";
}

export function PlatformDateTimePicker({ value, onChange, mode = "date" }: Props) {
  if (Platform.OS === "web") {
    // Input ajustado para web
    return (
      <input
        type={mode === "time" ? "time" : mode === "datetime" ? "datetime-local" : "date"}
        value={
          mode === "time"
            ? value.toISOString().slice(11, 16)
            : value.toISOString().slice(0, mode === "date" ? 10 : 16)
        }
        onChange={e => {
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
        style={{ fontSize: 16, margin: 7, borderRadius: 6, padding: 7 }}
      />
    );
  }
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      mode={mode}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      style={{ margin: 7 }}
    />
  );
}
