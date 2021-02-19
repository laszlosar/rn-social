import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { H, BigButton, SecondButton, color, TextArea } from '../components/ui'
import firebase from 'react-native-firebase';
export default class Invite extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        rootNavigator = this.props.navigator
    }
    submit = () => {
        const gid = this.props.gid;
        const puid = this.props.puid;

        firebase.database().ref(`usersGames/${puid}/${gid}`)
        .set({gameKey: gid, status:'rejected'}, () => console.log('saved game'))
        .catch(err => console.log('oh no', err));

        firebase.database().ref(`games/${gid}/confirmedPlayers/${puid}`).remove();
        
        firebase.database().ref(`games/${gid}/invitePlayers/${puid}`).set(this.props.user)

    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapperTop}>
                    <Icon name="md-sad" size={80} color={color.error} />
                    <H> NO, I'M OUT </H>
                </View>
                <View style={styles.wrapperBottom}>
                    <Text> Want to add a comment to the group? </Text>
                    <TextArea> </TextArea>
                    <BigButton onPress={this.submit}> Confirm </BigButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    wrapperTop:{
        flex: .5,
    },
    wrapperBottom:{
        flex: .5,
        justifyContent: 'flex-end'
    },
})