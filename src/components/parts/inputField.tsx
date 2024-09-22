import React, { ChangeEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from '@/styles/components/inputField.module.css';

interface InputFieldProps {
  label: string; // ラベル
  register: UseFormRegisterReturn; // react-hook-formのregister関数を受け取る
  error?: string; // エラーメッセージ
  type?: string; // インプットのタイプ（デフォルトは'text'）
  width?: string; // 幅の指定（デフォルト: 100%）
  height?: string; // 高さの指定（デフォルト: 40px）
  value?: string; // インプットの値
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 外部からのonChange関数
}

const InputField = ({
  label,
  register,
  error,
  type = 'text',
  width = '100%',
  height = '40px',
  value,
  onChange,
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
        value={value} // 外部からの値を受け取る
        onChange={(e) => {
          if (onChange) onChange(e); // 外部からのonChangeを呼び出す
          register.onChange(e); // react-hook-formのonChangeを呼び出す
        }}
        name={register.name} // registerからnameを直接指定
        ref={register.ref} // registerからrefを直接指定
        style={inputStyle}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default InputField;
