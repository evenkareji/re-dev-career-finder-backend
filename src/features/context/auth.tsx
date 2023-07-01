import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from '../firebase/client';
import { User } from '../types/user';

// 初期値を入れる
type ContextType = {
  fbUser: FirebaseUser | null | undefined;
  isLoading: boolean;
  user: User | null | undefined;
};
export const AuthContext = createContext<ContextType>({
  fbUser: undefined,
  isLoading: true,
  user: undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    // 既存のユーザーがいる場合
    // ここに値が入る時はundefinedの可能性がない
    onAuthStateChanged(auth, (resultUser) => {
      console.log(resultUser?.displayName, 'resultUser');
      setFbUser(resultUser);
      if (fbUser) {
        const ref = doc(db, `users/${fbUser.uid}`);

        onSnapshot(ref, (snap) => {
          setUser(snap.data() as User);
        });
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ fbUser, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useUserContext = () => useContext(AuthContext);
