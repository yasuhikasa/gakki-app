import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ページロード時に /products にリダイレクト
    router.push("/products");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta name="description" content="トップページ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Redirecting to products...</div>
    </>
  );
}
