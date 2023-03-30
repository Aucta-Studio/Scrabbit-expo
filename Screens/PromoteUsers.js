import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { db, myFireBase } from '../fireBaseConfig';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import Firemage from '../Components/Firemage';
import { useDownloadURL } from 'react-firebase-hooks/storage';

export default function PromoteUsers({ navigation }) {
    const [users, setUsers] = useState(null);
    const nav = useNavigation();
    const navtoUser = (item) => {
        nav.navigate("UserMod", item)
    }

    async function getUsers() {
        const snapshot = collection(db, "Profiles");
        const q = query(snapshot, where("flagged_enabled", "==", "N"));
        const temp = await getDocs(q);
        const user = [];
        temp.forEach((doc) => {
            user.push({
                Bio: doc.data().Bio,
                Email: doc.data().Email,
                FirstName: doc.data().FirstName,
                LastName: doc.data().LastName,
                report_flag: doc.data().report_flag,
                flagged_enabled: doc.data().flagged_enabled,
                Pfp: doc.data().Pfp,
                UserName: doc.data().UserName
            });
        })
        setUsers(user)
        console.log(user)
    }
    useEffect(() => {
        getUsers();
        console.log("Scrap: ", users)
    });
    return (
        <View style={{ backgroundColor: "#000" }}>
            {/* <SafeAreaView> */}
                <ScrollView
                    showsVerticalScrollIndicator
                // style={styles.wrap}
                >
                    <View>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>View All Users</Text>
                    </View>
                    <Pressable style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 14 }}>
                        {users?.map((item, index) =>
                            <View>
                                <Text>{item.UserName}</Text>
                                <Text>{item.Bio}</Text>
                                <Pressable onPress={navigation.navigate("UserMod", item)}>
                                    <Text>View</Text>
                                </Pressable>
                            </View>
                        )}
                    </Pressable>
                </ScrollView>
            {/* </SafeAreaView> */}
        </View>
    )
}

const styles = StyleSheet.create({
})