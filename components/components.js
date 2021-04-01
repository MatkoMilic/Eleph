const Comments = (props) => {
  const styles = StyleSheet.create({
    container: {
      paddingLeft: 15,
      paddingRight: 15,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      padding: 10,
      height: 30,
      backgroundColor: "#eee",
    },

    buttonText: {
      fontSize: 11,
    },
    field: {
      fontSize: 13,
      position: "relative",
      left: -3,
      top: -10,
    },
  });
  return (
    <View style={styles.container}>
      <Input
        style={styles.field}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Skriven komentar..."
      />
      <Button rounded style={styles.button} onPress={() => props.addComment()}>
        <Text style={styles.buttonText}>Komentar</Text>
      </Button>
    </View>
  );
};
