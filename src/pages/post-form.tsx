import React from 'react';
import Button from '../components/button';

const PostPage = () => {
  return (
    <div className="p-6">
      <h1 className="font-bold text-lg">記事投稿</h1>
      <form className="space-y-3">
        <div>
          <label className="block" htmlFor="title">
            タイトル
          </label>
          <input type="text" id="title" placeholder="タイトル" />
        </div>
        <div>
          <label className="body block" htmlFor="body">
            本文
          </label>
          <textarea id="body" />
        </div>
        <Button>送信</Button>
      </form>
    </div>
  );
};

export default PostPage;
