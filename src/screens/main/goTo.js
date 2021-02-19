import IonIcon from 'react-native-vector-icons/Ionicons';
import colorPallet from '../../components/ui/color';

const goTo = (nav, destination, props = {}) => {
    Promise.all([
        // <ion-icon name="notifications"></ion-icon>
        IonIcon.getImageSource('md-menu',30, colorPallet.main), // friends and groups 
        IonIcon.getImageSource('md-notifications',30, colorPallet.main), // friends and groups 
        IonIcon.getImageSource('md-chatboxes',30, colorPallet.main), // friends and groups 
    ]).then( source => {
        nav.push({
            screen: `${destination}`,
            passProps: props,
            navigatorButtons:{
                leftButtons: [
                    {
                        icon: source[0],
                        title: 'Menu',
                        id: 'leftDrawerToggle',
                        disableIconTint: true,
                    }
                ],
                rightButtons: [
                    {
                        icon: source[1],
                        title: 'Alerts',
                        id: 'alert',
                        disableIconTint: true,
                    },
                    {
                        icon: source[2],
                        title: 'Messages',
                        id: 'messages',
                        disableIconTint: true,
                    }
                ]
            },
            drawer:{
                left:{
                    screen: 'Rally.SideDrawer'
                },
            },
            animationType: 'fade'

        });
    });
}

export default goTo;