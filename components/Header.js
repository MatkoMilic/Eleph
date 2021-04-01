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
  TouchableOpacity,
} from "react-native";
import * as Linking from "expo-linking";
import AwesomeAlert from "react-native-awesome-alerts";
import { DrawerNavigatorItems, DrawerItems } from "react-navigation-drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../Fire";
//import Button from 'MyButton';
import Loader from "./Loader";

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
export default class header extends React.Component {
  state = {
    user: {},
    loading: false,
  };

  unsubscribe = null;

  async componentDidMount() {
    this.setState({ loading: true });
    const user = Fire.shared.uid;
    //console.log(user);
    this.unsubscribe = Fire.shared.firestore
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

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#ffffff",
          //width: "100%",
          padding: 11,
          alignItems: "center",
          position: "absolute",
          justifyContent: "center",
          //top: 50,
          //bottom: 0,
          //left: 0,
          //elevation: 4,
          //right: 0,
          //height: 50,
        }}

        //flexDirection: "row",
        //backgroundColor: "#ffffff",
        //width: "100%",
        //padding: 11,
        //alignItems: "center",
      >
        <Image
          source={
            this.state.user.avatar
              ? { uri: this.state.user.avatar }
              : require("../assets/tempAvatar.jpg")
          }
          style={{
            width: 36,
            height: 36,
            marginRight: 16,
            borderRadius: 18,
            borderColor: "#63003d",
            borderWidth: 2,
          }}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Post")}
        >
          <Text
            style={{ alignItems: "center", color: "#C4C6CE" }}
            //placeholder={`How are you feeling right now ${this.state.user.name}?`}
            multiline
          >{`Tell us how are you feeling right now ${this.state.user.name}?`}</Text>
        </TouchableOpacity>

        {/* <View style={styles.divider}></View> */}
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
    borderColor: "white",
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
