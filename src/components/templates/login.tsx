import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '@/libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router'; // useRouterのインポート
import styles from '@/styles/pages/login.module.css';
import ButtonComponent from '@/components/parts/button';
import InputField from '@/components/parts/inputField';
import { NextPage } from 'next';

interface LoginFormData {
  email: string;
  password: string;
}


const Login: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // useRouterの初期化
  const { redirect } = router.query; // クエリパラメータからredirectを取得

  const onSubmit: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // ログイン後、redirectの値に応じてリダイレクト
      if (redirect === 'checkout') {
        router.push('/checkout'); // 決済ページへ
      } else {
        router.push('/products'); // 商品一覧ページへ
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <InputField
              label="Email"
              register={register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              type="email"
            />
          </div>

          <div className={styles.formGroup}>
            <InputField
              label="Password"
              register={register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              type="password"
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.buttonWrapper}>
            <ButtonComponent label="Login" width="100%" height="50px" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
