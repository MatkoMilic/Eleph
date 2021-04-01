import React, { Component, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationActions } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import FirebaseKeys from "../config";
import moment from "moment";
//import firebase, { database } from "firebase";
import Fire, { getUsers } from "../Fire";
import { string } from "react-native-redash";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Entypo } from "@expo/vector-icons";
import * as firebase from "firebase";
import Lightbox from "react-native-lightbox-v2";
import { NavigationEvents } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import "firebase/firestore";
import { BackHandler } from "react-native";
require("firebase/firestore");
import NetInfo from "@react-native-community/netinfo";

const scrollY = new Animated.Value(0);
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
export default class ListOfPostsScreen extends React.Component {
  mounted = false;
  _isMounted = false;
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = false;
    this.backButtonClick = this.backButtonClick.bind(this);
  }
  state = {
    text: "",
    user: {},
    avatar: null,
    name: "",
    id: "",
    specialid: null,
    chosenId: 0,
    comments: [],
    isMoreLoading: false,
    isLoading: false,
    lastDoc: null,
    lastDocumentsId: null,
    loading: false,
    online: false,
  };

  unsubscribe = null;

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

    this._isMounted = true;
    this.mounted = true;

    this.setState({ chosenId: this.props.navigation.state.params.chosenId });
    BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);

    this.getComments();
    getUsers(this.onUsersReceived);

    const user = Fire.shared.uid;
    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        this.setState({ user: doc.data() });
        this.setState({
          avatar: this.state.user.avatar,
          name: this.state.user.name,
        });
      });

    const documentLast = [];
    const testing = firebase
      .firestore()
      .collection("comments")
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

  getComments = async () => {
    this.setState({ isLoading: true });

    const snapshot = await firebase
      .firestore()
      .collection("comments")
      .where("postId", "==", this.props.navigation.state.params.chosenId)
      .orderBy("id", "desc")
      .limit(4)
      .get();

    if (!snapshot.empty) {
      let newcomment = [];
      this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });
      for (let i = 0; i < snapshot.docs.length; i++) {
        newcomment.push(snapshot.docs[i].data());
      }
      this.setState({ comments: newcomment });
      //console.log(this.state.comments);
    } else {
      this.setState({ lastDoc: null });
    }

    this.setState({ isLoading: false });
  };

  componentWillUnmount() {
    this.unsubscribe();
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
  }

  backButtonClick() {
    return this.props.navigation.navigate("Home");
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

  get userInfo() {
    return firebase.firestore().collection("users").doc(this.uid);
  }

  addComment = async ({ text, avatar, name }) => {
    let documentID = "";

    const posts = firebase.firestore().collection("posts");

    const snapshot = await posts
      .where("id", "==", this.props.navigation.state.params.chosenId)
      .get();
    if (snapshot.empty) {
      return;
    }

    snapshot.forEach((doc) => {
      documentID = doc.id;
    });
    const postDocument5 = firebase.firestore().doc(`/posts/${documentID}`);
    let postData;

    return new Promise((res, rej) => {
      //this.check();

      this.firestore
        .collection("comments")
        .add({
          text,
          postId: this.state.chosenId,

          id: ++this.state.lastDocumentsId,

          uid: this.uid,
          timestamp: this.timestamp,
          avatar: this.state.avatar,
          name: this.state.name,
        })
        .then((ref) => {
          postDocument5.update({
            commentCount: firebase.firestore.FieldValue.increment(1),
          });
          this.getComments();

          res(ref);
        })
        .catch((error) => {
          Alert.alert(`${error}`);
          rej(error);
        });
    });
  };

  handleComment = () => {
    if (this.state.loading == true) {
      this.setState({ loading: true });
      if (this.state.text.trim() == "") {
        Alert.alert("Warning", "Comment cannot be empty.");
        this.setState({ loading: false });
      } else {
        this.addComment({
          text: this.state.text.trim(),
          avatar: this.state.avatar,
          name: this.state.name,
        })
          .then((ref) => {
            this.setState({
              text: "",
            });
            this.props.navigation.goBack();
            this.setState({ loading: false });
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
      this.setState({ user: user });
      //console.log(this.state.user);
    } catch (error) {
      Alert.alert(
        "Users failed to load, you need to check your internet connection."
      );
    }
  };

  getMore = async () => {
    let check = {};
    check = this.state.lastDoc;

    if (check) {
      this.setState({ isMoreLoading: true });

      setTimeout(async () => {
        let snapshot = await firebase
          .firestore()
          .collection("comments")
          .where("postId", "==", this.props.navigation.state.params.chosenId)
          .orderBy("id", "desc")
          .startAfter(check.data().id)
          .limit(2)
          .get();

        if (!snapshot.empty) {
          let newcomment = this.state.comments;

          this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

          for (let i = 0; i < snapshot.docs.length; i++) {
            newcomment.push(snapshot.docs[i].data());
          }

          this.setState({ comments: newcomment });

          if (snapshot.docs.length < 2) this.setState({ lastDoc: null });
        } else {
          this.setState({ lastDoc: null });
        }

        this.setState({ isMoreLoading: false });
      }, 1000);
    }

    this.onEndReachedCalledDuringMomentum = true;
  };

  onRefresh = () => {
    setTimeout(() => {
      this.getComments();
    }, 1000);
  };

  renderFooter = () => {
    if (!this.state.isMoreLoading) return true;

    return (
      <ActivityIndicator
        size="large"
        color={"#D83E64"}
        style={{ marginBottom: 10 }}
      />
    );
  };

  displayPosts = async (uid) => {
    this.props.navigation.navigate("ListOfOtherUsersPosts", {
      chosenUser: uid,
    });
  };

  renderComments = (comments) => {
    return (
      <View keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
        <View
          keyboardShouldPersistTaps="always"
          style={{
            paddingLeft: 8,
            paddingRight: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: "#E8E8EE",
            margin: 8,
            marginVertical: 6,
            borderRadius: 20,
            flex: 1,
          }}
        >
          <Lightbox
            keyboardShouldPersistTaps="always"
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
                comments.avatar
                  ? { uri: comments.avatar }
                  : require("../assets/tempAvatar.jpg")
              }
              keyboardShouldPersistTaps="always"
              style={{
                width: 45,
                height: 45,
                borderRadius: 30,
              }}
            />
          </Lightbox>

          <View
            keyboardShouldPersistTaps={"handled"}
            style={{ marginLeft: 16, flex: 1 }}
          >
            <View
              keyboardShouldPersistTaps={"handled"}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                keyboardShouldPersistTaps={"handled"}
                onPress={() => this.displayPosts(comments.uid)}
              >
                <Text
                  keyboardShouldPersistTaps={"handled"}
                  style={{ fontSize: 16, fontWeight: "bold", color: "#63003d" }}
                >
                  {comments.name}
                </Text>
              </TouchableOpacity>

              <Text
                keyboardShouldPersistTaps={"handled"}
                style={{ fontSize: 11, color: "#808080" }}
              >
                {/* {Notification.timestamp} */}
                {moment(comments.timestamp).toDate().toDateString()}
              </Text>
            </View>
            <Text
              keyboardShouldPersistTaps={"handled"}
              rkType="primary3 mediumLine"
            >
              {comments.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        keyboardShouldPersistTaps="always"
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <Spinner
          visible={this.state.loading}
          textContent={"Comforting..."}
          color="#639dff"
          textStyle={{ color: "#639dff" }}
        />
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <NavigationEvents onWillFocus={() => {}} />
        <View keyboardShouldPersistTaps="always">
          <View keyboardShouldPersistTaps="always" style={styles.action}>
            <Image
              keyboardShouldPersistTaps="always"
              source={
                this.state.avatar
                  ? { uri: this.state.avatar }
                  : require("../assets/tempAvatar.jpg")
              }
              style={styles.avatar}
            />

            <TextInput
              keyboardShouldPersistTaps="always"
              autoFocus={true}
              multiline={true}
              style={{ flex: 1, color: "black" }}
              placeholder={`Write your comfort here...`}
              placeholderTextColor="#808080"
              onChangeText={(text) => this.setState({ text: text })}
              value={this.state.text}
            ></TextInput>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
              keyboardShouldPersistTaps={"handled"}
              style={{
                marginRight: 8,
                marginBottom: 8,
                marginLeft: 8,
                marginTop: 8,
                width: 48,
                alignItems: "center",
                height: 48,
                backgroundColor: "red",
                borderRadius: 25,
                backgroundColor: "white",
              }}
            >
              <Feather
                name="home"
                size={25}
                color="#63003d"
                style={{
                  marginBottom: 8,

                  marginTop: 8,
                }}
              ></Feather>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={this.handleComment}
            >
              <LinearGradient
                colors={["#63003d", "#63003d"]}
                style={styles.signIn2}
              >
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "white",
                    },
                  ]}
                >
                  Comfort
                </Text>
                <MaterialCommunityIcons
                  name="comment-plus"
                  size={20}
                  color="#fff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        {Object.keys(this.state.comments).length === 0 ? (
          <Text style={{ color: "white", alignContent: "center" }}>
            No comforts yet, be the first!
          </Text>
        ) : (
          <FlatList
            style={{
              backgroundColor: "#ffffff",
              marginHorizontal: 0,
              marginVertical: 6,
            }}
            keyExtractor={(item) => item.id.toString()}
            data={this.state.comments}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            renderItem={({ item }) => this.renderComments(item)}
            ListFooterComponent={this.renderFooter}
            refreshControl={
              <RefreshControl
                style={{ color: "#639dff" }}
                tintColor="#639dff"
                titleColor="#fff"
                refreshing={this.state.isLoading}
                onRefresh={this.onRefresh}
              />
            }
            initialNumToRender={7}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (
                !this.onEndReachedCalledDuringMomentum &&
                !this.state.isMoreLoading
              ) {
                //this.getMore.bind(this);
                ////this.getMore();
                //this.getMore;
              }
            }}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onScroll={(e) => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
          />
        )}
        <View style={styles.button2}>
          <TouchableOpacity style={styles.signIn} onPress={this.getMore}>
            <LinearGradient colors={["#fff", "#fff"]} style={styles.signIn3}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#63003d",
                  },
                ]}
              >
                More Comments
              </Text>
              <Fontisto name="spinner-refresh" size={24} color="#63003d" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    marginHorizontal: 0,
    marginVertical: 2,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    marginBottom: 8,
    marginLeft: 8,
    marginTop: 8,
    borderColor: "#63003d",
    borderWidth: 2,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  time: {
    fontSize: 11,
    color: "#808080",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
    backgroundColor: "red",
  },
  btnNormal: { borderColor: "black" },
  btnPress: {
    borderColor: "orange",
    borderWidth: 2,
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

  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 10,
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

    color: "#63003d",
    fontSize: 25,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,

    borderRadius: 25,
    backgroundColor: "#E8E8EE",
    margin: 8,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    marginTop: 5,
    borderRadius: 1,
  },
  button2: {
    alignItems: "center",
    marginTop: 5,
    borderRadius: 1,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    padding: 8,
    margin: 8,
  },
  signIn2: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    flexDirection: "row",
    padding: 8,
    margin: 8,
  },
  signIn3: {
    borderWidth: 2,
    borderColor: "#63003d",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    flexDirection: "row",
    padding: 8,
    margin: 8,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
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
