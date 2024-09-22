import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '@/context/authContext';
import { CartProvider } from '@/context/cartContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
