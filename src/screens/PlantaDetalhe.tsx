import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from "react-native";
import { PlatformDateTimePicker } from "../components/PlatformDateTimePicker";
import storage from "../util/storage";

// Detalhes da planta, regas e histórico
export default function PlantaDetalhe({ route, navigation }) {
  const planta = route?.params?.planta ?? {};
  const [historico, setHistorico] = useState([]);
  const [dataRega, setDataRega] = useState(new Date());
  const [observacao, setObservacao] = useState("");

  // Carrega histórico salvo no storage
  useEffect(() => {
    storage.getItem(`regas-${planta.id}`).then(res => {
      setHistorico(res ? JSON.parse(res) : []);
    });
  }, [planta.id]);

  // Salva nova rega, feedback visual
  async function registrarRega() {
    const rega = {
      data: dataRega.toISOString(),
      observacao: observacao.trim()
    };
    const atualizados = [rega, ...historico];
    setHistorico(atualizados);
    await storage.setItem(`regas-${planta.id}`, JSON.stringify(atualizados));
    setObservacao("");
    setDataRega(new Date());
    Alert.alert("Rega agendada!", "O registro de rega foi salvo com sucesso.");
  }

  // Limpa histórico da planta
  async function limparHistorico() {
    setHistorico([]);
    await storage.setItem(`regas-${planta.id}`, JSON.stringify([]));
  }

  function formatarData(dataStr) {
    const dt = new Date(dataStr);
    return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString().slice(0, 5)}`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#181b24", paddingTop: 18 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 22, left: 18, zIndex: 4 }}
      >
        <Text style={{ color: "#4ADE80", fontWeight: "bold", fontSize: 17 }}>← Voltar</Text>
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: 34, marginBottom: 10 }}>
        <Text style={{ fontSize: 60 }}>
          {planta.name?.toLowerCase().includes("samambaia") ? "🌿"
            : planta.name?.toLowerCase().includes("monstera") ? "🪴"
            : planta.name?.toLowerCase().includes("cacto") ? "🌵"
            : "🌱"}
        </Text>
        <Text style={{
          color: "#4ADE80", fontWeight: "bold", fontSize: 24, marginTop: 10
        }}>{planta.name}</Text>
        <Text style={{
          color: "#fff", fontSize: 16, marginTop: 6, textAlign: "center", maxWidth: 320, opacity: 0.8
        }}>
          {planta.summary}
        </Text>
      </View>

      {/* Agendamento de rega */}
      <View style={{ backgroundColor: "#23272f", borderRadius: 18, margin: 20, padding: 18 }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
          Agendar nova rega
        </Text>
        <PlatformDateTimePicker
          value={dataRega}
          onChange={(_, date) => date && setDataRega(date)}
          mode="date"
        />
        <TextInput
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Observação (opcional)"
          placeholderTextColor="#aaa"
          style={{
            backgroundColor: "#202534", color: "#fff", borderRadius: 9, paddingHorizontal: 14,
            paddingVertical: 10, marginTop: 12, fontSize: 15
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#4ADE80", marginTop: 15, borderRadius: 13, paddingVertical: 13,
            alignItems: "center"
          }}
          onPress={registrarRega}
        >
          <Text style={{
            color: "#10141a", fontWeight: "bold", fontSize: 16
          }}>Salvar rega</Text>
        </TouchableOpacity>
      </View>

      {/* Histórico visual das regas */}
      <View style={{ marginHorizontal: 22, marginTop: 8, marginBottom: 22 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{
            color: "#91A7C8", fontWeight: "bold", fontSize: 18
          }}>Histórico de regas</Text>
          {historico.length > 0 && (
            <TouchableOpacity onPress={limparHistorico}>
              <Text style={{ color: "#e3342f", fontWeight: "bold", fontSize: 14 }}>Limpar histórico</Text>
            </TouchableOpacity>
          )}
        </View>
        {historico.length === 0 &&
          <Text style={{ color: "#7d889c" }}>
            Nenhuma rega registrada para esta planta.
          </Text>
        }
        <FlatList
          data={historico}
          keyExtractor={(_, idx) => String(idx)}
          style={{ marginTop: 2 }}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: "#23272f", borderRadius: 9, marginBottom: 10,
              paddingHorizontal: 13, paddingVertical: 12
            }}>
              <Text style={{ color: "#4ADE80", fontWeight: "bold", fontSize: 15 }}>
                {formatarData(item.data)}
              </Text>
              {item.observacao ?
                <Text style={{ color: "#fff", fontSize: 14, marginTop: 3 }}>
                  {item.observacao}
                </Text> : null}
            </View>
          )}
        />
      </View>
    </View>
  );
}
