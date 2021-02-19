import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native';
import pallet from './color';
const BigButton = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <View style={[styles.button, {borderColor: pallet.main }]}>
                <Text style={[styles.text, {color: props.color || pallet.main }]}>
                   {props.children}
                </Text> 
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '80%',
        alignItems: 'center',
        margin: 7
    },
    button:{
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
        borderWidth: 2,
        padding:10,
    },
    text:{
        color: 'white',
        fontSize: 30
    }

})

export default BigButton;