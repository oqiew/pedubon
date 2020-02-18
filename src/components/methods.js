import firebase from '../firebase';

export function GetCurrentDate(sp) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear() + 543;

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (mm + sp + dd + sp + yyyy);
}
export function GetNameUserType(id) {
    firebase.firestore().collection('USER_TYPES').doc(id).get().then((doc) => {
        if (doc.exists) {
            return doc.data().Name;
        } else {
            return "";
        }
    })
}

export function GetTypeUser() {
    const User_type = [];

    firebase.firestore().collection('USER_TYPES').onSnapshot((querySnapshot) => {
        querySnapshot.forEach(doc => {
            const { Name } = doc.data();
            User_type.push({
                Key: doc.id,
                Name,
            });

        });
    });
    //     console.log(User_type)
    return User_type;

}

export const isEmptyValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return true
    } else {
        return false
    }
}