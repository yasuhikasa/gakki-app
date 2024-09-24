import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/libs/firebase';
import { updateEmail } from 'firebase/auth'; // メールアドレスの更新
import { useForm } from 'react-hook-form';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import styles from '@/styles/pages/editProfile.module.css';
import { useRouter } from 'next/router';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phoneNumber: string;
  shippingAddress: {
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
    phoneNumber: string;
  };
}

const EditProfile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [updatedEmail, setUpdatedEmail] = useState(''); // メールアドレスの更新用

  useEffect(() => {
    if (!user) {
      router.push('/login'); // ログインしていない場合はログイン画面にリダイレクト
      return;
    }

    const fetchUserProfile = async () => {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserProfile;
        setProfile(userData);

        // フォームの初期値設定
        setValue('firstName', userData.firstName);
        setValue('lastName', userData.lastName);

        // 通常の住所をhomeAddressとして保存していない場合、サインアップ時の住所を使用
        setValue('postalCode', userData.postalCode);
        setValue('prefecture', userData.prefecture);
        setValue('city', userData.city);
        setValue('addressLine', userData.addressLine);
        setValue('phoneNumber', userData.phoneNumber);

        // 配送先住所がある場合は設定
        if (userData.shippingAddress) {
          setValue('shippingPostalCode', userData.shippingAddress.postalCode);
          setValue('shippingPrefecture', userData.shippingAddress.prefecture);
          setValue('shippingCity', userData.shippingAddress.city);
          setValue('shippingAddressLine', userData.shippingAddress.addressLine);
          setValue('shippingPhoneNumber', userData.shippingAddress.phoneNumber);
        }

        // メールアドレスの初期値も設定
        setValue('email', userData.email);
        setUpdatedEmail(userData.email);  // メールアドレスの初期値
      }
    };

    fetchUserProfile();
  }, [user, setValue]);

  const handleAddressUpdate = async (data: any) => {
    if (user) {
      try {
        // Firebase Authentication のメールアドレスを更新
        if (data.email !== profile?.email) {
          await updateEmail(user, data.email); // メールアドレスの更新
        }

        // Firestore の住所情報を更新
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          email: data.email, // Firestoreでもメールアドレスを更新
          postalCode: data.postalCode,
          prefecture: data.prefecture,
          city: data.city,
          addressLine: data.addressLine,
          phoneNumber: data.phoneNumber,
          shippingAddress: {
            postalCode: data.shippingPostalCode,
            prefecture: data.shippingPrefecture,
            city: data.shippingCity,
            addressLine: data.shippingAddressLine,
            phoneNumber: data.shippingPhoneNumber,
          },
        });
        alert('ユーザー情報が更新されました');
      } catch (error) {
        console.error('エラーが発生しました: ', error);
        alert('メールアドレスの更新に失敗しました');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザー情報を編集</h2>
      <form onSubmit={handleSubmit(handleAddressUpdate)} className={styles.form}>
        {profile && (
          <>
            <InputField
              label="姓"
              register={register('lastName', { required: '姓は必須です' })}
              error={errors.lastName?.message as string | undefined}
            />
            <InputField
              label="名"
              register={register('firstName', { required: '名は必須です' })}
              error={errors.firstName?.message as string | undefined}
            />
            <InputField
              label="メールアドレス"
              register={register('email', { required: 'メールアドレスは必須です' })}
              value={updatedEmail} // メールアドレスの状態を反映
              onChange={(e) => setUpdatedEmail(e.target.value)} // メールアドレスを更新
              error={errors.email?.message as string | undefined}
            />

            <h3>通常の住所</h3>
            <InputField
              label="郵便番号"
              register={register('postalCode', { required: '郵便番号は必須です' })}
              error={errors.postalCode?.message as string | undefined}
            />
            <InputField
              label="都道府県"
              register={register('prefecture', { required: '都道府県は必須です' })}
              error={errors.prefecture?.message as string | undefined}
            />
            <InputField
              label="市区町村"
              register={register('city', { required: '市区町村は必須です' })}
              error={errors.city?.message as string | undefined}
            />
            <InputField
              label="番地"
              register={register('addressLine', { required: '番地は必須です' })}
              error={errors.addressLine?.message as string | undefined}
            />
            <InputField
              label="電話番号"
              register={register('phoneNumber', { required: '電話番号は必須です' })}
              error={errors.phoneNumber?.message as string | undefined}
            />

            <h3>配送先住所</h3>
            <InputField
              label="郵便番号"
              register={register('shippingPostalCode', { required: '郵便番号は必須です' })}
              error={errors.shippingPostalCode?.message as string | undefined}
            />
            <InputField
              label="都道府県"
              register={register('shippingPrefecture', { required: '都道府県は必須です' })}
              error={errors.shippingPrefecture?.message as string | undefined}
            />
            <InputField
              label="市区町村"
              register={register('shippingCity', { required: '市区町村は必須です' })}
              error={errors.shippingCity?.message as string | undefined}
            />
            <InputField
              label="番地"
              register={register('shippingAddressLine', { required: '番地は必須です' })}
              error={errors.shippingAddressLine?.message as string | undefined}
            />
            <InputField
              label="電話番号"
              register={register('shippingPhoneNumber', { required: '電話番号は必須です' })}
              error={errors.shippingPhoneNumber?.message as string | undefined}
            />

            <Button label="保存" width="100%" />
          </>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
