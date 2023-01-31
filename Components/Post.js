import React, { Component } from 'react'
import { Text, View, Image, useState } from 'react-native'
import { auth, db } from '../fireBaseConfig'
import {
  firestore,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';

const Post = () => {
  
  const postdb = collection(db, "Posts");
  const postInfo = [
    {
      user: postdb.get(),
      pfp: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
      image: "https://th.bing.com/th/id/OIP.eKF2blXCrUp4s_xCE6ncgwHaD3?pid=ImgDet&rs=1",
      caption: "good day at le louvre",
      isLiked : false
    }
  ]

  return(
    <View>
      {
        postInfo.map((data, index) => {
          const [like, setLike] = useState(data.isLiked)

          return(
            <View key = {index} style = {{paddingBottom: 10, borderBottomColor: 'gray', borderBottomWidth: 0.1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={data.pfp} style={{width: 40, height: 40, borderRadius: 100}}/>
                  <View style={{paddingLeft: 5}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {data.user}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={data.image} style={{width: '100%', height: 400}}/>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

export default Post