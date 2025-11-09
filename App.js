import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Error en tarea de segundo plano:', error);
    return;
  }
  console.log(' Notificación recibida en segundo plano:', data);
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      Alert.alert(title || 'Notificación', body || 'Tienes un nuevo mensaje ');
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(' Notificación tocada:', response);
    });

    (async () => {
      const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      if (!registered) {
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        console.log('Tarea en segundo plano registrada');
      }
    })();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

 
  const enviarNotificacionPrimerPlano = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Notificación en primer plano',
        body: 'Esta notificación aparece dentro de la app ',
        sound: 'default', 
      },
      trigger: null,
    });
  };

  const enviarNotificacionSegundoPlano = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📩 Notificación en segundo plano',
        body: 'Esta aparecerá fuera de la app',
        sound: 'default',
      },
      trigger: { seconds: 3 },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.appName}>📱 NotiPlus</Text>
        <Text style={styles.subtitle}>Centro de notificaciones inteligentes</Text>
      </View>

      {/* Cuerpo */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>🔔 Sistema de Notificaciones</Text>
        <Text style={styles.sectionText}>
          • Primer plano → aparece y suena dentro de la app {"\n"}
          • Segundo plano → aparece en la barra del sistema
        </Text>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: '#4CAF50' }]}
            onPress={enviarNotificacionPrimerPlano}
          >
            <Text style={styles.buttonText}>📲 Notificación en primer plano</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: '#007AFF' }]}
            onPress={enviarNotificacionSegundoPlano}
          >
            <Text style={styles.buttonText}>📤 Notificación en segundo plano</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>🏠 Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>🔔 Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>⚙️ Configuración</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
  },
  header: {
    backgroundColor: '#1E88E5',
    paddingVertical: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
  },
  appName: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
  customButton: {
    width: '85%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});


async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', // 🔊 Activa sonido
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert(' No se otorgaron permisos para notificaciones.');
      return;
    }
  } else {
    alert(' Las notificaciones solo funcionan en un dispositivo físico.');
  }
}
