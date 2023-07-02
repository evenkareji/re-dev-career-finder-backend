import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { FC, VFC, useEffect, useState } from 'react';
import { db } from '../features/firebase/client';
import { Post } from '../features/types/post';
import useSWR from 'swr/immutable';
import { format } from 'date-fns';
import { useAuthor } from '../features/hooks/useAuthor';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { adminDB } from '../features/firebase/server';

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
  const { author } = useAuthor(post?.authorId);

  if (!post) return <p>記事が存在しません</p>;

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
      <p>{author?.username}</p>
    </div>
  );
};

export default DetailPage;
