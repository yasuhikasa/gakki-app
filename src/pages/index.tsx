import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ページロード時に /products にリダイレクト
    router.push('/products');
  }, [router]);

  return (
    <>
      <Head>
      <title>日笠泰彰 ポートフォリオ | フルスタックエンジニア</title>
        <meta name="description" content="Next.jsとFirebaseで構築した楽器屋オンラインショップのデモです。日笠泰彰のエンジニアとしての技術スタックを公開中。" />
        <meta name="description" content="トップページ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Redirecting to products...</div>
    </>
  );
}
