import { Dimensions } from "react-native";
import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Alert,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import firebase, { database } from "firebase";
import Lightbox from "react-native-lightbox-v2";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
//import Fire from "../Fire";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationEvents } from "react-navigation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Fire, { getUsers } from "../Fire";
import * as ImagePicker from "expo-image-picker";
import FirebaseKeys from "../config";
import { AntDesign } from "@expo/vector-icons";
import { string } from "react-native-redash";
import * as Animatable from "react-native-animatable";
import AwesomeAlert from "react-native-awesome-alerts";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { ListItem, SearchBar, Avatar, Header } from "react-native-elements";
import {
  ClassicHeader,
  ModernHeader,
} from "@freakycoder/react-native-header-view";
import moment from "moment";
//import DatePicker from '@react-native-community/datetimepicker';
import DateTimePicker from "@react-native-community/datetimepicker";
require("firebase/firestore");

const WINDOW_WIDTH = Dimensions.get("window").width;
//const screenWidth = (Dimensions.get("window").height / 100) * 50;
const screenWidth = Dimensions.get("window").width * 0.95;
const screenWidth2 = (Dimensions.get("window").height / 100) * 70;
//(Dimensions.get('window').height / 100) * 80
const WINDOW_HEIGHT = Dimensions.get("window").height;

var excited;
var happy;
var neutral;
var sad;
var cry;

