import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function ViewFlaggedScrapbooks(props, {navigation}) {
    const [scrapbooks, setScrapbooks] = useState(null);
    const nav = useNavigation();
    const navtoFScrap = (item) => {
        navigation.navigate("FScrapbook", item)
    }

    const getFlaggedScrapbooks = async() => {
        const snapshot = collection(db,"Flagged");
        const q = query(snapshot, where("Type", "==", "Scrapbook"));
        const temp = await getDocs(q);
        const reportedScrapbook = [];
        temp.forEach((doc) => {
                // console.log("Scrapbook: ",doc.data())
                reportedScrapbook.push({
                    Title : doc.data().User,
                    ReporterUser: doc.data().UserName,
                    docID: doc.data().docID,
                    Reason: doc.data().Reason,
                    Type: doc.data().Type,
                    Caption: doc.data().Caption,
                    photos: doc.data().photos
                });
        })
        setScrapbooks(reportedScrapbook)
    }
    useEffect(() => {
        getFlaggedScrapbooks;
      }, []);

    return (
        <View style={{ backgroundColor: "#000", width: Dimensions.get("window").width, height: Dimensions.get("window").height }}>
                <ScrollView
                    showsVerticalScrollIndicator
                // style={styles.wrap}
                >
                    <View>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 25 }}>View Flagged Scrapbooks</Text>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} />
                    {/* <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}> */}
                    {scrapbooks?.map((item, index) =>
                        <View key={item.docID}>
                            <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, alignItems: 'flex-start', justifyContent: 'space-between', margin: 14 }}>
                                <View style={{ backgroundColor: "#F8F8F8" }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.Title}</Text>
                                    <Text style={styles.shown}>Caption : {item.Caption}</Text>
                                    <Text style={styles.shown}>Scrapbook Flagged For : {item.Reason}</Text>
                                    <Pressable style={styles.pressable}>
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