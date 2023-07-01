import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase/client';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const router = useRouter();
  const login = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        alert(`${result.user.displayName}さんこんにちは`);
        router.push('/');
      })
      .catch((e) => console.log(e));
  };

  const logout = () => {
    return signOut(auth).then(() => {
      alert('サインアウト完了');
      router.push('/');
    });
  };
  return {
    login,
    logout,
  };
};
