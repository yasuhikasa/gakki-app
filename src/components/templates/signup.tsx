import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth, db } from '@/libs/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/signup.module.css';
import Button from '@/components/parts/button';
import InputField from '@/components/parts/inputField';
import GenderField from '@/components/parts/genderField';
import axios from 'axios';
import { JUSHO_API_URLS } from '@/libs/def';
import { prefectures } from '@/libs/def'
import { NextPage } from 'next';

interface SignupFormData {
  firstName: string;
  lastName: string;
  furiganaFirstName: string;
  furiganaLastName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phoneNumber: string;
  gender: string;
  email: string;
  password: string;
}

const Signup: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); 
  const [city, setCity] = useState(''); // 自動で入力される町名
  const [prefecture, setPrefecture] = useState(''); // 都道府県の値
  const [addressLine, setAddressLine] = useState(''); // 番地以降

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        furiganaFirstName: data.furiganaFirstName,
        furiganaLastName: data.furiganaLastName,
        postalCode: data.postalCode,
        prefecture: data.prefecture,
        city: data.city,
        addressLine: data.addressLine,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        email: data.email,
        role: 0,
        createdAt: new Date(),
      });

      // サインアップ後、商品一覧ページへ遷移
      router.push('/products');

      console.log('User and additional data saved to Firestore');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  // 郵便番号から町名を自動取得する関数
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const postalCode = e.target.value;
    if (postalCode.length === 7) { // 郵便番号が7桁であれば
      try {
        const response = await axios.get(JUSHO_API_URLS(postalCode));
        if (response.data.results) {
          const result = response.data.results[0];
          setCity(result.address2); // 町名部分をセット
          setPrefecture(result.address1); // 都道府県部分をセット
        } else {
          setCity(''); // エラー処理
          setPrefecture(''); // エラー時は都道府県もクリア
        }
      } catch (error) {
        console.error("Failed to fetch city and prefecture:", error);
        setCity('');
        setPrefecture('');
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
              onChange={(e) => handlePostalCodeChange(e)} // 郵便番号変更時に町名を自動入力
            />
          </div>
          <div className={styles.formGroup}>
          <label className={styles.label}>都道府県</label>
            <select
              className={styles.selectField}
              {...register('prefecture', { required: '都道府県は必須です' })}
              value={prefecture} // 自動入力された都道府県
              onChange={(e) => setPrefecture(e.target.value)}>
              <option value="">選択してください</option>
              {prefectures.map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
            {errors.prefecture && <p className={styles.error}>{errors.prefecture.message}</p>}
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="町名"
              register={register('city', { required: '町名は必須です' })}
              error={errors.city?.message}
              value={city} // 自動入力された町名
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <InputField
              label="番地以降"
              register={register('addressLine', { required: '番地は必須です' })}
              error={errors.addressLine?.message}
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)} // 番地以降の入力
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
            <Button label="Sign Up" width="100%" height="50px" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;