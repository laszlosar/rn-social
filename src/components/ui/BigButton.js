import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import pallet from './color';
const BigButton = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <View style={[styles.button, {backgroundColor: props.color || pallet.main }]}>
                <Text style={styles.text}>
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
        padding:10,
    },
    text:{
        color: 'white',
        fontSize: 30
    }

})

export default BigButton;