import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationEvents } from "react-navigation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay";
import Feather from "react-native-vector-icons/Feather";
import Fire, { getUsers } from "../Fire";
import * as ImagePicker from "expo-image-picker";
import FirebaseKeys from "../config";
import { AntDesign } from "@expo/vector-icons";
import firebase, { database } from "firebase";
import Lightbox from "react-native-lightbox-v2";
import { string } from "react-native-redash";
import * as Animatable from "react-native-animatable";
import AwesomeAlert from "react-native-awesome-alerts";
import { TouchableHighlight } from "react-native-gesture-handler";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
require("firebase/firestore");

let customFonts = {
  "Raleway-Italic": require("../assets/fonts/Raleway-Italic.ttf"),
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default class PostScreen extends React.Component {
  mounted = false;
  _isMounted = false;
  constructor(props) {
    super(props);

    this.touchProps = {
      activeOpacity: 1,
      underlayColor: "blue",
      style: this.state.pressed === true ? styles.btnPress : styles.btnNormal,
      onHideUnderlay: () => this.setState({ pressed: false }),
      onShowUnderlay: () => this.setState({ pressed: true }),
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(FirebaseKeys);
    }
  }

  state = {
    text: "",

    mood: null,
    user: {},
    avatar: null,
    name: "",
    id: "",
    specialid: null,
    pressed: "false",
    optimistic: "neutral",
    lastDocumentsId: null,
    loading: false,
    modalVisibleLoading: false,
    online: false,
  };

  unsubscribe = null;

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    if (this._isMounted) {
      this.setState({ fontsLoaded: true });
    }
  }

  componentDidMount() {
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
    this._isMounted = true;
    this._loadFontsAsync();

    getUsers(this.onUsersReceived);

    const user = Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ user: doc.data() });

        if (doc.exists) {
          this.setState({
            avatar: this.state.user.avatar,
            name: this.state.user.name,
          });
        }
      });

    const documentLast = [];
    const testing = firebase
      .firestore()
      .collection("posts")
      .orderBy("id", "desc")
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const { id } = doc.data();
          documentLast.push({ id: id });
          if (this._isMounted) {
            this.setState({ lastDocumentsId: documentLast[0].id });
          }
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this._isMounted = false;
  }

  get firestore() {
    return firebase.firestore();
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }

  addPost = async ({ text, avatar, name }) => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text,

          optimistic: this.state.optimistic,
          hugCount: 0,
          commentCount: 0,
          liked: false,
          mood: this.state.mood,
          id: ++this.state.lastDocumentsId,

          uid: this.uid,
          timestamp: this.timestamp,
          avatar,
          name,
        })
        .then((ref) => {
          res(ref);
        })

        .catch((error) => {
          Alert.alert(`${error}`);
          rej(error);
        });
    });
  };

  conditions = (check) => {
    if (this.state.mood == 0) {
    }
  };

  handlePost = () => {
    if (this.state.online == true) {
      this.setState({ loading: true });

      if (this.state.mood == null) {
        Alert.alert(
          "Warning",
          "Mood cannot be unselected, as it's the main part of a post."
        );
        this.setState({ loading: false });
      } else {
        this.addPost({
          text: this.state.text.trim(),

          mood: this.state.mood,
          avatar: this.state.avatar,
          name: this.state.name,
        })
          .then((ref) => {
            this.setState({
              text: "",
              mood: null,
              optimistic: "neutral",
            });

            this.setState({ loading: false });
            this.props.navigation.navigate("Home", { refresh: true });
            Alert.alert(
              "Success",
              "Post is creating. If you don't see it yet refresh the feed!"
            );
          })
          .catch((error) => {
            this.setState({ loading: false });
            Alert.alert(`${error}`);
          });
      }
    } else {
      Alert.alert("No connection", "Check your internet connection.");
    }
  };

  onUsersReceived = (user) => {
    try {
      if (this._isMounted) {
        this.setState({ user: user });
      }
    } catch (error) {
      Alert.alert(
        "Users failed to load, you need to check your internet connection."
      );
    }
  };

  render() {
    if (this.state.fontsLoaded) {
      return (
        <SafeAreaView style={styles.container}>
          <Header
            containerStyle={{
              justifyContent: "space-around",
              backgroundColor: "#63003d",
            }}
            centerComponent={{
              text: "Post your mood",
              style: {
                color: "white",
                fontFamily: "Lobster-Regular",

                fontSize: 25,
              },
            }}
            leftComponent={
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicons
                  name="md-arrow-back"
                  size={25}
                  color="#fff"
                  style={{
                    marginLeft: 8,
                  }}
                ></Ionicons>
              </TouchableOpacity>
            }
            rightComponent={<TouchableOpacity></TouchableOpacity>}
          />

          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <Spinner
              visible={this.state.loading}
              textContent={"Posting..."}
              color="#639dff"
              textStyle={{ color: "#639dff" }}
            />

            <ScrollView keyboardShouldPersistTaps={"handled"}>
              <View>
                <Text style={styles.text_footer}>You are not alone!</Text>
                <View style={styles.action}>
                  <Lightbox
                    activeProps={{
                      width: WINDOW_WIDTH,
                      height: WINDOW_HEIGHT,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      resizeMode: "contain",
                      flex: 1,
                    }}
                    swipeToDismiss
                  >
                    <Image
                      source={
                        this.state.avatar
                          ? { uri: this.state.avatar }
                          : require("../assets/tempAvatar.jpg")
                      }
                      style={styles.avatar}
                    />
                  </Lightbox>

                  <TextInput
                    autoFocus={true}
                    multiline={true}
                    style={{ flex: 1, marginLeft: 16 }}
                    placeholder="Tell us how are you feeling right now"
                    maxLength={200}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                  ></TextInput>
                </View>
              </View>

              <Text
                style={[
                  styles.text_footer,
                  {
                    marginTop: 30,
                  },
                ]}
              >
                Choose your mood
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 30,
                }}
              >
                <View>
                  {this.state.mood == 1 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-excited"
                          size={45}
                          color="green"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "black",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-excited"
                          size={45}
                          color="white"
                          onPress={() => this.setState({ mood: 1 })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>

                <View>
                  {this.state.mood == 2 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-happy"
                          size={45}
                          color="#90EE90"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "black",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-happy"
                          size={45}
                          color="white"
                          onPress={() => this.setState({ mood: 2 })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>

                <View>
                  {this.state.mood == 3 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",
                        //width: 80,
                        //height: 80,
                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-neutral"
                          size={45}
                          color="yellow"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "black",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-neutral"
                          size={45}
                          color="white"
                          onPress={() => this.setState({ mood: 3 })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>

                <View>
                  {this.state.mood == 4 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-sad"
                          size={45}
                          color="orange"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "black",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-sad"
                          size={45}
                          color="white"
                          onPress={() => this.setState({ mood: 4 })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>

                <View>
                  {this.state.mood == 5 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-cry"
                          size={45}
                          color="red"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "black",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <MaterialCommunityIcons
                          name="emoticon-cry"
                          size={45}
                          color="white"
                          onPress={() => this.setState({ mood: 5 })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>
              </View>
              <Text
                style={[
                  styles.text_footer,
                  {
                    marginTop: 30,
                  },
                ]}
              >
                Are you optimistic about tomorrow? (optional)
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 30,
                }}
              >
                <View>
                  {this.state.optimistic == "yes" ? (
                    <View
                      style={{
                        backgroundColor: "white",
                        //width: 80,
                        //height: 80,
                        //borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <FontAwesome
                          name="check-square"
                          size={40}
                          color="green"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "white",
                        //width: 80,
                        //height: 80,
                        //borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <FontAwesome
                          name="check-square"
                          size={40}
                          color="#E8E8E8"
                          onPress={() => this.setState({ optimistic: "yes" })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>

                <View>
                  {this.state.optimistic == "no" ? (
                    <View
                      style={{
                        backgroundColor: "white",

                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <FontAwesome
                          name="minus-square"
                          size={40}
                          color="red"
                        />
                      </TouchableHighlight>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "white",

                        borderRadius: 80 / 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight>
                        <FontAwesome
                          name="minus-square"
                          size={40}
                          color="#E8E8E8"
                          onPress={() => this.setState({ optimistic: "no" })}
                        />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",

                  marginTop: 10,
                  paddingBottom: 5,
                }}
              >
                <AntDesign
                  name="infocirlce"
                  size={20}
                  color="#63003d"
                  style={{ padding: 2 }}
                />
                <Text style={{ color: "grey", flexWrap: "wrap" }}>
                  Eleph won't ever abuse the data it gets from it's users.
                </Text>
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={this.handlePost}
                >
                  <LinearGradient
                    colors={["#63003d", "#63003d"]}
                    style={styles.signIn}
                  >
                    <Entypo name="open-book" size={24} color="white" />
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: "#fff",
                        },
                      ]}
                    >
                      Post
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animatable.View>
        </SafeAreaView>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#63003d",
  },
  btnNormal: { borderColor: "black" },
  btnPress: {
    borderColor: "orange",
    borderWidth: 2,
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
  behind: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 24,
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text_header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  errorMessage: {
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "#63003d",
    fontSize: 25,
    textAlign: "center",
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
    flexDirection: "row",
    padding: 8,
    margin: 8,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
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
});
