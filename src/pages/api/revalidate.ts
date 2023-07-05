// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAuth } from 'firebase-admin/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | {
      revalidate: boolean;
    }
  | string;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // あなたはログインしている人ですか？このサービスからちゃんとアクセスしているか
  try {
    const token = req.headers.authorization?.split(' ')?.[1] as string;
    await getAuth().verifyIdToken(token);

    await res.revalidate(req.query.path as string);
    return res.json({ revalidate: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

export default handler;
