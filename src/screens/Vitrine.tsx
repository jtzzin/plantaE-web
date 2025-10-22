import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Dimensions } from "react-native";
import storage from "../util/storage";
import { GROUPS, PLANTAS_INICIAIS, Planta } from "../data/plants";

const exemplosPlantaPorGrupo = {
  "Pteridófitas": "Samambaia",
  "Angiospermas": "Monstera",
  "Gimnospermas": "Cacto",
  "Briófitas": "Musgo"
};

export default function Vitrine({ navigation }) {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novoResumo, setNovoResumo] = useState("");
  const [novoGrupo, setNovoGrupo] = useState(GROUPS[0]);

  useEffect(() => {
    storage.getItem("nomeUsuario").then(nome => setNomeUsuario(nome || ""));
    storage.getItem("plantas-db").then(res => setPlantas(res ? JSON.parse(res) : PLANTAS_INICIAIS));
  }, []);

  async function cadastrarPlanta() {
    if (!novoNome.trim()) return;
    const nova: Planta = {
      id: String(Date.now()),
      name: novoNome.trim(),
      summary: novoResumo.trim(),
      group: novoGrupo,
    };
    const atualizadas = [...plantas, nova];
    setPlantas(atualizadas);
    await storage.setItem("plantas-db", JSON.stringify(atualizadas));
    setModalVisible(false);
    setNovoNome("");
    setNovoResumo("");
    setNovoGrupo(GROUPS[0]);
  }

  async function excluirPlanta(id: string) {
    const atualizadas = plantas.filter(p => p.id !== id);
    setPlantas(atualizadas);
    await storage.setItem("plantas-db", JSON.stringify(atualizadas));
  }

  const plantasPorGrupo = useMemo(
    () => plantas.filter((p) => p.group === activeGroup),
    [plantas, activeGroup]
  );

  const isEmpty = plantasPorGrupo.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#10141a", position: "relative" }}>
      <View style={{ paddingVertical: 36, paddingHorizontal: 18 }}>
        <Text style={{ color: "#4ADE80", fontSize: 25, fontWeight: "bold" }}>
          Olá, {nomeUsuario}
        </Text>
        <Text style={{ color: "#fff", fontSize: 16, marginTop: 2, marginBottom: 3 }}>
          Qual planta você gostaria de cadastrar?
        </Text>
        <Text style={{
          color: "#91A7C8",
          fontSize: 15,
          fontWeight: "600",
          marginTop: 5,
        }}>
          {plantas.length > 1 ? `Você possui ${plantas.length} plantas cadastradas` :
            `Você ainda não cadastrou plantas`}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginVertical: 22, paddingLeft: 14, paddingRight: 6, alignItems: "center" }}>
        {GROUPS.map(g => (
          <TouchableOpacity
            key={g}
            style={{
              backgroundColor: g === activeGroup ? "#4ADE80" : "#23272f",
              borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8,
              minWidth: 90, maxWidth: 115, marginRight: 8, alignItems: "center",
              borderWidth: g === activeGroup ? 0 : 1, borderColor: "#3f424d",
            }}
            activeOpacity={0.7}
            onPress={() => setActiveGroup(g)}
          >
            <Text style={{
              fontWeight: "bold", color: g === activeGroup ? "#10141a" : "#fff", fontSize: 16,
              textAlign: "center",
            }}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isEmpty && (
        <View style={{
          position: "absolute",
          left: 0, right: 0, top: 172, height: 360,
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingHorizontal: 15,
          zIndex: 2
        }}>
          <Text style={{ fontSize: 85, opacity: 0.18, marginBottom: 19 }}>🌱</Text>
          <Text style={{
            color: "#4ADE80", fontWeight: "bold", fontSize: 20, marginBottom: 16,
            letterSpacing: 0.2, textAlign: "center"
          }}>
            Nenhuma planta nesse grupo
          </Text>
          <Text style={{
            color: "#91a7c8", fontSize: 16, opacity: 0.75, marginBottom: 7, textAlign: "center", maxWidth: 350
          }}>
            Use o botão <Text style={{ color: "#4ADE80", fontWeight: "bold" }}>Nova planta</Text> para cadastrar sua primeira!
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: "#4ADE80",
              borderRadius: 16,
              paddingVertical: 10,
              paddingHorizontal: 28,
              marginTop: 18,
              marginBottom: 14,
              elevation: 7
            }}>
            <Text style={{ color: "#10141a", fontWeight: "bold", fontSize: 16 }}>Cadastrar agora</Text>
          </TouchableOpacity>
          <Text style={{
            color: "#fff", fontSize: 13, opacity: 0.64, textAlign: "center", maxWidth: 375
          }}>
            Toque nos grupos abaixo para explorar diferentes tipos de plantas cadastráveis no sistema.
          </Text>
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20
          }}>
            {[
              { nome: "Samambaia", grupo: "Pteridófitas", emoji: "🌿" },
              { nome: "Monstera", grupo: "Angiospermas", emoji: "🪴" },
              { nome: "Cacto", grupo: "Gimnospermas", emoji: "🌵" }
            ].map(item => (
              <TouchableOpacity
                key={item.nome}
                onPress={() => {
                  setNovoNome(item.nome);
                  setNovoGrupo(item.grupo);
                  setModalVisible(true);
                }}
                style={{
                  backgroundColor: "#23272f",
                  borderRadius: 11,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  alignItems: "center",
                  marginHorizontal: 6,
                  flexDirection: "row",
                  minWidth: 110,
                  elevation: 4
                }}
                activeOpacity={0.82}
              >
                <Text style={{ fontSize: 22, marginRight: 8 }}>
                  {item.emoji}
                </Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>{item.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {!isEmpty && (
        <FlatList
          style={{ flex: 1, paddingHorizontal: 10, marginTop: 14 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 18 }}
          keyExtractor={item => item.id}
          data={plantasPorGrupo}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PlantaDetalhe', { planta: item })}
              style={{
                backgroundColor: "#202534", borderRadius: 20, padding: 16, alignItems: "center",
                width: Dimensions.get("window").width / 2 - 25,
                shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18,
                shadowRadius: 4, elevation: 7, marginBottom: 8,
                position: "relative"
              }}
              activeOpacity={0.90}
            >
              <View style={{ width: "100%", height: 32, position: "absolute", top: 7, right: 0, alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation && e.stopPropagation();
                    excluirPlanta(item.id);
                  }}
                  style={{
                    padding: 3,
                    marginRight: 9,
                    zIndex: 12,
                    backgroundColor: "transparent"
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 19, color: "#e3342f" }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                backgroundColor: "#181b24", width: 64, height: 64, borderRadius: 32, marginBottom: 8,
                alignItems: "center", justifyContent: "center"
              }}>
                <Text style={{ fontSize: 42 }}>
                  {item.name.toLowerCase().includes("samambaia") && "🌿"}
                  {item.name.toLowerCase().includes("monstera") && "🪴"}
                  {item.name.toLowerCase().includes("cacto") && "🌵"}
                  {!["samambaia","monstera","cacto"].some(txt => item.name.toLowerCase().includes(txt)) && "🌱"}
                </Text>
              </View>
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>{item.name}</Text>
              <Text style={{
                color: "#91A7C8", fontSize: 13, textAlign: "center", marginTop: 5
              }} numberOfLines={2}>{item.summary}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={{
        backgroundColor: "#181b24",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 68,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 18,
        borderTopWidth: 2,
        borderTopColor: "#222b31"
      }}>
        <TouchableOpacity>
          <Text style={{ color: "#4ADE80", fontWeight: "bold", fontSize: 16 }}>
            plantas cadastradas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{
            color: "#10141a", backgroundColor: "#4ADE80", borderRadius: 16, paddingVertical: 11, paddingHorizontal: 18,
            fontWeight: "bold", fontSize: 16
          }}>Nova planta</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.48)"
        }}>
          <View style={{
            backgroundColor: "#181b24",
            paddingVertical: 32,
            paddingHorizontal: 18,
            borderRadius: 22,
            width: "95%",
            maxWidth: 410,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.22,
            shadowRadius: 13,
            elevation: 12,
          }}>
            <Text style={{ color: "#4ADE80", fontWeight: "bold", fontSize: 20, marginBottom: 18, alignSelf: "center" }}>
              Cadastrar nova planta
            </Text>
            <View style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: "100%",
              maxWidth: 375,
              marginBottom: 17,
              marginTop: 4,
              flexWrap: "wrap",
            }}>
              {GROUPS.map(g => (
                <TouchableOpacity
                  key={g}
                  style={{
                    backgroundColor: novoGrupo === g ? "#4ADE80" : "#23272f",
                    paddingHorizontal: 15,
                    paddingVertical: 9,
                    borderRadius: 11,
                    marginHorizontal: 6,
                    marginBottom: 2,
                    minWidth: 0,
                    maxWidth: 130,
                  }}
                  onPress={() => {
                    setNovoGrupo(g);
                    setNovoNome(exemplosPlantaPorGrupo[g] || "");
                  }}
                >
                  <Text style={{
                    color: novoGrupo === g ? "#10141a" : "#fff",
                    fontWeight: "bold",
                    fontSize: 15,
                    textAlign: "center"
                  }}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome da planta"
              style={{
                backgroundColor: "#23272f",
                color: "#fff",
                paddingHorizontal: 17,
                paddingVertical: 12,
                fontSize: 16,
                borderRadius: 10,
                marginBottom: 8,
                width: "100%"
              }}
              placeholderTextColor="#a3a3a3"
            />
            <TextInput
              value={novoResumo}
              onChangeText={setNovoResumo}
              placeholder="Resumo/cuidados"
              style={{
                backgroundColor: "#23272f",
                color: "#fff",
                paddingHorizontal: 17,
                paddingVertical: 12,
                fontSize: 16,
                borderRadius: 10,
                marginBottom: 18,
                width: "100%"
              }}
              placeholderTextColor="#a3a3a3"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#4ADE80",
                  paddingVertical: 12,
                  flex: 1,
                  borderRadius: 11,
                  alignItems: "center",
                  marginRight: 12
                }}
                onPress={cadastrarPlanta}>
                <Text style={{ color: "#181b24", fontWeight: "bold", fontSize: 16 }}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e3342f",
                  paddingVertical: 12,
                  flex: 1,
                  borderRadius: 11,
                  alignItems: "center"
                }}
                onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
