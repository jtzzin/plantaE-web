import { Platform } from "react-native";

// Dispara alertas de notificação: usa window.alert na web e expo-notifications no mobile
type Props = { title: string; body: string; date?: Date };

export async function scheduleNotification({ title, body, date }: Props) {
  if (Platform.OS === "web") {
    window.alert(`[WEB] Notificação: ${title}\n${body}`);
    return;
  }
  // No mobile físico, usa expo-notifications
  const Notifications = require('expo-notifications');
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: date ? { seconds: Math.max(1, Math.round((date.getTime() - Date.now()) / 1000)), repeats: false } : undefined,
  });
}
