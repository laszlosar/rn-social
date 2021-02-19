// require('events').EventEmitter.prototype._maxListeners = 100;
// require('events').EventEmitter.defaultMaxListeners = 100;
// var AppDispatcher = require('../Dispatcher/Dispatcher');
// const EventEmitter = require('events').EventEmitter;
require('events').EventEmitter.prototype._maxListeners = 100;
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import {
    Alerts, 
    CreateGroup,
    Contacts,
    Home,
    InviteDetails,
    SetGameDetails,
    PendingDetails,
    Invitations,
    NoImOut,
    Profile,
    Groups,
    GroupProfile,
    GroupChat,
    Friends,
    FriendFinder,
    ForgotPassword,
    ScheduledGames,
    FriendProfile,
    UserChat,
    MessageAlerts,
    GameChat,
    SignIn,
    SignUp,
    SideDrawer,
    YesImIn
}  from './src/screens';

import {
    SearchFriends
} from './src/modals';
import configureStore from './src/store/congifgureStore';

const store = configureStore();
// PAGES
Navigation.registerComponent('Rally.Alerts', () => Alerts, store, Provider );
Navigation.registerComponent('Rally.SignIn', () => SignIn, store, Provider );
Navigation.registerComponent('Rally.SignUp', () => SignUp, store, Provider );
Navigation.registerComponent('Rally.Find Friends', () => FriendFinder, store, Provider );
Navigation.registerComponent('Rally.Contacts', () => Contacts, store, Provider );
Navigation.registerComponent('Rally.Create Group', () => CreateGroup, store, Provider );
Navigation.registerComponent('Rally.Friends', () => Friends, store, Provider );
Navigation.registerComponent('Rally.FriendProfile', () => FriendProfile, store, Provider );
Navigation.registerComponent('Rally.ForgotPassword', () => ForgotPassword, store, Provider );
Navigation.registerComponent('Rally.Groups', () => Groups, store, Provider );
Navigation.registerComponent('Rally.GroupProfile', () => GroupProfile, store, Provider );
Navigation.registerComponent('Rally.GroupChat', () => GroupChat, store, Provider );
Navigation.registerComponent('Rally.Home', () => Home, store, Provider );
Navigation.registerComponent('Rally.Invitations', () => Invitations, store, Provider );
Navigation.registerComponent('Rally.InviteDetails', () => InviteDetails, store, Provider );
Navigation.registerComponent('Rally.Message Alerts', () => MessageAlerts, store, Provider );
Navigation.registerComponent('Rally.No Im Out', () => NoImOut, store, Provider );
Navigation.registerComponent('Rally.PendingDetails', () => PendingDetails, store, Provider );
Navigation.registerComponent('Rally.Profile', () => Profile, store, Provider );
Navigation.registerComponent('Rally.UserChat', () => UserChat, store, Provider );
Navigation.registerComponent('Rally.GameChat', () => GameChat, store, Provider );
Navigation.registerComponent('Rally.Schedule', () => ScheduledGames, store, Provider );
Navigation.registerComponent('Rally.Start Game', () => SetGameDetails, store, Provider );
Navigation.registerComponent('Rally.SideDrawer', () => SideDrawer, store, Provider );
Navigation.registerComponent('Rally.Yes Im In', () => YesImIn, store, Provider );


// Modals
Navigation.registerComponent('Rally.Search Friends', () => SearchFriends, store, Provider );
Navigation.startSingleScreenApp({
    screen:{
        screen: "Rally.SignIn",
        title: 'Rally'
    },
    drawer:{
        left:{
            screen: 'Rally.SideDrawer',
        },
    },
    animationType: 'fade'
})
