import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { planFirst } from "../services/scheduler";
import { upsert, PlantInstance } from "../storage/db";
import { uid } from "../util/uid";
import { PlatformDateTimePicker } from "../components/PlatformDateTimePicker";

export default function Relogio({ route, navigation }: any) {
  const { plantId } = route.params;
  const [date, setDate] = useState(new Date());

  const handleConfirm = async () => {
    try {
      const instance: PlantInstance = {
        instanceId: uid(),
        plantId,
        active: true,
        history: [],
      };
      await planFirst(instance, date);
      instance.history.push({ at: date.getTime(), type: "manual" });
      await upsert(instance);
      // Agora abre a tela de histórico da planta após cadastrar
      navigation.replace("PlantaDetalhe", { instanceId: instance.instanceId });
    } catch (e) {
      alert("Falha ao cadastrar. Veja logs e tente novamente.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#10141a" }}>
      <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 16, color: "#fff" }}>
        Quando a primeira rega foi realizada?
      </Text>
      <PlatformDateTimePicker
        value={date}
        onChange={(_e, newDate) => !!newDate && setDate(newDate)}
        mode="datetime"
      />
      <View style={{ height: 12 }} />
      <Button title="Cadastrar" onPress={handleConfirm} color="#4ADE80" />
    </View>
  );
}
