import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import withAdminAuth from '@/components/hoc/withAdminAuth';
import styles from '@/styles/pages/admin.module.css';

// 商品の型を定義
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const ProductManagement = () => {
  // 初期値として空の配列を設定し、useStateの型を明示
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0 });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});

  // 商品データを取得して設定
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = await getDocs(collection(db, 'products'));
      const productList: Product[] = productsCollection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        stock: doc.data().stock,
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  // 商品の追加
  const addProduct = async () => {
    if (newProduct.name === '' || newProduct.price <= 0 || newProduct.stock < 0) {
      alert('商品名、価格、在庫数を正しく入力してください');
      return;
    }

    const addedProductRef = await addDoc(collection(db, 'products'), newProduct);
    const addedProduct: Product = { ...newProduct, id: addedProductRef.id };
    setProducts([...products, addedProduct]);
    setNewProduct({ name: '', price: 0, stock: 0 }); // フォームをリセット
  };

  // 商品の編集モードに切り替え
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setUpdatedProduct({ name: product.name, price: product.price, stock: product.stock });
  };

  // 商品の編集を保存
  const saveEditedProduct = async () => {
    if (editingProductId && updatedProduct.name && updatedProduct.price) {
      const productRef = doc(db, 'products', editingProductId);
      await updateDoc(productRef, updatedProduct);

      setProducts(products.map((product) =>
        product.id === editingProductId
          ? { ...product, ...updatedProduct }
          : product
      ));
      setEditingProductId(null); // 編集モードを終了
      setUpdatedProduct({});
    }
  };

  // 商品の削除
  const deleteProduct = async (id: string) => {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    setProducts(products.filter((product) => product.id !== id)); // フロント側のデータも削除
  };

  return (
    <div className={styles.container}>
      <h2>商品管理</h2>
      
      <div className={styles.form}>
        <input
          type="text"
          placeholder="商品名"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="価格"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="在庫数"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
        />
        <button onClick={addProduct}>商品追加</button>
      </div>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {editingProductId === product.id ? (
              <div>
                <input
                  type="text"
                  value={updatedProduct.name || ''}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  value={updatedProduct.price || ''}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })}
                />
                <input
                  type="number"
                  value={updatedProduct.stock || ''}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock: Number(e.target.value) })}
                />
                <button onClick={saveEditedProduct}>保存</button>
                <button onClick={() => setEditingProductId(null)}>キャンセル</button>
              </div>
            ) : (
              <div>
                {product.name} - {product.price}円 - 在庫: {product.stock}
                <button onClick={() => startEditingProduct(product)}>編集</button>
                <button onClick={() => deleteProduct(product.id)}>削除</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAdminAuth(ProductManagement);
