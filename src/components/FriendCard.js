import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Right, Text, Thumbnail, Icon } from 'native-base';
import avatar from '../assets/avatardefault.png'; 
import Icn from 'react-native-vector-icons/Ionicons';

const FriendCard = (props) => {
  // Card MetaData
  const { removePlayerFromList, note } = props;
  const actions = props.actions ? props.actions : [];
  // FriendData
  const { profileURI, name, location, phone, email, rating, ratingType, uid } = props;
  const friend =  { profileURI, name, location, phone, email, rating, ratingType, uid };
  viewFriendProfile = () => {
      Promise.all([
          Icn.getImageSource('ios-arrow-down-outline',30), 
      ]).then( source => {
          props.rootNav.showModal({
              screen: 'Rally.FriendProfile', 
              title: name,
              passProps: {friendUserId: uid, name: name},
              navigatorButtons:{
                  leftButtons: [
                      {
                          icon: source[0],
                          title: 'Menu',
                          id: 'closeModal'
                      }
                  ]
              },
              animationType: 'slide-up' 
          });
      });
  }
  return (
    <ListItem className="friendCard" userId={uid} style={styles.listStyle} avatar>
          <Left>
            <TouchableOpacity onPress={viewFriendProfile}>
            {/* <Thumbnail style={styles.avatar} source={profileURI && profileURI !== "processing" ? {uri:profileURI} : avatar} /> */}
              { profileURI && profileURI !== "processing" 
                ? <Thumbnail style={styles.avatar} source={{uri:profileURI}} /> 
                : <View style={{
                    backgroundColor:"#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}), 
                    width: 40,
                    height: 40,
                    borderRadius: 20}}>
                      <Text style={{color:'white', textAlign:'center', fontSize:25, fontWeight:'900', position:'relative', top: Platform.OS ==='Android'? 3 : 5 }}>
                        {name.charAt(0)}
                      </Text>
                   </View>
              }
              
            </TouchableOpacity>
          </Left>
          <Body style={{borderBottomWidth: 0}}>
            <TouchableOpacity onPress={viewFriendProfile}>
              <Text>{name} {note?note:null}</Text>
              <Text note>{location ? location.replace(/^(.{11}).+/, "$1…") : "Location Unspecificied"} - {rating} {ratingType}</Text>
            </TouchableOpacity>
          </Body>
          <Right style={{borderBottomWidth: 0}}>
            {actions.map(action => (
              <TouchableOpacity 
                  key={`${uid}_friendCard_${action.icon}`} 
                  onPress={
                    () =>{ 
                      action.func(friend) 
                      // NOTE this is poorly designed. We need a method handlerto tie with the action obj
                      removePlayerFromList ? removePlayerFromList(uid) : null;
                    }
                  }
                >
                  <Icon type={action.iconType? action.iconType:"FontAwesome"} name={action.icon} style={ styles.icon}/>
              </TouchableOpacity> 
            ))}
          </Right>
    </ListItem>
  )
};

const styles = StyleSheet.create({
  listStyle:{
    width:'95%',
    paddingBottom:10,
    paddingTop:10,
    height:70,
    borderBottomWidth: 0
  },
  icon:{
    height:70,
    paddingTop:10,
    paddingBottom:10,
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 20
  }
})

const mapStateToProps = state => {
  return {
      rootNav: state.navigator.rootNav,
      user: state.user,
  }
}
export default connect(mapStateToProps, null)(FriendCard);