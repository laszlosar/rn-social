import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Text, Icon } from 'native-base';
import {SecondButton, BigButton, color} from '../components/ui/';
import { connect } from 'react-redux';
import avatar from '../assets/avatardefault.png'; 
import firebase from 'react-native-firebase';
import Icn from 'react-native-vector-icons/Ionicons';

class FriendProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {
                location: "",
                rating: 0,
                ratingType:"",
                about:"",
                profileURI:"",
                playTypes: {}
            }
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log(props);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'closeModal'){
            this.props.navigator.dismissModal({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
              });
            // rootNavigator = this.props.navigator
        }
    }
    gotData = (data) => {
        const user = {...this.state.user, ...data.val()};
        this.setState({ user });
    }
  
    errData = (err) => {
        console.log(err);
    }

    isFriend = (data) => {
        const t = data.val() ? true: false;
        this.setState({isFriend: t});
    }

    notFriend = (err) => {
        console.log(err);
        this.setState({isFriend: false});
    }

    componentDidMount(){
        firebase.database().ref(`users/${this.props.friendUserId}`)
        .once('value', this.gotData, this.errData);    
        if(this.props.user && this.props.user.user){
            firebase.database().ref(`usersFriends/${this.props.user.user.uid}/${this.props.friendUserId}`)
            .once('value',this.isFriend, this.notFriend);
        }
    }

    addToPlayersList = () => {
        console.log(this.props, this.state.user);
        firebase.database().ref(`usersFriends/${this.props.user.user.uid}/${this.state.user.uid}`)
            .set({...this.state.user}, () =>  this.props.rootNav.dismissModal())
            .catch(err => console.log('oh no', err));;
    }

    inviteToGame = () => {
        console.log("invite to game");
    }

    goToChats = () => {
        console.log("chats");
    }

    removeFriend = () => {
        firebase.database().ref(`usersFriends/${this.props.user.user.uid}/${this.state.user.uid}`).remove();
        this.props.navigator.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });

    }

    sendMessage = props => {
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
    render(){
        return(
              <Container>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={(this.state.user.profileURI?{uri:this.state.user.profileURI}:avatar)} />
                </View>
                <View style={styles.container}>
                    <View style={styles.row}> 
                        <Icon style={{color:'#ddd', position:'relative', left:10, bottom:10}} type="Octicons" name='location' /> 
                        <Text style={styles.txt} note>   {this.state.user.location}</Text>
                    </View>
                    { this.state.user.rating || this.state.user.ratingType
                        ? <Text style={styles.txtBold}> {this.state.user.rating} {this.state.user.ratingType} Rated </Text>
                        : null
                    }                    
                    <Text style={styles.txt} note>{this.state.user.about}</Text>
                    {Object.keys(this.state.user.playTypes).length
                        ?<View>
                            <Text style={styles.txt} note>Contact me to play:</Text>
                            <Text style={styles.txtBold}> {Object.keys(this.state.user.playTypes).join(", ")}</Text>
                        </View>
                        :null
                    }
                    <BigButton onPress={this.sendMessage}>
                        Send Message
                    </BigButton>

                    {/* TODO if profile is private remove the addFriend do not show the button */}
                    {this.state.isFriend
                        ?<TouchableOpacity onPress={this.removeFriend}>
                            <Text style={{color:color.err}}> Remove Friend </Text>
                            </TouchableOpacity>
                        :<SecondButton style={styles.nudgeBtn}  onPress={ this.addToPlayersList}>
                            Add to Player List
                        </SecondButton>

                    }
                    
                </View>
              </Container>  
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',

    },
    row:{
        display:'flex',
        flexDirection:'row'
    },
    avatarContainer:{
        alignItems: 'center',
    },
    avatar:{
        width: 100,
        height: 100,
        marginBottom: 30,
        borderRadius: 50,
        position: 'relative',
        top: 20
    },
    txt:{
        textAlign:'center'
    },
    txtBold:{
        textAlign:'center',
        fontWeight:"900",
    },
    nudgeBtn:{
        position:'relative',
        top:30
    }
})

const mapStateToProps = state => {
    return {
        rootNav: state.navigator.rootNav,
        user: state.user,
    }
  }
export default connect(mapStateToProps, null)(FriendProfile);