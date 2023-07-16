import { HeartIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { doc, onSnapshot } from 'firebase/firestore';
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

  const handleLike = () => {
    if (!user) {
      return <p>ログインしてください</p>;
    }
    const ref = doc(db, `posts/${realPost?.id}`);

    if (realPost?.likes.includes(user.id)) {
      unLike(ref, user.id);
    } else if (!realPost?.likes.includes(user.id)) {
      Like(ref, user.id);
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
      <HeartIcon onClick={handleLike} className="w-5 h-5 text-slate-500" />
    </div>
  );
};

export default DetailPage;
