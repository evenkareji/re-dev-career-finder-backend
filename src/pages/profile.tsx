import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import Button from '../components/button';
import { useUserContext } from '../features/context/auth';
import { db } from '../features/firebase/client';
import { User } from '../features/types/user';
import { useEffect } from 'react';

const Profile = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  const { user } = useUserContext();

  useEffect(() => {
    const ref = doc(db, `users/${user?.id}`);
    getDoc(ref).then((snap) => {
      // alert('set');
      reset(snap.data() as User);
    });
  }, [user]);

  const submit = (data: User) => {
    const ref = doc(db, `users/${user?.id}`);
    const putUser = {
      username: data.username,
    };
    setDoc(ref, putUser, { merge: true }).then(() => {
      alert('成功');
    });
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-lg">ユーザー編集</h1>
      <form className="space-y-3" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="block" htmlFor="companyName">
            プロフィール画像
          </label>
          <input type="file" />
        </div>
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

        <Button type="submit">編集</Button>
      </form>
    </div>
  );
};

export default Profile;
