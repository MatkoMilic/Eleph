import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  LayoutAnimation,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    email: "",
    password: "",
    errorMessage: null,
  };

  handleLogin = () => {
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    LayoutAnimation.easeInEaseOut();

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#639dff" barStyle="light-content" />

        <View
          style={{
            flex: 1,
          }}
        >
          <Image
            source={require("../assets/LoadingLogoEleph.jpg")}
            style={{ height: undefined, width: undefined, flex: 1 }}
            resizeMode="contain"
          ></Image>

          <Text style={styles.title}>
            {`Welcome to Eleph! \nYour`}{" "}
            <Text
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                color: "#639dff",
              }}
            >
              mood matters.
            </Text>
            <Text> </Text>
          </Text>
        </View>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={{ padding: 25 }}>
          <View>
            <MaterialCommunityIcons
              name="email-search-outline"
              size={30}
              color="white"
              style={{ position: "absolute", top: 8, left: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="next"
              autoCapitalize="none"
              onSubmitEditing={() => this.passwordInput.focus()}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            ></TextInput>
          </View>

          <View>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={30}
              color="white"
              style={{ position: "absolute", top: 8, left: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="go"
              secureTextEntry
              autoCapitalize="none"
              ref={(input) => (this.passwordInput = input)}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            ></TextInput>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
              <Text
                style={{ color: "#639dff", fontWeight: "500", fontSize: 17 }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  color: "#639dff",
                  fontWeight: "500",
                  fontSize: 17,
                }}
              >
                New?
                <Text style={{ textDecorationLine: "underline" }}>
                  {" "}
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#639dff",
  },
  title: {
    fontSize: 25,
    textAlign: "center",

    color: "white",
    fontWeight: "500",
    fontWeight: "bold",

    fontFamily: "sans-serif-condensed",
  },
  form: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  input: {
    marginBottom: 20,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "white",
    paddingLeft: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: "white",
  },
  button: {
    backgroundColor: "white",

    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    paddingHorizontal: 10,
    borderRadius: 10,

    padding: 15,
    height: 45,
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
