import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import storage from "../util/storage"; // importa o util para salvar o nome

// Tela de login elegante e centralizada
export default function Login({ navigation }) {
  const [nome, setNome] = useState("");
  const [touched, setTouched] = useState(false);

  // Ao entrar, salva o nome do usuário no storage global/local
  async function entrar() {
    setTouched(true);
    if (nome.trim()) {
      await storage.setItem("nomeUsuario", nome.trim()); // salva o nome do login
      navigation.replace("Vitrine");
    }
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#10141a",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <View style={{
        width: '95%',
        maxWidth: 370,
        padding: 32,
        backgroundColor: "#181b24",
        borderRadius: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.13,
        shadowRadius: 13,
        elevation: 7,
        alignItems: "center",
      }}>
        {/* Logo e título principal */}
        <Text style={{
          color: "#4ADE80",
          fontSize: 25,
          fontWeight: "700",
          marginBottom: 4,
          letterSpacing: 0.2
        }}>
          PlantaE
        </Text>
        <Text style={{
          color: "#fff", fontSize: 15,
          marginBottom: 18,
          opacity: 0.8,
          textAlign: "center"
        }}>
          Gerencie suas plantas de maneira prática!
        </Text>
        {/* Input para o nome */}
        <TextInput
          value={nome}
          onChangeText={t => { setNome(t); if (!touched) setTouched(true); }}
          placeholder="Seu nome"
          style={{
            backgroundColor: "#23272f",
            color: "#fff",
            paddingHorizontal: 18,
            paddingVertical: 11,
            fontSize: 16,
            borderRadius: 10,
            borderWidth: touched && !nome.trim() ? 2 : 0,
            borderColor: touched && !nome.trim() ? "#E3342F" : "#4ADE80",
            marginBottom: 7,
            width: "100%"
          }}
          placeholderTextColor="#a3a3a3"
          returnKeyType="done"
        />
        {/* Mensagem de erro clara e discreta */}
        {touched && !nome.trim() && (
          <Text style={{
            color: "#E3342F",
            fontSize: 13,
            marginBottom: 7,
            textAlign: "left",
            width: "100%"
          }}>
            Por favor, digite o nome!
          </Text>
        )}

        {/* Botão Entrar estilizado */}
        <TouchableOpacity
          disabled={!nome.trim()}
          onPress={entrar}
          activeOpacity={nome.trim() ? 0.8 : 1}
          style={{
            marginTop: 8,
            width: "100%",
            backgroundColor: nome.trim() ? "#4ADE80" : "#353b45",
            paddingVertical: 13,
            borderRadius: 13,
            alignItems: "center"
          }}
        >
          <Text style={{
            color: nome.trim() ? "#181b24" : "#8b929e",
            fontWeight: "bold",
            fontSize: 17,
            letterSpacing: 0.4
          }}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
