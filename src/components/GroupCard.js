import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ListItem, Left, Body, Right, Text, Thumbnail,  Icon } from 'native-base';

import avatar from '../assets/gold.jpg';
import pickleImg from '../assets/pickleball.png';
const GroupCard = (props) => {
  const {name, description} = props;
  return (
    <ListItem style={styles.listStyle} avatar>
        <TouchableOpacity onPress={props.viewGroupProfile}>
          {/* <Left>
            <Thumbnail style={styles.avatar} source={avatar} />
          </Left> */}
        </TouchableOpacity>
        <Body>
          {/* <TouchableOpacity onPress={props.viewGroupProfile}> */}
              <Text>{name}</Text>
              <Text note>{description}</Text>
          {/* </TouchableOpacity> */}
        </Body>
        <TouchableOpacity onPress={props.viewGroupProfile}>
          <Right>
            <Icon type="FontAwesome" name="users" style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}/>
          </Right>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.viewGroupChat}>
          <Right>
            <Icon type="FontAwesome" name="comment" style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}/>
          </Right>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={props.startGroupGame}>
          <Right>
            <Image source={pickleImg} style={{width: 30, height: 30, position: 'relative', right: 4}}/>
          </Right>
        </TouchableOpacity> */}
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


export default GroupCard;