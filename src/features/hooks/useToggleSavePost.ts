import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

export const useToggleSavePost = () => {
  const removeSavedPost = (ref: any, postId: string) => {
    updateDoc(ref, { storage: arrayRemove(postId) })
      .then(() => {
        alert('保存から除きました');
      })
      .catch((err) => {
        alert(err);
      });
  };

  const savePost = (ref: any, postId: string) => {
    updateDoc(ref, { storage: arrayUnion(postId) })
      .then(() => {
        alert('保存に成功しました');
      })
      .catch((err) => alert(err));
  };

  return { savePost, removeSavedPost };
};
