import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import { BackHandler } from "react-native";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class NotificationScreen extends React.Component {
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
      <View style={{ flex: 1, backgroundColor: "#EBECF4" }}>
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <SafeAreaView>
          <Header
            containerStyle={{
              justifyContent: "space-around",
              backgroundColor: "#63003d",
            }}
            centerComponent={{
              text: "Notifications",
              style: {
                color: "white",
                fontFamily: "Lobster-Regular",

                fontSize: 23,
              },
            }}
            leftComponent={
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <MaterialCommunityIcons
                  name="home-circle"
                  size={35}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            }
            rightComponent={<TouchableOpacity></TouchableOpacity>}
          />
        </SafeAreaView>
        <Text></Text>
        <Text style={{ textAlign: "center" }}>
          Notifications are coming in the first update along with other
          quality-of-life improvements.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
