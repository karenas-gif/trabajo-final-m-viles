import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import * as Battery from "expo-battery";

export default function BateriaScreen() {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    // Obtener nivel al iniciar
    Battery.getBatteryLevelAsync().then((value) => {
      const percent = Math.round(value * 100);
      setLevel(percent);

      if (percent <= 15) {
        Alert.alert("Batería baja", `Tu batería está en ${percent}%`);
      }
    });

    // Escuchar cambios en batería
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      const percent = Math.round(batteryLevel * 100);
      setLevel(percent);

      if (percent <= 15) {
        Alert.alert("Batería baja", `Tu batería está en ${percent}%`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Nivel de batería: {level !== null ? `${level}%` : "Cargando..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
