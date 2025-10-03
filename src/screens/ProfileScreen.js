import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  
  const nombreEstudiante = "Angel David Escobar Ibañez";
  const carrera = "Tecnología en Desarollo Informatico";
  const universidad = "Universidad ECCI";
  const codigo = "133138";
  const habilidades = ["JavaScript", "React Native", "Node.js", "SQL", "Git", "API REST"];
  const semestre = "5° Semestre";



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>💻</Text>
          </View>
          <Text style={styles.name}>{nombreEstudiante}</Text>
          <Text style={styles.careerText}>{carrera}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Estudiante Activo</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Académicos</Text>
          
          <View style={styles.dataCard}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Institución</Text>
              <Text style={styles.dataValue}>{universidad}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Código Estudiante</Text>
              <Text style={styles.dataValue}>{codigo}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nivel Actual</Text>
              <Text style={styles.dataValue}>{semestre}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
            <View style={styles.skillsContainer}>
                {habilidades.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                </View>
                ))}
            </View>
            </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Logros Recientes</Text>
          
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Mejor Proyecto 2024</Text>
              <Text style={styles.achievementDesc}>App de gestión académica</Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Excelencia Académica</Text>
              <Text style={styles.achievementDesc}>Promedio superior a 4.5</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '500',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  careerText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#065f46',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 16,
  },
  dataCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dataLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  skillText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '500',
  },
  achievementsSection: {
    marginBottom: 28,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 13,
    color: '#94a3b8',
  },
  homeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});