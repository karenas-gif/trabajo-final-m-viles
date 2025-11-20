import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
const LOCATION_TASK_NAME = 'BACKGROUND-LOCATION-TASK';

// Configuración de colores
const COLORS = {
  primary: '#8B0000', // Vino tinto oscuro
  secondary: '#A52A2A', // Vino tinto claro
  dark: '#1a1a1a', // Negro suave
  darker: '#0d0d0d', // Negro más oscuro
  light: '#f5f5f5',
  accent: '#C41E3A', // Rojo vino brillante
  gray: '#888',
};

// Configuración de la tarea en segundo plano
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Error en tarea de segundo plano:', error);
    return;
  }
  console.log('📩 Notificación recibida en segundo plano:', data);
});

// Tarea de geofencing
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error en geofencing:', error);
    return;
  }
  if (data) {
    const { eventType, region } = data;
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log('📍 Has entrado a:', region.identifier);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📍 ¡Has llegado!',
          body: `Acabas de entrar a: ${region.identifier}`,
          sound: 'default',
          data: { region: region.identifier },
        },
        trigger: null,
      });
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log('🚶 Has salido de:', region.identifier);
    }
  }
});

// Handler de notificaciones
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
  const [lastNotification, setLastNotification] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geofencingActive, setGeofencingActive] = useState(false);

  useEffect(() => {
    initializeNotifications();
    getCurrentLocation();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const initializeNotifications = async () => {
    await registerForPushNotificationsAsync();

    // Listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      setLastNotification({ title, body, time: new Date() });
      
      // Solo mostrar Alert si la app está en primer plano
      Alert.alert(
        title || '🔔 Notificación',
        body || 'Tienes un nuevo mensaje',
        [{ text: 'Entendido', style: 'default' }]
      );
    });

    // Listener para cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notificación tocada:', response);
      const { title, body } = response.notification.request.content;
      setLastNotification({ title, body, time: new Date() });
    });

    // Registrar tarea en segundo plano
    try {
      const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      if (!registered) {
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        console.log('✅ Tarea en segundo plano registrada');
      }
    } catch (error) {
      console.error('Error registrando tarea:', error);
    }
  };

  const enviarNotificacionInmediata = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Notificación Inmediata',
          body: 'Esta notificación aparece al instante dentro de la app',
          sound: 'default',
          data: { type: 'foreground' },
        },
        trigger: null, // Trigger null = inmediato
      });
      console.log('✅ Notificación inmediata enviada');
    } catch (error) {
      console.error('Error enviando notificación:', error);
      Alert.alert('Error', 'No se pudo enviar la notificación');
    }
  };

  const enviarNotificacionDemorada = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📩 Notificación Programada',
          body: 'Esta notificación aparece después de 5 segundos',
          sound: 'default',
          data: { type: 'background' },
        },
        trigger: { seconds: 5 }, // Se dispara después de 5 segundos
      });
      
      Alert.alert(
        '⏰ Notificación Programada',
        'La notificación aparecerá en 5 segundos. Puedes minimizar la app para verla en la barra del sistema.',
        [{ text: 'Entendido', style: 'default' }]
      );
      console.log('✅ Notificación programada para 5 segundos');
    } catch (error) {
      console.error('Error programando notificación:', error);
      Alert.alert('Error', 'No se pudo programar la notificación');
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log('📍 Ubicación actual:', location.coords);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  };

  const setupGeofencing = async () => {
    try {
      // Solicitar permisos de ubicación en segundo plano
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        Alert.alert(
          'Permiso Requerido',
          'Para recibir notificaciones por ubicación, necesitas permitir el acceso a la ubicación "Siempre" en la configuración de la app.'
        );
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Definir región de geofencing (ejemplo: 100 metros alrededor de tu ubicación actual)
      const region = {
        identifier: 'Mi Ubicación Importante',
        latitude: latitude,
        longitude: longitude,
        radius: 100, // metros
        notifyOnEnter: true,
        notifyOnExit: false,
      };

      // Iniciar geofencing
      await Location.startGeofencingAsync(LOCATION_TASK_NAME, [region]);
      setGeofencingActive(true);

      Alert.alert(
        '✅ Geofencing Activado',
        `Se te notificará cuando entres en un radio de 100m alrededor de:\nLat: ${latitude.toFixed(6)}\nLon: ${longitude.toFixed(6)}\n\nAléjate y vuelve a acercarte para probar.`,
        [{ text: 'Entendido' }]
      );

      console.log('✅ Geofencing configurado en:', region);
    } catch (error) {
      console.error('Error configurando geofencing:', error);
      Alert.alert('Error', 'No se pudo activar el geofencing: ' + error.message);
    }
  };

  const stopGeofencing = async () => {
    try {
      await Location.stopGeofencingAsync(LOCATION_TASK_NAME);
      setGeofencingActive(false);
      Alert.alert('🛑 Geofencing Desactivado', 'Ya no recibirás notificaciones por ubicación.');
      console.log('🛑 Geofencing detenido');
    } catch (error) {
      console.error('Error deteniendo geofencing:', error);
    }
  };

  const setupCustomLocationNotification = async () => {
    Alert.prompt(
      '📍 Configurar Ubicación Personalizada',
      'Ingresa las coordenadas (formato: latitud,longitud)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Configurar',
          onPress: async (coords) => {
            try {
              const [lat, lon] = coords.split(',').map(s => parseFloat(s.trim()));
              
              if (isNaN(lat) || isNaN(lon)) {
                Alert.alert('Error', 'Coordenadas inválidas');
                return;
              }

              // Solicitar permisos
              const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
              const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
              
              if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
                Alert.alert('Error', 'Necesitas permitir ubicación "Siempre"');
                return;
              }

              const region = {
                identifier: `Ubicación Custom (${lat}, ${lon})`,
                latitude: lat,
                longitude: lon,
                radius: 100,
                notifyOnEnter: true,
                notifyOnExit: false,
              };

              await Location.startGeofencingAsync(LOCATION_TASK_NAME, [region]);
              setGeofencingActive(true);

              Alert.alert(
                '✅ Ubicación Configurada',
                `Te notificaré cuando estés cerca de:\nLat: ${lat}\nLon: ${lon}`
              );
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
      'plain-text',
      currentLocation ? `${currentLocation.latitude},${currentLocation.longitude}` : ''
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Elegante */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appIcon}>🔔</Text>
          <View>
            <Text style={styles.appName}>NotiPlus Premium</Text>
            <Text style={styles.subtitle}>Sistema de Notificaciones Avanzado</Text>
          </View>
        </View>
      </View>

  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60, paddingTop: 25, paddingHorizontal: 20 }}>
      {/* Contenido Principal */}
      <View style={styles.body}>
        {/* Card de Información */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>💡 Cómo Funciona</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>🔴</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Inmediata:</Text> Aparece instantáneamente dentro de la app
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>🔴</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Programada:</Text> Aparece después de 5 segundos (minimiza la app para verla)
            </Text>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={enviarNotificacionInmediata}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>⚡</Text>
              <View>
                <Text style={styles.buttonTitle}>Notificación Inmediata</Text>
                <Text style={styles.buttonSubtitle}>Disparo instantáneo</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={enviarNotificacionDemorada}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>⏰</Text>
              <View>
                <Text style={styles.buttonTitle}>Notificación Programada</Text>
                <Text style={styles.buttonSubtitle}>Disparo en 5 segundos</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={geofencingActive ? stopGeofencing : setupGeofencing}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>📍</Text>
              <View>
                <Text style={styles.buttonTitle}>
                  {geofencingActive ? 'Desactivar Geofencing' : 'Activar Geofencing'}
                </Text>
                <Text style={styles.buttonSubtitle}>
                  {geofencingActive ? 'Notificaciones activas' : 'Notificar por ubicación'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          
        </View>

        {/* Ubicación Actual */}
        {currentLocation && (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>📌 Tu Ubicación Actual</Text>
            <Text style={styles.locationText}>
              Lat: {currentLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lon: {currentLocation.longitude.toFixed(6)}
            </Text>
            {geofencingActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>🟢 Geofencing Activo</Text>
              </View>
            )}
          </View>
        )}

        {/* Última Notificación */}
        {lastNotification && (
          <View style={styles.lastNotificationCard}>
            <Text style={styles.lastNotificationTitle}>📬 Última Notificación</Text>
            <View style={styles.notificationDetails}>
              <Text style={styles.notificationText}>
                <Text style={styles.notificationLabel}>Título:</Text> {lastNotification.title}
              </Text>
              <Text style={styles.notificationText}>
                <Text style={styles.notificationLabel}>Mensaje:</Text> {lastNotification.body}
              </Text>
              <Text style={styles.notificationTime}>
                🕒 {formatTime(lastNotification.time)}
              </Text>
            </View>
          </View>
        )}
      </View>

      </ScrollView>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  appIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    color: COLORS.light,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#ffcccc',
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  infoCard: {
    backgroundColor: COLORS.darker,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  infoBullet: {
    fontSize: 8,
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 25,
  },
  button: {
    borderRadius: 16,
    padding: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  locationButton: {
    backgroundColor: '#2E7D32', // Verde oscuro
  },
  customLocationButton: {
    backgroundColor: '#D84315', // Naranja oscuro
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  buttonIcon: {
    fontSize: 32,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.light,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: '#ffcccc',
    marginTop: 2,
  },
  lastNotificationCard: {
    backgroundColor: COLORS.darker,
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    elevation: 3,
  },
  lastNotificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.light,
    marginBottom: 12,
  },
  notificationDetails: {
    gap: 8,
  },
  notificationText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  notificationLabel: {
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.darker,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '500',
  },
  locationTitle: {
  fontSize: 18,
  color: COLORS.light,
  marginBottom: 10,
  fontWeight: 'bold',
},
locationText: {
  fontSize: 16,
  color: COLORS.light,   // ← AHORA BLANCO
  marginBottom: 6,
},
});

async function registerForPushNotificationsAsync() {
  // Configurar canal de notificaciones para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C41E3A',
      enableLights: true,
    });
  }

  // Verificar si es un dispositivo físico
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        '⚠️ Permisos Requeridos',
        'No se otorgaron permisos para notificaciones. La app necesita este permiso para funcionar correctamente.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    console.log('✅ Permisos de notificación otorgados');
  } else {
    Alert.alert(
      'ℹ️ Dispositivo Requerido',
      'Las notificaciones solo funcionan en un dispositivo físico, no en simuladores.',
      [{ text: 'Entendido', style: 'default' }]
    );
  }
}