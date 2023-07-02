import useSWR from 'swr/immutable';
import { User } from '../types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/client';

export const useAuthor = (id: string) => {
  const { data: author } = useSWR<User>(id && `users/${id}`, async () => {
    const ref = doc(db, `users/${id}`);
    const snap = await getDoc(ref);
    return snap.data() as User;
  });
  return { author };
};
