# アプリ概要
・フロントにNext.jsとTypeScript、DB,認証にFirebaseを使用したショッピングページ。

・DBはusers（ユーザー情報）、products（登録商品情報）、orders（注文情報）、categories（商品カテゴリ）を管理。

・決済にはstripeと連携。

・vercelでデプロイ。

### アプリURL
https://gakki-app-yasuhikasas-projects.vercel.app/

# 画面一覧
## ヘッダー
・マイページボタンはログイン完了後のみ、管理者ページボタンはログインユーザーが管理者権限（role=1）がある場合のみ表示される仕様。

・タイトル部分を押下するとトップページへ遷移。

<img width="1240" alt="スクリーンショット 2024-10-07 21 53 08" src="https://github.com/user-attachments/assets/44dc7dad-ef3b-4669-a5df-0b60d8c76e23">
<img width="1259" alt="スクリーンショット 2024-10-07 21 53 36" src="https://github.com/user-attachments/assets/5413d706-b956-4eac-8dda-4276a197737c">

・レスポンシブ対応

<img width="704" alt="スクリーンショット 2024-10-07 22 06 16" src="https://github.com/user-attachments/assets/0ba8cb1e-8bd4-42d7-95db-28ce28b308e1">


## 商品画面
### トップ画面
・（/）にアクセスすると、商品一覧（/products）へ遷移。

![gakki-app-yasuhikasas-projects vercel app_orderList](https://github.com/user-attachments/assets/7287e9d0-c57d-44e1-b871-a42818edc378)

・レスポンシブ対応（１カラム構成）

![gakki-app-yasuhikasas-projects vercel app_](https://github.com/user-attachments/assets/e9f01c63-3237-4f4e-ab8f-9896c422ead0)

### 個別商品画面
![gakki-app-yasuhikasas-projects vercel app_products_181zUJQdS0lSJA0e955b](https://github.com/user-attachments/assets/af358353-0a63-478e-903b-3ce4b2ea9190)

・レスポンシブ対応（１カラム構成）

![gakki-app-yasuhikasas-projects vercel app_ (1)](https://github.com/user-attachments/assets/9a5a2a0b-f30d-4325-a358-0275c125b9cc)


### カート画面
![localhost_3000_cart](https://github.com/user-attachments/assets/4a2264ce-c890-43ef-ade8-f310bcc3eaaa)

### 決済画面
・stripeと連携。クレジット払い

・ログインしていない場合はログイン画面へリダイレクトする。ログイン後に決済画面が表示される仕様。

![gakki-app-yasuhikasas-projects vercel app_products_181zUJQdS0lSJA0e955b (2)](https://github.com/user-attachments/assets/1044e10d-49a7-4154-a358-a8f8030bbc97)

### 注文確認画面
![gakki-app-yasuhikasas-projects vercel app_ (2)](https://github.com/user-attachments/assets/30b4641d-20d1-4ad2-9e55-90fc92f6a8ed)


## 認証画面
### ログイン画面
![localhost_3000_admin (2)](https://github.com/user-attachments/assets/58057dfd-1ecf-4777-9fb8-71cf753dc5e4)

### サインアップ画面
![localhost_3000_admin (3)](https://github.com/user-attachments/assets/aaff7cef-1e48-473f-86f0-1b8f7b73b642)

## 顧客用マイページ画面
### 注文履歴画面
![localhost_3000_admin (1)](https://github.com/user-attachments/assets/ce009c10-0de3-4676-82ec-ddc982544c5b)

### ユーザー情報編集画面
![gakki-app-yasuhikasas-projects vercel app_products_181zUJQdS0lSJA0e955b (3)](https://github.com/user-attachments/assets/142018bb-4414-4558-bba0-4eb5d1e282b2)

## 管理者画面
・どのページも管理者アカウント（role=1）でないとアクセスできない仕様

### 管理者トップ画面
![localhost_3000_cart (1)](https://github.com/user-attachments/assets/b37ee3f6-9875-41dc-8faf-68fc455b79ff)

### 商品登録画面
![localhost_3000_cart (2)](https://github.com/user-attachments/assets/83cafcae-5143-4b63-a062-4fb35318d767)

### 商品一覧画面
![localhost_3000_cart (3)](https://github.com/user-attachments/assets/73bf2ce2-8d83-4822-84ad-511e185d812b)

### 商品編集画面
![localhost_3000_cart (4)](https://github.com/user-attachments/assets/2e571906-9a26-482a-8d00-0465c4286796)

### 注文履歴一覧画面
・商品の発送、キャンセルのステータス管理ができるようにしている

![localhost_3000_admin](https://github.com/user-attachments/assets/a4c51dfb-b19e-43c5-b353-664907441b15)


