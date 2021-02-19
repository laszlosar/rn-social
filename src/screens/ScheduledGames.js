import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {List, Button, Segment, Text } from 'native-base';
import { InviteCard } from '../components';
import colorPallet from '../components/ui/color';
import go from './main/goTo.js';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

class ScheduledGames extends Component {
    constructor(props){
        super(props);
        this.state = {
            games:[]
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        rootNavigator = this.props.navigator
    }

    formatData = () => {
        return this.state.games.map(obj => {
            obj.key = obj.gid;
            return obj;
        });
    }

    goTo = destination => {
        go(this.props.rootNav, destination);
    }

    onInviteSelected = (gid, gameDetails, confirmedPlayers, creator, inviteList) => {
        this.props.navigator.push({
            screen:'Rally.PendingDetails',
            title: "Join The Game", 
            passProps: {
                gid,
                gameDetails,
                confirmedPlayers,
                inviteList,
                creator

            }
        });
    }
    gotData = (gameData) => {
        gamesKeys = Object.keys(gameData.val());
        gamesKeys.forEach(key => {
            firebase.database().ref(`games/${key}`)
            .once('value', d => {
                const data = d.val();
                console.log(data);
                if((data.details.groupSize <= Object.keys(data.confirmedPlayers).length) || (data.details.noLimit &&  Object.keys(data.confirmedPlayers).length > 1)){
                    this.setState({games: [...this.state.games, data ]})
                }
            }, this.errData); 
        })
    }
        
    errData = (err) => {
        console.log(err);
    }

    componentDidMount(){
        firebase.database().ref(`usersGames/${this.props.user.user.uid}`)
        .once('value', this.gotData, this.errData); 
    }
    render(){
        return(
            <View style={styles.container}>
                <Segment style={styles.segment}>
                    <Button style={styles.btn} first  onPress={() => this.goTo('Rally.Invitations')}>
                        <Text style={styles.txt}>Invitations</Text>
                    </Button>
                    <Button style={styles.selectedBtn} last >
                        <Text style={styles.selectedTxt}>Scheduled</Text>
                    </Button>
                </Segment>
                <List>
                    <FlatList 
                        style={styles.container}
                        data={this.formatData()}
                        renderItem={ (info) => <InviteCard {...info} onInviteSelected={()=>this.onInviteSelected(info.item.gid, info.item.details, info.item.confirmedPlayers, info.item.creator, info.item.invitePlayers)}/> }
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

export default connect(mapStateToProps, null)(ScheduledGames);