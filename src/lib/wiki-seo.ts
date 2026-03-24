/** 本番の絶対URL（canonical・JSON-LD・OG用）。未設定時は相対パスのみ */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

/** 公式リンク（YouTube・note は公開時に設定してください） */
export const OFFICIAL_LINKS = {
  website: 'https://nshinri.net/',
  youtube: '',
  note: '',
} as const;

/** 画像は public 以下に配置。存在しない場合はプレースホルダ表示 */
export const WIKI_IMAGES: { file: string; alt: string; caption: string }[] = [
  {
    file: '01.jpg',
    alt: '日笠泰彰 — 公式プロフィール写真（1）',
    caption: '公式プロフィール写真（1）',
  },
  {
    file: '02.jpg',
    alt: '日笠泰彰 — 活動・専門分野に関する画像（2）',
    caption: '活動・専門分野（2）',
  },
  {
    file: '03.jpg',
    alt: '日笠泰彰 — 公式関連画像（3）',
    caption: '公式関連画像（3）',
  },
  {
    file: '04.jpg',
    alt: '日笠泰彰 — 実績・メディアに関する画像（4）',
    caption: '実績・メディア（4）',
  },
];

export const WIKI_PAGE_TITLE = '日笠泰彰 Wiki | 公式プロフィール';

export const WIKI_META_DESCRIPTION =
  '日笠泰彰の公式プロフィールWiki。IT・心理学の活動、Kindle・アプリの実績、公式リンク（nshinri.net、YouTube、note）を一次情報として掲載。';

export const WIKI_OG_DESCRIPTION =
  '公式プロフィールWiki。活動・実績・公式リンクを一次情報として掲載します。';

export function buildJsonLd() {
  const pageUrl = SITE_URL ? `${SITE_URL}/` : undefined;
  const imageUrls = SITE_URL
    ? WIKI_IMAGES.map((img) => `${SITE_URL}/images/wiki/${img.file}`)
    : WIKI_IMAGES.map((img) => `/images/wiki/${img.file}`);

  const sameAs = [OFFICIAL_LINKS.website, OFFICIAL_LINKS.youtube, OFFICIAL_LINKS.note].filter(
    Boolean,
  ) as string[];

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': pageUrl ? `${pageUrl}#person` : '#person',
    name: '日笠泰彰',
    alternateName: 'Hikasa Yasuhisa',
    jobTitle: 'IT・心理学',
    description:
      'IT・心理学を中心とした活動、Kindle・アプリ等の実績を公開する公式プロフィール。',
    url: pageUrl ?? OFFICIAL_LINKS.website,
    image: imageUrls,
    knowsAbout: [
      { '@type': 'Thing', 'name': '情報技術' },
      { '@type': 'Thing', 'name': '心理学' },
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
      name: WIKI_PAGE_TITLE,
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
