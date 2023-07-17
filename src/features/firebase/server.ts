import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 本来は環境変数
const FIREBASE_ADMIN_KEY = {
  type: 'service_account',
  project_id: 'carer-finder-demo',
  private_key_id: '314e2d7b69c51655a2c96bfa649d18b434fff0e3',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCOk5CWhItvWd4D\nOX+W7YcyuzKYA8VJepd58SgSRLQPw4EnZqNGQE7c5XyHxSMTbE8mrfi8OGxWzqP9\nEKsfaQdPuhNf2iAkxLQGXx85/0F4xHwaGU6nLNx0H3QTJrTt3aw90J3t+SGDi0Av\nIxWZm5C1sPhDY95uw39zQWovdEAXnoCG/nmkx1G8alhHt+pYDVPi9oIuXVW8/Xdm\nT9otUzp8xsBW1SGs1iXHyrOyIU7cZa+QruQ773d9z3m4+cHX9QbUih0pSepSt05P\nXJ9b+Oek7XwZ3Ru5zS2S+e7fcraRumC7IKx0ZQ95/4C3KUBD/SJ1yjTb+GtpLnA0\nOiV01snnAgMBAAECggEAAPNJL0T9PEXwPbuYNvR+Bl+1Y8pWpM7n4TyzGdgSY9ks\n7GB57cxyRMpUzP+KjyUVgU+p4kX1VujJXV+gkbTcrcfdkYcogrDloEs/BTRx28Zi\nK2GyzVjLtAxySh8ObVghFJ0Q3cFfhfsbd5T3c7l+j+944CjIwUU//WUuD4M/Wsjw\nTKvKoVnodc4GWug35+3jVZ9XAUvIqoRwawZNTxN1Cjw/z3t3oCvAwO3BujTNGfUH\naEap6H2wzudHR9vsJ7a8YORLsCa2CzhYQ0bVpez/Mk/iLxMaFNbtCJv/kY3mEhXz\nLKXL/TkCdTZhnKbne5fczytM9HK5cStQsqb5D9cI4QKBgQDBGEsG0qKtzSKey7i7\ncX1bFOvf3dyOCD6I70QfUpW3Zy39oQfYZF3RXv1rHl8If8YG+DnudmhoVQa2CbOJ\nTTTO0tIaa7aWX0zFQ8Y1YzKskVHJ6kJVuxdOM4WP+rpwRwGTNHl4mihsso9kU5K3\njqPBL3cuUe/a48tjg3D23KKGYQKBgQC9BiNNbSCNDV9Egy53+I6lMOG7bzLDCV3I\n+t9i7ENab/hB8IklKTAxoQ4k8scTa6/BncmIxqRIiSLn8DSIpr/GJK5kWL0dfWUs\nYWJ/A6DyISNEnyyz3LdQdQWBcFAuFANetUKFAcuF1ePbtdGlCPMsg04quka/qWAA\ngCR6ZoelRwKBgFhAgyHmKUXoKLeNAqxg7Vswj7Gsk/4yVGp/eJIcS6McPE/cRlqn\nXJ2xnX9UzTh0NYy/7LJJWeS9X6jZfD33lHgmsLI0oqnNeqf6FuAVq3ZloIz5TUIj\nlT4/m/63KHjiaxzdcdsmEe3EGndPHxJX1g4YZI8+EbLoQ/AChiG9q2ZhAoGAYze1\nkA6X53H9b5jr600sksj1s8zKeFWSRMxqNSKOuAnN5c68LiVQhrxjEEHe/PKpbpfE\nEWczFF/nUpdi+9eLEhZu830gxznqwUDc0o61DGMYgAyNClvwXOsP2MF7VLRskGnU\nYLxwd++tisYFJPttqQ/DF+pu+GuPWLPqcdUfnkECgYBUXbVqopviebMp8tq0MZaU\nnUEWLt+IbbxHQbXSsgavDGGinstgWUYqzqDzGTl8W43mKbJwm9hKmF2Aw/A9+EvY\nsKJN/xSqrvrupcN0cTCODa1kINYm+NRNf9gTy1qWlaj7D3h+s3oAJiRTK6FFM6C8\n77e64fYdmsrRZpr5CypkZA==\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-yj2rd@carer-finder-demo.iam.gserviceaccount.com',
  client_id: '112209704308158169647',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yj2rd%40carer-finder-demo.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
// getAppsで初期されるアプリケーションを取得して
// lengthで存在することがわかる
// ！なので存在しなければ初期化を実行
if (!getApps().length) {
  initializeApp({
    credential: cert(FIREBASE_ADMIN_KEY as any),
  });
}

export const adminDB = getFirestore();
