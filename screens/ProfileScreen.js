import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import Fire from "../Fire";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox-v2";
import { LinearGradient } from "expo-linear-gradient";
import UserPermissions from "../utilities/UserPermissions";
import Spinner from "react-native-loading-spinner-overlay";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import * as ImagePicker from "expo-image-picker";
import FirebaseKeys from "../config.js";
import firebase, { database } from "firebase";
import { BackHandler } from "react-native";
import NetInfo from "@react-native-community/netinfo";

require("firebase/firestore");

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default class ProfileScreen extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.backButtonClick = this.backButtonClick.bind(this);
  }
  get firestore() {
    return firebase.firestore();
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    errorMessage: null,
    secureTextEntry: true,
    loading: false,
    online: false,
  };

  _isMmounted = false;
  unsubscribe = null;

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
    //console.log(this.state.user.avatar);
  };

  uploadPhotoAsync = (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filename).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  updateUser = async (user) => {
    if (this.state.online == true) {
      this.setState({ loading: true });
      this._isMmounted = true;
      let remoteUri = null;
      try {
        let db = this.firestore.collection("users").doc(this.uid);
        if (user.avatar) {
          remoteUri = await this.uploadPhotoAsync(
            user.avatar,
            `avatars/${this.uid}`
          );
          if (this.mounted) {
            let post = this.firestore.collection("posts");
            post
              .where("uid", "==", this.uid)
              .get()
              .then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((item) => {
                    post.doc(item.id).update({ avatar: remoteUri });
                  });
                }
              });
            //console.log(db);
            db.update({ avatar: remoteUri });
            this.setState({ loading: false });
          }
        }
      } catch (error) {
        alert(`${error}`);
        this.setState({ loading: false });
      }
      return () => {
        this._isMounted = false;
      };
    } else {
      Alert.alert("No connection", "Check your internet connection.");
    }
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
    BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
    const user = Fire.shared.uid;

    this.unsubscribe = await Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ user: doc.data() });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.mounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
  }

  backButtonClick() {
    return this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <SafeAreaView>
          <Spinner
            visible={this.state.loading}
            textContent={"Updating avatar..."}
            color="#639dff"
            textStyle={{ color: "#639dff" }}
          />
          <ModernHeader
            backgroundColor="#63003d"
            height={50}
            text={this.state.user.name}
            textStyle={{
              color: "white",
              //fontFamily: "DancingScript-Bold",
              //fontWeight: "bold",
              fontSize: 20,
            }}
            leftIconComponent={
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <MaterialCommunityIcons
                  name="home-heart"
                  size={35}
                  color="#fff"
                />
              </TouchableOpacity>
            }
            rightIconComponent={
              <TouchableOpacity
                onPress={() =>
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
                  )
                }
              >
                <Feather name="log-out" size={28} color="#fff" />
              </TouchableOpacity>
            }
          />
        </SafeAreaView>

        {/* <Loader loading={this.state.loading} /> */}
        <View style={{ marginTop: 64, alignItems: "center" }}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={this.handlePickAvatar}>
              <Image
                source={
                  this.state.user.avatar
                    ? { uri: this.state.user.avatar }
                    : require("../assets/tempAvatar.jpg")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.signIn]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: "#63003d",

                  textAlign: "center",
                },
              ]}
            >
              You can update your profile picture by tapping on your image
              above.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => this.updateUser(this.state.user)}
            style={[styles.signIn2]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#fff",
                  // textDecorationLine:"underline",
                  textAlign: "center",
                  alignSelf: "center",
                  alignContent: "center",

                  alignItems: "center",
                  //
                  borderRadius: 10,
                  padding: 5,
                },
              ]}
            >
              Confirm new chosen avatar
              <Text style={{ textDecorationLine: "none" }}></Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 15,
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{ textAlign: "center", color: "#63003d", padding: 5 }}>
            {`Proud Eleph memeber since: ${moment(this.state.user.timestamp)
              .toDate()
              .toDateString()} `}
          </Text>
          <MaterialCommunityIcons name="elephant" size={20} color="#63003d" />
        </View>

        <TouchableOpacity
          style={styles.signIn}
          onPress={() => {
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
          }}
        >
          <LinearGradient colors={["#63003d", "#63003d"]} style={styles.signIn}>
            <Text
              style={[
                styles.textSign,
                {
                  color: "#fff",
                },
              ]}
            >
              Log out
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    marginTop: 64,
    alignItems: "center",
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 30,
    shadowOpacity: 0.4,
  },
  avatar: {
    width: 135,
    height: 135,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: "#63003d",
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    justifyContent: "space-between",
    margin: 32,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statAmount: {
    color: "#4F566D",
    fontSize: 18,
    fontWeight: "300",
  },
  statTitle: {
    color: "#C3C5CD",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    padding: 14,
  },
  signIn2: {
    alignContent: "center",
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#63003d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
    backgroundColor: "#63003d",
  },
});
