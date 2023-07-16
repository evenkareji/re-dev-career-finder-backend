import { HeartIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '../../components/button';
import { useUserContext } from '../../features/context/auth';
import { db } from '../../features/firebase/client';
import { adminDB } from '../../features/firebase/server';
import { useAuthor } from '../../features/hooks/useAuthor';
import { Post } from '../../features/types/post';
import { useLike } from '../../features/hooks/useLikes';
//  GetStaticProps<{ post: Post }>はreturnで入力したpropsを型で明示している
// そしてジェネリクスの中身はDetailPageに渡るpropsの方と一致する
// その場合InferGetStaticPropsType
export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  context,
) => {
  const snap = await adminDB.doc(`posts/${context.params?.id}`).get();
  const post = snap.data() as Post;
  return { props: { post } };
};
export const getStaticPaths = () => {
  return {
    paths: [],
    // 本番はtrueかな
    fallback: 'blocking',
  };
};
// サーバーの中で記事詳細ページを生成する
const DetailPage = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(post, '[id]');
  const { user } = useUserContext();
  const author = useAuthor(post?.authorId);
  const [realPost, setRealPost] = useState<Post>();
  const { unLike, Like } = useLike();
  useEffect(() => {
    const ref = doc(db, `posts/${post.id}`);
    onSnapshot(ref, (snap) => {
      setRealPost(snap.data() as any);
    });
  }, []);
  if (!post) return <p>記事が存在しません</p>;

  const handleClickToggleLikePost = () => {
    if (!user) {
      return alert('ログインしてください');
    }
    const ref = doc(db, `posts/${realPost?.id}`);

    if (realPost?.likes.includes(user.id)) {
      unLike(ref, user.id);
    } else if (!realPost?.likes.includes(user.id)) {
      Like(ref, user.id);
    }
  };
  const handleClickToggleSavePost = () => {
    if (!user) {
      return alert('ログインしてください');
    }

    const ref = doc(db, `users/${user?.id}`);

    if (user?.storage?.includes(realPost?.id)) {
      updateDoc(ref, { storage: arrayRemove(realPost?.id) })
        .then(() => {
          alert('storage外した');
        })
        .catch((err) => {
          alert(err);
        });
    } else if (!user?.storage?.includes(realPost?.id)) {
      updateDoc(ref, { storage: arrayUnion(realPost?.id) })
        .then(() => {
          alert('保存に成功しました');
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className="w-96">
      <h1 className="text-lg p-6 bg-slate-400 text-white">
        {post.companyName}
      </h1>
      <div className="bg-sky-300 mt-5 text-white p-3 border rounded-lg">
        {post.occupation}
      </div>
      <p className="p-3">{post.body}</p>
      <p>{format(post.createdAt, 'yyyy年MM月dd日')}</p>
      <p>投稿者{author?.username}</p>

      {author?.id === user?.id && (
        <Button>
          <Link href={`${post.id}/edit`}>
            <a>編集</a>
          </Link>
        </Button>
      )}
      <HeartIcon
        onClick={handleClickToggleLikePost}
        className="w-5 h-5 text-slate-500"
      />
      <div onClick={handleClickToggleSavePost}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
    </div>
  );
};

export default DetailPage;
