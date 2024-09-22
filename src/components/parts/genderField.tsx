import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import styles from '@/styles/components/genderField.module.css';

interface GenderFieldProps {
  register: UseFormRegisterReturn; // react-hook-formのregister関数を受け取る
  error?: FieldError; // エラーメッセージ
}

const GenderField = ({ register, error }: GenderFieldProps) => (
  <div className={styles.genderField}>
    <label className={styles.label}>性別</label>
    <div className={styles.radioGroup}>
      <label>
        <input type="radio" value="男性" {...register} /> 男性
      </label>
      <label>
        <input type="radio" value="女性" {...register} /> 女性
      </label>
    </div>
    {error && <p className={styles.error}>{error.message}</p>}
  </div>
);

export default GenderField;
