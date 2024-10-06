import React from 'react';
import Confirm from '@/components/templates/confirm';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const ConfirmPage: NextPage = () => {
  return (
    <Layout>
      <Confirm />
    </Layout>
  );
};

export default ConfirmPage;
