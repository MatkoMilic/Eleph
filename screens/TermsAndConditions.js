import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class TermsAndConditions extends Component {
  state = {
    accepted: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#639dff" barStyle="light-content" />
        <Text style={styles.title}>Terms and conditions</Text>
        <ScrollView
          style={styles.tcContainer}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              this.setState({
                accepted: true,
              });
            }
          }}
        >
          <Text style={styles.tcP}>
            Welcome to{" "}
            <Text
              style={{
                color: "#639dff",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              Eleph
            </Text>
            . If you continue to use this mobile app, you are agreeing to comply
            with and be bound by the following terms and conditions of use,
            which together with our privacy policy govern [business name]’s
            relationship with you in relation to this mobile app. If you
            disagree with any part of these terms and conditions, please do not
            use my mobile app.
          </Text>
          <Text style={styles.tcP}>
            These terms and conditions ("Agreement") sets forth the general
            terms and conditions of your use of the "
            <Text
              style={{
                color: "#639dff",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              Eleph
            </Text>
            " mobile application ("Mobile Application" or "Service") and any of
            its related products and services (collectively, "Services"). This
            Agreement is legally binding between you ("User", "you" or "your")
            and this Mobile Application developer ("Operator", "we", "us" or
            "our"). By accessing and using the Mobile Application and Services,
            you acknowledge that you have read, understood, and agree to be
            bound by the terms of this Agreement. If you are entering into this
            Agreement on behalf of a business or other legal entity, you
            represent that you have the authority to bind such entity to this
            Agreement, in which case the terms "User", "you" or "your" shall
            refer to such entity. If you do not have such authority, or if you
            do not agree with the terms of this Agreement, you must not accept
            this Agreement and may not access and use the Mobile Application and
            Services. You acknowledge that this Agreement is a contract between
            you and the Operator, even though it is electronic and is not
            physically signed by you, and it governs your use of the Mobile
            Application and Services. our
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Accounts and membership </Text>
          <Text style={styles.tcL}>
            {"\u2022"} You must be at least 13 years of age to use the Mobile
            Application and Services. By using the Mobile Application and
            Services and by agreeing to this Agreement you warrant and represent
            that you are at least 13 years of age. If you create an account in
            the Mobile Application, you are responsible for maintaining the
            security of your account and you are fully responsible for all
            activities that occur under the account and any other actions taken
            in connection with it. I may, but have no obligation to, monitor and
            review new accounts before you may sign in and start using the
            Services. Providing false contact information of any kind may result
            in the termination of your account. You must immediately notify me
            of any unauthorized uses of your account or any other breaches of
            security. I will not be liable for any acts or omissions by you,
            including any damages of any kind incurred as a result of such acts
            or omissions. I may suspend, disable, or delete your account (or any
            part thereof) if I determine that you have violated any provision of
            this Agreement or that your conduct or content would tend to damage
            my reputation and goodwill. If I delete your account for the
            foregoing reasons, you may not re-register for my Services. I may
            block your email address and Internet protocol address to prevent
            further registration.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>User content </Text>
          <Text style={styles.tcL}>
            {"\u2022"} I do not own any data, information or material
            (collectively, "Content") that you submit in the Mobile Application
            in the course of using the Service. You shall have sole
            responsibility for the accuracy, quality, integrity, legality,
            reliability, appropriateness, and intellectual property ownership or
            right to use of all submitted Content. I may, but have no obligation
            to, monitor and review the Content in the Mobile Application
            submitted or created using my Services by you. You grant me
            permission to access, copy, distribute, store, transmit, reformat,
            display and perform the Content of your user account solely as
            required for the purpose of providing the Services to you. Without
            limiting any of those representations or warranties, I have the
            right, though not the obligation, to, in my own sole discretion,
            refuse or remove any Content that, in my reasonable opinion,
            violates any of my policies or is in any way harmful or
            objectionable. You also grant me the license to use, reproduce,
            adapt, modify, publish or distribute the Content created by you or
            stored in your user account for commercial, marketing or any similar
            purpose.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Adult content </Text>
          <Text style={styles.tcL}>
            {"\u2022"} Please be aware that there may be certain adult or mature
            content available in the Mobile Application. Where there is mature
            or adult content, individuals who are less than 18 years of age or
            are not permitted to access such content under the laws of any
            applicable jurisdiction may not access such content. If I learn that
            anyone under the age of 18 seeks to conduct a transaction through
            the Services, I will require verified parental consent, in
            accordance with the Children's Online Privacy Protection Act of 1998
            ("COPPA"). Certain areas of the Mobile Application and Services may
            not be available to children under 18 under any circumstances.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Backups </Text>
          <Text style={styles.tcL}>
            {"\u2022"} I perform regular backups of the Content, however, these
            backups are for my own administrative purposes only and are in no
            way guaranteed. You are responsible for maintaining your own backups
            of your data. I do not provide any sort of compensation for lost or
            incomplete data in the event that backups do not function properly.
            I will do my best to ensure complete and accurate backups, but
            assume no responsibility for this duty.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Links to other resources </Text>
          <Text style={styles.tcL}>
            {"\u2022"} Although the Mobile Application and Services may link to
            other resources (such as websites, mobile applications, etc.), I are
            not, directly or indirectly, implying any approval, association,
            sponsorship, endorsement, or affiliation with any linked resource,
            unless specifically stated herein. I are not responsible for
            examining or evaluating, and I do not warrant the offerings of, any
            businesses or individuals or the content of their resources. I do
            not assume any responsibility or liability for the actions,
            products, services, and content of any other third parties. You
            should carefully review the legal statements and other conditions of
            use of any resource which you access through a link in the Mobile
            Application and Services. Your linking to any other off-site
            resources is at your own risk.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Intellectual property rights </Text>
          <Text style={styles.tcL}>
            {"\u2022"} "Intellectual Property Rights" means all present and
            future rights conferred by statute, common law or equity in or in
            relation to any copyright and related rights, trademarks, designs,
            patents, inventions, goodwill and the right to sue for passing off,
            rights to inventions, rights to use, and all other intellectual
            property rights, in each case whether registered or unregistered and
            including all applications and rights to apply for and be granted,
            rights to claim priority from, such rights and all similar or
            equivalent rights or forms of protection and any other results of
            intellectual activity which subsist or will subsist now or in the
            future in any part of the world. This Agreement does not transfer to
            you any intellectual property owned by the Operator or third
            parties, and all rights, titles, and interests in and to such
            property will remain (as between the parties) solely with the
            Operator. All trademarks, service marks, graphics and logos used in
            connection with the Mobile Application and Services, are trademarks
            or registered trademarks of the Operator or its licensors. Other
            trademarks, service marks, graphics and logos used in connection
            with the Mobile Application and Services may be the trademarks of
            other third parties. Your use of the Mobile Application and Services
            grants you no right or license to reproduce or otherwise use any of
            the Operator or third party trademarks.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Changes and amendments </Text>
          <Text style={styles.tcL}>
            {"\u2022"}I reserve the right to modify this Agreement or its terms
            relating to the Mobile Application and Services at any time,
            effective upon posting of an updated version of this Agreement in
            the Mobile Application. When I do, I will revise the updated date at
            the bottom of this page. Continued use of the Mobile Application and
            Services after any such changes shall constitute your consent to
            such changes. Policy was created with WebsitePolicies.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Acceptance of these terms </Text>
          <Text style={styles.tcL}>
            {"\u2022"} You acknowledge that you have read this Agreement and
            agree to all its terms and conditions. By accessing and using the
            Mobile Application and Services you agree to be bound by this
            Agreement. If you do not agree to abide by the terms of this
            Agreement, you are not authorized to access or use the Mobile
            Application and Services.
          </Text>

          <Text></Text>
          <Text></Text>
          <Text style={styles.Helpingtitle}>Contacting me </Text>
          <Text style={styles.tcP}>
            If you would like to contact me to understand more about this
            Agreement or wish to contact me concerning any matter relating to
            it, you may send an email to{" "}
            <Text
              style={{
                color: "#639dff",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              imatkomilic@gmail.com
            </Text>
          </Text>
          <Text style={styles.tcP}>
            This document was last updated on{" "}
            <Text
              style={{
                color: "#639dff",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              November 1, 2020
            </Text>
          </Text>
        </ScrollView>

        <TouchableOpacity
          disabled={!this.state.accepted}
          onPress={() => this.props.navigation.navigate("Register")}
          style={this.state.accepted ? styles.button : styles.buttonDisabled}
        >
          <Text
            style={
              this.state.accepted ? styles.buttonLabel : styles.buttonLabel2
            }
          >
            {this.state.accepted
              ? "All read! Go back to Eleph Sign Up"
              : "Scroll through terms and conditions"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");

const styles = {
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
    color: "#639dff",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  Helpingtitle: {
    fontSize: 15,
    alignSelf: "center",
    color: "#639dff",
    fontFamily: "monospace",
    //fontWeight: "bold",
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcP: {
    marginTop: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    backgroundColor: "#639dff",
    borderRadius: 5,
    padding: 10,
    borderColor: "#20232a",
    color: "white",
  },

  buttonDisabled: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    borderRadiusColor: "#20232a",
    borderColor: "#639dff",
    borderWidth: 1,
  },

  buttonLabel: {
    fontSize: 14,
    alignSelf: "center",
    color: "white",
  },
  buttonLabel2: {
    fontSize: 14,
    alignSelf: "center",
    color: "#639dff",
  },
};

export default TermsAndConditions;
