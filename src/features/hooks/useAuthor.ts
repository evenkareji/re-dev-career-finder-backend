import useSWR from 'swr/immutable';
import { User } from '../types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/client';

export const useAuthor = (id: string) => {
  const { data: author } = useSWR<User>(id && `users/${id}`, async () => {
    console.log('データ取得');
    // documentを確定させ

    const ref = doc(db, `users/${id}`);
    console.log(ref, 'ref', id);

    // 取得し
    const snap = await getDoc(ref);
    console.log(snap.data(), id, 'snap');

    return snap.data() as User;
  });

  return author;
};
