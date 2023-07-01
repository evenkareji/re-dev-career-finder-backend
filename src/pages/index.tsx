import type { NextPage } from 'next';
import Head from 'next/head';

import { useUserContext } from '../features/context/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '../components/button';
const Home: NextPage = () => {
  // 関数を実行し以下の変数を作成
  const router = useRouter();
  const { user, isLoading } = useUserContext();
  if (isLoading) {
    return (
      <>
        <div
          className="h-screen w-screen flex justify-center items-center"
          aria-label="読み込み中"
        >
          <div className=" animate-spin h-20 w-20 bg-blue-300 rounded-xl"></div>
        </div>
      </>
    );
  }
  if (!user) {
    router.push('/login');
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-slate-300 p-3">header</header>
      <main>
        {/* 監視したuser documentが空だから表示されない。故に作る必要がある */}
        <p>{user?.username}</p>
        <Button>
          <Link href="post-form">
            <a>投稿</a>
          </Link>
        </Button>
      </main>
      <header className="bg-slate-200 p-2">footer</header>
    </div>
  );
};

export default Home;
