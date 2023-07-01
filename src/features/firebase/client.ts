import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAT3LyyIpm10fO_lbydx_k1FORqW9KF0Dg',
  authDomain: 'carer-finder-demo.firebaseapp.com',
  projectId: 'carer-finder-demo',
  storageBucket: 'carer-finder-demo.appspot.com',
  messagingSenderId: '191822785202',
  appId: '1:191822785202:web:8d9c64f84987c3e1fdb7ab',
  measurementId: 'G-856SDN5NXG',
};

// 重複して初期化してエラーがでることはなくなる
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions();
export const db = getFirestore();
