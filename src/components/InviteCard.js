import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ListItem, Left, Body, Right, Text, Thumbnail, Icon} from 'native-base';
import { connect } from 'react-redux';
import avatar from '../assets/avatardefault.png'; 
import Icn from 'react-native-vector-icons/Ionicons';
import { formatDateTime } from '../util';
const InviteCard = (props) => {
  const {details, creator} = props.item;
  // const confirmedCount = Object.keys(props.item.confirmedPlayers).length;
  const confirmedCount = props.item.confirmedPlayers ? Object.keys(props.item.confirmedPlayers).length : 0;
  const dateTime = formatDateTime(details.chosenDate);
  viewFriendProfile = () => {
    Promise.all([
        Icn.getImageSource('ios-arrow-down-outline',30), 
    ]).then( source => {
        props.rootNav.showModal({
            screen: 'Rally.FriendProfile', 
            title: creator.name,
            passProps: {friendUserId: creator.uid, name: creator.name, referer: "Rally.Invitations"},
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
  viewMessages = () => {
    // console.log(props)
    Promise.all([
        Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
    ]).then( source => {
        props.rootNav.showModal({
            screen: 'Rally.GameChat', // unique ID registered with Navigation.registerScreen
            title: 'Game Messages', // title of the screen as appears in the nav bar (optional)
            passProps: {gid: props.item.gid}, // simple serializable object that will pass as props to the modal (optional)
            // navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
            navigatorButtons:{
                leftButtons: [
                    {
                        icon: source[0],
                        title: 'Menu',
                        id: 'closeModal'
                    }
                ]
            },
            animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
    });
  }
  // viewMessages = () =>{
  //   console.log("hello message");
  // }
  return (
      <ListItem style={styles.listStyle} avatar>
          <Left>
            <TouchableOpacity onPress={viewFriendProfile}>
              <Thumbnail style={styles.avatar} source={creator.profileURI && creator.profileURI !== "processing" ? {uri: creator.profileURI} : avatar} />
            </TouchableOpacity>  
          </Left>
          <Body>
            <TouchableOpacity onPress={props.onInviteSelected}>
              <Text >{dateTime}</Text>
              <Text note>
                  {details.location}
                  {confirmedCount}
                  {
                    details.noLimit
                    ? "/ Unltd "
                    : "/" + details.groupSize 
                  }
              </Text>
            </TouchableOpacity>
          </Body>
          <Right>
            {/* {
              details.noLimit
              ?<Text style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}> {confirmedCount} / Unltd </Text>
              :<Text style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}> {confirmedCount} / {details.groupSize} </Text>
            } */}
             <TouchableOpacity onPress={ this.viewMessages}>
                <Icon type="FontAwesome" name={"comment"} style={(Platform.OS === 'ios' ? styles.icon : styles.andIcon)}/>
              </TouchableOpacity> 
          </Right>
      </ListItem>
  )
};

const styles = StyleSheet.create({
  listStyle:{
    padding:10
  },
  icon:{
    paddingTop:9,
    paddingBottom:8,
  },
  andIcon:{
    paddingTop:9,
    paddingBottom:9,
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
  }
}
export default connect(mapStateToProps, null)(InviteCard);