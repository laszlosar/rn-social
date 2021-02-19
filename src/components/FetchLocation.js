import React from 'react';
import { StyleSheet } from  'react-native';
import { Icon, Button } from 'native-base';
import colorPallet from './ui/color';
// import IonIcon from 'react-native-vector-icons/Ionicons';
// IonIcon.getImageSource('md-menu',30, colorPallet.main),

const fetchLocation = props => {
    return (
        <Button iconLeft light transparent onPress={props.onGetLocation}>
            <Icon style={styles.drawerItemIcon} type="Octicons" name='location' />
        </Button>
    );
};
const styles = StyleSheet.create({
    drawerItemIcon:{
        marginRight: 10,
        fontSize: 30,
        color: colorPallet.main,
    }
})
export default fetchLocation;