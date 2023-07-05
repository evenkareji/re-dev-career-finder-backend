import { ReactElement } from 'react';
import PostForm from '../components/post-form';
import Layout from '../components/layout';
const CreatePost = () => {
  return <PostForm isEditMode={false} />;
};

CreatePost.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
export default CreatePost;
