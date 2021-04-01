import FirebaseKeys from "./config";
import firebase, { database } from "firebase";

require("firebase/firestore");

class Fire {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(FirebaseKeys);
    }
  }

  addPost = async ({ text, avatar, name, numberID }) => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text,

          numberID,
          uid: this.uid,
          timestamp: this.timestamp,
          avatar,
          name,
        })
        .then((ref) => {
          ref.update({ id: ref.id });
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  get timestamp() {
    return Date.now();
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get firestore() {
    return firebase.firestore();
  }

  uploadPhotoAsync = (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filename).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  createUser = async (user) => {
    let remoteUri = null;

    try {
      await firebase

        .auth()
        .createUserWithEmailAndPassword(user.email.trim(), user.password);

      let db = this.firestore.collection("users").doc(this.uid);

      db.set({
        name: user.name,
        email: user.email,
        avatar: null,
        timestamp: this.timestamp,
      });

      if (user.avatar) {
        remoteUri = await this.uploadPhotoAsync(
          user.avatar,
          `avatars/${this.uid}`
        );
        db.set({ avatar: remoteUri }, { merge: true });
      }
    } catch (error) {
      alert(`${error}`, console.log(error));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
  get mood() {}

  get userInfos() {
    return firebase.firestore().collection("users").doc(this.uid);
  }
}

export async function getPosts(PostsRetreived) {
  var post = [];

  var snapshot = await firebase
    .firestore()
    .collection("posts")
    .orderBy("timestamp", "desc")
    .get();

  snapshot.forEach((doc) => {
    const PostItem = doc.data();
    PostItem.id = doc.id;
    post.push(PostItem);
  });

  PostsRetreived(post);
}

export async function getUsers(UsersRetreived) {
  var user = [];

  var snapshot = await firebase
    .firestore()
    .collection("users")
    .orderBy("timestamp", "desc")
    .get();

  snapshot.forEach((doc) => {
    const UserItem = doc.data();
    UserItem.id = doc.id;
    user.push(UserItem);
  });

  UsersRetreived(user);
}

export async function getCom(req, PostsRetreived) {
  var post = {};
  var comments = [];
  var postDetails = await firebase.firestore().doc(`/posts/${req}`).get();

  var snapshot = await firebase
    .firestore()
    .collection("comments")
    .where("postId".trim(), "==", postDetails.id)
    .get();

  snapshot.forEach((doc) => {
    const PostItem = doc.data();
    PostItem.id = doc.id;
    comments.push(PostItem);
  });

  post.details = postDetails.data();
  post.comments = comments;

  PostsRetreived(post);
}

export async function getComms(req, res) {
  let commentData = {};
  const mojdb = firebase.firestore();
  mojdb
    .doc(`/posts/${req.params.PostId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log(error);
      }
      commentData = doc.data();
      commentData.PostId = doc.id;
      return mojdb
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.PostId)
        .get();
    })
    .then((data) => {
      commentData.comments = [];
      data.forEach((doc) => {
        commentData.comments.push(doc.data());
      });

      res(commentData);
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getComments(CommentsRetreived) {
  var comments = {};

  var user = firebase.auth().currentUser;
  var snapshot = await firebase.firestore().collection("comments").get();

  snapshot.forEach((doc) => {
    const CommentItem = doc.data();
    CommentItem.id = doc.id;
    comments.push(CommentItem);
  });
  CommentsRetreived(comments);
}

Fire.shared = new Fire();
export default Fire;
