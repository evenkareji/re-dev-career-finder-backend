import React from 'react';
import Button from '../components/button';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../features/context/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../features/firebase/client';
import { Post } from '../features/types/post';

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Post>();
  const { user } = useUserContext();
  if (!user) {
    return null;
  }
  const submit = (data: any) => {
    console.log(data.companyName);
    console.log(user.id, 'id');

    const ref = doc(collection(db, 'posts'));
    const newPost: Post = {
      id: ref.id,
      companyName: data.companyName,
      body: data.body,
      occupation: data.occupation,
      authorId: user.id,
      createdAt: Date.now(),
      updateAt: null,
    };
    setDoc(ref, newPost)
      .then(() => {
        alert('記事を作成しました');
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <div className="p-6">
      <h1 className="font-bold text-lg">記事投稿</h1>
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
        <Button type="submit">送信</Button>
      </form>
    </div>
  );
};

export default CreatePost;
