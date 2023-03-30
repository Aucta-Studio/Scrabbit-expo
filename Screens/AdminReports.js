import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { async } from '@firebase/util';
import { db } from '../fireBaseConfig';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function AdminReports(props, { navigation }) {
    const [scrapn, setScrapn] = useState(0);
    const [scraprn, setScraprn] = useState(0);
    const [scrapfn, setScrapfn] = useState(0);
    const [usern, setusern] = useState(0);
    const [modn, setmodn] = useState(0);
    const scrapbooks = [];
    const nav = useNavigation();

    useEffect(() => {
        getUsersn();
        getModn();
        getScrapnos();
        getReportedScrapNos();
        getFlaggedScrapNos();
    }, [])

    async function getUsersn() {
        const snapshot = collection(db, "Profiles");
        const q = query(snapshot);
        const temp = await getDocs(q);
        for (let i = 1; i <= temp.size; i++){
            setusern(i);
        }
    }

    async function getModn() {
        const snapshot = collection(db, "Moderators");
        const q = query(snapshot);
        const temp = await getDocs(q);
        for (let i = 1; i <= temp.size; i++){
            setmodn(i);
        }
    }

    async function getScrapnos() {
        const snapshot = collection(db, "Posts");
        const q = query(snapshot);
        const temp = await getDocs(q);
        for (let i = 1; i <= temp.size; i++){
            setScrapn(i);
        }
    }

    async function getReportedScrapNos() {
        const snapshot = collection(db, "Posts");
        const q = query(snapshot, where("report_flag", "==", "Y"));
        const temp = await getDocs(q);
        for (let i = 1; i <= temp.size; i++){
            setScraprn(i);
        }
    }

    async function getFlaggedScrapNos() {
        const snapshot = collection(db, "Posts");
        const q = query(snapshot, where("flagged_enabled", "==", "Y"));
        const temp = await getDocs(q);
        for (let i = 1; i <= temp.size; i++){
            setScrapfn(i);
        }
    }

    const pieData = [
        {
            name: 'Total',
            population: scrapn,
            color: 'rgb(0, 0, 255)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Reported',
            population: scraprn,
            color: '#52c310',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Flagged',
            population: scrapfn,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
    ]

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5
        };

    return (
        <View>
        <View style={{flexDirection:'row'}}>
            <View style={{backgroundColor: "#ec6319", borderRadius: 8, padding: 10, alignItems: 'flex-start', width: 150 , justifyContent: 'space-between', margin: 14}}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color:'white', alignSelf:'center'}}>Total Users</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20, color:'white', alignSelf:'center'}}>{usern}</Text>
            </View>
            <View style={{backgroundColor: "#ec6319", borderRadius: 8, padding: 10, alignItems: 'flex-start', width: 180 , justifyContent: 'space-between', margin: 14}}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color:'white', alignSelf:'center'}}>Total Moderators</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20, color:'white', alignSelf:'center'}}>{modn}</Text>
            </View>
            </View>
            <View style={{alignSelf: 'center'}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Scrapbook Details</Text>
            <PieChart
      data={pieData}
      width={Dimensions.get("window").width*0.90}
      height={220}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
    </View>
    </View>
    )
}

const styles = StyleSheet.create({
})