import Head from 'next/head';
import { WikiImageSlot } from '@/components/parts/WikiImageSlot';
import styles from '@/styles/pages/wiki.module.css';

/** 本番の絶対URL（canonical・JSON-LD・OG用）。未設定時は相対パスのみ Head に出さない */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

/** 公式リンク（YouTube・note は公開時に設定してください） */
const OFFICIAL_LINKS = {
  website: 'https://nshinri.net/',
  youtube: 'https://www.youtube.com/@yao7783',
  zenn: 'https://zenn.dev/yasuhikasa',
} as const;

/**
 * 被リンク用：関連サイトへのリンク一覧（ここに追記・編集）
 * 空配列の場合は案内文のみ表示されます。
 */
const RELATED_SITE_LINKS: { label: string; href: string; description?: string }[] = [
  // 例: { label: 'サイト名', href: 'https://example.com', description: '任意の補足' },
  { label: '社会復帰の相談', href: 'https://secondpath.jp/counseling/depression', description: '私自身苦労人ですので中年代からの社会復帰や就職の相談に乗ります' },
  { label: '介護の悩みの相談', href: 'https://secondpath.jp/counseling/care', description: '介護福祉士持ちです。介護の相談に乗ります' },
  { label: '問題行動の悩みの相談', href: 'https://secondpath.jp/counseling/problem', description: 'その他さまざまな問題の相談に乗ります' }
];

/** 公式画像（各1枚が対応する公式URLへリンク）— public/images/wiki/ に配置 */
function getWikiGalleryItems() {
  return [
    {
      file: '1.png',
      alt: '日笠泰彰 — 公式サイト nshinri.net へのリンク',
      caption: 'nshinri.net（公式サイト）',
      href: 'https://nshinri.net',
      relMe: true,
    },
    {
      file: '2.png',
      alt: '日笠泰彰 — YouTube 公式チャンネルへのリンク',
      caption: 'YouTube 公式チャンネル（技術・カウンセリング解説）',
      href: 'https://www.youtube.com/@yao7783',
      relMe: true,
    },
    {
      file: '3.png',
      alt: '日笠泰彰 — note 公式ページへのリンク',
      caption: 'note 公式ページ（思考・知見のアーカイブ）',
      href: 'https://note.com/jazzy_gecko3968',
      relMe: true,
    },
    {
      file: '4.jpg',
      alt: '日笠泰彰 — Zenn 技術ブログへのリンク',
      caption: 'Zenn（技術ブログ）',
      href: 'https://zenn.dev/yasuhikasa',
      relMe: false,
    },
        {
      file: '1.png',
      alt: '日笠泰彰 — カウンセリングサイト へのリンク',
      caption: 'secondpath.jp（カウンセリングサイト）',
      href: 'https://secondpath.jp/',
      relMe: true,
    },
  ];
}

