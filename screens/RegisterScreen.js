import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import UserPermissions from "../utilities/UserPermissions";
import ExtraDimensions from "react-native-extra-dimensions-android";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import normalize from "react-native-normalize";
import { Entypo } from "@expo/vector-icons";
import Fire from "../Fire";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

export default class RegisterScreen extends React.Component {
  mounted = false;

  static navigationOptions = {
    headerShown: false,
  };

  async componentDidMount() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      let netState = null;
      netState = state.isConnected;
      if (this.mounted) {
        if (state.isConnected) {
          this.setState({ online: netState });
        }
      }
      this.setState({ online: state.isConnected });
    });
    this.mounted = true;
  }

  checkName = () => {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let alpha = /^[a-zA-Z]+$/;
    let check = alpha.test(this.state.name);
    let text;

    if (!this.state.name == "" && check == true) {
      this.state.checkName = true;
    }
  };

  checkMail = () => {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let text;
    if (this.state.user.email == "" && reg.test(text) === false) {
      this.state.checkMail = true;
    }
  };

  updateSecureTextEntry = () => {
    this.state.setData({
      ...this.state.data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  constructor(props) {
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    online: false,
    errorMessage: null,
    checkName: false,
    checkMail: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,

    showPassword: true,
    loading: false,
  };

  validate = () => {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let alpha = /^[a-zA-Z]+$/;
    let check = alpha.test(this.state.name);
    let text;

    if (this.state.user.name.length < 5) {
      this.setState({
        errorMessage: "Username needs to have at least 5 characters",
      });
      return false;
    } else if (this.state.user.name.length > 20) {
      this.setState({
        errorMessage: "Username needs to have less than 21 characters",
      });
      return false;
    } else if (this.state.user.name == "") {
      this.setState({ errorMessage: "Username cant be empty!" });
      return false;
    } else if (!check) {
      this.setState({ errorMessage: "Username field must be alphabetic" });
      return false;
    } else if (this.state.user.password.length < 6) {
      this.setState({
        errorMessage: "Password needs to have at least 6 characters",
      });
      return false;
    } else if (this.state.user.password.length > 20) {
      this.setState({
        errorMessage: "Password needs to have less than 21 characters.",
      });
      return false;
    } else if (this.state.user.password == "") {
      this.setState({ errorMessage: "Password cant be empty!" });
      return false;
    } else if (this.state.user.email == "") {
      this.setState({ errorMessage: "Email cant be empty!" });
      return false;
    } else if (reg.test(text) === true) {
      this.setState({ errorMessage: "Email must be a proper email!" });
      return false;
    }
    return true;
  };

  createUser = () => {
    if (this.state.online == true) {
      this.setState({ loading: true });

      const isValid = this.validate();
      if (isValid) {
        Fire.shared.createUser(this.state.user);
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    } else {
      Alert.alert("No connection", "Check your internet connection.");
    }
  };

  handlePickAvatar = async () => {
    UserPermissions.getCameraPermission();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
  };

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  //   //metoda za pokretanje "Secret" ekrana:
  //   lastTap = 0;
  //   handleDoubleTap = () => {
  //     const now = Date.now();
  //     const DOUBLE_PRESS_DELAY = 300;
  //     if (this.lastTap && (now - this.lastTap) * 2.7 < DOUBLE_PRESS_DELAY) {
  //       this.props.navigation.navigate("Secret");
  //     } else {
  //       this.lastTap = now;
  //     }
  //   };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={"Creating..."}
          color="#639dff"
          textStyle={{ color: "#639dff" }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.state.loading && <ActivityIndicator color={"#fff"} />}
        </View>
        <StatusBar backgroundColor="#639dff" barStyle="light-content" />
        <View style={styles.header}>
          {/* <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
        ></TouchableOpacity> */}
          <Text style={styles.text_header}>Register to Eleph</Text>
        </View>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <Text style={styles.text_footer}>Choose your avatar</Text>
            <TouchableOpacity onPress={this.handlePickAvatar}>
              <View style={styles.action}>
                <MaterialCommunityIcons
                  name="image-search-outline"
                  size={25}
                  color="black"
                />
                <Text style={{ paddingLeft: 10, color: "#639dff" }}>
                  Search Image
                </Text>
                <Image
                  source={{ uri: this.state.user.avatar }}
                  style={styles.avatar}
                />
              </View>
            </TouchableOpacity>

            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 30,
                },
              ]}
            >
              Username
            </Text>

            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={25} />
              <TextInput
                placeholder="Full Name"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(name) =>
                  this.setState({
                    user: { ...this.state.user, name: name.trim() },
                  })
                }
                placeholderTextColor="#639dff"
                value={this.state.user.name}
              />
            </View>

            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 30,
                },
              ]}
            >
              Email
            </Text>
            <View style={styles.action}>
              <MaterialCommunityIcons
                name="email-edit-outline"
                color="#05375a"
                size={25}
              />
              <TextInput
                placeholder="Your Email"
                name="email"
                type="email"
                style={styles.textInput}
                autoCapitalize="none"
                placeholderTextColor="#639dff"
                //placeholder="Email Address"
                onChangeText={(email) =>
                  this.setState({
                    user: { ...this.state.user, email: email.trim() },
                  })
                }
                value={this.state.user.email}
              />
            </View>

            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 30,
                },
              ]}
            >
              Password
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#05375a" size={25} />
              <TextInput
                placeholder="Your Password"
                secureTextEntry={this.state.showPassword}
                placeholderTextColor="#639dff"
                style={styles.textInput}
                autoCapitalize="none"
                value={this.state.user.password}
                onChangeText={(password) =>
                  this.setState({
                    user: { ...this.state.user, password: password.trim() },
                  })
                }
              />

              <TouchableOpacity onPress={this.toggleSwitch}>
                {this.state.showPassword ? (
                  <Feather name="eye-off" color="#639dff" size={20} />
                ) : (
                  <Feather name="eye" color="#639dff" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                By signing up you agree to our
              </Text>
              <Text> </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("TermsAndConditions")
                }
              >
                <Text
                  style={[
                    {
                      fontWeight: "bold",
                      color: "#639dff",
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  Terms and Conditions
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity style={styles.signIn} onPress={this.createUser}>
                <LinearGradient
                  colors={["#639dff", "#639dff"]}
                  style={styles.signIn}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: "#fff",
                      },
                    ]}
                  >
                    Sign Up
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={[
                  styles.signIn,
                  {
                    borderColor: "#639dff",
                    borderWidth: 2,
                    marginTop: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "#639dff",
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#639dff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  errorMessage: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textPrivate: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  color_textPrivate: {
    color: "grey",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#E1E2E6",
    borderRadius: 50,
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50,
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
    marginLeft: 20,
  },
});
