// src/util/notifications.ts
import { Platform } from "react-native";

type Props = { title: string; body: string; date?: Date };

export async function scheduleNotification({ title, body, date }: Props) {
  if (Platform.OS === "web") {
    window.alert(`[WEB] Notificação: ${title}\n${body}`);
    return;
  }
  // Mobile notifications (apenas no físico)
  const Notifications = require('expo-notifications');
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date ? { seconds: Math.max(1, Math.round((date.getTime() - Date.now()) / 1000)), repeats: false } : undefined,
  });
}
