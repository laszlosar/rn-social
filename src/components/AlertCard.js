import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ListItem, Left, Right, Body, Icon, Text, Button} from 'native-base';
import { connect } from 'react-redux';
import Icn from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

function formatHours(timeStamp){
  const dt = new Date(Date(timeStamp));
  const arr = dt.toLocaleTimeString().split(" ");
  const hoursMinutes = arr[0].split(":");

  return `${dt.toLocaleDateString()} ${hoursMinutes[0]}:${hoursMinutes[1]} ${arr[1]}`;

}

const AlertCard = (props) => {
  console.log(props);
  // const { profileURI, name } = props; 
  let { message } = props.data; 
  switch(props.type){
    case"New User Message":

    break;
    case"New Friend":
      message = props.friendData.name ? props.friendData.name + " added you as a friend" : message;
    break;
    case"New Game":
    
    break;
    case"New Game Message":
      
    break;
  }
  handleNotification = () => {
    props.data.time = formatHours(props.timeKey);
    switch(props.type){
      case"New User Message":
        Promise.all([
          Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            props.rootNav.showModal({
                screen: 'Rally.UserChat', // unique ID registered with Navigation.registerScreen
                title: props.name ? props.name : "chat", // title of the screen as appears in the nav bar (optional)
                passProps: props.data, // simple serializable object that will pass as props to the modal (optional)
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
      break;
      case"New Friend":
        message = props.friendData.name ? props.friendData.name + "added you as a friend" : message;
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), 
        ]).then( source => {
            props.rootNav.showModal({
                screen: 'Rally.FriendProfile', 
                title: props.friendData.name ? props.friendData.name : props.friendData.email,
                passProps: {friendUserId: props.friendId},
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
      break;
      case"New Game":
      firebase.database().ref(`games/${props.gameId}`).once('value').then((d) => {
        console.log(props);
        console.log(d.val());
          // props.rootNav.push({
          //     screen:'Rally.PendingDetails',
          //     title: "Game Details", 
          //     passProps:  d.val()
          // })
        });
        // Promise.all([
        //   Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        // ]).then( source => {
        //     props.rootNav.showModal({
        //         screen: 'Rally.GameChat', // unique ID registered with Navigation.registerScreen
        //         title: 'Game Messages', // title of the screen as appears in the nav bar (optional)
        //         passProps: {gid: props.gameId}, // simple serializable object that will pass as props to the modal (optional)
        //         // navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
        //         navigatorButtons:{
        //             leftButtons: [
        //                 {
        //                     icon: source[0],
        //                     title: 'Menu',
        //                     id: 'closeModal'
        //                 }
        //             ]
        //         },
        //         animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        //     });
        // });
      break;
      case"New Game Message":
        Promise.all([
          Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            props.rootNav.showModal({
                screen: 'Rally.GameChat', // unique ID registered with Navigation.registerScreen
                title: 'Game Messages', // title of the screen as appears in the nav bar (optional)
                passProps: {gid: props.gameId}, // simple serializable object that will pass as props to the modal (optional)
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
      break;
    }
  }

  return (
    <ListItem style={styles.listStyle}>
        <Body>
            <Text note style={{textAlign:'center'}}>{formatHours(props.timeKey)}</Text>
            <Text style={{textAlign:'center'}}>{message}</Text>
        </Body>
        <Right>
          <Button transparent onPress={this.handleNotification}>
            <Icon name='arrow-forward' />
          </Button>
        </Right>
    </ListItem>
  )
};


const styles = StyleSheet.create({
  listStyle:{
    padding:10,
    borderBottomWidth: 0
  }
})


const mapStateToProps = state => {
  return {
      // user: state.user,
      rootNav: state.navigator.rootNav,
  }
}

export default connect(mapStateToProps, null)(AlertCard);
// export default AlertCard;