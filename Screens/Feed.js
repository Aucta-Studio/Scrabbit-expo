import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Post from "../Components/Post";

// The post retrieval from database is in progress. 
// For now, posts are hardcoded to show how the feed will look like.
// Like & Comment 
const Feed = () => {
  return (
    <SafeAreaView className="bg-zinc-900 h-full p-4">
        <ScrollView>
          {/* <Text className="text-white">This is the feed page</Text> */}
            <Post
              user="4aas_h"
              pfp="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"
              image="https://th.bing.com/th/id/OIP.eKF2blXCrUp4s_xCE6ncgwHaD3?pid=ImgDet&rs=1"
              caption="good day at le louvre"
            />
            <Post
              user="jdm324xd"
              pfp="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"
              image="https://firebasestorage.googleapis.com/v0/b/scrabbit-app-test-1.appspot.com/o/posts%2F7He64dcM47bc6Pn4PyZmLowIOyk2%2F0.3ufycyx9ne4.jpeg?alt=media&token=5a7a8239-abb5-4c3a-9dec-47973cda4d15"
              caption="Good Night! <3"
            />
        </ScrollView>
    </SafeAreaView>
  )
}



function getPosts() {}

export default Feed