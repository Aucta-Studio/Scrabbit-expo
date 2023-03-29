import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { async } from '@firebase/util';
import { auth, db, myFireBase } from '../fireBaseConfig';
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

export default async function RAccount(props, {navigation}) {
    console.log(props.route.params)
    const Bio = props.route.params.Bio
    const Email = props.route.params.Email
    const Reason = props.route.params.Reason
    const ReporterUser = props.route.params.ReporterUser
    const flagged_enabled = props.route.params.flagged_enabled
    const Pfp = props.route.params.Pfp
    const FirstName = props.route.params.FirstName
    const LastName = props.route.params.LastName

    const unreport = async() => {
        const postRef = doc(db, "Profiles", Email);
        updateDoc(postRef, {
            report_flag: "N"
        })

        // Remove doc
        const reportRef = doc(db, "Reports");
        const q = query(reportRef, where("Type", "==", Type), where("Email", "==", Email));
        const temp = await getDoc(q)
        deleteDoc(temp)
    }

    const flag = async() => {
        const postRef = doc(db, "Profiles", Email);
        updateDoc(postRef, {
            flagged_enabled: "Y"
        })

        addDoc(collection(db, "Flags"), {
          Bio: Bio,
          Email: Email,
          FirstName: FirstName,
          LastName: LastName,
          Pfp: Pfp,
          Reason: Reason,
          ReporterUser: ReporterUser,
        }).then((function () {
            console.log("Flag posted!")
        })).catch((error) => {
            console.error("Error posting flag: ", error);
            //showMessage("Error!", "There was an error posting the picture. Please try again!")
        });
    }

    return (
        <View style={styles.wrap}>
            <ScrollView>
                <View>
                  <TouchableOpacity onPress={navigation.navigate("ViewReportComment")}>
                    <Icon name="back" color={"white"} size={25}></Icon>
                  </TouchableOpacity>
                  <Text style={{ padding: 20, fontWeight: "bold", fontSize: 25 }}>{FirstName} {LastName}</Text>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} />
                <Text>Report made by: {ReporterUser}</Text>
                <Text>Reason: </Text>
                <Text>{Reason}</Text>
                <Text>Bio: </Text>
                <Text>{Bio}</Text>
                <Text>Email: </Text>
                <Text>{Email}</Text>
                <TouchableOpacity style={styles.pressable} onPress={flag}>
                    <Text> style={styles.flag}Flag</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pressable} onPress={unreport}>
                    <Text style={styles.text}>UnReport</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
  )
}

const styles = StyleSheet.create({
    wrap: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        //alignSelf: 'center'
      },
      wrapDot: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignSelf: 'center'
      },
      dotActive: {
        margin: 3,
        color: '#000'
      },
      dot: {
        margin: 3,
        color: '#FFF'
      },
      pressable: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: 80
    },
    text: {
        borderColor: "gray",
        borderRadius: 4,
        borderWidth: 0.8,
        marginVertical: 10,
        color: "#088F8F",
        textAlign: "center",
        padding: 5,
        fontSize: 18,
        fontWeight: "bold"
    },
    flag: {
      borderColor: "white",
      borderRadius: 4,
      borderWidth: 0.8,
      marginVertical: 10,
      color: "white",
      textAlign: "center",
      padding: 5,
      fontSize: 18,
      fontWeight: "bold",
      backgroundColor: "red"
  },
})