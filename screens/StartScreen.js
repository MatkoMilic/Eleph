import React, { useState /*useEffect*/ } from "react";
import { View, StyleSheet, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

//OVAJ SCREEN SE NE KORISTI.

const StartScreen = () => {
  return (
    <View>
      <Text>Start sc</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

StartScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "mm",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default StartScreen;
