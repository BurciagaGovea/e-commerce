import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Charge = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>bread</Text>
      
      <View style={styles.linesContainer}>
        <View style={[styles.line, styles.inactiveLine]} />
        <View style={[styles.line, styles.activeLine]} />
        <View style={[styles.line, styles.inactiveLine]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    position: 'absolute',
    bottom: 100, // Ajusta esta posición según necesites
    fontSize: 24,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 2,
  },
  linesContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  activeLine: {
    backgroundColor: '#FF7F50', // Color melón fuerte
  },
  inactiveLine: {
    backgroundColor: '#FFDAB9', // Color melón suave
  },
});

export default Charge;