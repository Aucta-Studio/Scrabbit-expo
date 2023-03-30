import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const About = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => alert('Button Clicked!')}>
        <Text style={styles.editButton}>Aucta Studio</Text>
        </TouchableOpacity>
        <Text color={"#AAA"}>About the app</Text>
        <Text>Scrabbit is an augmented reality scrapbooking platform that allows users to upload and share their scrapbooks with each other, creating a unique and interactive experience for everyone. Scrabbit includes a range of tools and resources to help users create and share their scrapbooks. Users can edit and draw on their scrapbooks, and can easily upload their own photos and mementos to personalize their scrapbook. Once their scrapbook is complete, users can share it with friends and family via the app, allowing them to experience their memories together in a way that is truly unique.
Aucta Studio's commitment to quality and customer satisfaction is evident in the design and functionality of Scrabbit. The platform is user-friendly and intuitive, making it easy for users of all skill levels to create and share their own augmented reality scrapbooks. Overall, Scrabbit is an exciting and innovative platform that brings a whole new level of interactivity and immersion to the world of scrapbooking.</Text>

      </View>
    );
};

export default About;

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