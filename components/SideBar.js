import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacityComponent,
  Alert,
  Dimensions,
} from "react-native";
import * as Linking from "expo-linking";
import AwesomeAlert from "react-native-awesome-alerts";
import { DrawerNavigatorItems, DrawerItems } from "react-navigation-drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../Fire";
//import Button from 'MyButton';
import Loader from "../components/Loader";
import Lightbox from "react-native-lightbox-v2";

// function getCurrentRouteParams(navigationState) {
//   if (!navigationState) {
//     return null;
//   }
//   const route = navigationState.routes[navigationState.index];
//   // dive into nested navigators
//   if (route.routes) {
//     return getCurrentRouteParams(route);
//   }
//   if (route.params) {
//     return route.params;
//   } else {
//     return null;
//   }
// }
// export default SideBar = (props) => (
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default class SideBar extends React.Component {
  state = {
    user: {},
    loading: false,
  };

  unsubscribe = null;

  async componentDidMount() {
    this.setState({ loading: true });
    const user = Fire.shared.uid;
    //console.log(user);
    this.unsubscribe = await Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ loading: false, user: doc.data() });
        //console.log(user);
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  static navigationOptions = ({ navigation }) => ({
    title: "TEST",
    //headerLeft: <Icon name="ios-menu" style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('DrawerOpen')} />,
    drawerLabel: "Notification",
    drawerIcon: ({ tintColor }) => (
      <MaterialCommunityIcons
        name="elephant"
        size={24}
        color="#639dff"
        //onPress={() => this.xDD(this.state.comments)}
        //onPress={() => navigation.navigate("CommentsScreen")}
        //onPress={() => this.props.navigation.navigate("Comments")}
        //onPress={() => this.props.navigation.navigate("Register")}
        //onPress={() => Linking.openURL("https://expo.io")}
      />
    ),
  });

  render() {
    return (
      <View>
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <ScrollView>
          <ImageBackground
            source={require("../assets/LoadingLogoEleph.jpg")}
            style={{
              width: undefined,
              padding: 16,
              paddingTop: 50,
              backgroundColor: "#63003d",
            }}
          >
            <Image
              source={
                this.state.user.avatar
                  ? { uri: this.state.user.avatar }
                  : require("../assets/tempAvatar.jpg")
              }
              style={styles.profile}
            />

            <View style={{ flexDirection: "row" }}>
              {/* <Text style={styles.text}>Number of </Text>
              <MaterialCommunityIcons
                name="elephant"
                size={18}
                color="white"
                style={{}}
                //onPress={() => this.xDD(this.state.comments)}
                //onPress={() => navigation.navigate("CommentsScreen")}
                //onPress={() => this.props.navigation.navigate("Comments")}
                onPress={() => this.props.navigation.navigate("Register")}
              /> */}
              {/* <Text style={styles.text}> given: 10</Text> */}
              <Text style={styles.name}>Welcome {this.state.user.name}</Text>
            </View>
          </ImageBackground>

          <View
            style={styles.container}
            forceInset={{ top: "always", horizontal: "never" }}
          >
            <DrawerNavigatorItems
              {...this.props}
              onItemPress={(route) => {
                // if (route.route.routeName == "Rate Eleph") {
                //   this.props.onItemPress({ route });
                //   //console.log("item pressed");
                //   Linking.openURL("https://expo.io");
                // }
                if (route.route.routeName == "AuthStack") {
                  this.props.onItemPress({ route });
                  //console.log("item pressed");
                  this.props.navigation.navigate("Register");
                } else if (route.route.routeName == "Contact Programer") {
                  this.props.onItemPress({ route });
                  //console.log("item pressed");
                  this.props.navigation.navigate("Contact");
                } else if (route.route.routeName == "Log out") {
                  this.props.onItemPress({ route });
                  //console.log("item pressed");
                  Alert.alert(
                    "Are you sure you want to log out?",

                    "You will have to re-enter your credentials.",
                    [
                      { text: "Yes", onPress: () => Fire.shared.signOut() },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                    { cancelable: true }
                  );
                } else if (route.route.routeName == "Bored? Try Tic Tac Toe") {
                  this.props.onItemPress({ route });
                  this.props.navigation.navigate("TicTacToe");
                } else if (route.route.routeName == "Enter special code") {
                  this.props.onItemPress({ route });
                  this.props.navigation.navigate("Angel");
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    borderRadius: 40,
    width: 60,
    height: 60,

    borderWidth: 3,
    borderColor: "#63003d",
    //borderRadius: 18,
    marginRight: 16,
  },
  name: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 4,
    marginTop: 25,
    marginBottom: 2,
  },
  text: {
    color: "#63003d",
    fontSize: 7,
    marginRight: 4,
  },
});
