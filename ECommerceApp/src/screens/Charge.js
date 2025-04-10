import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

const Charge = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../media/charge.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>bread</Text>
        <Text style={styles.description}>
          Our flexible custom options let you personalize every aspect of your desserts to make it truly unique.
        </Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  textContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: '600',
    color: '#D19793',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F6DAD5',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#EB6F4E',
    width: 20,
  },
});

export default Charge;
