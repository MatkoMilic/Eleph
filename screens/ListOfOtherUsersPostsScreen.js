import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import * as Linking from "expo-linking";
import moment from "moment";

import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  Entypo,
} from "@expo/vector-icons";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { BackHandler } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";

import styled from "styled-components/native";
import { DrawerActions, createDrawerNavigator } from "react-navigation-drawer";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import Fire from "../Fire";
import Loader from "../components/Loader";

import { Foundation, AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import Comments from "./CommentsScreen";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { AppLoading } from "expo";
import NetInfo from "@react-native-community/netinfo";
import Animated from "react-native-reanimated";
import * as Font from "expo-font";

import { SocialIcon } from "react-native-elements";
import firebase, { database } from "firebase";
import { NavigationEvents } from "react-navigation";
import { Feather } from "@expo/vector-icons";

import Lightbox from "react-native-lightbox-v2";

require("firebase/firestore");

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const Row = styled.View`
  flex-direction: row;
  background: #ffffff;
  width: 100%;
  padding: 11px;
  align-items: center;
`;

//const { Value, timing } = Animated;
const HEADER_HEIGHT = 100;

//const { Value, timing } = Animated;
const scrollY = new Animated.Value(0);
const diffClamp = Animated.diffClamp(scrollY, 0, 100);
//const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 100);
const translateY = Animated.interpolate(diffClamp, {
  inputRange: [0, 100],
  outputRange: [0, -100],
});

const _header_opacity = Animated.interpolate(diffClamp, {
  inputRange: [0, 0],
  outputRange: [1, 0],
  extrapolate: "clamp",
});

let customFonts = {
  "Lobster-Regular": require("../assets/fonts/Lobster-Regular.ttf"),
};

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = false;
    this.backButtonClick = this.backButtonClick.bind(this);
  }

  state = {
    loading: true,
    limit: 2,
    post: [],
    comments: [],
    user: [],
    connection_status: false,
    isMoreLoading: false,

    isLoading: false,
    lastDoc: null,
    mood: null,
    fontsLoaded: false,
    chosenId: 0,
    pickedUser: "",
    hugged: false,
    isSelected: true,
    refresh: true,
    selectedId: null,
    hugged: [],
    postHugs: [],
    modalVisibleMood: false,
    modalVisiblePositivity: false,
    modalVisibleLiked: false,
    chosenUser: "",
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
    this.setState({
      chosenUser: this.props.navigation.state.params.chosenUser,
    });

    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange
    );
    this._loadFontsAsync();
    this.getPosts();
    //this.checkIfHugged();
    //const user = Fire.shared.uid;

    Fire.shared.firestore
      .collection("users")
      .doc(this.props.navigation.state.params.chosenUser)
      .onSnapshot((doc) => {
        this.setState({ loading: false, user: doc.data() });
      });
  }

  getPosts = async () => {
    this.setState({ isLoading: true });

    //console.log(this.state.chosenUser)

    let newpost = [];

    const snapshot = await firebase
      .firestore()
      .collection("posts")
      .where("uid", "==", this.props.navigation.state.params.chosenUser)
      .orderBy("id", "desc")
      .limit(8)
      .get();

    let neededArray = [];
    if (!snapshot.empty) {
      this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

      const hugDocument = await firebase
        .firestore()
        .collection("hugs")
        .where("userHandle", "==", this.uid)
        .get();

      for (let i = 0; i < hugDocument.docs.length; i++) {
        neededArray.push(hugDocument.docs[i].data());
      }

      //   var lets = [];

      for (let i = 0; i < snapshot.docs.length; i++) {
        newpost.push(snapshot.docs[i].data());

        //lets.push(snapshot.docs[i].data().id)

        //newpost[i].username = result;
        //newpost[i].userHandle = [result]; //your new object here
      }
      function test(arr1, arr2) {
        let em = [];
        arr2.forEach(({ id }) => (em[id] = 1));
        return arr1.map((el) => {
          em[el.id] ? (el.liked = true) : null;
          return el;
        });
      }

      const hugDocument5 = firebase
        .firestore()
        .collection("hugs")
        .where("userHandle", "==", this.uid)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "modified" || change.type === "added") {
              neededArray = [...neededArray, change.doc.data()];

              return neededArray;
              //console.log(neededArray);
            }
          });
        });

      const snapshot5 = firebase
        .firestore()
        .collectionGroup("posts")
        .where("uid", "==", this.uid)
        .orderBy("id", "desc")
        .limit(15)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "modified" || change.type === "added") {
              newpost = [...newpost, change.doc.data()];
              return newpost;
              //console.log(neededArray);
            }
          });
        });

      newpost = test(newpost, neededArray);

      this.setState({ post: [...newpost] });
      //console.log(this.state.post)
    } else {
      this.setState({ lastDoc: null });
    }

    this.setState({ isLoading: false });
  };

  onCommentsReceived = (comments) => {
    try {
      this.setState({ comments: comments });
    } catch (error) {
      Alert.alert(
        "Comments failed to load, you need to check your internet connection."
      );
    }
  };

  FindAuthorOfPost = async () => {};

  postComment = async (id) => {
    var comments = [];

    const db = Fire.shared.firestore;
    const commentIDs = await db.collection("comments").get();

    var mojiIdovi = [];
    for (let i = 0; i < commentIDs.size; i++) {
      var nesto = commentIDs.docs[i].id;

      mojiIdovi.push(commentIDs.docs[i].id);
      var commentId = commentIDs.docs[i].id;
    }

    firebase
      .firestore()
      .collection("comments")
      .where("postId", "==", id)
      .orderBy("id", "desc")
      .limit(4)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const CommentItem = doc.data();
          CommentItem.id = doc.id;
          comments.push(CommentItem);
        }, this.setState({ comments: comments }));

        this.props.navigation.navigate("Comments", {
          comments: this.state.comments,
          chosenId: id,
        });
      });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
    //this.unsubscribe();
    //NetInfo.removeEventListener(this.handleConnectivityChange);
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  _handleConnectivityChange = (state) => {
    this.setState({
      connection_status: state.isConnected,
    });
    if (this.state.connection_status == "Disconnected") {
      Alert.alert(
        "In order for Eleph to maintain its maximum secuirty level as well as function properly an internet connection is necessary."
      );
    }
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  getMore = async () => {
    let check = {};
    check = this.state.lastDoc;

    if (check) {
      this.setState({ isMoreLoading: true });
      let newpost = [];

      setTimeout(async () => {
        const snapshot = await firebase
          .firestore()
          .collection("posts")
          .where("uid", "==", this.props.navigation.state.params.chosenUser)
          .orderBy("id", "desc")

          .startAfter(check.data().id)
          .limit(2)
          .get();

        let neededArray = [];
        const hugDocument = await firebase
          .firestore()
          .collection("hugs")
          .where("userHandle", "==", this.uid)
          .get();

        for (let i = 0; i < hugDocument.docs.length; i++) {
          neededArray.push(hugDocument.docs[i].data());
        }

        for (let i = 0; i < snapshot.docs.length; i++) {
          newpost.push(snapshot.docs[i].data());
        }
        function test(arr1, arr2) {
          let em = [];
          arr2.forEach(({ id }) => (em[id] = 1));
          return arr1.map((el) => {
            em[el.id] ? (el.liked = true) : null;
            return el;
          });
        }

        const hugDocument5 = firebase
          .firestore()
          .collection("hugs")
          .where("userHandle", "==", this.uid)
          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "modified" || change.type === "added") {
                neededArray = [...neededArray, change.doc.data()];
                return neededArray;
                //console.log(neededArray);
              }
            });
          });

        newpost = test(newpost, neededArray);

        if (!snapshot.empty) {
          newpost = this.state.post;

          this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

          for (let i = 0; i < snapshot.docs.length; i++) {
            newpost.push(snapshot.docs[i].data());
          }

          this.setState({ post: [...newpost] });

          if (snapshot.docs.length < 2) this.setState({ lastDoc: null });
        } else {
          this.setState({ lastDoc: null });
        }

        this.setState({ isMoreLoading: false });
      }, 1000);
    }

    this.onEndReachedCalledDuringMomentum = true;
  };

  hugPost = async (id, index) => {
    let documentID = "";
    //console.log(id);
    const hugDocument = firebase
      .firestore()
      .collection("hugs")
      .where("userHandle", "==", this.uid)
      .where("id", "==", id)
      .limit(1);

    const posts = firebase.firestore().collection("posts");
    const snapshot = await posts.where("id", "==", id).get();
    if (snapshot.empty) {
      //console.log('No matching documents.');
      return;
    }

    snapshot.forEach((doc) => {
      documentID = doc.id;
      //radi:
      //console.log(documentID);
    });

    const postDocument5 = firebase.firestore().doc(`/posts/${documentID}`);

    let postData;

    postDocument5
      .get()
      .then((doc) => {
        if (doc.exists) {
          postData = doc.data();
          //console.log("DDDDDDDDDDDDDD");
          postData.postId = doc.id;
          return hugDocument.get();
        } else {
          return alert(
            "Post not found"
            //console.log(err)
          );
        }
      })
      .then((data) => {
        if (data.empty) {
          return firebase
            .firestore()
            .collection("hugs")
            .add({
              id: id,
              userHandle: this.uid,
            })
            .then(() => {
              postData.hugCount++;
              return postDocument5.update({ hugCount: postData.hugCount });
            })
            .then(() => {
              return postData;
            });
        } else {
          //this.setState({liked: true});
          return alert(
            'Did you ever manage to "unhug someone"? You cannot unhug.'
            //JSON.stringify(err)
          );
        }
      })
      .catch((err) => {
        alert(
          "Something went wrong, check your internet connection please"
          //err
        );
      });
  };

  setModalVisibleMood = (visible) => {
    this.setState({ modalVisibleMood: visible });
  };

  listEmptyComponent = () => {
    return (
      <View>
        <Text style={{ textAlign: "center", color: "#639dff" }}>
          {`${this.state.user.name} never wrote a post.`}
        </Text>
      </View>
    );
  };

  backButtonClick() {
    return this.props.navigation.navigate("Home");
  }

  renderPost = (post, mood, props, index) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: "#FFF",
            //borderRadius: 18,
            //borderTopWidth: 1,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,

            margin: 8,
            marginVertical: 6,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 3.5 }}>
              <View
                style={{
                  padding: 8,
                  flexDirection: "row",
                  //justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                      post.avatar
                        ? { uri: post.avatar }
                        : require("../assets/tempAvatar.jpg")
                    }
                    style={styles.avatar}
                  />
                </Lightbox>

                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.name}>{post.name}</Text>
                  <Text style={styles.timestamp}>
                    {moment(post.timestamp).toDate().toDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.post}>
                {post.text == "" ? (
                  <Text style={{ fontStyle: "italic" }}>*chose silence*</Text>
                ) : (
                  post.text
                )}
              </Text>
              {/* <Image
            source={post.image && { uri: post.image }}
            source={post.image}
            style={styles.postImage}
            resizeMode="cover"
          /> */}

              <View
                style={{
                  width: "95%",
                  //padding: 6,
                  borderBottomColor: "#EBECF4",
                  borderBottomWidth: 2,
                  alignSelf: "center",
                }}
              />

              <View
                style={{
                  //flex: 1,
                  //alignSelf: "flex-start",
                  //",
                  alignItems: "center",
                  justifyContent: "space-between",

                  //paddingLeft: 22,
                  //paddingRight: 20,
                  backgroundColor: "white",
                  flexDirection: "row",
                  padding: 6,
                  marginTop: 5,
                  marginRight: 5,
                  //borderRadius: 18,
                  //padding: 0,
                  //margin: 0,

                  alignSelf: "auto",
                  //padding: 8,
                  //paddingTop: 30,
                  //paddingBottom: 0,
                  //marginVertical: 0,
                }}
              >
                <TouchableOpacity
                  //onPress={() => this.hugPost(post.id, index)}
                  onPress={() => this.hugPost(post.id)}
                >
                  <View style={{ flexDirection: "row" }}>
                    {post.liked == true ? (
                      <MaterialCommunityIcons
                        name="elephant"
                        size={24}
                        color="#639dff"
                        style={{ transform: [{ rotate: "350deg" }] }}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="elephant"
                        size={24}
                        color="#63003d"
                      />
                    )}

                    <Text>{` Hugs ${post.hugCount}`}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.postComment(post.id)}>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome5
                      name="hands-helping"
                      size={19}
                      color="#63003d"
                    />
                    <Text adjustsFontSizeToFit>
                      {` Comforts ${post.commentCount}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                borderLeftWidth: 2,
                borderLeftColor: "#EBECF4",
                height: "80%",
                //padding: 5,
                alignSelf: "center",
                //margin: 10,
              }}
            ></View>

            <View
              style={{
                //(
                justifyContent: "center",
                overflow: "hidden",
                flex: 1,
                padding: 8,
                //margin: 8,
                //marginVertical: 6,
                //borderWidth: 4,
                alignItems: "center",
              }}

              // post.mood == 1
              //   ? styles.mood1
              //   : post.mood == 2
              //   ? styles.mood2
              //   : post.mood == 3
              //   ? styles.mood3
              //   : post.mood == 4
              //   ? styles.mood4
              //   : styles.mood5,
              // ),
            >
              <Text style={{ position: "absolute", top: 0, padding: 8 }}>
                Mood
              </Text>

              {/* <MaterialCommunityIcons
                  name="emoticon-neutral"
                  size={40}
                  color="yellow"
                /> */}
              {/* if (item.theme === 1) {
    return this.renderTheme1({ item });
  } */}

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {post.mood == 1 ? (
                  <View
                    style={{
                      backgroundColor: "#639dff",
                      //width: 80,
                      //height: 80,
                      borderRadius: 80 / 2,
                      //borderWidth: 4,
                      //borderColor: "green",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibleMood(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-excited"
                        size={45}
                        color="green"
                      />
                    </TouchableOpacity>
                  </View>
                ) : post.mood == 2 ? (
                  <View
                    style={{
                      backgroundColor: "#639dff",
                      //width: 80,
                      //height: 80,
                      borderRadius: 80 / 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibleMood(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-happy"
                        size={45}
                        color="#90EE90"
                      />
                    </TouchableOpacity>
                  </View>
                ) : post.mood == 3 ? (
                  <View
                    style={{
                      backgroundColor: "#639dff",
                      //width: 80,
                      //height: 80,
                      borderRadius: 80 / 2,
                      //borderWidth: 1,
                      //borderColor: "yellow",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibleMood(true);
                      }}
                      onPressOut={() => {
                        this.setModalVisibleMood(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-neutral"
                        size={45}
                        color="yellow"
                      />
                    </TouchableOpacity>
                  </View>
                ) : post.mood == 4 ? (
                  <View
                    style={{
                      backgroundColor: "#639dff",
                      //width: 80,
                      //height: 80,
                      borderRadius: 80 / 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibleMood(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-sad"
                        size={45}
                        color="orange"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#639dff",
                      //width: 80,
                      //height: 80,
                      borderRadius: 80 / 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisibleMood(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-cry"
                        size={45}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  bottom: 0,
                  padding: 8,
                  justifyContent: "space-between",
                  marginTop: 5,
                  marginRight: 5,

                  alignSelf: "auto",
                  alignItems: "center",
                }}
              >
                {post.optimistic == "no" ? (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("", "Users positivity about tomorrow.");
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome
                        name="check-square"
                        size={24}
                        color="#E8E8E8"
                      />
                      <FontAwesome name="minus-square" size={24} color="red" />
                    </View>
                  </TouchableOpacity>
                ) : post.optimistic == "yes" ? (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("", "Users positivity about tomorrow.");
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome
                        name="check-square"
                        size={24}
                        color="green"
                      />
                      <FontAwesome
                        name="minus-square"
                        size={24}
                        color="#E8E8E8"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("", "Users positivity about tomorrow.");
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome
                        name="check-square"
                        size={24}
                        color="#E8E8E8"
                      />
                      <FontAwesome
                        name="minus-square"
                        size={24}
                        color="#E8E8E8"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  onRefresh = () => {
    setTimeout(() => {
      this.getPosts();
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

  // renderComments = (comments) => {
  //   <View>
  //     <FlatList
  //       data={this.state.comments}
  //       renderItem={({ item }) => (
  //         <View>
  //           <Text> {item.body} </Text>
  //         </View>
  //       )}
  //       keyExtractor={(item, index) => item.id}
  //     />
  //   </View>;
  // };

  // xDD = () => {
  //   return (
  //     <View>
  //       <Test></Test>
  //     </View>
  //   );
  // };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  render() {
    if (this.state.fontsLoaded) {
      const { height } = Dimensions.get("window");
      const { modalVisibleMood } = this.state;
      return (
        <View style={{ flex: 1, backgroundColor: "#EBECF4" }}>
          <StatusBar backgroundColor="#639dff" barStyle="light-content" />
          <NavigationEvents onWillFocus={() => {}} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleMood}
            onRequestClose={() => {
              this.setModalVisibleMood(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text></Text>
                <Text style={styles.modalText}>
                  These icons represent users mood, where users of Eleph can
                  choose one of the 5 icons.
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="emoticon-excited"
                    size={45}
                    color="green"
                  />
                  <MaterialCommunityIcons
                    name="emoticon-happy"
                    size={45}
                    color="#90EE90"
                  />
                  <MaterialCommunityIcons
                    name="emoticon-neutral"
                    size={45}
                    color="yellow"
                  />
                  <MaterialCommunityIcons
                    name="emoticon-sad"
                    size={45}
                    color="orange"
                  />
                  <MaterialCommunityIcons
                    name="emoticon-cry"
                    size={45}
                    color="red"
                  />
                </View>
                <Text></Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisibleMood(!modalVisibleMood);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          {/* <Loader loading={this.state.loading} /> */}
          <StatusBar backgroundColor="#63003d" barStyle="light-content" />
          <SafeAreaView>
            <ModernHeader
              backgroundColor="#639dff"
              height={50}
              text={`${this.state.user.name}'s posts`}
              textStyle={{
                color: "white",
                //fontFamily: "Lobster-Regular",
                //fontWeight: "bold",
                fontSize: 15,
              }}
              leftIconComponent={
                <Lightbox
                  activeProps={{
                    width: WINDOW_WIDTH,
                    height: WINDOW_HEIGHT,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    resizeMode: "contain",
                    flex: 1,
                    //marginLeft: 8,
                  }}
                  swipeToDismiss
                >
                  <Image
                    source={
                      this.state.user.avatar
                        ? { uri: this.state.user.avatar }
                        : require("../assets/tempAvatar.jpg")
                    }
                    style={styles.avatar}
                  />
                </Lightbox>
              }
              rightIconComponent={
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <Feather
                    name="home"
                    size={25}
                    color="#fff"
                    style={{
                      //marginRight: 8,
                      marginBottom: 8,
                      //marginLeft: 8,
                      marginTop: 8,
                      //borderColor: "#63003d",
                      //borderWidth: 2
                    }}
                  ></Feather>
                </TouchableOpacity>
              }
            />
          </SafeAreaView>

          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              //contentInset={{ top: HEADER_HEIGHT }}
              //contentOffset={{ y: -HEADER_HEIGHT }}

              data={this.state.post}
              //keyExtractor={(item, index) => String(index)}
              extraData={this.state.post}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={this.listEmptyComponent}
              style={{
                marginHorizontal: 0,
                marginVertical: 6,
                //margin: 6,
                //position: "relative",
              }}
              renderItem={({ item }) => this.renderPost(item)}
              ListFooterComponent={this.renderFooter}
              //ListHeaderComponent={this.renderHeader}
              refreshControl={
                <RefreshControl
                  style={{ color: "#639dff" }}
                  colors={["#639dff", "#63003d", "#639dff"]}
                  tintColor="#639dff"
                  //colors="#639dff"
                  titleColor="#fff"
                  refreshing={this.state.isLoading}
                  onRefresh={this.onRefresh}
                />
              }
              //ListHeaderComponent={this.renderHeader}
              initialNumToRender={7}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (
                  !this.onEndReachedCalledDuringMomentum &&
                  !this.state.isMoreLoading
                ) {
                  //this.getMore.bind(this);
                  this.getMore();
                  //this.getMore;
                }
              }}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
              onScroll={(e) => {
                scrollY.setValue(e.nativeEvent.contentOffset.y);
              }}
            ></FlatList>
          </SafeAreaView>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF4",
    //position: "relative",
  },
  mood: {
    //backgroundColor: "#63003d",

    //borderTopLeftRadius: 18,
    //borderBottomLeftRadius: 18,
    //borderTopRightRadius: 18,
    //borderBottomRightRadius: 18,
    justifyContent: "center",
    overflow: "hidden",
    flex: 1,
    margin: 8,
    marginVertical: 6,
    //borderWidth: 4,
    alignItems: "center",
  },
  mood1: {
    borderColor: "green",
    flex: 1,
    //backgroundColor: "#63003d",
    overflow: "hidden",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    borderWidth: 4,
    alignItems: "center",
  },
  mood2: {
    borderColor: "#90EE90",
    flex: 1,
    //backgroundColor: "#63003d",
    overflow: "hidden",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    borderWidth: 4,
    alignItems: "center",
  },
  mood3: {
    borderColor: "yellow",
    flex: 1,
    //backgroundColor: "#63003d",
    overflow: "hidden",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    borderWidth: 4,
    alignItems: "center",
  },
  mood4: {
    borderColor: "orange",
    flex: 1,
    //backgroundColor: "#63003d",
    overflow: "hidden",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    borderWidth: 4,
    alignItems: "center",
  },
  mood5: {
    borderColor: "red",
    flex: 1,
    //backgroundColor: "#63003d",
    overflow: "hidden",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: "center",
    borderWidth: 4,
    alignItems: "center",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    //alignItems: "",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  animatedHeader: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10000,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "#454D65",
    fontFamily: "ExtraBold",
    //alignItems: "center",
  },
  feed: {
    marginHorizontal: 0,
    marginVertical: 6,
    //position: "relative",
    //marginTop: 20,
    //flexDirection: "column",
  },
  feedItem: {
    //position: "relative",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 8,
    flexDirection: "row",
    marginVertical: 6,
    alignSelf: "flex-start",
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    marginTop: 15,
    padding: 5,
  },
  items: {},
  row: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    width: "100%",
    //padding: 0 11px,
    padding: 10,
    //marginVertical: 6,
    ////alignSelf: "flex-start",
    //paddingRight: 30,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    //marginRight: 8,
    //marginRight: 8,
    //marginRight: 16,
  },
  loadMoreBtn: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    padding: 8,
    margin: 10,
    color: "#639dff",
    marginVertical: 6,
  },
  btnText: {
    color: "#639dff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  avatarInHeader: {
    width: 36,
    height: 36,
    marginRight: 16,
    borderRadius: 18,
    borderColor: "#63003d",
    borderWidth: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    margin: 5,
    marginTop: 20,
    padding: 8,
    fontSize: 14,
    color: "#838899",
    fontWeight: "bold",
    //////////paddingRight: 16,
  },
  input: {
    //height: 50px;
    //paddingRight: 30,
    //width: "100%",
    //paddingRight: 30,
    //padding: 0 8px;
    alignItems: "center",
  },
  postImage: {
    width: 300,
    height: 80,
    borderRadius: 5,
    marginVertical: 16,
  },
  activityIndicator: {
    paddingVertical: 20,
    borderTopWidth: 0,
    borderTopColor: "#CED0CE",
  },
  Container2: {
    //width: "100%",
    flex: 1,
    //height: 92px;
  },
  divider: {
    width: "100%",
    //height: 0.5px,
    backgroundColor: "#f0f0f0",
  },
  menu: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //height: 42px,
  },
  MenuText: {
    //padding-left: 11px,
    fontWeight: "500",
    fontSize: 12,
  },
  separator: {
    //width: 1px,
    //height: 26px,
    backgroundColor: "#f0f0f0",
  },
  BottomDivider: {
    width: "100%",
    //height: 9px,
    backgroundColor: "#f0f2f5",
  },
});
