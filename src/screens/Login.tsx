// src/screens/Login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

type Props = { navigation: any };

export default function Login({ navigation }: Props) {
  const [nome, setNome] = useState("");

  function entrar() {
    if (nome.trim()) {
      navigation.replace("Vitrine"); // Vai para a tela de plantas
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 32, backgroundColor: "#10141a" }}>
      <Text style={{ color: "#4ADE80", fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
        Bem-vindo ao PlantaE
      </Text>
      <Text style={{ color: "#fff", marginBottom: 8 }}>Informe seu nome para entrar:</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        style={{
          backgroundColor: "#23272f", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 16,
        }}
        placeholderTextColor="#a3a3a3"
      />
      <Button color="#4ADE80" title="Entrar" onPress={entrar} />
    </View>
  );
}
