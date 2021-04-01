import React, { Component } from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";

const Loader = (props) => {
  const { loading, ...attributes } = props;

  return (
    <Modal transparent={true} animationType={"none"} visible={loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#0000ff" animating={loading} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: "50%",
    width: "50%",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
export default Loader;