const chartConfig = {
  backgroundGradientFrom: "white",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

let start = new Date("2017-01-01");
let end = new Date("2018-01-01");

export default class HappinessScreen extends React.Component {
  mounted = false;
  _isMounted = false;
  constructor(props) {
    super(props);
  }

  state = {
    datasource: [],
    datasource2: [],
    datasource3: [],
    datasource4: [],
    datasource5: [],
    datasource6: [],
    user: [],
    date: new Date(1598051730000),
    date2: new Date(1598051730000),
    startingDate: null,
    endingDate: null,
    show: false,
    show2: false,
    show3: false,
    show4: false,
    showCustomGraph: false,
    datasourceCustom: [],
    datasource2Custom: [],
    minimumDate: null,
    post: [],
    isLoading: false,
    newLoad: false,
    loading: false,
  };

  // if (
  //   this.state.datasource4[0] == 0 &&
  //   this.state.datasource4[1] == 0 &&
  //   this.state.datasource4[2] == 0 &&
  //   this.state.datasource4[3] == 0 &&
  //   this.state.datasource4[4] == 0
  // ) {
  //   return (
  //     <View
  //       style={{
  //         justifyContent: "center",
  //         alignItems: "center",
  //         flex: 1,
  //         marginVertical: 10,
  //       }}
  //     >
  //       <Text>You didn't write any post yet for us to show you graph.</Text>
  //     </View>
  //   );
  // }

  onChange = (dateName, selectedDate) => {
    //console.log(selectedDate);
    const currentDate = new Date(selectedDate);
    const dateINeed = new Date().setDate(currentDate.getDate());
    this.setState({ show: false });
    this.setState({ startingDate: dateINeed });
    //console.log(this.state.startingDate);
    //console.log("dwwdwd");
  };

  onChange2 = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    const dateINeed = new Date().setDate(currentDate.getDate());
    this.setState({ show2: false });
    //("EVO TU");
    this.setState({ endingDate: dateINeed });
  };

  Test = () => {
    //console.log(this.state.startingDate);
    //console.log(this.state.endingDate);
  };

  setShow = () => {
    this.setState({ show3: true });
  };

  showMode2 = (currentMode) => {
    this.setState({ show2: true });
  };

  showMode = (currentMode) => {
    this.setState({ show: true });
  };

  showDatepicker2 = () => {
    if (this.state.startingDate != null) {
      this.showMode2("date");
    } else {
      Alert.alert("First you must choose a starting date for your graphs.");
    }
  };

  showDatepicker = () => {
    this.showMode("date");
  };

  LineChart_Dynamic = () => {
    let text = "";
    if (this.state.datasource) {
      if (this.state.datasource) {
        if (this.state.datasource.length) {
          return (
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Your mood in the last
                <Text style={{ color: "#63003d" }}> 30 </Text>
                days.
              </Text>
              <PieChart
                data={[
                  {
                    name: "Happiest",
                    population: this.state.datasource[0],
                    color: "green",
                    legendFontColor: "green",
                    legendFontSize: 15,
                  },
                  {
                    name: "Happy",
                    population: this.state.datasource[1],
                    color: "#90EE90",
                    legendFontColor: "#90EE90",
                    legendFontSize: 15,
                  },
                  {
                    name: "Neutral",
                    population: this.state.datasource[2],
                    color: "yellow",
                    legendFontColor: "yellow",
                    legendFontSize: 15,
                  },
                  {
                    name: "Sad",
                    population: this.state.datasource[3],
                    color: "orange",
                    legendFontColor: "orange",
                    legendFontSize: 15,
                  },
                  {
                    name: "Crying",
                    population: this.state.datasource[4],
                    color: "red",
                    legendFontColor: "red",
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"#63003d"}
                paddingLeft={"15"}
                style={{
                  borderRadius: 25,
                  //width: "100%",
                  //height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  padding: 12,
                  margin: 12,
                }}
                //center={[10, 50]}
              />
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
              <ActivityIndicator size="large" color="#63003d" />
              <Text style={{ textAlign: "center" }}>
                Loading graph, if you didn't write any post in the last 30 days
                this mood graph won't load until you write one.
              </Text>
            </View>
          );
        }
      } else {
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color="#63003d" />
          <Text style={{ textAlign: "center" }}>
            Loading graph, if you didn't write any post in the last 30 days this
            mood graph won't load until you write one.
          </Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>No posts found in the last 30 days</Text>
        </View>
      );
    }
  };

  LineChart_Dynamic2 = () => {
    let text = "";
    if (this.state.datasource2) {
      if (this.state.datasource2) {
        if (this.state.datasource2.length) {
          return (
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Your positivity in the last
                <Text style={{ color: "#639dff" }}> 30 </Text>
                days.
              </Text>

              <PieChart
                data={[
                  {
                    name: "Positive",
                    population: this.state.datasource2[0],
                    color: "green",
                    legendFontColor: "green",
                    legendFontSize: 15,
                  },
                  {
                    name: "Neutral",
                    population: this.state.datasource2[1],
                    color: "grey",
                    legendFontColor: "grey",
                    legendFontSize: 15,
                  },
                  {
                    name: "Negative",
                    population: this.state.datasource2[2],
                    color: "red",
                    legendFontColor: "red",
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"#639dff"}
                paddingLeft={"15"}
                style={{
                  borderRadius: 25,
                  //width: "100%",
                  //height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 12,
                  alignSelf: "center",
                  margin: 12,
                }}
                //center={[10, 50]}
              />
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
              <ActivityIndicator size="large" color="#639dff" />
              <Text style={{ textAlign: "center" }}>
                Loading graph, if you didn't write any post in the last 30 days
                this positivity graph won't load until you write one.
              </Text>
            </View>
          );
        }
      } else {
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color="#639dff" />
          <Text style={{ textAlign: "center" }}>
            Loading graph, if you didn't write any post in the last 30 days this
            positivity graph won't load until you write one.
          </Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>No posts found in the last 30 days</Text>
        </View>
      );
    }
  };

  LineChart_Dynamic3 = () => {
    let text = "";
    if (this.state.datasource3) {
      if (this.state.datasource3) {
        if (this.state.datasource3.length) {
          return (
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Your mood in the last
                <Text style={{ color: "#63003d" }}> 7 </Text>
                days.
              </Text>
              <PieChart
                data={[
                  {
                    name: "Happiest",
                    population: this.state.datasource3[0],
                    color: "green",
                    legendFontColor: "green",
                    legendFontSize: 15,
                  },
                  {
                    name: "Happy",
                    population: this.state.datasource3[1],
                    color: "#90EE90",
                    legendFontColor: "#90EE90",
                    legendFontSize: 15,
                  },
                  {
                    name: "Neutral",
                    population: this.state.datasource3[2],
                    color: "yellow",
                    legendFontColor: "yellow",
                    legendFontSize: 15,
                  },
                  {
                    name: "Sad",
                    population: this.state.datasource3[3],
                    color: "orange",
                    legendFontColor: "orange",
                    legendFontSize: 15,
                  },
                  {
                    name: "Crying",
                    population: this.state.datasource3[4],
                    color: "red",
                    legendFontColor: "red",
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"#63003d"}
                paddingLeft={"15"}
                style={{
                  borderRadius: 25,
                  //width: "100%",
                  //height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 12,
                  alignSelf: "center",
                  margin: 12,
                }}
                //center={[10, 50]}
              />
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
              <ActivityIndicator size="large" color="#63003d" />
              <Text style={{ textAlign: "center" }}>
                Loading graph, if you didn't write any post in the last 7 days
                this mood graph won't load until you write one.
              </Text>
            </View>
          );
        }
      } else {
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color="#63003d" />
          <Text style={{ textAlign: "center" }}>
            Loading graph, if you didn't write any post in the last 7 days this
            mood graph won't load until you write one.
          </Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ textAlign: "center" }}>No data found.</Text>
        </View>
      );
    }
  };

  LineChart_Dynamic4 = () => {
    let text = "";
    if (this.state.datasource4) {
      if (this.state.datasource4) {
        if (this.state.datasource4.length) {
          return (
            <View>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Your positivity in the last
                <Text style={{ color: "#639dff" }}> 7 </Text>
                days.
              </Text>

              <PieChart
                data={[
                  {
                    name: "Positive",
                    population: this.state.datasource4[0],
                    color: "green",
                    legendFontColor: "green",
                    legendFontSize: 15,
                  },
                  {
                    name: "Neutral",
                    population: this.state.datasource4[1],
                    color: "grey",
                    legendFontColor: "grey",
                    legendFontSize: 15,
                  },
                  {
                    name: "Negative",
                    population: this.state.datasource4[2],
                    color: "red",
                    legendFontColor: "red",
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"#639dff"}
                paddingLeft={"15"}
                style={{
                  borderRadius: 25,
                  //width: "100%",
                  //height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  padding: 12,
                  margin: 12,
                }}
                //center={[10, 50]}
              />
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
              <ActivityIndicator size="large" color="#639dff" />
              <Text style={{ textAlign: "center" }}>
                Loading graph, if you didn't write any post in the last 7 days
                this positivity graph won't load until you write one.
              </Text>
            </View>
          );
        }
      } else {
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color="#639dff" />
          <Text style={{ textAlign: "center" }}>
            Loading graph, if you didn't write any post in the last 7 days this
            positivity graph won't load until you write one.
          </Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>No posts found in the last 7 days</Text>
        </View>
      );
    }
  };

  // async getCustoms() {
  //   let posts = [];
  //   const snapshot3 = await firebase
  //     .firestore()
  //     .collection("posts")
  //     .where("timestamp", "==", this.state.startingDate)
  //     .where("uid", "==", this.uid)
  //     .get();

  //   for (let i = 0; i < snapshot3.docs.length; i++) {
  //     posts.push(snapshot3.docs[i].data());
  //     console.log(docs[i].data());
  //   }
  //   console.log(posts);
  //   this.setState({ show4: true });
  // }

  LineChart_Dynamic5 = () => {
    let text = "";
    this.getCustoms();
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>No data found</Text>
      </View>
    );
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  //OVO: collectionRef.where("startTime", ">=", "1506816000").where("startTime", "<=", "1507593600")
  async componentDidMount() {
    this.getPosts();
    this.mounted = true;
    this._isMounted = true;
    const pocetni = Date.parse("01 Jan 2020 00:00:00 GMT+1");
    const krajnji = Date.parse("01 Dec 2020 00:00:00 GMT+1");
    let newpost = [];
    const user = Fire.shared.uid;
    Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        if (this._isMounted) {
          this.setState({ loading: false, user: doc.data() });
        }
      });

    const snapshot = await firebase
      .firestore()
      .collection("posts")
      .where("uid", "==", this.uid)
      .get();

    for (let i = 0; i < snapshot.docs.length; i++) {
      newpost.push(snapshot.docs[i].data());
      var filtriraniPostovi5 = newpost.filter(function (el) {
        return el.mood == 5;
      });
      var filtriraniPostovi4 = newpost.filter(function (el) {
        return el.mood == 4;
      });
      var filtriraniPostovi3 = newpost.filter(function (el) {
        return el.mood == 3;
      });
      var filtriraniPostovi2 = newpost.filter(function (el) {
        return el.mood == 2;
      });
      var filtriraniPostovi1 = newpost.filter(function (el) {
        return el.mood == 1;
      });

      var filtriraniPostoviYes = newpost.filter(function (el) {
        return el.optimistic == "yes";
      });
      var filtriraniPostoviNo = newpost.filter(function (el) {
        return el.optimistic == "no";
      });
      var filtriraniPostoviNeutral = newpost.filter(function (el) {
        return el.optimistic == "neutral";
      });
    }

    var yes = filtriraniPostoviYes.length;
    var no = filtriraniPostoviNo.length;
    var neutral = filtriraniPostoviNeutral.length;

    this.setState({
      datasource5: [
        filtriraniPostovi1.length,
        filtriraniPostovi2.length,
        filtriraniPostovi3.length,
        filtriraniPostovi4.length,
        filtriraniPostovi5.length,
      ],
    });

    this.setState({
      datasource6: [yes, neutral, no],
    });

    //console.log(this.state.datasource5[0]);
    //console.log(this.state.datasource5[1]);
    //console.log(this.state.datasource5[2]);
    //console.log(this.state.datasource5[3]);
    //console.log(this.state.datasource5[4]);

    //console.log(Math.max(...this.state.datasource5));

    //var x = new Date();
    var today = new Date();
    var priorDate = new Date().setDate(today.getDate() - 30);
    //x.setDate(1);
    //x.setMonth(x.getMonth() - 1);
    //console.log(x.getDate());
    this.getMoodValues();
    //let excited = 0;
  }

  getPosts = async () => {
    this.setState({ isLoading: true });

    let newpost = [];
    const snapshot = await firebase
      .firestore()
      .collection("posts")
      .where("uid", "==", this.uid)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      for (let i = 0; i < snapshot.docs.length; i++) {
        newpost.push(snapshot.docs[i].data());
        //console.log(snapshot.docs[i].data());
        //console.log(newpost);
      }
      if (this._isMounted) {
        //console.log("HELLO!");
        this.setState({ post: [...newpost] });
      }
    } else {
      this.setState({ isLoading: false });
    }
    //console.log(this.state.post);
  };

  async getMoodValues() {
    this.setState({ loading: true });
    this.setState({ isLoading: true });
    const pocetni = Date.parse("01 Jan 2020 00:00:00 GMT+1");
    const krajnji = Date.parse("01 Dec 2021 00:00:00 GMT+1");
    let newpost = [];
    let newpost2 = [];
    let posts = [];

    //var x = new Date();
    var today = new Date();
    var thisMoment = new Date().setDate(today.getDate());
    var priorDate = new Date().setDate(today.getDate() - 30);

    var priorDate7 = new Date().setDate(today.getDate() - 7);
    //x.setDate(1);

    //x.setMonth(x.getMonth() - 1);
    //console.log(priorDate);
    //console.log(thisMoment);
    //console.log(priorDate7);

    //let excited = 0;
    const snapshot = await firebase
      .firestore()
      .collection("posts")
      .where("timestamp", ">=", priorDate)
      .where("timestamp", "<=", thisMoment)
      .where("uid", "==", this.uid)
      .get();

    const snapshot2 = await firebase
      .firestore()
      .collection("posts")
      .where("timestamp", ">=", priorDate7)
      .where("timestamp", "<=", thisMoment)
      .where("uid", "==", this.uid)
      .get();

    //console.log(snapshot.docs.length);

    for (let i = 0; i < snapshot.docs.length; i++) {
      newpost.push(snapshot.docs[i].data());
      var filtriraniPostovi5 = newpost.filter(function (el) {
        return el.mood == 5;
      });
      var filtriraniPostovi4 = newpost.filter(function (el) {
        return el.mood == 4;
      });
      var filtriraniPostovi3 = newpost.filter(function (el) {
        return el.mood == 3;
      });
      var filtriraniPostovi2 = newpost.filter(function (el) {
        return el.mood == 2;
      });
      var filtriraniPostovi1 = newpost.filter(function (el) {
        return el.mood == 1;
      });

      var filtriraniPostoviYes = newpost.filter(function (el) {
        return el.optimistic == "yes";
      });
      var filtriraniPostoviNo = newpost.filter(function (el) {
        return el.optimistic == "no";
      });
      var filtriraniPostoviNeutral = newpost.filter(function (el) {
        return el.optimistic == "neutral";
      });

      //console.log(filtriraniPostovi1.length);
      //console.log(filtriraniPostovi2.length);
      //console.log(filtriraniPostovi3.length);
      //console.log(filtriraniPostovi4.length);
      //console.log(filtriraniPostovi5.length);

      //console.log(filtriraniPostoviYes.length);
      //console.log(filtriraniPostoviNo.length);
      //console.log(filtriraniPostoviNeutral.length);

      var yes = (100 * filtriraniPostoviYes.length) / newpost.length / 100;
      var no = (100 * filtriraniPostoviNo.length) / newpost.length / 100;
      var neutral =
        (100 * filtriraniPostoviNeutral.length) / newpost.length / 100;

      this.setState({
        datasource: [
          filtriraniPostovi1.length,
          filtriraniPostovi2.length,
          filtriraniPostovi3.length,
          filtriraniPostovi4.length,
          filtriraniPostovi5.length,
        ],
      });

      if (this.mounted) {
        this.setState({
          datasource2: [yes, neutral, no],
        });
      }
    }

    for (let i = 0; i < snapshot2.docs.length; i++) {
      newpost2.push(snapshot2.docs[i].data());
      var filtriraniPostovi6 = newpost2.filter(function (el) {
        return el.mood == 5;
      });
      var filtriraniPostovi7 = newpost2.filter(function (el) {
        return el.mood == 4;
      });
      var filtriraniPostovi8 = newpost2.filter(function (el) {
        return el.mood == 3;
      });
      var filtriraniPostovi9 = newpost2.filter(function (el) {
        return el.mood == 2;
      });
      var filtriraniPostovi10 = newpost2.filter(function (el) {
        return el.mood == 1;
      });

      var filtriraniPostoviYes2 = newpost2.filter(function (el) {
        return el.optimistic == "yes";
      });
      var filtriraniPostoviNo2 = newpost2.filter(function (el) {
        return el.optimistic == "no";
      });
      var filtriraniPostoviNeutral2 = newpost2.filter(function (el) {
        return el.optimistic == "neutral";
      });

      //console.log(filtriraniPostovi1.length);
      //console.log(filtriraniPostovi2.length);
      //console.log(filtriraniPostovi3.length);
      //console.log(filtriraniPostovi4.length);
      //console.log(filtriraniPostovi5.length);

      //console.log(filtriraniPostoviYes.length);
      //console.log(filtriraniPostoviNo.length);
      //console.log(filtriraniPostoviNeutral.length);

      var yes2 = (100 * filtriraniPostoviYes2.length) / newpost2.length / 100;
      var no2 = (100 * filtriraniPostoviNo2.length) / newpost2.length / 100;
      var neutral2 =
        (100 * filtriraniPostoviNeutral2.length) / newpost2.length / 100;

      this.setState({
        datasource3: [
          filtriraniPostovi10.length,
          filtriraniPostovi9.length,
          filtriraniPostovi8.length,
          filtriraniPostovi7.length,
          filtriraniPostovi6.length,
        ],
      });
      if (this.mounted) {
        this.setState({
          datasource4: [yes2, neutral2, no2],
        });
      }
    }

    if (this.state.datasourceCustom) {
      if (this.state.datasourceCustom.length) {
        const snapshot3 = await firebase
          .firestore()
          .collection("posts")
          .where("timestamp", ">=", this.state.startingDate)
          .where("timestamp", "<=", this.state.endingDate)
          .where("uid", "==", this.uid)
          .get();
      }
    }
    //console.log(this.state.datasource);
    //console.log(this.state.datasource2[0]),
    //console.log(this.state.datasource2[1]),
    //console.log(this.state.datasource2[2]);
    this.setState({ isLoading: false });
    this.setState({ loading: false });
  }

  fetch = async () => {
    const pocetni = Date.parse("01 Jan 2020 00:00:00 GMT+1");
    const krajnji = Date.parse("01 Dec 2021 00:00:00 GMT+1");
    let posts = [];
    let posts2 = [];

    //var x = new Date();
    var today = new Date();
    var thisMoment = new Date().setDate(today.getDate());
    var priorDate = new Date().setDate(today.getDate() - 30);

    var priorDate7 = new Date().setDate(today.getDate() - 7);
    //x.setDate(1);

    //x.setMonth(x.getMonth() - 1);
    //console.log(priorDate);
    //console.log(thisMoment);
    //console.log(priorDate7);

    //let excited = 0;
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.mounted = false;
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        {/* <Spinner
          visible={this.state.loading}
          textContent={"Loading searches..."}
          color="#639dff"
          textStyle={{ color: "#639dff" }}
        /> */}
        <StatusBar backgroundColor="#63003d" barStyle="light-content" />
        <NavigationEvents
          onWillFocus={() => {
            this.getMoodValues();
            //this.state.loading == true ? (
            <ActivityIndicator size="large" color="black" />;
            //) : null;
          }}
        />
        <View style={styles.container}>
          <Header
            containerStyle={{
              //backgroundColor: '#3D6DCC',
              justifyContent: "space-around",
              backgroundColor: "#63003d",
              //height: 100,
            }}
            centerComponent={{
              text: "Your mood",
              style: {
                color: "white",
                //fontFamily: "Raleway-Italic",
                //fontWeight: "bold",
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
                    //marginBottom: 8,
                    //marginTop: 8,
                    marginLeft: 8,
                  }}
                ></Ionicons>
              </TouchableOpacity>
            }
            rightComponent={
              <Lightbox
                activeProps={{
                  width: WINDOW_WIDTH,
                  height: WINDOW_HEIGHT,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  resizeMode: "contain",
                  flex: 1,
                  marginLeft: 8,
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
          />
        </View>
        {this.state.loading == true ? (
          <View>
            <Text></Text>
            <ActivityIndicator size="large" color="pink" />
            <Text
              style={{
                textAlign: "center",
                color: "#63003d",
                fontWeight: "bold",
              }}
            >
              Checking for graph changes
            </Text>
          </View>
        ) : null}
        {/* <View style={styles.action}>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 15,
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={this.showDatepicker}>
              <MaterialIcons
                name="date-range"
                size={24}
                color="black"
                style={{ margin: 2 }}
              />
              <Text style={{ color: "#63003d" }}>Start</Text>
            </TouchableOpacity>

            {this.state.show && (
              <DateTimePicker
                testID="datePickerPocetni"
                value={this.state.date}
                mode={"date"}
                format="YYYY-MM-DD"
                is24Hour={true}
                display="default"
                onChange={this.onChange}
              />
            )}
          </View>

          <View style={{ backgroundColor: "#63003d", borderRadius: 25 }}>
            <TouchableOpacity onPress={this.setShow}>
              <Text style={{ color: "#fff", padding: 15 }}>
                Create custom graphs
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        {/* {this.state.show3 && (
          <View style={{ marginVertical: 15 }}>
            {this.LineChart_Dynamic5()}
          </View>
        )} */}
        {this.state.post.length != 0 ? (
          <View>
            <View style={{ marginVertical: 15 }}>
              {this.LineChart_Dynamic3()}
            </View>
            <View style={{ marginVertical: 15 }}>
              {this.LineChart_Dynamic4()}
            </View>
            <View style={{ marginVertical: 15 }}>
              {this.LineChart_Dynamic()}
            </View>
            <View style={{ marginVertical: 15 }}>
              {this.LineChart_Dynamic2()}
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginVertical: 10,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              You didn't write any post yet for us to create graphs for you.
            </Text>
          </View>
        )}
        <View
          style={{
            flex: 1,
            backgroundColor: "#63003d",
            padding: 12,
            margin: 12,
            borderRadius: 25,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignSelf: "center" }}>
            <Text style={{ alignSelf: "center", color: "#fff" }}>
              Most present mood (or tied):{" "}
            </Text>
            <Text style={{ alignSelf: "center" }}>
              {this.state.datasource5.indexOf(
                Math.max(...this.state.datasource5)
              ) == 4 ? (
                <Text style={{ color: "red" }}>Crying</Text>
              ) : this.state.datasource5.indexOf(
                  Math.max(...this.state.datasource5)
                ) == 3 ? (
                <Text style={{ color: "orange" }}>Sad</Text>
              ) : this.state.datasource5.indexOf(
                  Math.max(...this.state.datasource5)
                ) == 2 ? (
                <Text style={{ color: "yellow" }}>Neutral</Text>
              ) : this.state.datasource5.indexOf(
                  Math.max(...this.state.datasource5)
                ) == 1 ? (
                <Text style={{ color: "#90EE90" }}>Happy</Text>
              ) : this.state.datasource5.indexOf(
                  Math.max(...this.state.datasource5)
                ) == 0 ? (
                <Text style={{ color: "green" }}>Happiest</Text>
              ) : null}
            </Text>
          </View>

          <View
            style={{
              width: "95%",
              //padding: 6,
              borderBottomColor: "#EBECF4",
              borderBottomWidth: 1,
              alignSelf: "center",
            }}
          />

          <View style={{ flex: 1, flexDirection: "row", alignSelf: "center" }}>
            <Text style={{ alignSelf: "center", color: "#fff" }}>
              Least present mood (or tied):{" "}
            </Text>

            <Text style={{ alignSelf: "center" }}>
              {this.state.datasource5.indexOf(
                Math.min(...this.state.datasource5)
              ) == 4 ? (
                <Text style={{ color: "red" }}>Crying</Text>
              ) : this.state.datasource5.indexOf(
                  Math.min(...this.state.datasource5)
                ) == 3 ? (
                <Text style={{ color: "orange" }}>Sad</Text>
              ) : this.state.datasource5.indexOf(
                  Math.min(...this.state.datasource5)
                ) == 2 ? (
                <Text style={{ color: "yellow" }}>Neutral</Text>
              ) : this.state.datasource5.indexOf(
                  Math.min(...this.state.datasource5)
                ) == 1 ? (
                <Text style={{ color: "#90EE90" }}>Happy</Text>
              ) : this.state.datasource5.indexOf(
                  Math.min(...this.state.datasource5)
                ) == 0 ? (
                <Text style={{ color: "green" }}>Happiest</Text>
              ) : null}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.Test();
          }}
        ></TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
    backgroundColor: "#fff",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    justifyContent: "space-between",
    alignSelf: "auto",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    //marginRight: 16,
  },
});

// const snapshot3 = await firebase
//       .firestore()
//       .collection("posts")
//       .where("timestamp", ">=", this.state.startingDate)
//       .where("timestamp", "<=", this.state.endingDate)
//       .where("uid", "==", this.uid)
//       .get();

//     for (let i = 0; i < snapshot3.docs.length; i++) {
//       posts.push(snapshot3.docs[i].data());
//       var filtriraniPostovi5 = posts.filter(function (el) {
//         return el.mood == 5;
//       });
//       var filtriraniPostovi4 = posts.filter(function (el) {
//         return el.mood == 4;
//       });
//       var filtriraniPostovi3 = posts.filter(function (el) {
//         return el.mood == 3;
//       });
//       var filtriraniPostovi2 = posts.filter(function (el) {
//         return el.mood == 2;
//       });
//       var filtriraniPostovi1 = posts.filter(function (el) {
//         return el.mood == 1;
//       });

//       var filtriraniPostoviYes = posts.filter(function (el) {
//         return el.optimistic == "yes";
//       });
//       var filtriraniPostoviNo = newpost.posts(function (el) {
//         return el.optimistic == "no";
//       });
//       var filtriraniPostoviNeutral = posts.filter(function (el) {
//         return el.optimistic == "neutral";
//       });

//       var yes = (100 * filtriraniPostoviYes.length) / newpost.length / 100;
//       var no = (100 * filtriraniPostoviNo.length) / newpost.length / 100;
//       var neutral =
//         (100 * filtriraniPostoviNeutral.length) / newpost.length / 100;

//       this.setState({
//         datasourceCustom: [
//           filtriraniPostovi1.length,
//           filtriraniPostovi2.length,
//           filtriraniPostovi3.length,
//           filtriraniPostovi4.length,
//           filtriraniPostovi5.length,
//         ],
//       });
//       this.setState({
//         datasource2Custom: [yes, neutral, no],
//       });
//     }
