import firebase from 'react-native-firebase';

const db = firebase.database()
const ref = db.ref()

function get(path) {
  return db.ref(path).once("value").then(snapshot => {
    return snapshot.val();
  });
}

function listen(path){
  return db.ref(path);
}

function update(path, data){
  return db.ref(path).set(data);
}

export { get, listen, update, ref, db};