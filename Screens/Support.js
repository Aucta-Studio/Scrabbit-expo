import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Support = () => {
    return (
        <View style={styles.container}>
        <Text>Contact Us</Text>
            <TouchableOpacity onPress={() => alert('auctastudio@gmail.com')}>
        <Text style={styles.editButton}>Email</Text>
        </TouchableOpacity>
      </View>
    );
};

export default Support;

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