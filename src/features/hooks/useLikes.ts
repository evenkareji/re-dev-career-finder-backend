import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

export const useLike = () => {
  // const ref = doc(db, `posts/${realPost?.id}`);
  const unLike = (ref: any, userId: string) => {
    updateDoc(ref, { likes: arrayRemove(userId) })
      .then(() => {
        alert('likes外した');
      })
      .catch((err) => {
        alert(err);
      });
  };
  const Like = (ref: any, userId: string) => {
    updateDoc(ref, { likes: arrayUnion(userId) })
      .then(() => {
        alert('likes追加');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return { unLike, Like };
};
