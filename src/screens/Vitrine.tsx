import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";

const GROUPS = ["Briófitas", "Pteridófitas", "Gimnospermas", "Angiospermas"];
const MVP_PLANTS = [
  { id: "1", name: "Samambaia", group: "Pteridófitas", summary: "Sombra, umidade." },
  { id: "2", name: "Monstera deliciosa", group: "Angiospermas", summary: "Meia-sombra, regas médias." },
  { id: "3", name: "Cacto Cereus", group: "Gimnospermas", summary: "Sol, substrato seco." }
];

export default function Vitrine({ navigation }: any) {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const plantasPorGrupo = useMemo(
    () => MVP_PLANTS.filter((p) => p.group === activeGroup),
    [activeGroup]
  );
  
  return (
    <View style={{ flex: 1, backgroundColor: "#10141a" }}>
      <View style={{ paddingVertical: 38, paddingHorizontal: 18 }}>
        <Text style={{ color: "#4ADE80", fontSize: 24, fontWeight: "bold" }}>Olá, Tiago</Text>
        <Text style={{ color: "#fff", fontSize: 16, marginTop: 2 }}>
          Qual planta você gostaria de cadastrar?
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginVertical: 20, paddingLeft: 14, paddingRight: 6, alignItems: "center" }}>
        {GROUPS.map((g) => (
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
      <FlatList
        style={{ flex: 1, paddingHorizontal: 10 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 18 }}
        keyExtractor={item => item.id}
        data={plantasPorGrupo}
        ListEmptyComponent={<Text style={{ color: "#fff", alignSelf: "center" }}>Nenhuma planta nesse grupo.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Relogio", { plantId: item.id })}
            style={{
              backgroundColor: "#202534", borderRadius: 20, padding: 16, alignItems: "center",
              width: Dimensions.get("window").width / 2 - 25,
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18,
              shadowRadius: 4, elevation: 7,
            }}
            activeOpacity={0.8}
          >
            <View style={{
              backgroundColor: "#181b24", width: 64, height: 64, borderRadius: 32, marginBottom: 8,
              alignItems: "center", justifyContent: "center"
            }}>
              <Text style={{ fontSize: 42 }}>
                {item.name === "Samambaia" && "🌿"}
                {item.name === "Monstera deliciosa" && "🪴"}
                {item.name === "Cacto Cereus" && "🌵"}
              </Text>
            </View>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>{item.name}</Text>
            <Text style={{
              color: "#91A7C8", fontSize: 13, textAlign: "center", marginTop: 5
            }} numberOfLines={2}>
              {item.summary}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={{
        backgroundColor: "#181b24", flexDirection: "row", alignItems: "center",
        justifyContent: "space-around", height: 68, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        position: "absolute", left: 0, right: 0, bottom: 0
      }}>
        <TouchableOpacity>
          <Text style={{ color: "#4ADE80", fontWeight: "bold" }}>plantas cadastradas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{
            color: "#10141a", backgroundColor: "#4ADE80", borderRadius: 16, padding: 12,
            overflow: "hidden", fontWeight: "bold"
          }}>Nova planta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
