import React, { Component } from 'react';
import { View, StyleSheet, Image,  Dimensions, TouchableOpacity  } from 'react-native';
import { Button, Segment, Text, Root, Toast } from 'native-base';
import { Input, BigButton, SecondButton } from '../components/ui';
import { connect } from 'react-redux'; 
import { setUser } from '../store/actions'
import firebase from 'react-native-firebase';
import colorPallet from '../components/ui/color';
import logo from '../assets/rally_logo.png';
import corner from '../assets/corner_ball.png';
import go from './main/goTo.js';

class SignIn extends Component {
  constructor(props){
    super(props);
    this.state = {
        message: null,
    };
  }
  onTextChange = name => text => {
    console.log(name, text);
    this.setState({[name]:text})
  }

  signIn = () => {
    // firebase.auth().signInWithPhoneNumber(phoneNumber)
    //   .then(confirmResult => console.log(confirmResult) )
    //   .catch(error => error);

    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
    .then(credential => {
      if (credential) {
        console.log('default app user ->', credential.user.toJSON());
      }
    }).catch(err => {
      Toast.show({
        text: "Email and Password do not match",
        duration: 3000
      })
      console.log(err)
    });
  }
  authListener = user => {
    if(!user) return false;
    
    firebase.database().ref(`users/${user.uid}`)
      .once('value', this.handleUser, (err) => console.log(err));

    
  }
  handleUser = user => {
    const data = user._value;
    // console.log(data);
    this.props.setUser(data);
    this.goTo('Rally.Home')
  }
  goTo = destination => {
    go(this.props.navigator, destination);
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
                  <Button style={styles.btn} first onPress={() => this.goTo('Rally.SignUp')}>
                      <Text style={styles.txt}>Sign Up</Text>
                  </Button>
                  <Button style={styles.selectedBtn} last>
                      <Text style={styles.selectedTxt}>Sign In</Text>
                  </Button>
            </Segment>
        </View>
        <View style={styles.container}>
            <Input placeholder="Email" keyboardType="email-address" textContentType="emailAddress" onChangeText={this.onTextChange('email')}/>
            <Input placeholder="Password" extContentType="password" secureTextEntry={true} onChangeText={this.onTextChange('password')}/>
            <BigButton onPress={this.signIn}> Sign In </BigButton>
            <TouchableOpacity onPress={() => this.goTo('Rally.ForgotPassword')}>
              <View>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text> 
              </View>
          </TouchableOpacity>
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
    justifyContent:'space-around',
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
  segment:{
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
  },
  forgotPasswordText:{
    fontSize: 15,
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

export default connect(null, mapDispatchToProps)(SignIn);