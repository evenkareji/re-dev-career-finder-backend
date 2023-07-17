import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/button';
import { useUserContext } from '../features/context/auth';
import { db, storage } from '../features/firebase/client';
import { User } from '../features/types/user';
import ImageSelector from '../components/image-selector';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { Post } from '../features/types/post';
import Link from 'next/link';

const Profile = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<User>();
  const router = useRouter();
  const { user, isLoading } = useUserContext();
  const [savedPosts, setSavedPosts] = useState<Post[]>();

  useEffect(() => {
    reset(user as User);
  }, [user]);

  if (isLoading) {
    return;
  }
  if (!user) {
    router.push('/');
    return;
  }
  // ------------------
  // 非同期関数を配列で実行していく場合、処理が終わる前に次のコードが実行されるため、かえってくる値がpromiseになってしまう
  // すべての処理を待って値をかえすためにpromise.allを使う必要がある
  // バックエンドの動作に変更する必要ある
  Promise.all(
    user.storage.map(async (str) => {
      const postRef = doc(db, `posts/${str}`);
      const snap = await getDoc(postRef);
      return snap.data();
    }),
  ).then((result) => {
    setSavedPosts(result as Post[]);
  });
  // 処理が完了する前に実行されてしまった関数はpromiseがかえる

  // ------------------
  const submit = async (data: User) => {
    console.log(data);
    if (data.avatarURL?.match(/^data:/)) {
      const imageRef = ref(storage, `users/${user?.id}/avatar`);
      await uploadString(imageRef, data.avatarURL, 'data_url');
      // その画像を受け取るための画像url
      data.avatarURL = await getDownloadURL(imageRef);
    }

    if (!data.avatarURL && user?.avatarURL) {
      const imageRef = ref(storage, `users/${user.id}`);
      await deleteObject(imageRef);
    }

    const documentRef = doc(db, `users/${user?.id}`);
    const putUser = {
      username: data.username,
      avatarURL: data.avatarURL,
    };
    return setDoc(documentRef, putUser, { merge: true }).then(() => {
      alert('更新しました');
    });
  };

  return (
    <>
      <div className="p-6 mx-auto w-5/12">
        <h1 className="font-bold text-lg">ユーザー編集</h1>
        <form className="space-y-3" onSubmit={handleSubmit(submit)}>
          <h2>プロフィール画像</h2>
          <ImageSelector control={control} name="avatarURL" />
          <div>
            <label className="block" htmlFor="companyName">
              ユーザー名
            </label>
            <input
              autoComplete="name"
              {...register('username', {
                required: '必須入力です',
                maxLength: {
                  value: 55,
                  message: '55文字以内で入力してください',
                },
              })}
              className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-64 p-2.5"
              type="text"
              id="username"
              placeholder="ユーザーネーム"
            />
            {errors.username && (
              <p className="text-red-500 mt-0.5">{errors.username.message}</p>
            )}
          </div>

          <Button disabled={isSubmitting} type="submit">
            編集
          </Button>
        </form>
      </div>
      <div className="p-6 mx-auto w-5/12">
        <h2 className="font-bold text-lg">保存した記事</h2>
        <div className="mt-4">
          {savedPosts?.map((savedPost) => (
            <article
              key={savedPost.id}
              className="border border-lime-400 rounded-md p-3 w-3/5"
            >
              <h3 className="font-bold">{savedPost.companyName}</h3>
              <p className="text-gray-500">{savedPost.body}</p>
              <Link href={`/${savedPost.id}`}>
                <a>記事へ</a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

Profile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
export default Profile;
