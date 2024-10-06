import React from 'react';
import Admin from '@/components/templates/management/admin';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const AdminPage: NextPage = () => {
  return (
    <Layout>
      <Admin />
    </Layout>
  );
};

export default AdminPage;
