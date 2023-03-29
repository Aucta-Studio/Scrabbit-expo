import { StyleSheet, Text, View, ScrollView, Image, Pressable, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { db, myFireBase } from '../fireBaseConfig';
import { getStorage, ref } from 'firebase/storage';
import Firemage from '../Components/Firemage';
import { useDownloadURL } from 'react-firebase-hooks/storage';

export default function ViewReportComment({navigation}) {
    const [comment, setComment] = useState(null);
    const nav = useNavigation();
    const navtoRCom = (item) => {
        nav.navigate("RComment", item)
    }

    async function getReportedComments() {
        const snapshot = collection(db,"Reports");
        const q = query(snapshot, where("Type", "==", "Comment"));
        const temp = await getDocs(q);
        const com = [];
        temp.forEach((doc) => {
                com.push({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt,
                    Reason: doc.data().Reason,
                    text: doc.data().text,
                    ReporterUser: doc.data().user,
                    flagged_enabled: doc.data().flagged_enabled
                });
        })
        setComment(com)
        // console.log(com)
    }
    useEffect(() => {
        getReportedComments();
        // console.log("Com: ", comment)
      });
    return (
        <View style={{ backgroundColor: "#000", width: Dimensions.get("window").width, height: Dimensions.get("window").height }}>
                <ScrollView
                    showsVerticalScrollIndicator
                // style={styles.wrap}
                >
                    <View>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 25 }}>View Reported Comments</Text>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} />
                    {/* <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}> */}
                    {comment?.map((item, index) =>
                        <View key={item._id}>
                            <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}>
                                <View style={{ backgroundColor: "#F8F8F8" }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>"{item.text}"</Text>
                                    <Text style={styles.shown}>{item.createdAt}</Text>
                                    <Pressable onPress={navtoRCom(item)} style={styles.pressable}>
                                        <Text style={styles.text}>View</Text>
                                    </Pressable>
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
})