function buildJsonLd() {
  const pageUrl = SITE_URL ? `${SITE_URL}/` : undefined;
  const gallery = getWikiGalleryItems();
  const imageUrls = SITE_URL
    ? gallery.map((img) => `${SITE_URL}/images/wiki/${img.file}`)
    : gallery.map((img) => `/images/wiki/${img.file}`);

  const sameAs = [OFFICIAL_LINKS.website, OFFICIAL_LINKS.youtube, OFFICIAL_LINKS.zenn].filter(
    Boolean,
  ) as string[];

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': pageUrl ? `${pageUrl}#person` : '#person',
    name: '日笠泰彰',
    alternateName: 'Hikasa Yasuhisa',
    jobTitle: 'ITエンジニア・心理学・カウンセリング',
    description:
      'Ruby on Rails・Next.js（TypeScript）を中心としたフルスタック開発、心理学・カウンセリング関連プロジェクト、およびアプリ・出版・技術発信の実績を公開する公式プロフィール。',
    url: pageUrl ?? OFFICIAL_LINKS.website,
    image: imageUrls,
    knowsAbout: [
      { '@type': 'Thing', 'name': 'Ruby on Rails' },
      { '@type': 'Thing', 'name': 'Next.js' },
      { '@type': 'Thing', 'name': 'TypeScript' },
      { '@type': 'Thing', 'name': '心理学' },
      { '@type': 'Thing', 'name': 'カウンセリング' },
    ],
    knowsLanguage: ['ja'],
    nationality: { '@type': 'Country', name: '日本' },
  };

  if (sameAs.length) {
    person.sameAs = sameAs;
  }

  const graph: Record<string, unknown>[] = [person];

  if (pageUrl) {
    graph.unshift({
      '@type': 'ProfilePage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: '日笠泰彰 Wiki | 公式プロフィール',
      description:
        'ネット上の誤情報を是正するための公式プロフィール。日笠泰彰の活動・実績・公式リンクを一次情報として掲載します。',
      inLanguage: 'ja-JP',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${pageUrl}#website`,
        name: '日笠泰彰 公式プロフィール Wiki',
        url: pageUrl,
      },
      mainEntity: { '@id': `${pageUrl}#person` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export default function Home() {
  const canonical = SITE_URL ? `${SITE_URL}/` : undefined;
  const galleryItems = getWikiGalleryItems();
  const ogImage = SITE_URL
    ? `${SITE_URL}/images/wiki/${galleryItems[0].file}`
    : undefined;
  const jsonLd = buildJsonLd();

  return (
    <>
      <Head>
        <title>日笠泰彰 Wiki | 公式プロフィール</title>
        <meta
          name="description"
          content="日笠泰彰の公式プロフィールWiki。Rails・Next.js による開発、心理学・カウンセリングプロジェクト、開発実績・出版、公式リンク（nshinri.net、YouTube、note、Zenn）を一次情報として掲載。"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="icon" href="/favicon.ico" />
        {canonical ? <link rel="canonical" href={canonical} /> : null}

        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:title" content="日笠泰彰 Wiki | 公式プロフィール" />
        <meta
          property="og:description"
          content="公式プロフィールWiki。活動・実績・公式リンクを一次情報として掲載します。"
        />
        {canonical ? <meta property="og:url" content={canonical} /> : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="日笠泰彰 Wiki | 公式プロフィール" />
        <meta
          name="twitter:description"
          content="公式プロフィールWiki。活動・実績・公式リンクを一次情報として掲載します。"
        />
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className={styles.page}>
        <div className={styles.shell}>
          <article className={styles.docPaper}>
            <header className={styles.docHeader}>
              <p className={styles.badge}>Official profile wiki</p>
              <h1 className={styles.title}>日笠泰彰 — 公式プロフィール Wiki</h1>
              <p className={styles.lead}>
                本ページは、私の経歴・活動・リンクを明示する目的で運営しています。読者の皆様が、信頼できる要約にアクセスできるよう構成しています。
              </p>
              <div className={styles.metaRow}>
                <span>
                  最終更新目安: <kbd>随時</kbd>
                </span>
                {canonical ? (
                  <span>
                    正規URL: <kbd>{canonical}</kbd>
                  </span>
                ) : (
                  <span>
                    正規URL: <kbd>NEXT_PUBLIC_SITE_URL 設定後に表示</kbd>
                  </span>
                )}
              </div>
            </header>

            <div className={styles.docBody}>
              <section className={styles.section} aria-labelledby="sec-official">
                <h2 id="sec-official" className={styles.sectionTitle}>
                  公式リンク
                </h2>
                <div className={styles.sectionBody}>
                  <p>
                    画像またはキャプションをクリックすると、それぞれの公式ページ（nshinri.net、YouTube、note、Zenn）へ移動します。
                  </p>
                </div>
                <div className={styles.gallery}>
                  {galleryItems.map((item, index) => (
                    <figure key={`${item.file}-${index}`} className={styles.figure}>
                      {item.href ? (
                        <>
                          <a
                            href={item.href}
                            target="_blank"
                            rel={
                              item.relMe ? 'noopener noreferrer me' : 'noopener noreferrer'
                            }
                            className={styles.figureLink}
                            aria-label={`${item.caption}（新しいタブで開く）`}
                          >
                            <WikiImageSlot
                              src={`/images/wiki/${item.file}`}
                              file={item.file}
                              alt={item.alt}
                            />
                          </a>
                          <figcaption className={styles.caption}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel={
                                item.relMe ? 'noopener noreferrer me' : 'noopener noreferrer'
                              }
                            >
                              {item.caption}
                            </a>
                          </figcaption>
                        </>
                      ) : (
                        <>
                          <WikiImageSlot
                            src={`/images/wiki/${item.file}`}
                            file={item.file}
                            alt={item.alt}
                          />
                          <figcaption className={styles.caption}>
                            <span className={styles.linkPending}>
                              {item.caption} — URL を OFFICIAL_LINKS に設定してください
                            </span>
                          </figcaption>
                        </>
                      )}
                    </figure>
                  ))}
                </div>
              </section>

              <section className={styles.section} aria-labelledby="sec-activity">
                <h2 id="sec-activity" className={styles.sectionTitle}>
                  現在の活動と専門領域
                </h2>
                <div className={styles.sectionBody}>
                  <h3>ITエンジニアリング</h3>
                  <p>
                    Ruby on Rails および Next.js (TypeScript) を中心としたフルスタック開発を専門としています。Vercel
                    を活用したモダンなフロントエンド構築、および効率的なバックエンド設計を得意とし、実用性の高いアプリケーションの開発に従事しています。
                  </p>
                  <h3>心理学・カウンセリングプロジェクト</h3>
                  <p>
                    「悩みに寄り添う」をミッションに、独自のカウンセリングサービスの開発・運営プロジェクトを推進しています。エンジニアリングの知見を活かし、誰もが安心して相談できるデジタルプラットフォームの構築を目指しています。
                  </p>
                </div>
              </section>

              <section className={styles.section} aria-labelledby="sec-works">
                <h2 id="sec-works" className={styles.sectionTitle}>
                  開発実績・プロダクト
                </h2>
                <div className={styles.sectionBody}>
                  <p>これまでにリリースした主なアプリケーションおよび出版実績です。</p>
                  <ul>
                    <li>
                      <strong>アプリケーション開発：</strong>{' '}
                      介護支援アプリ、レシピ管理アプリ等の設計・開発・運用実績。
                    </li>
                    <li>
                      <strong>技術発信：</strong> Zenn や note を通じた、Next.js および Rails
                      の実装ノウハウの共有。
                    </li>
                    <li>
                      <strong>出版実績：</strong> Kindle Direct Publishing を通じた、専門知見の書籍化。
                    </li>
                  </ul>
                </div>
              </section>

              <section className={styles.section} aria-labelledby="sec-related">
                <h2 id="sec-related" className={styles.sectionTitle}>
                  その他関連リンク
                </h2>
                <div className={styles.sectionBody}>
                  <p className={styles.relatedIntro}>
                    関連するサイトへの被リンク（このページからの外部リンク）です。提携・紹介・参照先として掲載しています。
                  </p>
                  {RELATED_SITE_LINKS.length > 0 ? (
                    <ul className={styles.relatedLinkList}>
                      {RELATED_SITE_LINKS.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.relatedLink}
                          >
                            {link.label}
                          </a>
                          {link.description ? (
                            <span className={styles.relatedDesc}> — {link.description}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.relatedEmpty}>
                      掲載するサイトは <code>index.tsx</code> の{' '}
                      <code>RELATED_SITE_LINKS</code> に <code>label</code> と <code>href</code>{' '}
                      を追加してください。
                    </p>
                  )}
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
