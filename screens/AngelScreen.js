import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import MakeItRain from "react-native-make-it-rain";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";

export default class AngelScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    secretCode: "",
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />

        <SafeAreaView>
          <Header
            containerStyle={{
              justifyContent: "space-around",
              backgroundColor: "#63003d",
            }}
            centerComponent={{
              text: "Enter code",
              style: {
                color: "white",
                fontSize: 18,
              },
            }}
            leftComponent={
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Feather
                  name="home"
                  size={25}
                  color="#fff"
                  style={{
                    marginBottom: 8,

                    marginTop: 8,
                  }}
                ></Feather>
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Feather
                  name="home"
                  size={25}
                  color="#fff"
                  style={{
                    marginBottom: 8,
                    marginTop: 8,
                  }}
                ></Feather>
              </TouchableOpacity>
            }
          />
        </SafeAreaView>

        {this.state.secretCode == "Agata" ||
        this.state.secretCode == "Angel" ? (
          <View style={{ flex: 1, padding: 20 }}>
            <Text
              style={{
                textAlign: "center",
                color: "#639dff",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              Ten efekt jest dla ciebie Aniołku!
            </Text>
            <MakeItRain
              numItems={80}
              itemDimensions={{ width: 40, height: 20 }}
              itemComponent={<Text>Angel</Text>}
              itemTintStrength={0.8}
              itemColors={["red", "#fff", "#fff"]}
            />
          </View>
        ) : (
          <TextInput
            autoFocus={true}
            multiline={true}
            style={{ flex: 1, alignSelf: "center" }}
            placeholder="Enter your code"
            maxLength={200}
            onChangeText={(secretCode) => this.setState({ secretCode })}
            value={this.state.secretCode}
          ></TextInput>
        )}
      </View>
    );
  }
}
