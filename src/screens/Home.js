import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { setNavigator } from '../store/actions'
import { BigButton, SecondButton} from '../components/ui';
import logo from '../assets/rally_logo.png'
import go from './main/goTo.js';
import Icn from 'react-native-vector-icons/Ionicons';

import colorPallet from '../components/ui/color';

class Home extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        if(e.type === 'NavBarButtonPress' &&   e.id === 'alert'){
            Promise.all([
                Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
            ]).then( source => {
                this.props.navigator.showModal({
                    screen: 'Rally.Alerts', // unique ID registered with Navigation.registerScreen
                    title: 'Notifications', // title of the screen as appears in the nav bar (optional)
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
        if(e.type === 'NavBarButtonPress' &&   e.id === 'messages'){
            Promise.all([
                Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
            ]).then( source => {
                this.props.navigator.showModal({
                    screen: 'Rally.Message Alerts', // unique ID registered with Navigation.registerScreen
                    title: 'Messages', // title of the screen as appears in the nav bar (optional)
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
    }

    componentDidMount(){
        this.props.setNavigator(this.props.navigator);
        if( this.props.user.user && ! this.props.user.user.phone){
          this.goTo('Rally.Profile')
        }
    }
    
    goTo = (destination, props = null) => {
        go(this.props.navigator, destination, props);
    }
   
    render(){
        return(
            <View style={styles.container}>
                <Image source={logo} style={styles.logo}/>
                <BigButton  onPress={() => this.goTo('Rally.Start Game')}> Start Game </BigButton>
                <BigButton  onPress={() => this.goTo('Rally.Invitations')}> Invitations </BigButton>
                <BigButton  onPress={() => this.goTo('Rally.Friends')}> Messages </BigButton>
                <SecondButton  onPress={() => this.goTo('Rally.Friends', {subPage: "search"})} color={colorPallet.error}> Player Search </SecondButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    logo:{
        width: Dimensions.get('window').width * .8,
        height: Dimensions.get('window').height * .3,
        resizeMode: Image.resizeMode.contain
    }
})

const mapDispatchToProps = dispatch => {
    return {
        setNavigator: (navigator) => {
            dispatch(setNavigator(navigator));
        }
    }
}
const mapStateToProps = state => {
    return {
        user: state.user,
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(Home);