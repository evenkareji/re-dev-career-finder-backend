import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from '../firebase/client';
import { User } from '../types/user';

type ContextType = {
  isLoading: boolean;
  user: User | null | undefined;
};
const AuthContext = createContext<ContextType>({
  isLoading: true,
  user: undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 既存のユーザーがいる場合
    // ここに値が入る時はundefinedの可能性がない
    onAuthStateChanged(auth, (resultUser) => {
      if (resultUser) {
        const ref = doc(db, `users/${resultUser.uid}`);
        onSnapshot(ref, (snap) => {
          if (snap.data() === undefined && resultUser.displayName) {
            const userData: User | undefined | null = {
              username: resultUser.displayName,
            };
            setDoc(ref, userData);
          }

          // 認証で得たidと一致するdocumentとをリアルタイムで監視
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
    <AuthContext.Provider value={{ isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useUserContext = () => useContext(AuthContext);
