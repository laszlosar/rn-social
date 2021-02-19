import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux';
import { List, Icon, Toast, Root } from 'native-base';
import { FriendCard } from '../components';
import { H, BigButton } from '../components/ui';
import go from './main/goTo.js';
import Icn from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

class Invite extends Component {
    constructor(props){
        super(props);
        this.state ={
            inviteType:"",
            preConfirmed: [this.props.user.user],
            inviteList: []
         }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
    }
      
    formatListData = listKey => {
        return this.state[listKey].map(user => {
            const obj = user;
            obj.key = obj.uid;
            return obj;
        });
    }
    viewPlayersList = (title, actions, counter = false) => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.Search Friends', 
                title: title, 
                passProps: {
                    showCounter : counter,
                    count: this.state.inviteList.length,
                    actions,
                    exclude:[...this.state.preConfirmed.map(x => x.uid), ...this.state.inviteList.map(x => x.uid)]
                }, 
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
    addUser = list => user => {
        this.setState({[list]: [...this.state[list], user] })
    }

    removeUser = ({uid}) => {
        const preConfirmed = this.state.preConfirmed.filter(user => user.uid != uid);
        const inviteList = this.state.inviteList.filter(user => user.uid != uid);
        this.setState({preConfirmed, inviteList});
        console.log("remove", uid);
    }
    toObject = (arr, isInvitees) => {
        var obj = {};
        for (var i = 0; i < arr.length; ++i){
          obj[arr[i].uid] = arr[i];
          obj[arr[i].uid].order = i;
          const date = new Date();
          
          if(this.props.gameDetails.hoursToRespond && isInvitees){
            date.setHours(date.getHours()+ (this.props.gameDetails.hoursToRespond * i));
          }

          obj[arr[i].uid].sendTextAt = date;
        }
        return obj;
    }
    setTextQueue = (obj, gameKey, messageKey, creator, details) => {
        Object.keys(obj).forEach(k => {
            firebase.database().ref(`textQueue/${Date.parse(obj[k].sendTextAt)}`).push({...obj[k], gameKey, messageKey, creator, details});
        })
    }
    sendInvites = () => {

        if( this.state.preConfirmed.length + this.state.inviteList.length < 2 ) {
                Toast.show({
                    text: "not enough players to invite",
                    buttonText: "Okay",
                    duration: 3000
                })
            console.log("sorry not enough players");
            return false;
        }

        const gameRef = firebase.database().ref(`game`).push();
        const gameKey = gameRef.key;
        const invitees = this.toObject(this.state.inviteList, true);
        const preConfirmedPlayers = this.toObject(this.state.preConfirmed, false);
        firebase.database().ref(`games/${gameKey}`)
        .set({gid: gameKey, details:this.props.gameDetails, creator: this.props.user.user, confirmedPlayers: preConfirmedPlayers, invitePlayers: invitees}, () => console.log('saved game'))
        .catch(err => console.log('oh no', err));

        [...this.state.inviteList, ...this.state.preConfirmed].forEach(player => {
            firebase.database().ref(`usersGames/${player.uid}/${gameKey}`)
            .set({gameKey:gameKey}, () => console.log('saved game'))
            .catch(err => console.log('oh no', err));
        })
        
        // TODO add time for the game in the text;
        // TODO add creator 
        this.setTextQueue(invitees, gameKey, 'invite', this.props.user.user, this.props.gameDetails);
        this.setTextQueue(preConfirmedPlayers, gameKey, 'confirmed', this.props.user.user, this.props.gameDetails);
        go(this.props.rootNav, 'Rally.Invitations');
    }
    
    componentDidMount(){
        console.log(this.props);
    }
    render(){
        removeActions = [
            {func: this.removeUser, icon:'times'}
        ]
        addPreConfAction = [
            {func: this.addUser('preConfirmed'), icon:'check'},
        ]
        addInviteAction = [
            {func: this.addUser('inviteList'), icon:'plus'}
        ]
       
          
        return(
            <Root>
                <View style={styles.container}>
                    <View style={styles.lists}>
                        <View style={styles.row}>
                            <H style={styles.txt}> Pre-Confirmed </H>
                            <View style={styles.icon}>
                                <Icon 
                                    type="FontAwesome" 
                                    name="plus-circle" 
                                    onPress={() => this.viewPlayersList("Add PreConfirmed Players", addPreConfAction)}
                                    />  
                            </View>
                        </View>
                        <View>
                            <List>
                                <FlatList 
                                    style={styles.list}
                                    data={this.formatListData('preConfirmed')}
                                    renderItem={ (info) => <FriendCard actions={info.item.uid != this.props.user.user.uid ? removeActions : null} {...info.item}/> }
                                    />
                            </List>
                        </View>
                        <View style={styles.row}> 
                            <H style={styles.txt}> Invite List </H>
                            <View style={styles.icon}>
                                <Icon 
                                    type="FontAwesome" 
                                    name="plus-circle" 
                                    onPress={() => this.viewPlayersList("Send Invites", addInviteAction, true)}
                                />
                            </View>
                        </View>
                        <View>
                            <List>
                                <FlatList 
                                    style={styles.playersListContainer}
                                    data={this.formatListData('inviteList')}
                                    renderItem={ (info) => <FriendCard actions={removeActions} {...info.item}/> }
                                    />
                            </List>
                        </View> 
                    </View>
                    <View style={styles.button}>
                        <BigButton  onPress={this.sendInvites}> Send Invites </BigButton>
                    </View>
                
                </View>
            </Root>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        width: '100%',
        flex:1,
        display:'flex',
        justifyContent: 'space-between'
    },
    row:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    lists:{
        flex:1,
    },
    list:{
        width: '100%',
    },
    txt:{
        textAlign: 'center',
    },
    button:{
        height:70,
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
    },
    icon:{
        paddingLeft:20,
    },
   
})


const mapStateToProps = state => {
    return {
        rootNav: state.navigator.rootNav,
        user: state.user,
    }
}

  export default connect(mapStateToProps, null)(Invite);