import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Pns = () => {
    return (
      <View style={styles.container}>
        <Text>Privacy And Security Settings</Text>
      </View>
    );
};

export default Pns;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:"#ffF"
  },
});