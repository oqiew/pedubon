import Firebase from "../Firebase";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import
import { tableName } from "../database/TableConstant";

export function alert_status(status) {
  let title = "";

  if (status === "add") {
    title = "เพิ่มข้อมูลสำเร็จ";
  } else if (status === "noadd") {
    title = "เพิ่มข้อมูลไม่สำเร็จ";
  } else if (status === "update") {
    title = "อัพเดตข้อมูลสำเร็จ";
  } else if (status === "noupdate") {
    title = "อัพเดตข้อมูลไม่สำเร็จ";
  } else if (status === "upload") {
    title = "อัพโหลดรูปภาพสำเร็จ";
  } else if (status === "noupload") {
    title = "อัพโหลดรูปภาพไม่สำเร็จ";
  } else if (status === "notupload") {
    title = "กรุณาอัพโหลดรูปภาพ";
  }
  return confirmAlert({
    title: title,
    buttons: [
      {
        label: "ตกลง"
      }
    ]
  });
}
export function GetCurrentDate(sp) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //As January is 0.
  var yyyy = today.getFullYear() + 543;

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return mm + sp + dd + sp + yyyy;
}
export function GetNameUserType(id) {
  Firebase.firestore()
    .collection("USER_TYPES")
    .doc(id)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data().Name;
      } else {
        return "";
      }
    });
}
export function deleteSM(id, data) {
  Firebase.firestore().collection(tableName.Social_maps)
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().Map_image_URL !== '') {
        var desertRef = Firebase.storage().refFromURL(doc.data().Map_image_URL);
        desertRef.delete().then(function () {
          console.log("delete geomap and image sucess");
        }).catch(function (error) {
          console.log("image No such document! " + doc.data().areaImageName);
        });
      } else {
        console.log("geomap image  No such document! " + id);
      }
      if (data.Geo_map_type === 'home' && data.Important === true) {
        Firebase.firestore().collection(tableName.Person_historys)
          .where('Person_ID', '==', id)
          .onSnapshot((query) => {
            query.forEach((doc) => {
              Firebase.firestore().collection(tableName.Person_historys).doc(doc.id).delete().then(() => {
                console.log('delete timeline person siccess')
              })
            })
          })
      }
      Firebase.firestore().collection(tableName.Social_maps).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    });


}


export const isEmptyValue = value => {
  if (value === "" || value === null || value === undefined) {
    return true;
  } else {
    return false;
  }
};
export const isEmptyValues = (value) => {
  let result = false;
  value.forEach(element => {
    if (element === '' || element === null || element === undefined) {
      result = true
    }
  });

  return result

}
