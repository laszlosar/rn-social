import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform, PermissionsAndroid } from 'react-native';
import {  List, Text, Segment, Button } from 'native-base';
import colorPallet from '../components/ui/color';
import { ContactCard } from '../components';
import Contacts from 'react-native-contacts';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';




async function requestContactsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Lets Rally your contacts',
          'message': 'Rallypb needs access to your contacts ' +
                     'so you can invite them to the app.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Contacts")
      } else {
        console.log("Contacts permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

class ContactsList extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        this.state = {
            contacts: []
        }
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
        // rootNavigator = this.props.navigator
    }

    readContacts = () =>{
        if(Platform.OS === 'android'){
            requestContactsPermission().then(() => {
                Contacts.getAll((err, contacts) => {
                    console.log(err, contacts);
                    if (err) throw err;
                    this.setState({contacts})
                })
            }).catch(()=>console.log('not today'));
        }else{
            Contacts.getAll((err, contacts) => {
                console.log(err, contacts);
                if (err) throw err;
                this.setState({contacts})
            })
        }
    }

    formatData = () => {
        let contacts = this.state.contacts;
        return Object.keys(this.state.contacts).map(key => {
            const obj = contacts[key];
            obj.key = obj.recordID;
            return obj;
        });
    }

  
    sendTextInvite = (phoneNumber) => {
        // textQueue
        // javascriptTime
        // push
        // firebase.database().ref(`textQueue/${Date.parse(obj[k].sendTextAt)}`).push({...obj[k], gameKey, messageKey, creator, details});
        firebase.database().ref(`textQueue/${Date.parse(Date())}`).push({
            phone:phoneNumber,
            user: this.props.user.user, 
            messageKey: 'share'
        }, () => console.log('success'))
        .catch(err => console.log('oh no', err));
    //    console.log(this.props.user.user);
    }
    
    componentDidMount(){
        this.readContacts();
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Segment style={styles.segment}>
                        <Button style={styles.selectedBtn} first last>
                            <Text style={styles.selectedTxt}>Invite Friends to Rally</Text>
                        </Button>
                    </Segment>
                </View>
            <List>
                <FlatList 
                    style={styles.container}
                    data={this.formatData()}
                    renderItem={ (info) => <ContactCard sendTextInvite={() => this.sendTextInvite(info.item.phoneNumbers[0].number)}  {...info}/> }
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
    }

})

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(ContactsList)