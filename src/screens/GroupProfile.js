import React, { Component } from 'react';
import { View, StyleSheet, FlatList, } from 'react-native';
import { List, Text } from 'native-base';

import { SearchFriends, FriendCard } from '../components';
import firebase from 'react-native-firebase';
import Icn from 'react-native-vector-icons/Ionicons';


export default class GroupProfile extends Component {
    constructor(props){
        super(props);
        this.state ={
           name: "",
           name: "",
           players: {}
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'closeModal'){
            this.props.navigator.dismissModal({ animationType: 'slide-down' });
        }
    }
    
    formatPlayersData = () => {
        return Object.keys(this.state.players).map(key => {
            const obj = this.state.players[key];
            obj.key = key;
            return obj;
        });
    }

    messageUser = ({uid}) => {
       console.log("message", uid)
    }

    getData = () => {
        firebase.database().ref(`groups/${this.props.gid}`).once("value", this.gotData, this.errData);
    }

    gotData = (data) => {
        responseData = data.val();
        this.setState({ ...responseData });
    }

    errData = (err) => {
        console.log(err);
    }

    appendUser = (data) => {
        responseData = data.val();
        firebase.database().ref(`groups/${this.props.gid}/players/${responseData.uid}`)
        .set({...responseData}, this.getData())
        .catch(err => console.log('oh no', err));
    }

    addUser = ({uid}) => {
        firebase.database().ref(`users/${uid}`).once("value", this.appendUser, this.errData);
    }

    componentDidMount(){
        this.getData();
    }
    render(){
        actions = [{func: this.addUser, icon:'plus-circle'}];
        action = [{func: this.messageUser, icon:'comment'}]
        return(
            <View style={styles.container}>
                <Text style={styles.txt}>{this.state.description} </Text>
                <View>
                    <List>
                        <FlatList 
                            style={styles.playersListContainer}
                            data={this.formatPlayersData()}
                            renderItem={ (info) => <FriendCard actions={action} {...info.item}/> }
                            />
                    </List>
                </View> 
                <SearchFriends key={Object.keys(this.state.players).toString()} exclude={Object.keys(this.state.players)} actions={actions}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        width: '100%',
        display:'flex',
        flex:1,
        // alignItems: 'center',
        // justifyContent: 'space-evenly'
   },
    playersListContainer: {
        width: '100%',
   },
   txt:{
       textAlign:"center"
   }
})