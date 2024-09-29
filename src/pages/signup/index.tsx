import React from 'react';
import Signup from '@/components/templates/signup';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const SignupPage: NextPage = () => {
  return (
    <Layout>
      <Signup />
    </Layout>
  );
}

export default SignupPage;
