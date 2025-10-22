import React from "react";
import { Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// Retorna string "yyyy-MM-ddTHH:mm" no fuso local, compatível com <input type="datetime-local" />
function getLocalISO(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
  value: Date;
  onChange: (event: DateTimePickerEvent | null, date?: Date) => void;
  mode?: "date" | "time" | "datetime";
}

export function PlatformDateTimePicker({ value, onChange, mode = "date" }: Props) {
  if (Platform.OS === "web") {
    return (
      <input
        type={mode === "time" ? "time" : mode === "datetime" ? "datetime-local" : "date"}
        value={
          mode === "time"
            ? value.toTimeString().slice(0, 5)
            : getLocalISO(value)
        }
        onChange={e => {
          let d: Date;
          if (mode === "date") {
            d = new Date(e.target.value + "T" + value.toTimeString().slice(0, 8));
          } else if (mode === "time") {
            const [h, m] = e.target.value.split(":");
            d = new Date(value);
            d.setHours(Number(h), Number(m));
          } else {
            const [date, time] = e.target.value.split("T");
            const [year, month, day] = date.split("-");
            const [hour, minute] = time.split(":");
            d = new Date(
              Number(year), Number(month) - 1, Number(day),
              Number(hour), Number(minute)
            );
          }
          onChange(null, d);
        }}
        style={{ fontSize: 16, margin: 7, borderRadius: 6, padding: 7, width: "100%" }}
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
