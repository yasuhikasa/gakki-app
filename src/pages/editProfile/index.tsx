import React from 'react';
import EditProfile from '@/components/templates/editProfile';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const EditProfilePage: NextPage = () => {
  return (
    <Layout>
      <EditProfile />
    </Layout>
  );
}

export default EditProfilePage;
