import React, { useState, useEffect } from "react";
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { myFireBase } from "../fireBaseConfig";
import { useSelector, useDispatch } from "react-redux";
import Firemage from "../Components/Firemage";
import Notifications from "./Notifications";
import Login from "./Login";
import { RollInLeft } from "react-native-reanimated";

export function DrawerContent(props) {

    const paperTheme = useTheme();
    const paperNotifications = "on"
    const [followerCount, setfollowerCount] = useState(0);
    const [followingCount, setfollowingCount] = useState(0);
    const account = useSelector((state) => state.account);
    const db = getFirestore(myFireBase);
    const auth = getAuth(myFireBase);
    const relations = collection(db, "Relations");
    const q1 = query(relations, where("Follower", "==", auth.currentUser.uid));
    const q2 = query(relations, where("Followed", "==", auth.currentUser.uid));
    const getCounts = async () => {
        const temp1 = await getDocs(q1);
        const temp2 = await getDocs(q2);
        var count = 0;
        temp1.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          count++;
        });
        // console.log(count);
        setfollowingCount(count);
        count = 0;
        temp2.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          count++;
        });
        // console.log(count);
        setfollowerCount(count);
      };
    
      useEffect(() => {
        getCounts();
      }, []);
    


    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Firemage
                                path={account.pfp}
                                style={styles.pfp}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{account.firstname} {account.lastname}</Title>
                                <Caption style={styles.ftext}>@{account.username}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.fnum, styles.ftext]}>{followerCount}</Paragraph>
                                <Caption style={styles.ftext}>Followers</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.fnum, styles.ftext]}>{followingCount}</Paragraph>
                                <Caption style={styles.ftext}>Following</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="ios-lock-open-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Privacy & Security"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="person-circle-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="md-notifications-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Notifications"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="settings-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="md-information-circle-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="About"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="md-help-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="FAQ"
                            onPress={() => {}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="md-alert-circle-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {}}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Quick Settings">
                        <TouchableRipple onPress={() => {}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>                          
                        </TouchableRipple>
                        <TouchableRipple onPress={() => {}}>
                            <View style={styles.preference}>
                                    <Text>Notifications</Text>
                                    <View pointerEvents="none">
                                        <Switch value={paperNotifications.on}/>
                                    </View>
                                </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="ios-log-out-outline" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    ftext: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    fnum: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 0,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 0
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    pfp: {
        width: 50,
        height: 50,
        borderRadius: 50,
      },
  });