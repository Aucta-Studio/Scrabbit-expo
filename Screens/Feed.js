import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Post from "../Components/Post";

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
        </ScrollView>
    </SafeAreaView>
  )
}



function getPosts() {}

export default Feed