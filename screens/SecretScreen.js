import React from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import { Feather } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox-v2";
import { BackHandler } from "react-native";

export default class SecretScreen extends React.Component {
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
      <View style={{ flex: 1, backgroundColor: "#639dff" }}>
        <StatusBar backgroundColor="#639dff" barStyle="light-content" />
        <SafeAreaView>
          <ModernHeader
            backgroundColor="#639dff"
            height={50}
            text={`"In secretum - realis Angeli sunt"`}
            textStyle={{
              color: "white",

              fontSize: 15,
            }}
            leftIconComponent={
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
            rightIconComponent={
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

        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontSize: 12,
              color: "white",
            }}
          >
            Hello Random User! You're not supposed to be here 😁! Since you
            somehow got here, you may know the reason behind this apps name,
            "Eleph". You guessed easily, the inspiration is taken from
            elephants, but why elephants?
          </Text>
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontSize: 12,
              color: "red",
              margin: 10,
            }}
          >
            Elephants are highly sensitive and caring animals, much like humans.
            If a baby elephant cries, the herd will touch and caress the baby
            with their trunks to soothe it. They are highly intelligent animals
            with complex emotions, feelings, compassion and self-awareness, they
            form deep bonds.
          </Text>

          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontSize: 12,
              color: "red",
              margin: 10,
            }}
          >
            🌼❤️ 🌸❤️ 🍀❤️ HAPPY VALENTINES ANGEL 🌷❤️ ✿❤️ 🌹❤️
          </Text>

          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontSize: 12,
              color: "red",
              margin: 10,
            }}
          >
            ❤️ ❤️ ❤️ Kocham Cię ❤️ ❤️ ❤️
          </Text>

          <Image
            source={require("../assets/SecretScreenEleph.jpg")}
            style={{
              width: 300,
              height: 300,
              padding: 5,
              margin: 15,
              borderRadius: 300 / 2,
              overflow: "hidden",
              alignSelf: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          ></Image>
        </View>
      </View>
    );
  }
}
