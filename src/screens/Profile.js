import React, { Component } from 'react';
import { View, Image,  ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Container,  Content, Form, Input, Label, ListItem, CheckBox, Item, Body, Text, Picker, Icon, Toast, Root } from 'native-base';
import { connect } from 'react-redux';
import { setUser } from '../store/actions'
import firebase from 'react-native-firebase'; //https://rnfirebase.io/docs/v4.3.x/links/reference/links
import colorPallet from '../components/ui/color';
import avatar from '../assets/add_profile.png'
import loadingGif from '../assets/loading.gif'
import { FetchLocation, AndroidImagePicker } from '../components';
import { SecondButton } from '../components/ui';
// import ImagePicker from 'react-native-image-picker';

const phoneRgx = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            rating: '',
            ratingType: '',
            playTypes:{},
            location: '',
            isPrivate: false,
            ...this.props.user.user
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(!this.state.phone || !phoneRgx.test(this.state.phone)){
            Toast.show({
                text: 'A 10 digit phone number is required for this app',
                buttonText: "Okay",
                duration: 3000
            })
        }else{
            if(e.type === 'NavBarButtonPress' && e.id === 'leftDrawerToggle' && this.state.phone)
                this.props.navigator.toggleDrawer();
        }
      
        // rootNavigator = this.props.navigator
    }
    saveUserInfo = () => {
        firebase.database().ref(`users/${this.state.uid}`)
        .set({...this.state}, () => {
            Toast.show({
                text: 'User Info has been saved',
                type: 'success',
                duration: 3000
            })
        })
        .catch(err => console.log('oh no', err));

        this.props.setUser(this.state)
    }
    getUserLocationHandler = () => {
        const mapsKey = 'AIzaSyDgCkYfc-r0Rja1xe0EIBntSa5z0J07NdY'; //maps api key
        navigator.geolocation.getCurrentPosition( position => {
            console.log(position);
          const mapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${mapsKey}&latlng=${position.coords.latitude},${position.coords.longitude}&sensor=false`;
        //   const mapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${mapsKey}&latlng= ${37.0965},${-113.5684}&sensor=false`;
          fetch(mapsUrl)
            .then(data => data.json())
            .then(json => {
                // NOTE we use the locality
                const locality = json.results.filter(a => a.types.includes("locality"))[0];
                const locationInfo = json.results.length > 1 ?  json.results[1] :  json.results[0]
                const location = locality.formatted_address;
                this.setState({locationInfo, location}, this.saveUserInfo)
            }).catch(err => console.log(err));
          }, err => console.log(err)
        );
      }
    onValueChange = (key) => (value) => {
        this.setState({
            [key]: value
        }, this.saveUserInfo);
    }

    onTextChange = name => text => {
            this.setState({[name]:text})
    }
    handlePrivateCheckbox = () => {
        this.setState({isPrivate: !this.state.isPrivate})
    }
    handleCheckbox = type => () => {
        let playTypes;
        if(Object.keys(this.state.playTypes).includes(type)){
            playTypes = this.state.playTypes;
            delete playTypes[type];
        }else{
            playTypes = this.state.playTypes;
            playTypes[type]= true;
        }
        this.setState({...this.state, playTypes});
    }
   
    pickImageHandler = () => {
        // const imgPicker = Platform.OS === 'android' ? AndroidImagePicker : ImagePicker;
        AndroidImagePicker.showImagePicker({title:"Pick a profile pic"}, res => {
            if(res.didCancel) return console.log('user canceld!');
            if(res.err) return console.log(err);
            const uri = res.uri;
            firebase.storage().ref(`resized-${this.state.uid}`).delete();
            this.setState({profileURI:'processing'}, this.saveUserInfo);
            firebase.storage().ref(`users/${this.state.uid}`).putFile(uri)
                .then(res => { 
                    console.log(res);
                }).catch(err => console.log(err));
            console.log(uri);
        })
    }
    gotProfile = (data) => {
        if(data._value.profileURI)
            this.setState({profileURI:data._value.profileURI});
    }
    cancelCallbackOrContext = (data) => {
        console.log(data);
    }
    
    componentDidMount = () => {
        firebase.database().ref(`users/${this.state.uid}`)
        .once('value', this.gotProfile, this.cancelCallbackOrContext);
    }

    render(){
        let profilePic = this.state.profileURI ? {uri:this.state.profileURI} : avatar;
        const isProcessing = this.state.profileURI && this.state.profileURI === 'processing';
        profilePic = isProcessing ? loadingGif : profilePic;

        return(
            <Root>
                <Container>
                    <Content>
                        <Form>
                            {/* NOTE add onBlur={this.saveUserInfo} to inputs for live updating */}
                         
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity onPress={this.pickImageHandler}>
                                    <Image style={styles.avatar} source={profilePic} />
                                </TouchableOpacity>
                            </View>
                            {/* <View>
                                <View style={styles.privateCheck}>
                                    <Text note style={styles.txtLabel}>Private Profile</Text>
                                    <CheckBox onPress={this.handlePrivateCheckbox } checked={this.state.isPrivate}  color={colorPallet.main} />
                                </View>
                            </View> */}
                            <Item floatingLabel>
                                <Label  style={{ color: colorPallet.dark }}>Email</Label>
                                <Input value={this.state.email} disabled />
                            </Item>
                            <Item floatingLabel>
                                <Label  style={{ color: colorPallet.dark }}>Name</Label>
                                <Input value={this.state.name} onChangeText={this.onTextChange('name')}/>
                            </Item>
                            
                            <Item floatingLabel style={{ borderColor: (this.state.error === "phone" ? colorPallet.error : colorPallet.underline) }}>
                                <Label  style={{ color: colorPallet.dark }}>Phone</Label>
                                <Input value={this.state.phone} onChangeText={this.onTextChange('phone')} />
                            </Item>

                            <Item floatingLabel>
                                <Label  style={{ color: colorPallet.dark }}>Age</Label>
                                <Input value={this.state.age} onChangeText={this.onTextChange('age')}/>
                            </Item>                          
                            <View style={styles.locationFieldContainer}>
                                <View style={styles.locationField}>
                                    <Item floatingLabel>
                                        <Label  style={{ color: colorPallet.dark }}>Location</Label>
                                        <Input value={this.state.location} onChangeText={this.onTextChange('location')}/>
                                    </Item>
                                </View>
                                <View style={styles.locationBtn}>
                                    <FetchLocation onGetLocation={this.getUserLocationHandler} />
                                </View>
                            </View>

                            <View style={styles.pickerItemsContainer} >
                                <Item picker style={styles.pickerItems}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder="Rating"
                                        placeholderStyle={{color: colorPallet.dark }}
                                        placeholderIconColor={colorPallet.dark}
                                        selectedValue={this.state.rating}
                                        onValueChange={this.onValueChange('rating')}
                                    >
                                        {/* <Picker.Item label="1.0" value="1" /> */}
                                        <Picker.Item label="2.0" value="2.0" />
                                        <Picker.Item label="2.5" value="2.5" />
                                        <Picker.Item label="3.0" value="3.0" />
                                        <Picker.Item label="3.5" value="2.5" />
                                        <Picker.Item label="4.0" value="4.0" />
                                        <Picker.Item label="4.5" value="4.5" />
                                        <Picker.Item label="5.0" value="5.0" />
                                    </Picker>
                                </Item>
                                <Item picker style={styles.pickerItems}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder="Rating Type"
                                        placeholderStyle={{color: colorPallet.dark }}
                                        placeholderIconColor={colorPallet.dark}
                                        selectedValue={this.state.ratingType}
                                        onValueChange={this.onValueChange('ratingType')}
                                    >
                                        <Picker.Item label="USAPA" value="USAPA" />
                                        <Picker.Item label="Club" value="Club" />
                                        <Picker.Item label="IPTPA" value="IPTPA" />
                                        <Picker.Item label="IFP" value="IFP" />
                                        <Picker.Item label="Self Rated" value="Self Rated" />
                                    </Picker>
                                </Item>
                            </View>    
                        
                            <Text note style={styles.txtLabel}>Play Types</Text>
                            <ScrollView horizontal={true}>
                                <View style={styles.playType}>
                                    <View style={styles.item}>
                                        <CheckBox onPress={this.handleCheckbox('open') }checked={Object.keys(this.state.playTypes).includes('open')}  color={colorPallet.main} />
                                        <Body>
                                            <Text style={styles.txt}>Open</Text>
                                        </Body>
                                    </View>
                                    <View style={styles.item}>
                                        <CheckBox onPress={this.handleCheckbox('mixed') }checked={Object.keys(this.state.playTypes).includes('mixed')}  color={colorPallet.main} />
                                        <Body>
                                            <Text style={styles.txt}>Mixed</Text>
                                        </Body>
                                    </View>
                                    <View style={styles.item}>
                                        <CheckBox onPress={this.handleCheckbox('doubles') }checked={Object.keys(this.state.playTypes).includes('doubles')}  color={colorPallet.main} />
                                            <Body>
                                                <Text style={styles.txt}>Doubles</Text>
                                            </Body>
                                    </View>
                                    <View style={styles.item}>
                                        <CheckBox onPress={this.handleCheckbox('singles') }checked={Object.keys(this.state.playTypes).includes('singles')}  color={colorPallet.main} />
                                        <Body>
                                            <Text style={styles.txt}>Singles</Text>
                                        </Body>
                                    </View>
                                </View>
                            </ScrollView>
                            <Item floatingLabel>
                                <Label  style={{ color: colorPallet.dark }}>About Me</Label>
                                <Input value={this.state.about} onBlur={this.saveUserInfo} onChangeText={this.onTextChange('about')}/>
                            </Item>
                            <View style={[styles.container, {marginTop:10}]}>
                                <SecondButton  onPress={this.saveUserInfo} color={colorPallet.error}> Save Info </SecondButton>
                            </View>
                        </Form>
                    </Content>
                </Container>
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    avatarContainer:{
        alignItems: 'center',
    },
    avatar:{
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'relative',
        top: 15
    },
    playType:{
        paddingTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexGrow:1,
        height:60,
        width:420
    },
    privateCheck:{
        position:'relative',
        height:40,
        top:10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    item:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexGrow:1
    },
    locationFieldContainer:{
        height:40,
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexGrow:1
    },
    locationField:{
        width:'75%'
    },
    locationBtn:{
        position:'relative',
        top:30,
        width:'20%'
    },
    pickerItemsContainer:{
        marginTop:13,
        marginBottom:6,
        marginLeft:3,
        flexDirection: 'row',
    },
    pickerItems:{
        width:'49%',
    },
    txt:{
        marginLeft:13,
        marginRight:10,
        position:'relative',
        bottom:15
    },
    txtLabel:{
        marginTop:5,
        marginBottom:5,
        marginLeft:18,
        fontSize:17,
        color:'#666'
    }

})
const mapStateToProps = state => {
  return {
      user: state.user,
  }
}
const mapDispatchToProps = dispatch => {
    return {
        setUser: (user) => {
            dispatch(setUser(user));
        }
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Profile);