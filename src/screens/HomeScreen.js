import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.greeting}>Hola, Estudiante</Text>
        <Text style={styles.title}>Segundo Parcial</Text>
        <Text style={styles.subtitle}>Gestiona tu información académica</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.featureGrid}>
          <View style={styles.featureBox}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureTitle}>React Native</Text>
            <Text style={styles.featureDesc}>Desarrollo móvil</Text>
          </View>

          <View style={styles.featureBox}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureTitle}>Expo</Text>
            <Text style={styles.featureDesc}>Framework híbrido</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Examen Parcial 2 Corte</Text>
          <Text style={styles.infoText}>
            Sistema de navegación implementado con React Navigation. 
            Desarrollado como parte de la evaluación del curso.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.mainButtonText}>Ver Perfil Completo</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Documentación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topSection: {
    backgroundColor: '#10b981',
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#d1fae5',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1fae5',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  mainButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});