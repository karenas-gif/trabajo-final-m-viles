import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function HomeScreeen() {
  const estudiantes = [
    { nombre: 'Angel David Escobar Ibañez', codigo: '133138' },
    { nombre: 'Paula Alejandra Rico Delgado', codigo: '124476' },
    { nombre: 'Karen Astrid Ojeda Cely', codigo: '134765' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardWrap}>
        <View style={styles.headerTop}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.university}>Universidad ECCI</Text>
            <Text style={styles.projectTitle}>Parcial 3 — App Móviles</Text>
            <Text style={styles.projectSub}>Presentación de proyecto</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Integrantes</Text>

          <View style={styles.list}>
            {estudiantes.map((e, i) => (
              <View key={i} style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(e.nombre.match(/\b\w/g)||[]).slice(0,2).join('').toUpperCase()}</Text>
                </View>

                <View style={styles.rowText}>
                  <Text style={styles.name}>{e.nombre}</Text>
                  <Text style={styles.code}>Código: <Text style={styles.codeValue}>{e.codigo}</Text></Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Curso:</Text>
            <Text style={styles.metaValue}>Aplicaciones Móviles</Text>
            
          </View>
        </View>

        
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#8B0000', // vino oscuro
  secondary: '#A52A2A',
  accent: '#C41E3A',
  dark: '#1a1a1a',
  darker: '#0d0d0d',
  light: '#f5f5f5',
  gray: '#9a9a9a',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardWrap: {
    width: '100%',
    maxWidth: 820,
    backgroundColor: COLORS.dark,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(196,30,58,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoBox: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  logoEmoji: { fontSize: 36 },
  titleBox: {
    flex: 1,
  },
  university: {
    color: COLORS.light,
    fontWeight: '700',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 6,
  },
  projectTitle: {
    color: COLORS.light,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  projectSub: {
    color: COLORS.gray,
    marginTop: 6,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(196,30,58,0.08)',
    marginVertical: 18,
    borderRadius: 2,
  },
  infoSection: {
    paddingVertical: 8,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  list: {
    backgroundColor: '#0f0f0f',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,30,58,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.light,
    fontWeight: '800',
    fontSize: 16,
  },
  rowText: {
    flex: 1,
  },
  name: {
    color: COLORS.light,
    fontWeight: '700',
    fontSize: 14,
  },
  code: {
    color: COLORS.gray,
    marginTop: 4,
    fontSize: 12,
  },
  codeValue: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaLabel: {
    color: COLORS.gray,
    fontSize: 12,
    marginRight: 6,
  },
  metaValue: {
    color: COLORS.light,
    fontSize: 12,
    marginRight: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  smallButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  smallButtonText: {
    color: COLORS.light,
    fontWeight: '700',
    fontSize: 13,
  },
});
