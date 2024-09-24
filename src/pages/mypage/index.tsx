import React from 'react';
import Mypage from '@/components/templates/mypage';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const MyPage: NextPage = () => {
  return (
    <Layout>
      <Mypage />
    </Layout>
  );
}

export default MyPage;
