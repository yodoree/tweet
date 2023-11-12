import type { NextPage } from 'next';
import Layout from '@components/layout';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { Tweet, User } from '@prisma/client';
import Link from 'next/link';
import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utils';
import useUser from '@libs/client/useUser';

interface TweetWithUser extends Tweet {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  tweet: TweetWithUser;
  isLiked: boolean;
}

const TweetDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );

  const [toggleFav] = useMutation(`/api/tweets/${router.query.id}/like`);
  const onlikeClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };

  return (
    <Layout canGoBack>
      <div className="px-4 py-4">
        <div className="border rounded-lg p-2">
          <div className="flex pb-4 justify-between">
            <div className="flex space-x-3 items-start">
              <div className="w-10 h-10 rounded-full bg-gray-400" />
            </div>
            <div className=" flex flex-col px-2">
              <div className="flex space-x-3 items-center">
                <h3 className="text-sm font-medium text-gray-900">{data?.tweet?.user?.name}</h3>
                <span className="text-xs text-gray-400">4h ago</span>
              </div>
              <p className="pt-1 text-sm text-gray-800 ">{data?.tweet?.text}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              onClick={onlikeClick}
              className={cls(
                'p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ',
                data?.isLiked ? 'text-red-500  hover:text-red-600' : 'text-gray-400  hover:text-gray-500'
              )}>
              {data?.isLiked ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TweetDetail;
