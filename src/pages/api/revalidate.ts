// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | {
      revalidate: boolean;
    }
  | string;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await res.revalidate(req.query.path as string);
    return res.json({ revalidate: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

export default handler;
