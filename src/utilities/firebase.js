import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import {useState, useEffect} from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD9l31IkbmiiqAdAfzQLoixQTinjqsweMw",
    authDomain: "react-app-497.firebaseapp.com",
    databaseURL: "https://react-app-497-default-rtdb.firebaseio.com",
    projectId: "react-app-497",
    storageBucket: "react-app-497.appspot.com",
    messagingSenderId: "87845645752",
    appId: "1:87845645752:web:a89e12bac20ad2f9d1334d",
    measurementId: "G-50QQENVCKB"
  };

initializeApp(firebaseConfig);
const database = getDatabase();



export const setData = (path, value) => (
  set(ref(database, path), value)
);

export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(), setUser);
    }, []);
  
    return [user];
  };
export const signInWithGoogle = () => {
  signInWithPopup(getAuth(), new GoogleAuthProvider());
};

export const signOutWithGoogle = () => {
  signOut(getAuth());
}



export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };