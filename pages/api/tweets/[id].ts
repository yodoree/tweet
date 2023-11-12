import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { id } = req.query;
  const tweet = await client.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.json({ ok: true, tweet });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
