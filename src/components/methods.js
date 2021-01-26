import Firebase from "../Firebase";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import

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
