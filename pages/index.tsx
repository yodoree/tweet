import type { NextPage } from 'next';
import Layout from '@components/layout';
import useUser from '@libs/client/useUser';
import Head from 'next/head';
import FloatingButton from '@components/floating-button';
import useSWR, { SWRConfig } from 'swr';
import { Tweet } from '@prisma/client';
import Item from '@components/item';
import client from '@libs/server/client';

interface TweetWithCount extends Tweet {
  _count: {
    likes: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const user = useUser();
  const { data } = useSWR<TweetsResponse>('/api/tweets');
  return (
    <Layout title="tweet" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col px-4 space-y-5 py-10">
        {data &&
          data?.tweets?.map((tweet) => (
            <Item id={tweet.id} key={tweet.id} hearts={tweet._count?.likes || 0} text={tweet.text} />
          ))}
        <FloatingButton href="/tweets/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ tweets: TweetWithCount[] }> = ({ tweets }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/tweets': {
            ok: true,
            tweets,
          },
        },
      }}>
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const tweets = await client?.tweet.findMany({});
  return {
    props: {
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
  };
}

export default Page;
