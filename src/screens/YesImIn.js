import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { H, BigButton, SecondButton, color, TextArea } from '../components/ui'
import firebase from 'react-native-firebase';
export default class Invite extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log(props);
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
        .set({gameKey: gid, status:'confirmed'}, () => console.log('saved game'))
        .catch(err => console.log('oh no', err));

        firebase.database().ref(`games/${gid}/confirmedPlayers/${puid}`).set(this.props.user)
        
        firebase.database().ref(`games/${gid}/invitePlayers/${puid}`).remove();

    }
    render(){
        return(
            <View style={styles.container}>
                <Icon name="md-checkmark-circle" size={80} color={color.success} />
                <H> YES, I'M IN </H>
                <Text> Want to add a comment to the group? </Text>
                <TextArea> </TextArea>
                <BigButton onPress={this.submit}> Confirm </BigButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    }
})