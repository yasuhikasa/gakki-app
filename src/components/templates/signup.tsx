import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth, db } from '@/libs/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Firestore関連のインポート
import styles from '@/styles/pages/signup.module.css';
import ButtonComponent from '@/components/parts/button';
import InputField from '@/components/parts/inputField';
import GenderField from '@/components/parts/genderField';
import { NextPage } from 'next';

interface SignupFormData {
  firstName: string;
  lastName: string;
  furiganaFirstName: string;
  furiganaLastName: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
  gender: string;
  email: string;
  password: string;
}

const Signup: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      // Firebase Authentication でユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Firestore に追加情報を保存
      await setDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        furiganaFirstName: data.furiganaFirstName,
        furiganaLastName: data.furiganaLastName,
        postalCode: data.postalCode,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        email: data.email,
        role: 0, // ロールを 0（消費者）として保存
        createdAt: new Date(),
      });

      console.log('User and additional data saved to Firestore');
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
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <div className={styles.row}>
              <InputField
                label="姓"
                register={register('lastName', { required: '姓は必須です' })}
                error={errors.lastName?.message}
              />
              <InputField
                label="名"
                register={register('firstName', { required: '名は必須です' })}
                error={errors.firstName?.message}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.row}>
              <InputField
                label="姓（フリガナ）"
                register={register('furiganaLastName', { required: 'フリガナ（姓）は必須です' })}
                error={errors.furiganaLastName?.message}
              />
              <InputField
                label="名（フリガナ）"
                register={register('furiganaFirstName', { required: 'フリガナ（名）は必須です' })}
                error={errors.furiganaFirstName?.message}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="メールアドレス"
              register={register('email', { required: 'メールアドレスは必須です' })}
              error={errors.email?.message}
              type="email"
            />
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="パスワード"
              register={register('password', { required: 'パスワードは必須です' })}
              error={errors.password?.message}
              type="password"
            />
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="郵便番号"
              register={register('postalCode', { required: '郵便番号は必須です' })}
              error={errors.postalCode?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="住所"
              register={register('address', { required: '住所は必須です' })}
              error={errors.address?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="電話番号"
              register={register('phoneNumber', { required: '電話番号は必須です' })}
              error={errors.phoneNumber?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <GenderField
              register={register('gender', { required: '性別は必須です' })}
              error={errors.gender}
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <div className={styles.buttonWrapper}>
            <ButtonComponent label="Sign Up" width="100%" height="50px" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
