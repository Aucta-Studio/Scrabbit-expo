import { StyleSheet, Text, View, ScrollView, Image, Button, Pressable, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { db, myFireBase } from '../fireBaseConfig';
import { getStorage, ref } from 'firebase/storage';
import Dialog from "react-native-dialog";
import Firemage from '../Components/Firemage';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import Modal from 'react-native-modal';
import { Alert } from 'react-native';

export default function ViewReportScrapbooks({ navigation }) {
    const [scrapbooks, setScrapbooks] = useState(null);

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const unreport = async (item) => {
        const postRef = doc(db, "Posts", item.docID);
        updateDoc(postRef, {
            report_flag: "N"
        })

        // Remove doc
        const reportRef = collection(db, "Reports", item.id);
        const q = query(reportRef, where("Type", "==", item.Type));
        const temp = await getDoc(q)
        deleteDoc(temp)
    }

    const flag = async (item) => {
        const postRef = doc(db, "Posts", item.docID);
        updateDoc(postRef, {
            flagged_enabled: "Y"
        })

        addDoc(collection(db, "Flags"), {
            Title: item.Title,
            ReporterUser: item.ReporterUser,
            Reason: item.Reason,
            Type: "Scrapbook",
            Caption: item.Caption,
            docID: item.docID,
            photos: item.photos
        }).then((function () {
            console.log("Flag posted!")
        })).catch((error) => {
            console.error("Error posting flag: ", error);
            //showMessage("Error!", "There was an error posting the picture. Please try again!")
        });
    }

    const handleUnReport = async (item) => {
        handleModal;
        unreport(item);
        console.log("Unreported!");
        // Alert.alert("Scrapbook unreported!");
    }

    const handleFlag = async (item) => {
        handleModal;
        flag(item);
        console.log("Flagged!");
        // Alert.alert("Scrapbook flagged!");
    }

    async function getReportedScrapbooks() {
        const snapshot = collection(db, "Reports");
        const q = query(snapshot, where("Type", "==", "Scrapbook"));
        const temp = await getDocs(q);
        const scrap = [];
        temp.forEach((doc) => {
            scrap.push({
                Title: doc.data().Title,
                ReporterUser: doc.data().ReporterUser,
                Reason: doc.data().Reason,
                Type: doc.data().Type,
                flagged_enabled: doc.data().flagged_enabled,
                Caption: doc.data().Caption,
                docID: doc.data().docID,
                photos: doc.data().photos,
                ID: doc.id
            });
        })
        setScrapbooks(scrap)
        // console.log(scrap)
    }
    useEffect(() => {
        getReportedScrapbooks();
        // console.log("Scrap: ", scrapbooks)
    });
    return (
        <View >
            <ScrollView
                showsVerticalScrollIndicator
            // style={styles.wrap}
            >
                {/* <View>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 25 }}>View Reported Scrapbooks</Text>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} /> */}
                {/* <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}> */}
                {scrapbooks?.map((item, index) =>
                    <View key={item.ID}>
                        <Pressable style={{ backgroundColor: 'black', borderRadius: 8, padding: 10, alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}>
                            <View style={{ backgroundColor: "black" }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: "white" }}>{item.Title}</Text>
                                <Text style={styles.shown}>Caption : {item.Caption}</Text>
                                <Text style={styles.shown}>Scrapbook Reported For : {item.Reason}</Text>
                                <Text style={styles.shown}>Reported By: {item.ReporterUser}</Text>
                                {/* Commented modal */}
                                {/* <TouchableOpacity style={styles.pressable} onPress={handleModal}>
                                    <Text style={styles.text}>View</Text>
                                </TouchableOpacity>
                                <Modal isVisible={isModalVisible}>
                                    <View style={{ flex: 1, padding: 10, marginTop: 20 }}>
                                        <Text>Title: {item.Title}</Text>
                                        <Text>Reported By: {item.ReporterUser}</Text>
                                        <Text>Reason: {item.Reason}</Text>
                                        <Text>Type: {item.Type}</Text>
                                        <Text>Caption: {item.Caption}</Text>
                                        <Text>Document ID: {item.docID}</Text>
                                        <Button title='UnReport' onPress={handleUnReport(item)}/>
                                        <Text> </Text>
                                        <Button title='Flag' onPress={handleFlag(item)}/>
                                        <Text> </Text>
                                        <Button title="Cancel" onPress={handleModal} />
                                    </View>
                                </Modal> */}
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* </Pressable> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    shown: {
        color: "white",
        fontSize: 18,
        //width: 5,
        marginBottom: 6,
        fontWeight: '500'
    },
    pressable: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: 80
    },
    text: {
        borderColor: "white",
        borderRadius: 4,
        borderWidth: 0.8,
        marginVertical: 10,
        color: "white",
        textAlign: "center",
        padding: 5,
        fontSize: 18,
        fontWeight: "bold"
    },
})