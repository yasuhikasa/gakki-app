import React from 'react';
import styles from '@/styles/components/headerButton.module.css';

interface RoundedButtonProps {
  label: string;
  onClick: () => void;
}

const RoundedButton: React.FC<RoundedButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.roundedButton} onClick={onClick}>
      {label}
    </button>
  );
};

export default RoundedButton;
