import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Input, BigButton, SecondButton, color } from './ui';
import { ListItem, Left, Body, Right, Text, Thumbnail, List, Icon, Title, Segment, Content } from 'native-base';
import avatar from '../assets/tenor.png'
{/* <Thumbnail source={{ uri: 'Image URL' }} /> */}
const FriendCard = (props) => {
  const {thumbnailPath, phoneNumbers,  givenName, familyName ,hasThumbnail} = props.item; 
  let thumbnail;
  if(hasThumbnail){
    thumbnail = (<Thumbnail style={styles.avatar} source={thumbnailPath} />)
  }
  return (
    <ListItem style={styles.listStyle} avatar>
          <Left>
            <TouchableOpacity onPress={props.sendTextInvite}>
              {thumbnail}
            </TouchableOpacity>
          </Left>
        <Body>
            <TouchableOpacity onPress={props.sendTextInvite}>
              <Text>{familyName} {givenName}</Text>
              <Text note>{phoneNumbers[0].number}</Text>
            </TouchableOpacity>
        </Body>
        <TouchableOpacity onPress={props.sendTextInvite}>
          <Right>
            <Icon type="FontAwesome" name="envelope" style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}/>
          </Right>
        </TouchableOpacity>
    </ListItem>
  )
};


const styles = StyleSheet.create({
  listStyle:{
    padding:10
  },
  icon:{
    paddingTop:7,
    paddingBottom:7,
  },
  andIcon:{
    paddingTop:10,
    paddingBottom:10,
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 20
  }
})


export default FriendCard;