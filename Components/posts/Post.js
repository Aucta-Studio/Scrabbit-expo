import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from "react-redux";

const Post = (props) => {
  const { post, toggleLike, toggleFollow, onItemClicked, isFollowHidden } = props;
  const account = useSelector(state => state.account);

  const onHeartClicked = () => {
    toggleLike(post);
  };

  const onFollowClicked = () => {
    toggleFollow(post);
  };

  const clickItem = () => {
    onItemClicked(post);
  };

  // const renderPostContent = () => {
    //if (post.postCategory === 1) {
      // return (
      //   <View style={styles.listItemBody}>
      //     <Image style={styles.listItemImage} source={{ uri: post.content }} />
      //   </View>
      // );
    //}
    // if (post.postCategory === 2) {
    //   if (Platform.OS === 'ios') {
    //     return (
    //       <View style={styles.listItemBody}>
    //         <Video
    //           style={styles.videoElement}
    //           shouldPlay
    //           muted={true}
    //           source={{ uri: post.content }}
    //           allowsExternalPlayback={false} />
    //       </View>
    //     );
    //   } else {
    //     return (
    //       <View style={styles.listItemBody}>
    //         <VideoPlayer
    //           autoplay
    //           repeat
    //           showOnStart={false}
    //           style={styles.videoElement}
    //           source={{ uri: post.content }}
    //         />
    //         <TouchableOpacity style={styles.videoOverlay} onPress={clickItem} />
    //       </View>
    //     );
    //   }
    // }
    // return <></>;
  // }

  return (
    <TouchableOpacity style={styles.listItem} onPress={clickItem}>
      <View style={styles.listItemHeader}>
        <View style={styles.listItemAuthorAvatarContainer}>
          <Image style={styles.listItemAuthorAvatar} source={{ uri: account.avatar }} />
        </View>
        <Text style={styles.listItemAuthorName}>{account.firstname}{account.lastname}</Text>
        {/* {!isFollowHidden && <>
          <View style={styles.listItemDot}></View>
          <TouchableOpacity onPress={onFollowClicked}>
            <Text style={styles.listItemFollow}>{post.hasFollowed ? 'Followed' : 'Follow'}</Text>
          </TouchableOpacity>
        </>} */}
      </View>
      {/* {renderPostContent()} */}
      <View style={styles.listItemFooter}>
        <TouchableOpacity onPress={onHeartClicked}>
          {/* <Image style={[styles.listItemFooterImage, styles.gap]} source={post.hasLiked? Platform.select('../assets/heart-active.png') : Platform.select('../assets/heart.png')} /> */}
        </TouchableOpacity>
        <Image style={[styles.listItemFooterImage, styles.gap2]} source={Platform.select('../assets/comment.png')} />
        <Image style={styles.listItemFooterImage} source={Platform.select('../assets/share.png')} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {},
  listItemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8
  },
  listItemAuthorAvatarContainer: {
    alignItems: 'center',
    borderRadius: 48 / 2,
    borderWidth: 2,
    borderColor: 'red',
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  listItemAuthorAvatar: {
    borderRadius: 42 / 2,
    height: 38,
    width: 38,
  },
  listItemAuthorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12
  },
  listItemDot: {
    backgroundColor: '#000',
    borderRadius: 4 / 2,
    height: 4,
    marginRight: 12,
    marginTop: 2,
    width: 4,
  },
  listItemFollow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6'
  },
  listItemBody: {
    flex: 1,
    minHeight: 320
  },
  listItemImage: {
    aspectRatio: 1,
    flex: 1,
  },
  videoElement: {
    flex: 1
  },
  videoOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
  listItemFooter: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row'
  },
  listItemFooterImage: {
    width: 28,
    height: 28
  },
  gap: {
    marginRight: 12
  },
  gap2: {
    marginRight: 8
  }
});

export default Post;