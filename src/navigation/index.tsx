import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Vitrine from "../screens/Vitrine";
import Relogio from "../screens/Relogio";
import PlantaDetalhe from "../screens/PlantaDetalhe";

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Vitrine" component={Vitrine} />
        <Stack.Screen name="Relogio" component={Relogio} />
        <Stack.Screen name="PlantaDetalhe" component={PlantaDetalhe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
