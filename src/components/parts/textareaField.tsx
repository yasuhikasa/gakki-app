import React from 'react';
import styles from '@/styles/components/textareaField.module.css';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  name?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  rows = 4,
  name,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={onChange}
        rows={rows}
        name={name}
      />
    </div>
  );
};

export default TextareaField;
