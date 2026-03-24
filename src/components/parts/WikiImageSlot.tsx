'use client';

import { useState } from 'react';
import styles from '@/styles/pages/wiki.module.css';

type Props = {
  src: string;
  alt: string;
  file: string;
};

export function WikiImageSlot({ src, alt, file }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={styles.imageSlot}>
        <p className={styles.placeholderLabel}>
          画像を配置: <code>public/images/wiki/{file}</code>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.imageSlot}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ユーザー配置の静的画像・画像SEO向け */}
      <img
        src={src}
        alt={alt}
        width={640}
        height={480}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
