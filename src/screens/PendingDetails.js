import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Icon} from 'native-base';
import { H, BigButton, SecondButton, color } from '../components/ui';
import { formatDateTime, colorPallet } from '../util';
import { connect } from 'react-redux';

class PendingDetails extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        // console.log(props);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        rootNavigator = this.props.navigator
    }
    
    imOut = () => {
        this.props.navigator.push({
            screen:'Rally.No Im Out',
            title: "I'M OUT", 
            passProps: {
                gid : this.props.gid,
                puid: this.props.user.user.uid,
                user: this.props.user.user
            }
        });
    }
    imIn = () => {
        this.props.navigator.push({
            screen:'Rally.Yes Im In',
            title: "I'M IN", 
            passProps: {
                gid : this.props.gid,
                puid: this.props.user.user.uid,
                user: this.props.user.user
            }
        });
    }
    componentDidMount(){
        console.log(this.props);
    }
    render(){
        return(
            <View style={styles.container}>
                <Text> Invited By: {this.props.creator.name} </Text>
                <Text> Date: {formatDateTime(this.props.gameDetails.chosenDate)}</Text>
                <Text> Location: {this.props.gameDetails.location} </Text>
                <Text> Note: {this.props.gameDetails.gameNote} </Text>
                { 
                 this.props.gameDetails.noLimit 
                 ? null 
                 : <Text> Group Size: {this.props.gameDetails.groupSize} </Text>
                }
                <H> Invite List </H>
                {
                    this.props.confirmedPlayers && Object.keys(this.props.confirmedPlayers).map(playerKey => {
                        return (
                            <View style={styles.listItem} key={playerKey}>
                                <Icon type="MaterialCommunityIcons" name="emoticon" style={{color:colorPallet.success}} />
                                <Text> {this.props.confirmedPlayers[playerKey].name} </Text>
                            </View>

                        )
                    })
                    
                }
                {
                this.props.inviteList && Object.keys(this.props.inviteList).map(playerKey => {
                    return (
                        <View style={styles.listItem} key={playerKey}>
                            <Icon type="MaterialCommunityIcons" name="emoticon-sad" style={{color: colorPallet.error}} />
                            <Text> {this.props.inviteList[playerKey].name} </Text>
                        </View>
                     )
                    })
                }
                <View style={styles.btnContainer}>
                    <BigButton color={color.success} onPress={this.imIn}> YES, I'M IN </BigButton>
                    <SecondButton color={color.error} onPress={this.imOut}> NO, I'M OUT </SecondButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'flex-start'
    },
    listItem:{
        display:'flex',
        flexDirection:'row',
    },
    btnContainer:{
        width:'100%',
        alignItems: 'center'
    }

})

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}
export default connect(mapStateToProps, null)(PendingDetails);
