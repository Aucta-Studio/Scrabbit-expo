import { StyleSheet, Text, View, ScrollView, Image, Button, Pressable, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { db, myFireBase } from '../fireBaseConfig';
import { getStorage, ref } from 'firebase/storage';
import Firemage from '../Components/Firemage';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { Modal } from 'react-native-modal';

export default function ViewReportAccounts({ navigation }) {
    const [scrapbooks, setScrapbooks] = useState(null);
    const nav = useNavigation();
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const model = () => {
        return (
            <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>
          <Button title="Hide modal" onPress={handleModal} />
        </View>
      </Modal>
        )
    }

    async function getReportedScrapbooks() {
        const snapshot = collection(db, "Reports");
        const q = query(snapshot, where("Type", "==", "Scrapbook"));
        const temp = await getDocs(q);
        const scrap = [];
        temp.forEach((doc) => {
            // const pics = [];
            // doc.data().photos.forEach(async (pic) => {
            //     const storage = getStorage(myFireBase);
            //     const downurl = await getDownloadURL(ref(storage, pic))
            //     pics.push(downurl);
            //     // console.log("PIC: ",pics)
            //     // const [value, loading, error] = useDownloadURL(ref(storage, pic));
            //     // pics.push(value);
            // })
            //console.log("PIC2: ",pics)
            scrap.push({
                Title: doc.data().Title,
                ReporterUser: doc.data().User,
                Reason: doc.data().Reason,
                Type: doc.data().Type,
                flagged_enabled: doc.data().flagged_enabled,
                Caption: doc.data().Caption,
                docID: doc.data().docID,
                photos: doc.data().photos
            });
        })
        setScrapbooks(scrap)
        // console.log(scrap)
    }
    useEffect(() => {
        getReportedScrapbooks();
        console.log("Scrap: ", scrapbooks)
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
                        <View key={item.docID}>
                            <Pressable style={{ backgroundColor:'#B46060',borderRadius: 8, padding: 10, alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}>
                                <View style={{ backgroundColor: "#B46060" }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color:"#FFF4E0" }}>{item.Title}</Text>
                                    <Text style={styles.shown}>Caption : {item.Caption}</Text>
                                    <Text style={styles.shown}>Scrapbook Reported For : {item.Reason}</Text>
                                    <TouchableOpacity style={styles.pressable}>
                                    <Text style={styles.text}>View</Text>
                                    </TouchableOpacity>

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
        color: "#FFF4E0",
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
        borderColor: "#FFF4E0",
        borderRadius: 4,
        borderWidth: 0.8,
        marginVertical: 10,
        color: "#FFF4E0",
        textAlign: "center",
        padding: 5,
        fontSize: 18,
        fontWeight: "bold"
    },
})