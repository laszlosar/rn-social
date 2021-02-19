import React, { Component } from 'react';
import { View, Text, Image,  TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import firebase from 'react-native-firebase';
import pickleImg from '../assets/pickleball.png';
import { connect } from 'react-redux'; 
import colorPallet from '../components/ui/color';
import go from './main/goTo.js';

class SideDrawer extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    log = () => {
        console.log("SideDrawer");
    }
    
    goTo =  (destination, props = null) => {
        go(this.props.rootNav, destination, props);
        this.props.rootNav.toggleDrawer();
      
    }
    signOut = () => {
        firebase.auth().signOut();
        setTimeout(() => {
            this.goTo('Rally.SignIn');
        }, 300);
    }
   
    render(){
        return(
            <View style={[styles.container, {width: Dimensions.get("window").width * 0.8}]}>
                <TouchableOpacity onPress={() => this.goTo('Rally.Home')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="Ionicons" name="md-home"/>
                        <Text> Home Screen  </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Start Game')}>
                    <View style={styles.drawerItem}>
                        <Image source={pickleImg} style={{width: 30, height: 30, position: 'relative', right: 4}}/>
                        <Text> Start A Game  </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Invitations')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="Octicons" name="mail"/>
                        <Text> Pending Games </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Schedule')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="Octicons" name="calendar"/>
                        <Text> Scheduled Games  </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Friends')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="Octicons" name="jersey"/>
                        <Text> Players List </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Friends', {subPage: "search"})}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="FontAwesome" name="search"/>
                        <Text> Players Search </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Groups')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="FontAwesome" name="users"/>
                        <Text> Groups </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goTo('Rally.Profile')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="FontAwesome" name="user-circle"/>
                        <Text> Profile  </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => this.goTo('Rally.Contacts')}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="FontAwesome" name="id-card"/>
                        <Text> Invite Contacts to Rally </Text> 
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.signOut}>
                    <View style={styles.drawerItem}>
                        <Icon style={styles.drawerItemIcon} type="FontAwesome" name="sign-out"/>
                        <Text> Sign Out  </Text> 
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50
    },
    drawerItem:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colorPallet.grey,
    },
    drawerItemIcon:{
        marginRight: 10,
        fontSize: 30,
        color: 'black',
    }
})

const mapStateToProps = state => {
    return {
        rootNav: state.navigator.rootNav,
    }
}

export default connect(mapStateToProps, null)(SideDrawer)