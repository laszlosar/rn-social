import React, { Component } from 'react';
import { View, StyleSheet, Image,  Dimensions } from 'react-native';
import { Button, Segment, Text, Root, Toast } from 'native-base';
import { Input, BigButton, SecondButton } from '../components/ui';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux'; 
import { setUser } from '../store/actions';
import colorPallet from '../components/ui/color';
import logo from '../assets/rally_logo.png';
import corner from '../assets/corner_ball.png';
import go from './main/goTo.js';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
  return re.test(String(password));
}

function passwordsMatch(p, pp){
  return p === pp;
}

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
       errors:[]
    };
  }
  getUserLocationHandler = () => {
    console.log('hello');
    navigator.geolocation.getCurrentPosition( position => {
      console.log(`http://maps.googleapis.com/maps/api/geocode/json?latlng= ${position.coords.latitude},${position.coords.longitude}&sensor=false`);
        this.setState({lat: position.coords.latitude, long: position.coords.longitude});
      }, err => console.log(err)
    );

    console.log('pressed');
  }

  onTextChange = name => text => {
    console.log(name, text);
    const errors = this.state.errors;
    this.setState({[name]:text})
    if(errors.includes(name)){
      this.setState({errors: errors.filter(error => error != name)})
    }
  }
  
  isValid = () => {
    const emailIsValid = validateEmail(this.state.email);
    const errors = this.state.errors;
    if(!emailIsValid && !this.state.errors.includes('email')) errors.push('email'); 
    
    const passwordIsValid = validatePassword(this.state.password);
    if(!passwordIsValid && !this.state.errors.includes('password')) errors.push('password');
    
    const passwordMatches = passwordsMatch(this.state.password, this.state.passwordmatch);
    if(!passwordMatches && !this.state.errors.includes('passwordmatch')) errors.push('passwordmatch')

    this.setState({errors});
    return emailIsValid && passwordIsValid && passwordMatches
  }

  signUp = () => {
    if(!this.isValid())
      return false;
    firebase.auth()
    .createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
    .then(credential => {
      if (credential) {
        const {metadata, providerData, refreshToken, providerId, ...user} = credential.user.toJSON();
        firebase.database().ref(`users/${user.uid}`)
          .set({...user}, () => console.log('oh yeah'))
          .catch(err => console.log('oh no', err));
        console.log('default app user ->', credential.user.toJSON());
      }
    })
    .catch(err => {
      Toast.show({
        text: "User with that email already exists",
        duration: 3000
      })
      console.log(err);
    });
  }

  goTo = destination => {
    go(this.props.navigator, destination);
  }
  authListener = user => {
    if(!user) return false;
    this.goTo('Rally.Profile');
      firebase.database().ref(`users/${user.uid}`)
        .once('value', (data) => {
          this.props.setUser(data._value);
        }, (err) => console.log(err));
    
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user=>this.authListener(user));
  }
  render() {
    return (
      <Root>
        <View style={styles.wrapper}>
          <Image source={corner} style={styles.cornerTop}/>
          <Image source={corner} style={styles.cornerBottom}/>
          <View style={styles.container}>
              <Image source={logo} style={styles.logo}/>
              <Segment style={styles.segment}>
                    <Button style={styles.selectedBtn} first>
                        <Text style={styles.selectedTxt}>Sign Up</Text>
                    </Button>
                    <Button style={styles.btn} last  onPress={() => this.goTo('Rally.SignIn')}>
                        <Text style={styles.txt}>Sign In</Text>
                    </Button>
              </Segment>
          </View>
          <View style={styles.container}>
              <Input placeholder="Email" color={this.state.errors.includes('email') ? 'red' : null} keyboardType="email-address" textContentType="emailAddress" onChangeText={this.onTextChange('email')}/>
              <Input placeholder="Password" color={this.state.errors.includes('password') ? 'red' : null} textContentType="password" secureTextEntry={true} onChangeText={this.onTextChange('password')}/>
              <Input placeholder="Re-Type Password" color={this.state.errors.includes('passwordmatch') ? 'red' : null} extContentType="password" secureTextEntry={true} onChangeText={this.onTextChange('passwordmatch')}/>
              <View style={styles.txtContainer}>
                <Text style={styles.txtNote} note> *Password must be at least 6 characters long</Text>
                <Text style={styles.txtNote} note> with uppercase,lowercase and number</Text>
              </View>
              <BigButton onPress={this.signUp}> Sign Up </BigButton>
          </View>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent:'space-between',
    flex: 1
  },
  logo:{
    width: Dimensions.get('window').width * .8,
    height: Dimensions.get('window').height * .3,
    resizeMode: Image.resizeMode.contain
  },
  cornerTop:{
    position: 'absolute',
    top:0,
    right:0,
    zIndex:-999,
    transform: [{ rotate: '180deg'}]

  },
  cornerBottom:{
    position: 'absolute',
    bottom:0,
    left:0
  },
  container:{
      width: '100%',
      alignItems: 'center',
  },
  txtContainer:{
      marginTop:10,
      marginBottom:10,
      width: '80%',
      alignItems: 'center'
  },
  txtNote:{
      width:'100%',
      textAlign: 'left'
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

const mapDispatchToProps = dispatch => {
  return {
      setUser: (user) => {
          dispatch(setUser(user));
      }
  }
}


export default connect(null, mapDispatchToProps)(SignUp);
