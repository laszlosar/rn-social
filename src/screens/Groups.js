import React, { Component } from 'react';
import { View, StyleSheet, Image,  Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { GroupCard } from '../components';
import { List, Button, Icon, Segment, Text } from 'native-base';
import colorPallet from '../components/ui/color';
import Icn from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../assets/rally_logo.png';
import go from './main/goTo.js';

class Groups extends Component {
    constructor(props){
        super(props);
        this.state = {
            groups: []
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        rootNavigator = this.props.navigator
    }
    
    formatData = () => {
        return this.state.groups.map(group => {
            group.key = group.gid;
            return group;
        });
    }

    goTo = destination => {
        go(this.props.rootNav, destination);
    }


    appendGroup = (data) => {
        responseData = data.val();
        if(!responseData.gid) return false;
        if(this.state.groups.map(group => group.gid).includes(responseData.gid)) return false; 
        this.setState(prevState => ({ groups: [...prevState.groups, responseData] }));

    }

    filterOutGroups = groupsKeys => {
        this.setState(prevState => ({ 
            groups: [...prevState.groups].filter(group => groupsKeys.includes(group.gid))
        }));
    }

    gotData = (data) => {
        responseData = data.val();
        if(!responseData) return false;
        let groupKeys = Object.keys(responseData).map(key =>key);
        this.filterOutGroups(groupKeys);
        groupKeys.forEach((groupKey)=>{
            firebase.database().ref(`groups/${groupKey}`).once("value", this.appendGroup, this.errData);
        })
        return true;
    }
    
    errData = (err) => {
        console.log(err);
    }
    
    componentDidMount(){
        if(this.props.user && this.props.user.user){
            firebase.database().ref(`users/${this.props.user.user.uid}/groups`).once("value", this.gotData, this.errData);        
        }
    }

    viewGroupProfile = (gid, name) => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.GroupProfile', // unique ID registered with Navigation.registerScreen
                title: name, // title of the screen as appears in the nav bar (optional)
                passProps: {gid}, // simple serializable object that will pass as props to the modal (optional)
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

    viewGroupChat = gid => {
        console.log('chat will go here');
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.GroupChat', // unique ID registered with Navigation.registerScreen
                title: "Chat", // title of the screen as appears in the nav bar (optional)
                passProps: {gid}, // simple serializable object that will pass as props to the modal (optional)
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

    startGroupGame = gid => {
        console.log('starting game')
    }

    createGroup = () => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.Create Group', // unique ID registered with Navigation.registerScreen
                title: 'Create Group', // title of the screen as appears in the nav bar (optional)
                passProps: {}, // simple serializable object that will pass as props to the modal (optional)
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
            <View style={styles.containerTemp}>
                <Segment style={styles.segment}>
                    <Button style={styles.btn} first onPress={() => this.goTo('Rally.Friends')}>
                        <Text style={styles.txt}>Players</Text>
                    </Button>
                    <Button style={styles.selectedBtn} last>
                        <Text style={styles.selectedTxt}>Groups</Text>
                    </Button>
                </Segment>
                <Image source={logo} style={styles.logo}/>
                <Text style={styles.txtLargeNote}>Group Play Comming Soon</Text>
                {/*
                <View style={styles.plusBtn}>
                    <View>
                        <Button transparent onPress={this.createGroup}>
                            <Icon type="FontAwesome" name='plus' style={styles.plsIcon} />
                            <Text style={{color: colorPallet.main}}> Create Group </Text>
                        </Button>
                    </View>
                </View>
                <List>
                <FlatList 
                        style={styles.container}
                        data={this.formatData()}
                        renderItem={ (info) => <GroupCard 
                                                     viewGroupProfile={() => this.viewGroupProfile(info.item.gid, info.item.name)}
                                                     viewGroupChat={() => this.viewGroupChat(info.item.gid)}
                                                     startGroupGame={() => this.startGroupGame(info.item.gid)}
                                                     {...info.item}/> 
                                    }
                        />
                </List> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo:{
        width: Dimensions.get('window').width * .8,
        height: Dimensions.get('window').height * .3,
        resizeMode: Image.resizeMode.contain
    },
    containerTemp: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        width: '100%',
    },
    segment:{
        marginTop:10,
        backgroundColor:'#fff'
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
    selectedBtn:{
        borderColor: colorPallet.main,
        backgroundColor: colorPallet.main
    },
    selectedTxt:{
        fontSize: 19,
        color: 'white'
    },
    txtLargeNote:{
        fontSize: 22,
        color: colorPallet.main
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
export default connect(mapStateToProps, null)(Groups);