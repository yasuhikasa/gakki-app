import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';
import { useAuth } from '@/context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';

interface WithAdminAuthProps {
  children?: React.ReactNode;
}

const withAdminAuth = (WrappedComponent: ComponentType<WithAdminAuthProps>) => {
  return function AdminComponent(props: WithAdminAuthProps) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const checkAdminRole = async () => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role !== 1) { // roleが1でなければリダイレクト
              router.push('/');
            }
          } else {
            console.error("User document doesn't exist.");
          }
        } else {
          router.push('/login'); // ログインしていない場合はログインページへ
        }
      };
      checkAdminRole();
    }, [user, router]);

    if (!user) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;

