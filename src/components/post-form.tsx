import React, { useEffect } from 'react';
import Button from './button';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../features/context/auth';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../features/firebase/client';
import { Post } from '../features/types/post';
import { useRouter } from 'next/router';

const PostForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const router = useRouter();
  const editId = router.query.id;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Post>();
  const { user } = useUserContext();

  useEffect(() => {
    const ref = doc(db, `posts/${editId}`);
    getDoc(ref).then((snap) => {
      const oldPost = snap.data();
      reset(oldPost);
    });
  }, [editId]);

  if (!user) {
    return null;
  }
  const submit = (data: Post) => {
    const ref = isEditMode
      ? doc(db, `posts/${editId}`)
      : doc(collection(db, 'posts'));
    const newPost: Post = {
      id: isEditMode ? (editId as string) : ref.id,
      companyName: data.companyName,
      body: data.body,
      occupation: data.occupation,
      authorId: user.id,
      //  reset(oldPost)で投稿された記事の時間を持ってこれている
      createdAt: isEditMode ? data.createdAt : Date.now(),
      updateAt: isEditMode ? Date.now() : null,
    };
    setDoc(ref, newPost)
      .then(() => {
        alert(`記事を${isEditMode ? '編集' : '作成'}しました`);
        // isEditModeがfalseの時reset実行
        isEditMode || reset();
      })
      .catch((error) => {
        alert(error);
      });
  };

  // const deletePost = () => {
  //   const ref = doc(db, `posts/${editId}`);
  //   deleteDoc(ref).then(async () => {
  //     alert('記事を削除しました');
  //   });
  // };
  return (
    <div className="p-6">
      <h1 className="font-bold text-lg">記事{isEditMode ? '編集' : '投稿'}</h1>
      <form className="space-y-3" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="block" htmlFor="companyName">
            会社名
          </label>
          <input
            autoComplete="off"
            {...register('companyName', {
              required: '必須入力です',
              maxLength: {
                value: 137,
                message: '世界で最長の会社名は137文字です',
              },
            })}
            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-64 p-2.5"
            type="text"
            id="companyName"
            placeholder="会社名"
          />
          {errors.companyName && (
            <p className="text-red-500 mt-0.5">{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <label className="block" htmlFor="body">
            本文
          </label>
          <textarea
            {...register('body', {
              required: '必須入力です',
              maxLength: {
                value: 250,
                message: '最大250文字です',
              },
            })}
            id="body"
            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-64 p-2.5"
          />
          <p className="text-sm text-slate-400 leading-none">
            {watch('body')?.length}/250
          </p>
          {errors.body && (
            <p className="text-red-500 mt-0.5">{errors.body.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="occupation" className="block">
            職種
          </label>
          <input
            type="text"
            autoComplete="off"
            {...register('occupation', {
              required: '必須入力です',
            })}
            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-64 p-2.5"
            id="occupation"
          />
          {errors.occupation && (
            <p className="text-red-500 mt-0.5">{errors.occupation.message}</p>
          )}
        </div>
        <Button type="submit">{isEditMode ? '編集' : '投稿'}</Button>
        {/* {isEditMode && <Button onClick={deletePost}>削除</Button>} */}
      </form>
    </div>
  );
};

export default PostForm;
