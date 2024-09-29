import React from 'react';
import Login from '@/components/templates/login';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const LoginPage: NextPage = () => {
  return (
    <Layout>
      <Login />
    </Layout>
  );
}

export default LoginPage;
