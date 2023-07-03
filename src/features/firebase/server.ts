import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// getAppsで初期されるアプリケーションを取得して
// lengthで存在することがわかる
// ！なので存在しなければ初期化を実行
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY as string)),
  });
}

export const adminDB = getFirestore();
