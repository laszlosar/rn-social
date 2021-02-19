import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail } from 'native-base';




const Message = (props) => {
  console.log(props);
  // const {thumbnailPath, hasThumbnail, message} = props.item; 
  const { message, name, sentByMe, profileURI, bubbleColor} = props; 
  // let thumbnail;
  // if(hasThumbnail){
  //   thumbnail = (<Thumbnail style={styles.avatar} source={thumbnailPath} />)
  // }
  return (
    <ListItem style={styles.listStyle}>
    { sentByMe
      ? null
      : <Left style={{flex:.2}}>
          { profileURI && profileURI !== "processing" 
                ? <Thumbnail style={styles.avatar} source={{uri:profileURI}} /> 
                : <View style={{
                    backgroundColor: bubbleColor,
                    width: 40,
                    height: 40,
                    borderRadius: 20}}>
                      <Text style={{color:'white', textAlign:'center', fontSize:25, fontWeight:'900', position:'relative', top: Platform.OS ==='Android'? 3 : 5 }}>
                        {name.charAt(0)}
                      </Text>
                   </View>
              }
        </Left>
    }
        <Body>
              <Text style={{textAlign: sentByMe ? 'right': 'left'}} >{message}</Text>
        </Body>
    </ListItem>
  )
};


const styles = StyleSheet.create({
  listStyle:{
    padding:10,
    borderBottomWidth: 0
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 20
  }
})


export default Message;