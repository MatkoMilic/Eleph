import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default class MessageScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View style={styles.container}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <SafeAreaView>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicons name="md-arrow-back" size={24} color="red"></Ionicons>
              </TouchableOpacity>
              <Text>Messsages are coming in the next update! (v2.0)</Text>
            </SafeAreaView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    position: "absolute",

    alignItems: "center",
    left: 0,

    backgroundColor: "#6C6C6C",
    width: 60,
    height: 52,
    justifyContent: "center",
    marginTop: 20,
  },
});
