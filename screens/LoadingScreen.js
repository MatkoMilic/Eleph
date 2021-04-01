import React from "react";
import firebase from "firebase";
import { Image, View, StatusBar } from "react-native";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "#63003d",
        }}
      >
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <Image
          source={require("../assets/LoadingLogoEleph.jpg")}
          style={{
            width: 300,
            height: 300,
            borderRadius: 300 / 2,
            overflow: "hidden",
            alignSelf: "center",
            //borderWidth: 3,
            //borderColor: "red",
          }}
          //resizeMode="contain"
        ></Image>
      </View>
    );
  }
}
