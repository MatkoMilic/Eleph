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
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as Linking from "expo-linking";
import moment from "moment";

import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  Entypo,
} from "@expo/vector-icons";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import { NavigationEvents } from "react-navigation";

import styled from "styled-components/native";
import { DrawerActions, createDrawerNavigator } from "react-navigation-drawer";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import Fire from "../Fire";
import { Octicons } from "@expo/vector-icons";
import Loader from "../components/Loader";

import { Foundation, AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import Comments from "./CommentsScreen";
import { AppLoading } from "expo";
import NetInfo from "@react-native-community/netinfo";
import Animated from "react-native-reanimated";
import * as Font from "expo-font";
//import { NetInfo } from "react-native";
import { SocialIcon } from "react-native-elements";
import firebase, { database } from "firebase";
import Lightbox from "react-native-lightbox-v2";
import Spinner from "react-native-loading-spinner-overlay";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";

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
  mounted = false;

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = false;
  }

  state = {
    loading: true,
    limit: 2,
    post: [],
    comments: [],
    user: [],
    connection_Status: "",
    isMoreLoading: false,

    isLoading: false,
    lastDoc: null,
    mood: null,
    fontsLoaded: false,
    chosenId: 0,
    hugged: false,
    isSelected: true,
    refresh: true,
    selectedId: null,
    hugged: [],
    postHugs: [],
    modalVisibleMood: false,
    modalVisiblePositivity: false,
    modalVisibleLiked: false,
    modalVisibleHugged: false,
    modalVisibleHeader: false,
    liking: false,
    isLoading2: false,
    mood: [],
    focus: true,
    online: false,
    loadingHug: false,
  };

  async componentDidMount() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      let netState = null;
      netState = state.isConnected;
      //console.log("Connection type", state.type);
      if (this.mounted) {
        if (state.isConnected) {
          this.setState({ online: netState });
        }
      }

      this.setState({ online: state.isConnected });
      //console.log(this.state.online);
    });

    //unsubscribe();

    this.mounted = true;

    this._loadFontsAsync();

    this.getPosts();
    this.getMoods();

    //this.checkIfHugged();

    const user = Fire.shared.uid;
    Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        if (this.mounted) {
          if (doc.exists) {
            this.setState({ loading: false, user: doc.data() });
          }
        }
      });
  }

  getMoods = async () => {
    if (this.mounted) {
      this.setState({ isLoading2: true });
    }
    let newMood = [];
    const mood = await firebase
      .firestore()
      .collectionGroup("posts")
      .orderBy("id", "desc")
      .limit(16)
      .get()
      .catch((error) => {
        Alert.alert(`Error, Check your internet connection. ${error}`);
      });

    if (!mood.empty) {
      for (let i = 0; i < mood.docs.length; i++) {
        newMood.push(mood.docs[i].data());
      }
      if (this.mounted) {
        this.setState({ mood: [...newMood] });
      }
    }
    if (this.mounted) {
      this.setState({ isLoading2: false });
    }
  };

  getPosts = async () => {
    if (this.mounted) {
      this.setState({ isLoading: true });
      this.setState({ focus: false });
    }

    let newpost = [];

    const snapshot = await firebase
      .firestore()
      .collectionGroup("posts")
      .orderBy("id", "desc")
      .limit(8)
      .get()
      .catch((error) => {
        Alert.alert(`Error, Check your internet connection. ${error}`);
      });

    let neededArray = [];
    if (!snapshot.empty) {
      if (this.mounted) {
        this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });
      }

      const hugDocument = await firebase
        .firestore()
        .collection("hugs")
        .where("userHandle", "==", this.uid)
        .get()
        .catch((error) => {
          Alert.alert(`Error, Check your internet connection. ${error}`);
        });

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
            }
          });
        });

      const snapshot5 = firebase
        .firestore()
        .collectionGroup("posts")
        .orderBy("id", "desc")

        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "modified" || change.type === "added") {
              newpost = [...newpost, change.doc.data()];
              return newpost;
            }
          });
        });

      newpost = test(newpost, neededArray);

      if (this.mounted) {
        this.setState({ post: [...newpost] });
      }
    } else {
      if (this.mounted) {
        this.setState({ lastDoc: null });
      }
    }
    if (this.mounted) {
      this.setState({ isLoading: false });
    }
  };

  postComment = async (id) => {
    //console.log(id);
    var comments = [];

    const db = Fire.shared.firestore;
    const commentIDs = await db
      .collection("comments")
      .get()
      .catch((error) => {
        Alert.alert(`Error, Check your internet connection. ${error}`);
      });

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

          if (this.mounted) {
            this.setState({ comments: comments });
          }
        });

        this.props.navigation.navigate("Comments", {
          comments: this.state.comments,
          chosenId: id,
        });
      })
      .catch((error) => {
        Alert.alert(`Error, Check your internet connection. ${error}`);
      });
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    if (this.mounted) {
      this.setState({ fontsLoaded: true });
    }
  }

  getMore = async () => {
    let check = {};
    check = this.state.lastDoc;

    if (check) {
      if (this.mounted) {
        this.setState({ isMoreLoading: true });
      }
      let newpost = [];

      setTimeout(async () => {
        const snapshot = await firebase
          .firestore()
          .collection("posts")
          .orderBy("id", "desc")

          .startAfter(check.data().id)
          .limit(2)
          .get()
          .catch((error) => {
            Alert.alert(`Error, Check your internet connection. ${error}`);
          });

        let neededArray = [];
        const hugDocument = await firebase
          .firestore()
          .collection("hugs")
          .where("userHandle", "==", this.uid)
          .get()
          .catch((error) => {
            Alert.alert(`Error, Check your internet connection. ${error}`);
          });

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
              }
            });
          });

        const snapshot5 = firebase
          .firestore()
          .collectionGroup("posts")
          .orderBy("id", "desc")

          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "modified" || change.type === "added") {
                newpost = [...newpost, change.doc.data()];
                return newpost;
              }
            });
          });

        if (!snapshot.empty) {
          newpost = this.state.post;

          if (this.mounted) {
            this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });
          }

          for (let i = 0; i < snapshot.docs.length; i++) {
            newpost.push(snapshot.docs[i].data());
          }
          //console.log(newpost);
          newpost = test(newpost, neededArray);
          if (this.mounted) {
            this.setState({ post: [...newpost] });
          }

          if (snapshot.docs.length < 2) {
            if (this.mounted) {
              this.setState({ lastDoc: null });
            }
          }
        } else {
          if (this.mounted) {
            this.setState({ lastDoc: null });
          }
        }

        if (this.mounted) {
          this.setState({ isMoreLoading: false });
        }
      }, 1000);
    }

    this.onEndReachedCalledDuringMomentum = true;
  };

  hugPost = async (id, index) => {
    if (this.state.online == true) {
      this.setState({ loadingHug: true });

      let documentID = "";
      //console.log(id);
      const hugDocument = firebase
        .firestore()
        .collection("hugs")
        .where("userHandle", "==", this.uid)
        .where("id", "==", id)
        .limit(1);

      const posts = firebase.firestore().collection("posts");
      const snapshot = await posts
        .where("id", "==", id)
        .get()
        .catch((error) => {
          Alert.alert(`Error, Check your internet connection. ${error}`);
        });
      if (snapshot.empty) {
        this.setState({ loadingHug: false });

        return;
      }

      snapshot.forEach((doc) => {
        documentID = doc.id;
      });

      const postDocument5 = firebase.firestore().doc(`/posts/${documentID}`);

      let postData;

      postDocument5
        .get()
        .then((doc) => {
          if (doc.exists) {
            postData = doc.data();

            postData.postId = doc.id;
            return hugDocument.get().catch((error) => {
              Alert.alert(`Error, Check your internet connection. ${error}`);
              this.setState({ loadingHug: false });
            });
          } else {
            return alert(
              "Post not found",
              this.setState({ loadingHug: false })
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
                if (this.mounted) {
                  this.setState({ liking: true });
                }
                //postData.hugCount++;
                return (
                  postDocument5.update({
                    hugCount: firebase.firestore.FieldValue.increment(1),
                  }),
                  this.setState({ loadingHug: false })
                );
              })
              .then(() => {
                return postData;
              })
              .catch((error) => {
                Alert.alert(`Error, Check your internet connection. ${error}`);
                this.setState({ loadingHug: false });
              });
          } else {
            if (this.mounted) {
              this.setState({ liking: false });
            }
            return Alert.alert(
              //OVDJE
              "",
              'You already hugged. And if you wish to unhug, did you ever manage to "unhug someone"? You cannot unhug.',
              //JSON.stringify(err)
              this.setState({ loadingHug: false })
            );
          }
        })
        .catch((err) => {
          alert(
            "Something went wrong, check your internet connection please",
            this.setState({ loadingHug: false })
            //err
          );
        });
    } else {
      Alert.alert("No connection", "Check your internet connection.");
    }
  };

  _onLongPressButton = async () => {
    this.props.navigation.navigate("Secret");
  };

  setModalVisibleMood = (visible) => {
    this.setState({ modalVisibleMood: visible });
    //setTimeout(this.setModalVisibleMood(!modalVisibleMood), 3000)
  };

  setModalVisiblePositivity = (visible) => {
    this.setState({ modalVisiblePositivity: visible });
  };

  setModalVisibleHugged = (visible) => {
    this.setState({ modalVisibleHugged: visible });

    setTimeout(() => {
      this.setState({ modalVisibleHugged: false });
    }, 1500);
  };

  setModalVisibleHeader = (visible) => {
    this.setState({ modalVisibleHeader: visible });
    //setTimeout(this.setModalVisibleMood(!modalVisibleMood), 3000)
  };

  displayPosts = async (uid) => {
    if (this.uid == uid) {
      this.props.navigation.navigate("ListOfPosts");
    } else {
      this.props.navigation.navigate("ListOfOtherUsersPosts", {
        chosenUser: uid,
      });
    }
    //console.log(uid);
    //console.log(this.uid);
  };

  renderPost = (post, mood, props, index) => {
    if (this.state.post.length) {
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
                    <TouchableOpacity
                      onPress={() => this.displayPosts(post.uid)}
                    >
                      <Text style={styles.name}>{post.name}</Text>
                    </TouchableOpacity>

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
                    marginTop: 1,
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
                    onPress={() => {
                      this.hugPost(post.id);
                      if (post.liked != true) {
                        if (this.state.liking == false) {
                          this.setModalVisibleHugged(true);
                        }
                      }
                    }}
                    onLongPress={this._onLongPressButton}
                    delayLongPress={10000}
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

                      <Text
                        adjustsFontSizeToFit
                        style={{}}
                      >{` Hugs ${post.hugCount}`}</Text>
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
              >
                <Text style={{ position: "absolute", top: 0, padding: 8 }}>
                  Mood
                </Text>

                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  {post.mood == 1 ? (
                    <View
                      style={{
                        backgroundColor: "#63003d",
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
                        backgroundColor: "#63003d",
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
                        backgroundColor: "#63003d",
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
                        backgroundColor: "#63003d",
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
                        backgroundColor: "#63003d",
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
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => {
                          this.setModalVisiblePositivity(true);
                        }}
                        onPressOut={() => {
                          this.setModalVisiblePositivity(false);
                        }}
                      >
                        <FontAwesome
                          name="check-square"
                          size={24}
                          color="#E8E8E8"
                        />
                        <FontAwesome
                          name="minus-square"
                          size={24}
                          color="red"
                        />
                      </TouchableOpacity>
                    </View>
                  ) : post.optimistic == "yes" ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => {
                          this.setModalVisiblePositivity(true);
                        }}
                        onPressOut={() => {
                          this.setModalVisiblePositivity(false);
                        }}
                      >
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
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => {
                          this.setModalVisiblePositivity(true);
                        }}
                        onPressOut={() => {
                          this.setModalVisiblePositivity(false);
                        }}
                      >
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
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" />
          <Text>Loading</Text>
        </View>
      );
    }
  };

  onRefresh = () => {
    setTimeout(() => {
      this.getPosts();
    }, 1000);
  };

  onRefresh2 = () => {
    setTimeout(() => {
      this.getMoods();
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

  renderHeader = () => {
    if (this.state.mood.length) {
      const { modalVisibleHeader } = this.state;
      return (
        <View
          style={{
            flexDirection: "column",
            backgroundColor: "#ffffff",
            //width: "100%",

            margin: 8,
            marginVertical: 6,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,
            borderBottomLeftRadius: 18,
            flex: 1,
          }}
        >
          {this.state.online == false ? (
            <Text
              style={{
                alignSelf: "center",
                alignContent: "center",
                alignItems: "center",
                fontFamily: "Lobster-Regular",
                padding: 10,
                flex: 1,
                color: "red",
              }}
            >
              In order for Eleph to maintain its maximum secuirty level as well
              as function properly an internet connection is necessary. Please
              relaunch the app with internet connection present.
            </Text>
          ) : null}
          <View
            style={{
              padding: 8,
              flexDirection: "row",
              //justifyContent: "space-between",
              flex: 1,
              alignContent: "center",
              alignSelf: "center",
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
                  this.state.user.avatar
                    ? { uri: this.state.user.avatar }
                    : require("../assets/tempAvatar.jpg")
                }
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 18,
                  //marginRight: 8,
                }}
              />
            </Lightbox>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Post")}
              style={{ flex: 1 }}
            >
              <Text
                style={{ color: "#C4C6CE", padding: 5, marginLeft: 8 }}
                //placeholder={`How do you feel right now ${this.state.user.name}?`}
                multiline
                adjustsFontSizeToFit={true}
              >
                {`How do you feel now ${this.state.user.name}?`}
              </Text>
            </TouchableOpacity>

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

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Notification")}
            >
              <Entypo
                name="bell"
                size={24}
                color="#63003d"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "95%",
              //padding: 6,
              borderBottomColor: "#EBECF4",
              borderBottomWidth: 2,
              alignSelf: "center",
            }}
          />

          {/* <View style={styles.divider}></View> */}
          <View style={{ flexDirection: "row", flex: 1 }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 20,
                flexDirection: "row",
                marginVertical: 2,
              }}
              onPress={() => {
                this.setModalVisibleHeader(!modalVisibleHeader);
                //this.setModalVisibleHeader(!modalVisibleHeader);
              }}
            >
              <SimpleLineIcons
                name="info"
                size={30}
                color="#63003d"
                style={{
                  //width: 80,
                  //height: 80,
                  marginRight: 8,
                  marginLeft: 8,
                  //borderWidth: 4,
                  //borderColor: "green",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                borderLeftWidth: 2,
                borderLeftColor: "#EBECF4",
                height: "70%",
                //padding: 5,
                alignSelf: "center",
                //margin: 10,
              }}
            ></View>
            <FlatList
              style={{
                borderRadius: 8,
                padding: 8,

                flex: 1,
              }}
              horizontal={true}
              data={this.state.mood}
              extraData={this.state}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => this.renderMoods(item)}
              refreshControl={
                <RefreshControl
                  style={{ color: "#639dff" }}
                  colors={["#63003d", "#639dff", "#63003d"]}
                  tintColor="#639dff"
                  //colors="#639dff"
                  titleColor="#63003d"
                  refreshing={this.state.isLoading2}
                  onRefresh={this.onRefresh2}
                />
              }
            ></FlatList>
          </View>
          <View></View>
        </View>
      );
    } else {
      return null;
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  renderMoods = (post) => {
    if (this.state.mood.length) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            backgroundColor: "white",
            borderRadius: 20,
            flexDirection: "row",
            marginVertical: 6,
            //marginRight: 12,
            //paddingRight: 12,
            //flex: 1,
          }}
        >
          {post.mood == 1 ? (
            <View
              style={{
                backgroundColor: "#63003d",
                //width: 80,
                //height: 80,
                borderRadius: 80 / 2,
                //borderWidth: 4,
                //borderColor: "green",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="emoticon-excited"
                size={30}
                color="green"
              />
            </View>
          ) : post.mood == 2 ? (
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
              <MaterialCommunityIcons
                name="emoticon-happy"
                size={30}
                color="#90EE90"
              />
            </View>
          ) : post.mood == 3 ? (
            <View
              style={{
                backgroundColor: "#63003d",
                //width: 80,
                //height: 80,
                borderRadius: 80 / 2,
                //borderWidth: 1,
                //borderColor: "yellow",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="emoticon-neutral"
                size={30}
                color="yellow"
              />
            </View>
          ) : post.mood == 4 ? (
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
              <MaterialCommunityIcons
                name="emoticon-sad"
                size={30}
                color="orange"
              />
            </View>
          ) : (
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
              <MaterialCommunityIcons
                name="emoticon-cry"
                size={30}
                color="red"
              />
            </View>
          )}
        </View>
      );
    }
  };

  render() {
    if (this.state.fontsLoaded) {
      const { height } = Dimensions.get("window");
      const { modalVisibleMood } = this.state;
      const { modalVisiblePositivity } = this.state;
      const { modalVisibleHugged } = this.state;
      const { modalVisibleHeader } = this.state;

      return (
        <View style={{ flex: 1, backgroundColor: "#EBECF4" }}>
          <Spinner
            visible={this.state.loadingHug}
            //textContent={"Sending hug, you can see it upon refreshing."}
            color="#639dff"
            textStyle={{ color: "#639dff" }}
          />
          {/* <Text>
          Connection Status :{" "}
          {this.state.connection_status ? "Connected" : "Disconnected"}
        </Text> */}

          <TouchableWithoutFeedback
            onPress={() => this.setModalVisibleMood(!modalVisibleMood)}
          >
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleMood}
              onRequestClose={() => {
                this.setModalVisibleMood(false);
              }}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
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
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#63003d",
                      }}
                      onPress={() => {
                        this.setModalVisibleMood(!modalVisibleMood);
                      }}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </TouchableWithoutFeedback>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisiblePositivity}
            onRequestClose={() => {
              this.setModalVisiblePositivity(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  These icons represent users positivity towards tomorrow, user
                  either is optimistic about tomorrow or he is not.
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <FontAwesome name="check-square" size={24} color="green" />
                  <FontAwesome name="check-square" size={24} color="#E8E8E8" />
                  <FontAwesome name="minus-square" size={24} color="red" />
                  <FontAwesome name="minus-square" size={24} color="#E8E8E8" />
                </View>
                <Text></Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#63003d" }}
                  onPress={() => {
                    this.setModalVisiblePositivity(!modalVisiblePositivity);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleHugged}
            onRequestClose={() => {
              this.setModalVisibleHugged(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Hug sending successfully...!{"\n"}
                  {"\n"}You can see it upon refresh!
                </Text>
                <Text></Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#63003d" }}
                  onPress={() => {
                    this.setModalVisibleHugged(!modalVisibleHugged);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleHeader}
            onRequestClose={() => {
              this.setModalVisibleHeader(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Preview of most recent moods so you know where you're needed
                  the most.
                </Text>
                <Text></Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#63003d" }}
                  onPress={() => {
                    this.setModalVisibleHeader(!modalVisibleHeader);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          {/* <Loader loading={this.state.loading} /> */}
          <StatusBar backgroundColor="#63003d" barStyle="light-content" />
          <NavigationEvents
            onWillFocus={() => {
              if (
                this.props.navigation &&
                this.props.navigation.state &&
                this.props.navigation.state.params &&
                this.props.navigation.state.params.refresh
              ) {
                this.onRefresh();
                this.onRefresh2();
                this.props.navigation.state.params.refresh = false;
              }
            }}
          />
          <SafeAreaView>
            <Header
              containerStyle={{
                //backgroundColor: '#3D6DCC',
                justifyContent: "space-around",
                backgroundColor: "#63003d",
                //height: 100,
              }}
              centerComponent={{
                text: `Eleph`,
                style: {
                  color: "white",
                  fontFamily: "Lobster-Regular",
                  //fontWeight: "bold",
                  fontSize: 25,
                },
              }}
              leftComponent={
                <TouchableOpacity
                  style={{ marginLeft: 8, margin: 0 }}
                  onPress={() =>
                    this.props.navigation.dispatch(DrawerActions.openDrawer())
                  }
                >
                  <FontAwesome5 name="bars" size={22} color="white" />
                </TouchableOpacity>
              }
              rightComponent={
                <TouchableOpacity
                  style={{ marginRight: 8, margin: 0 }}
                  onPress={() => this.props.navigation.navigate("Profile")}
                >
                  {/* <MaterialCommunityIcons
                  name="chart-areaspline"
                  size={24}
                  color="#639dff"
                /> */}
                  <MaterialCommunityIcons
                    name="account-card-details"
                    size={24}
                    color="white"
                  />
                  {/* <FontAwesome name="bar-chart" size={24} color="white" /> */}
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
              style={{
                marginHorizontal: 0,
                marginVertical: 6,
                //margin: 6,
                //position: "relative",
              }}
              renderItem={({ item }) => this.renderPost(item)}
              ListFooterComponent={this.renderFooter}
              ListHeaderComponent={this.renderHeader}
              refreshControl={
                <RefreshControl
                  style={{ color: "#639dff" }}
                  colors={["#63003d", "#639dff", "#63003d"]}
                  tintColor="#639dff"
                  //colors="#639dff"
                  titleColor="#63003d"
                  refreshing={this.state.isLoading}
                  onRefresh={this.onRefresh}
                />
              }
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
    //backgroundColor: "#63003d",
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
