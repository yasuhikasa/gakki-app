import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from '@/styles/components/inputField.module.css';

interface InputFieldProps {
  label: string; // ラベル
  register: UseFormRegisterReturn; // react-hook-formのregister関数を受け取る
  error?: string; // エラーメッセージ
  type?: string; // インプットのタイプ（デフォルトは'text'）
  width?: string; // 幅の指定（デフォルト: 100%）
  height?: string; // 高さの指定（デフォルト: 40px）
}

const InputField = ({
  label,
  register,
  error,
  type = 'text',
  width = '100%',
  height = '40px',
}: InputFieldProps) => {
  // カスタムスタイル
  const inputStyle: React.CSSProperties = {
    width,
    height,
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...register}
        style={inputStyle} // widthとheightを適用
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default InputField;
