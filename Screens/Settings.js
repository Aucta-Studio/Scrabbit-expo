import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';

const Settings = () => {
    return (
      <View style={styles.container}>
        <Text>Settings Screen</Text>
        <Button
          title="Click Here"
          onPress={() => alert('Button Clicked!')}
        />
      </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    editButton: {
        fontSize: 15,
        color: "#fff",
        marginTop: 10,
        backgroundColor: "#333",
        borderRadius: 50,
        padding: 20,
        marginTop: 10,
        textAlign: "center",
      },
});