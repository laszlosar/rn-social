import React, { Component } from 'react';
import {View, Button,  StyleSheet, Platform, DatePickerAndroid, TimePickerAndroid, DatePickerIOS, TouchableWithoutFeedback } from 'react-native';
import { Item, Label, Input, Text } from 'native-base';
import {BigButton, SecondButton} from './'
import colorPallet from './color'

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            chosenDate: new Date(),
        };
    
      
    }

    formatStandardTime = date => {
        let time = date.toLocaleTimeString();
        time = time.split(':'); // convert to array

        // fetch
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);

        // calculate
        var timeValue;

        if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
        } else if (hours > 12) {
        timeValue= "" + (hours - 12);
        } else if (hours == 0) {
        timeValue= "12";
        }
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
        return timeValue
    }
    androidDatePicker = async () => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(2020, 4, 25)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                let d = this.state.chosenDate;
                d.setDate(day);
                d.setMonth(month);
                d.setYear(year);
                this.setState({chosenDate:d})
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    androidTimePicker = async () => {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
              hour: 14,
              minute: 0,
              is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                let t = this.state.chosenDate;
                t.setHours(hour,minute);
                this.setState({chosenDate:t})
            }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
    }
    setDate = newDate => {
        this.setState(
            {chosenDate: newDate},
            () => this.props.setDate(this.state.chosenDate)
        );

        // return newDate;
    }

    render() {
        return (
            <View style={styles[ Platform.OS === 'android' ? 'androidContainer' : 'IOSContainer']}>
                {
                    Platform.OS === 'android'
                    ?   
                    <View>
                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <TouchableWithoutFeedback onPress={this.androidDatePicker}>
                                    <Text note style={styles.timetxt}> {this.state.chosenDate.toDateString()} </Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.buttonWrapper}>
                                <TouchableWithoutFeedback onPress={this.androidTimePicker}>
                                    <Text note style={styles.timetxt}> {this.formatStandardTime(this.state.chosenDate)} </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    :<DatePickerIOS 
                            date={this.state.chosenDate}
                            onDateChange={this.setDate}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    IOSContainer: {
      width: '100%',
    },
    androidContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop:30,
    },
    buttonWrapper:{
        width:'50%'
    },
    buttonContainer:{
        width:'80%',
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    timetxt:{
        fontSize:17,
        textAlign:'center',
    }
  })

