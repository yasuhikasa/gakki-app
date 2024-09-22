import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/pages/products.module.css';

type Product = {
  id: number;
  name: string;
  price: number;
  manufacturer: string;
  category: string;
  releaseDate: string;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [guitarOpen, setGuitarOpen] = useState(false);
  const [bassOpen, setBassOpen] = useState(false);
  const [drumOpen, setDrumOpen] = useState(false);

  const productsData: Product[] = [
    { id: 1, name: 'Fender Stratocaster', price: 150000, manufacturer: 'Fender', category: 'guitar', releaseDate: '2023-01-01' },
    { id: 2, name: 'Gibson Les Paul', price: 200000, manufacturer: 'Gibson', category: 'guitar', releaseDate: '2023-02-15' },
    { id: 3, name: 'Ibanez RG', price: 120000, manufacturer: 'Ibanez', category: 'guitar', releaseDate: '2023-03-10' },
    { id: 4, name: 'Fender Jazz Bass', price: 140000, manufacturer: 'Fender', category: 'bass', releaseDate: '2023-04-20' },
    { id: 5, name: 'Pearl Drum Set', price: 250000, manufacturer: 'Pearl', category: 'drum', releaseDate: '2023-05-30' },
  ];

  useEffect(() => {
    if (selectedManufacturer) {
      const sortedProducts = productsData.filter(
        (product) => product.manufacturer === selectedManufacturer
      );
      setProducts(sortedProducts);
    } else {
      setProducts(productsData); // 全ての製品を表示
    }
  }, [selectedManufacturer]);

  const toggleGuitar = () => setGuitarOpen(!guitarOpen);
  const toggleBass = () => setBassOpen(!bassOpen);
  const toggleDrum = () => setDrumOpen(!drumOpen);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Categories</h2>
        <div className={styles.category}>
          <button className={styles.categoryButton} onClick={toggleGuitar}>
            Guitars {guitarOpen ? '-' : '+'}
          </button>
          {guitarOpen && (
            <div className={styles.subCategory}>
              <button onClick={() => setSelectedManufacturer('Fender')}>Fender</button>
              <button onClick={() => setSelectedManufacturer('Gibson')}>Gibson</button>
              <button onClick={() => setSelectedManufacturer('Ibanez')}>Ibanez</button>
            </div>
          )}
        </div>
        <div className={styles.category}>
          <button className={styles.categoryButton} onClick={toggleBass}>
            Basses {bassOpen ? '-' : '+'}
          </button>
          {bassOpen && (
            <div className={styles.subCategory}>
              <button onClick={() => setSelectedManufacturer('Fender')}>Fender</button>
              <button onClick={() => setSelectedManufacturer('Gibson')}>Gibson</button>
              <button onClick={() => setSelectedManufacturer('Yamaha')}>Yamaha</button>
            </div>
          )}
        </div>
        <div className={styles.category}>
          <button className={styles.categoryButton} onClick={toggleDrum}>
            Drums {drumOpen ? '-' : '+'}
          </button>
          {drumOpen && (
            <div className={styles.subCategory}>
              <button onClick={() => setSelectedManufacturer('Pearl')}>Pearl</button>
              <button onClick={() => setSelectedManufacturer('Tama')}>Tama</button>
              <button onClick={() => setSelectedManufacturer('Yamaha')}>Yamaha</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.products}>
        <h2 className={styles.title}>Products</h2>
        <div className={styles.productGrid}>
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div className={styles.productCard} key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <div className={styles.productContent}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>{product.price}円</p>
                    <p className={styles.productManufacturer}>メーカー: {product.manufacturer}</p>
                    <p className={styles.productReleaseDate}>
                      リリース日: {new Date(product.releaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
