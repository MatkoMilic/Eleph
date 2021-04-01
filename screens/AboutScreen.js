import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

const AboutScreen = () => {

    return <View>
        <Text>About sc</Text>
        </View>
};

const styles = StyleSheet.create({

});

AboutScreen.navigationOptions = navData => {
    return {
      headerTitle: 'Your Orders',
      headerLeft: (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Menu"
              iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
              onPress={() => {
                navData.navigation.toggleDrawer();
              }}
            />
          </HeaderButtons>
        ),
    };
  };

export default AboutScreen; 