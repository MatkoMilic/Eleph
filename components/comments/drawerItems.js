import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacityComponent,
} from "react-native";
import * as Linking from "expo-linking";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../Fire";
import Loader from "../components/Loader";

export default class CustomDrawerComponent extends React.Componect {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
            }}
          />
        </View>
        <ScrollView>
          <DrawerItems {...props} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

//import Button from 'MyButton';
