import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SideBar from "./components/SideBar";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import MessageScreen from "./screens/MessageScreen";
import { Dimensions } from "react-native";
import PostScreen from "./screens/PostScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TermsAndConditionsScreen from "./screens/TermsAndConditions";
import SecretScreen from "./screens/SecretScreen";
import CommentsScreen from "./screens/CommentsScreen";
import SearchUsersScreen from "./screens/SearchUsersScreen";
import ListOfPostsScreen from "./screens/ListOfPostsScreen";
import ListOfOtherUsersPostsScreen from "./screens/ListOfOtherUsersPostsScreen";
import TicTacToeScreen from "./screens/TicTacToeScreen";
import AngelScreen from "./screens/AngelScreen";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerActions,
  DrawerItems,
} from "react-navigation-drawer";
import HappinessScreen from "./screens/HappinessScreen";
import firebase, { database } from "firebase";

import Lightbox from "react-native-lightbox-v2";

require("firebase/firestore");

const MyProfileStack = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: () => (
              <Ionicons name="ios-home" size={24} color="white" />
            ),
          },
        },
        Happiness: {
          screen: HappinessScreen,
          navigationOptions: {
            tabBarIcon: () => (
              <Foundation name="graph-bar" size={24} color="white" />
            ),
          },
        },
        Post: {
          screen: PostScreen,
          navigationOptions: {
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="pencil-circle"
                size={45}
                color="white"
              />
            ),
          },
        },
        SearchUsers: {
          screen: SearchUsersScreen,
          navigationOptions: {
            tabBarIcon: () => <Feather name="search" size={24} color="white" />,
          },
        },
        ListOfPosts: {
          screen: ListOfPostsScreen,
          navigationOptions: {
            tabBarIcon: () => (
              <Entypo name="briefcase" size={24} color="white" />
            ),
          },
        },
      },
      {
        tabBarOptions: {
          activeTintColor: "#161F3D",
          inactiveTintColor: "#B8BBC4",
          style: {
            backgroundColor: "#63003d",
          },
          showLabel: false,
        },
      }
    ),
    postModal: {
      screen: PostScreen,
    },
  },

  {
    mode: "modal",
    headerMode: "none",
  }
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

const Stack = createStackNavigator({
  TicTacToe: {
    screen: TicTacToeScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false,
      };
    },
  },
});
const AngelStack = createStackNavigator({
  Angel: {
    screen: AngelScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false,
      };
    },
  },
});
const ContactStack = createStackNavigator({
  Contact: {
    screen: ContactScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false,
      };
    },
  },
});

const DrawerStack = createDrawerNavigator(
  {
    "Remember, you are unique!": { screen: MyProfileStack },

    "Contact Programer": {
      screen: ContactStack,
      navigationOptions: {
        drawerIcon: <FontAwesome5 name="user-tie" size={24} color="#FF0000" />,
      },
    },
    "Enter special code": {
      screen: AngelStack,
      navigationOptions: {
        drawerIcon: <AntDesign name="dingding-o" size={24} color="blue" />,
      },
    },
    "Bored? Try Tic Tac Toe": {
      screen: Stack,
      navigationOptions: {
        drawerIcon: (
          <Ionicons name="logo-game-controller-b" size={24} color="black" />
        ),
      },
    },
    "Log out": {
      screen: "Rate Eleph",

      navigationOptions: {
        drawerIcon: <Entypo name="log-out" size={24} color="#808000" />,
      },
    },
  },
  {
    contentComponent: (props) => <SideBar {...props} />,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",

    drawerWidth: Dimensions.get("window").width * 0.85,

    contentOptions: {
      itemsContainerStyle: {
        marginTop: 15,
        marginHorizontal: 9,
      },
      itemStyle: {
        borderRadius: 9,
      },
      labelStyle: { color: "#63003d" },
    },
  },
  {
    initialRouteName: "Drawer",
  }
);

const App = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    App: MyProfileStack,
    Auth: AuthStack,
    Drawer: DrawerStack,
    Notification: NotificationScreen,
    Comments: CommentsScreen,
    ListOfOtherUsersPosts: ListOfOtherUsersPostsScreen,
    Profile: ProfileScreen,
    TermsAndConditions: TermsAndConditionsScreen,
    Happiness: HappinessScreen,
    Secret: SecretScreen,
  },

  {
    initialRouteName: "Loading",
  }
);
console.reportErrorsAsExceptions = false;
export default createAppContainer(App);
