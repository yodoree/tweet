import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/client/useMutation';
import Layout from '@components/layout';
import TextArea from '@components/textarea';
import Button from '@components/button';

import { useEffect } from 'react';
import { Tweet } from '@prisma/client';
import { useRouter } from 'next/router';

interface UploadTweetForm {
  text: string;
}

interface UploadTweetMutation {
  ok: boolean;
  tweet: Tweet;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<UploadTweetForm>();
  const [uploadTweet, { loading, data }] = useMutation<UploadTweetMutation>('/api/tweets');
  const onValid = (data: UploadTweetForm) => {
    if (loading) return;
    uploadTweet(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/tweets/${data.tweet.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Tweet">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex flex-col">
          <div>
            <TextArea register={register('text', { required: true })} name="text" label="Tweet" required />
          </div>
          <Button text={loading ? 'Loading...' : 'Tweet'} />
        </div>
      </form>
    </Layout>
  );
};

export default Upload;
