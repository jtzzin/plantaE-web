// src/navigation/index.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Vitrine from "../screens/Vitrine";
// Importe outras telas (Cadastro, Detalhe, Relogio...)

export type RootStackParamList = {
  Login: undefined;
  Vitrine: undefined;
  // Adicione outras rotas conforme a aplicação
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Vitrine" component={Vitrine} />
        {/* ...outras telas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
