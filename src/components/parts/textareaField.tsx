import React from 'react';
import styles from '@/styles/components/textareaField.module.css';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  rows = 4,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={onChange}
        rows={rows}
      />
    </div>
  );
};

export default TextareaField;
