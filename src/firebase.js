
import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage
import 'firebase/auth';  // If using Firebase storageBucket
import 'firebase/firestore';  // If using Firebase storage
//insert config from firebase
const config = {
    apiKey: "AIzaSyCAhcQdlbxuXDi8F7s6t0czAy2bDhffGJI",
    authDomain: "cydubon-2019.firebaseapp.com",
    databaseURL: "https://cydubon-2019.firebaseio.com",
    projectId: "cydubon-2019",
    storageBucket: "cydubon-2019.appspot.com",
    messagingSenderId: "427406204816",
    appId: "1:427406204816:web:f0bc9cb9c88570b9a49d15"
};
firebase.initializeApp(config);


export { firebase as default };


// import firebase from 'firebase/app';
// import 'firebase/database'; // If using Firebase database
// import 'firebase/storage';  // If using Firebase storage
// import 'firebase/auth';  // If using Firebase storage
// import 'firebase/firestore';  // If using Firebase storage
// //insert config from firebase
// const config = {
//     apiKey: "AIzaSyBYBsBV1B6odlrXCgCuwz8r8B_JlwNBSAA",
//     authDomain: "silc-241508.firebaseapp.com",
//     databaseURL: "https://silc-241508.firebaseio.com",
//     projectId: "silc-241508",
//     storageBucket: "silc-241508.appspot.com",
//     messagingSenderId: "545192950451",
//     appId: "1:545192950451:web:44700c10ea0f60f7"
// };
// firebase.initializeApp(config);


// export { firebase as default };
