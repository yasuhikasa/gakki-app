import React from 'react';
import styles from '@/styles/components/button.module.css';

interface ButtonComponentProps {
  label: string; // ボタンに表示するテキスト
  onClick?: () => void; // ボタンクリック時のイベント
  type?: 'button' | 'submit'; // ボタンタイプ（デフォルトはsubmit）
  fullWidth?: boolean; // ボタンを全幅にするかどうか（デフォルトはtrue）
  disabled?: boolean; // ボタンが無効化されているかどうか
  width?: string; // カスタム幅（例: '200px' や '100%'）
  height?: string; // カスタム高さ（例: '50px'）
  textColor?: string; // テキストの色（デフォルト: 白）
  backgroundColor?: string; // 背景色（デフォルト: 青）
  borderRadius?: string; // 角の丸み（デフォルト: '5px'）
  fontSize?: string; // テキストサイズ（デフォルト: '16px'）
}

const ButtonComponent = ({
  label,
  onClick,
  type = 'submit',
  fullWidth = false,
  disabled = false,
  width = '100%', // デフォルトの幅は全幅
  height = '50px', // デフォルトの高さ
  textColor = '#fff', // デフォルトテキストカラー
  borderRadius = '5px', // デフォルトの角丸
  fontSize = '16px', // デフォルトテキストサイズ
}: ButtonComponentProps) => {
  // カスタムスタイル
  const buttonStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : width,
    height,
    color: textColor,
    borderRadius,
    fontSize,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
