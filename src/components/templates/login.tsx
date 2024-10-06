import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '@/libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/login.module.css';
import ButtonComponent from '@/components/parts/button';
import InputField from '@/components/parts/inputField';
import { NextPage } from 'next';
import { useAuth } from '@/context/authContext'; // ログイン情報を取得

interface LoginFormData {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { redirect } = router.query; // クエリパラメータからredirectを取得
  const { user } = useAuth(); // ログインユーザーを取得

  // すでにログインしている場合は / にリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/'); // ホームページにリダイレクト
    }
  }, []);

  const onSubmit: SubmitHandler<LoginFormData> = async (
    data: LoginFormData
  ) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // リダイレクトが 'checkout' なら /checkout、その他は /products に遷移
      if (redirect === 'checkout') {
        router.push('/checkout');
      } else {
        router.push('/products');
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
              name="email"
            />
          </div>

          <div className={styles.formGroup}>
            <InputField
              label="Password"
              register={register('password', {
                required: 'Password is required',
              })}
              error={errors.password?.message}
              type="password"
              name="password"
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.buttonWrapper}>
            <ButtonComponent label="Login" width="100%" height="50px" />
          </div>
        </form>

        {/* サインアップへのリンク */}
        <p className={styles.signupText}>
          サインアップがまだの場合はこちら→{' '}
          <span
            className={styles.signupLink}
            onClick={() => router.push('/signup')}
          >
            サインアップ
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
