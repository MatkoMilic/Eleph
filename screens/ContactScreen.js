import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MakeItRain from "react-native-make-it-rain";
import { AntDesign } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BackHandler } from "react-native";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";

export default class ContactScreen extends React.Component {
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
  }

  backButtonClick() {
    return this.props.navigation.navigate("Home");
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{
            justifyContent: "space-around",
            backgroundColor: "#63003d",
          }}
          centerComponent={{
            text: "Contact",
            style: {
              color: "white",
              fontSize: 25,
            },
          }}
          leftComponent={<TouchableOpacity></TouchableOpacity>}
          rightComponent={<TouchableOpacity></TouchableOpacity>}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#D8D9DB",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:imatkomilic@gmail.com")}
          >
            <Entypo name="mail-with-circle" size={50} color="#EA4335" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("fb://profile/100022922979046")}
          >
            <Entypo name="facebook-with-circle" size={50} color="#3b5998" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/in/matkomilic")
            }
          >
            <Entypo name="linkedin-with-circle" size={50} color="#2867B2" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <MaterialCommunityIcons
              name="home-circle"
              size={50}
              color="#63003d"
            />
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: "center", padding: 10 }}>
          Technologies used in making of this app: 100% React Native & Firebase
          (Firestore).
        </Text>

        <Text style={{ textAlign: "center", padding: 10 }}>
          IDE used to write code: Visual Studio Code.
        </Text>
      </View>
    );
  }
}
