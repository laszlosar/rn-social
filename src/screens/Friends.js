import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, List, Icon, Segment, Text } from 'native-base';
import colorPallet from '../components/ui/color';
import { connect } from 'react-redux';
import { FriendCard } from '../components';
import firebase from 'react-native-firebase';
import Icn from 'react-native-vector-icons/Ionicons';
import go from './main/goTo.js';

class Friends extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: []
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log("friends", {props});
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        rootNavigator = this.props.navigator
    }
    formatData = () => {
        return this.state.users.map(user => {
            user.key = user.uid;
            return user;
        });
    }

    goTo = destination => {
        go(this.props.rootNav, destination);
    }
    sendFriendMessage = key => {
        console.log('key')
    }
    viewFriendProfile = (key, name) => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.FriendProfile', // unique ID registered with Navigation.registerScreen
                title: name, // title of the screen as appears in the nav bar (optional)
                passProps: {friendUserId: key, name: name}, // simple serializable object that will pass as props to the modal (optional)
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
    appendUser = (data) => {
        responseData = data.val();
        if(!responseData.phone) return false;
        if(this.state.users.map(user => user.uid).includes(responseData.uid)) return false; 
        this.setState(prevState => ({ users: [...prevState.users, responseData] }));     
    }

    filterOutUsers = usersKeys => {
        this.setState(prevState => ({ 
            users: [...prevState.users].filter(user => usersKeys.includes(user.uid))
        }));
    }

    gotData = (data) => {
        responseData = data.val();
        let usersKeys = Object.keys(responseData).map(key =>key);
        this.setState({ users: []}, () => {
            usersKeys.forEach((userKey)=>{
                firebase.database().ref(`users/${userKey}`).once("value", this.appendUser, this.errData);
            });
        })
    }
    
    errData = (err) => {
        console.log(err);
    }
    componentDidMount(){
        if(this.props.user && this.props.user.user && this.props.user.user.uid){
            firebase.database().ref(`usersFriends`).child(this.props.user.user.uid).on('value', (snapshot) => {
                if (snapshot.exists()) {
                    this.gotData(snapshot);
                }
              });
        }
        if(this.props.subPage === "search"){
            this.findPlayers();
        }
    }
    chatWithFriend = props => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.UserChat', // unique ID registered with Navigation.registerScreen
                title: props.name, // title of the screen as appears in the nav bar (optional)
                passProps: props, // simple serializable object that will pass as props to the modal (optional)
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
    findPlayers = () => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.Find Friends', // unique ID registered with Navigation.registerScreen
                title: 'Find Rally Players', // title of the screen as appears in the nav bar (optional)
                passProps: {uid: this.props.user.user.uid}, // simple serializable object that will pass as props to the modal (optional)
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
    render(){
        // console.log(this.formatData())
        return(
            <View style={styles.container}>
            <Segment style={styles.segment}>
                <Button style={styles.selectedBtn} first>
                    <Text style={styles.selectedTxt}>Players</Text>
                </Button>
                <Button style={styles.btn} last  onPress={() => this.goTo('Rally.Groups')}>
                    <Text style={styles.txt}>Groups</Text>
                </Button>
            </Segment>
            <View style={styles.plusBtn}>
                <View>
                    <Button transparent onPress={this.findPlayers}>
                        <Icon type="FontAwesome" name='plus' style={styles.plsIcon}/>
                        <Text style={{color: colorPallet.main}}> Add Player </Text>
                    </Button>
                </View>
            </View>
                <List>
                    <FlatList 
                        style={styles.container}
                        data={this.formatData()}
                        renderItem={ (info) => <FriendCard {...info.item} actions={[{func: this.chatWithFriend, iconType:"Ionicons", icon:"md-chatboxes"}]} /> }
                    />
                </List>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    plsIcon:{
        position:'relative',
        left: 10,
        paddingRight:5,
        marginRight:5,
        color: colorPallet.main
    },
    plusBtn:{
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    segment:{
        marginTop:10,
        backgroundColor:'#fff'
    },
    selectedBtn:{
        borderColor: colorPallet.main,
        backgroundColor: colorPallet.main
    },
    selectedTxt:{
        fontSize: 19,
        color: 'white'
    },
    btn:{
        borderColor: colorPallet.main
    },
    txt:{
        fontSize: 19,
        color: colorPallet.main
    }
})
const mapStateToProps = state => {
    return {
        rootNav: state.navigator.rootNav,
        user: state.user,
    }
}
export default connect(mapStateToProps, null)(Friends);