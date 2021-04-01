import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox-v2";
import { Entypo } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

import firebase from "firebase";
require("firebase/firestore");

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default class SearchUsersScreen extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
  }

  state = {
    users: [],
    search: "",
    loading: false,
    online: false,
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

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

  fetchUsers = () => {
    if (this.state.online == true) {
      if (!this.state.search.trim() == "") {
        this.setState({ loading: true });
        firebase
          .firestore()
          .collection("users")
          .where("name", ">=", this.state.search)
          .limit(10)
          .get()
          .then((snapshot) => {
            let users = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;

              return { id, ...data };
            });
            this.setState({ users: users });
            this.setState({ loading: false });
          })
          .catch((error) => {
            this.setState({ loading: false });
            Alert.alert(`${error}`);
          });
      } else {
        Alert.alert(
          "Empty search",
          "We can't allow someone to have empty name, can't we?"
        );
      }
    } else {
      Alert.alert("No connection", "Check your internet connection.");
    }
  };

  renderFooter = () => {
    return (
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Text style={{ textAlign: "center", color: "grey", flexWrap: "wrap" }}>
          Your search will give you
          <Text style={{ textDecorationLine: "underline" }}>
            {" "}
            10 closest{" "}
          </Text>{" "}
          usernames in Eleph. If there aren't ten similar usernames to your
          search the rest will be filled
          <Text style={{ textDecorationLine: "underline" }}> randomly.</Text>
          <Text> Tapping on users names will lead you to their posts.</Text>
        </Text>
      </View>
    );
  };

  displayPosts = async (id) => {
    this.props.navigation.navigate("ListOfOtherUsersPosts", {
      chosenUser: id,
    });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={this.state.loading}
          textContent={"Loading searches..."}
          color="#639dff"
          textStyle={{ color: "#639dff" }}
        />
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <Header
          containerStyle={{
            justifyContent: "space-around",
            backgroundColor: "#63003d",
          }}
          centerComponent={{
            text: "Find other users",
            style: {
              color: "white",

              fontSize: 20,
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

        <SearchBar
          containerStyle={{ backgroundColor: "white" }}
          inputContainerStyle={{ backgroundColor: "#63003d", borderRadius: 15 }}
          placeholder="Search users here..."
          lightTheme
          round
          value={this.state.search.trim()}
          onChangeText={(search) => this.setState({ search: search })}
        />

        <TouchableOpacity
          style={{
            width: "95%",
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            borderRadius: 15,
            backgroundColor: "#63003d",
            marginTop: 5,
            padding: 10,
          }}
          onPress={this.fetchUsers}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Confirm search
          </Text>
        </TouchableOpacity>

        <FlatList
          numColumns={1}
          horizontal={false}
          data={this.state.users}
          renderItem={({ item }) => (
            <View>
              <View
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
                }}
              >
                <TouchableOpacity onPress={() => this.displayPosts(item.id)}>
                  <Image
                    source={
                      item.avatar
                        ? { uri: item.avatar }
                        : require("../assets/tempAvatar.jpg")
                    }
                    style={{ width: 45, height: 45, borderRadius: 30 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginLeft: 16,
                    flex: 1,
                    alignContent: "center",
                    alignSelf: "center",
                  }}
                  onPress={() => this.displayPosts(item.id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#63003d",
                        textAlign: "center",
                      }}
                    >
                      {`${item.name}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderFooter}
        />
      </SafeAreaView>
    );
  }
}
