import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import { loadAll, upsert, PlantInstance } from "../storage/db";
import { PlatformDateTimePicker } from "../components/PlatformDateTimePicker";

export default function PlantaDetalhe({ route, navigation }: any) {
  const { instanceId } = route.params;
  const [planta, setPlanta] = useState<PlantInstance | null>(null);
  const [showAdubaPicker, setShowAdubaPicker] = useState(false);
  const [adubaDate, setAdubaDate] = useState(new Date());
  const [showLembretePicker, setShowLembretePicker] = useState(false);
  const [lembreteDate, setLembreteDate] = useState(new Date());
  // Evita alertas múltiplos
  const [alerted, setAlerted] = useState(false);

  useEffect(() => {
    loadAll().then(list => {
      setPlanta(list.find((p) => p.instanceId === instanceId) ?? null);
    });
  }, [instanceId]);

  // Efeito para mostrar alerta de lembrete
  useEffect(() => {
    if (!planta) return;
    const timer = setInterval(() => {
      const agora = Date.now();
      // Tolerância de 2 minutos
      const lembretesProximos = planta.history.filter(
        h => h.type === "lembrete" && Math.abs(h.at - agora) < 120_000
      );
      if (!alerted && lembretesProximos.length > 0) {
        const lembrete = lembretesProximos[0];
        setAlerted(true);
        if (Platform.OS === "web") {
          // Modal manual para web
          const acao = window.prompt(
            "LEMBRETE DE REGA!\nDigite: 1 - Feito, 2 - Regar depois (adiar 1h), 3 - Cancelar lembrete",
            "1"
          );
          if (acao === "1") {
            planta.history.push({ at: Date.now(), type: "manual" });
            upsert(planta);
            setPlanta({ ...planta });
          } else if (acao === "2") {
            lembrete.at = Date.now() + 60 * 60 * 1000;
            upsert(planta);
            setPlanta({ ...planta });
          } else if (acao === "3") {
            planta.history = planta.history.filter(h => h !== lembrete);
            upsert(planta);
            setPlanta({ ...planta });
          }
          setAlerted(false);
        } else {
          Alert.alert(
            "Lembrete de rega",
            "Já chegou o horário do lembrete!",
            [
              {
                text: "Feito",
                onPress: async () => {
                  planta.history.push({ at: Date.now(), type: "manual" });
                  await upsert(planta);
                  setPlanta({ ...planta });
                  setAlerted(false);
                }
              },
              {
                text: "Regar depois",
                onPress: async () => {
                  lembrete.at = Date.now() + 60 * 60 * 1000;
                  await upsert(planta);
                  setPlanta({ ...planta });
                  setAlerted(false);
                }
              },
              {
                text: "Cancelar lembrete",
                style: "destructive",
                onPress: async () => {
                  planta.history = planta.history.filter(h => h !== lembrete);
                  await upsert(planta);
                  setPlanta({ ...planta });
                  setAlerted(false);
                }
              }
            ],
            { cancelable: false }
          );
        }
      }
      // reseta alerta se não houver lembrete próximo
      if (alerted && lembretesProximos.length === 0) setAlerted(false);
    }, 20_000);
    return () => clearInterval(timer);
  }, [planta, alerted]);

  if (!planta) return <Text style={{ color: "#fff", padding: 24 }}>Carregando...</Text>;

  return (
    <View style={{ flex: 1, padding: 18, backgroundColor: "#10141a" }}>
      <Text style={{ fontWeight: "bold", fontSize: 22, color: "#4ADE80", marginBottom: 12 }}>
        Histórico de {planta.plantId}
      </Text>
      <Button title="Adicionar adubação" color="#e4911c" onPress={() => setShowAdubaPicker(true)} />
      <View style={{ height: 8 }} />
      <Button title="Adicionar lembrete manual" color="#4ADE80" onPress={() => setShowLembretePicker(true)} />
      <View style={{ height: 8 }} />
      <Button title="Voltar" color="#303030" onPress={() => navigation.replace("Vitrine")} />

      {showAdubaPicker && (
        <PlatformDateTimePicker
          value={adubaDate}
          onChange={(_e, d) => {
            if (d && planta) {
              planta.history.push({ at: d.getTime(), type: "adubacao" });
              upsert(planta);
              setPlanta({ ...planta });
              setShowAdubaPicker(false);
              setAdubaDate(new Date());
            }
          }}
          mode="datetime"
        />
      )}
      {showLembretePicker && (
        <PlatformDateTimePicker
          value={lembreteDate}
          onChange={(_e, d) => {
            if (d && planta) {
              planta.history.push({ at: d.getTime(), type: "lembrete" });
              upsert(planta);
              setPlanta({ ...planta });
              setShowLembretePicker(false);
              setLembreteDate(new Date());
            }
          }}
          mode="datetime"
        />
      )}

      <View style={{ marginTop: 30 }}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Histórico de eventos:</Text>
        {planta.history.length === 0 && <Text style={{ color: "#aaa" }}>Nenhum registro ainda</Text>}
        {planta.history
          .slice()
          .sort((a, b) => b.at - a.at)
          .map((ev, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
              <Text style={{ color: "#fff", flex: 1 }}>
                {new Date(ev.at).toLocaleString()} ({ev.type})
              </Text>
              <Button
                title="Excluir"
                color="#cc0011"
                onPress={async () => {
                  if (planta) {
                    planta.history = planta.history.filter((h, j) => !(j === i && h.at === ev.at));
                    await upsert(planta);
                    setPlanta({ ...planta });
                  }
                }}
              />
            </View>
        ))}
      </View>
    </View>
  );
}
