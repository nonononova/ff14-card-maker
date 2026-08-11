import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';

export default function App() {
  const [siteTheme, setSiteTheme] = useState('light');

  // プロフィール情報
  const [name, setName] = useState('Kanon');
  const [dc, setDc] = useState('Mana');
  const [race, setRace] = useState("Miqo'te");
  const [twitterId, setTwitterId] = useState('Cheese_Dohee');
  const [bio, setBio] = useState('FF14メインアカウント。\nこだわりのスクリーンショットをアルバムのように投稿しています📷✨');

  // フォント選択肢
  const fontOptions = [
    { label: '丸ゴシック (Zen Maru)', value: "'Zen Maru Gothic', sans-serif" },
    { label: 'ぽっちゃり丸フォント (M PLUS Rounded 1c)', value: "'M PLUS Rounded 1c', sans-serif" },
    { label: '手書き風ポップ (Kiwi Maru)', value: "'Kiwi Maru', serif" },
    { label: '力強いポップ (Potta One)', value: "'Potta One', cursive" },
    { label: '明朝体 (Shippori Mincho)', value: "'Shippori Mincho', serif" },
    { label: '和風・毛筆 (Yuji Syuku)', value: "'Yuji Syuku', serif" },
    { label: 'レトロ・ドット風 (DotGothic16)', value: "'DotGothic16', sans-serif" },
    { label: '標準ゴシック (Sans-Serif)', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  ];
  const [cardFont, setCardFont] = useState(fontOptions[0].value);

  // カード自体のカラーテーマ
  const [cardThemeKey, setCardThemeKey] = useState('cyber');

  // アイコン画像 ＆ ギャラリー画像
  const [avatar, setAvatar] = useState({ src: null, x: 50, y: 50, zoom: 1 });
  const [gallery, setGallery] = useState([
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 }
  ]);

  const cardRef = useRef(null);

  // Webフォント ＆ スマホ用レスポンシブCSSの動的読み込み
  useEffect(() => {
    const linkId = 'google-fonts-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@700&family=Potta+One&family=Yuji+Syuku&family=Kiwi+Maru:wght@500;700&family=Shippori+Mincho:wght@700&family=Zen+Maru+Gothic:wght@700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const styleId = 'responsive-custom-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media (max-width: 1024px) {
          .app-main-layout {
            grid-template-columns: 1fr !important;
          }
          .app-preview-container {
            position: static !important;
            order: -1;
          }
        }
        @media (max-width: 480px) {
          .responsive-gallery-box {
            height: 160px !important;
          }
          .responsive-card-inner {
            padding: 14px !important;
          }
          .responsive-avatar {
            width: 70px !important;
            height: 70px !important;
          }
          .responsive-name {
            font-size: 18px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 画像圧縮＆リサイズ処理
  const compressImage = (file, maxWidth = 1200) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
      };
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedUrl = await compressImage(file, 800);
      setAvatar((prev) => ({ ...prev, src: compressedUrl }));
    }
  };

  const handleGalleryUpload = (index) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedUrl = await compressImage(file, 1200);
      setGallery((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], src: compressedUrl };
        return next;
      });
    }
  };

  // 画像保存処理
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: false,
      });
      const link = document.createElement('a');
      link.download = `${name || 'ff14'}_ss_gallery_card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('画像の保存に失敗しました。');
    }
  };

  const isLight = siteTheme === 'light';
  const colors = {
    bg: isLight ? '#f8fafc' : '#0f172a',
    panelBg: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '#e2e8f0' : '#334155',
    text: isLight ? '#0f172a' : '#f8fafc',
    subText: isLight ? '#64748b' : '#94a3b8',
    inputBg: isLight ? '#f1f5f9' : '#0f172a',
    accent: '#10b981',
  };

  const dcOptions = [
    'Mana', 'Gaia', 'Elemental', 'Meteor',
    'Aether', 'Primal', 'Crystal', 'Dynamis',
    'Light', 'Chaos', 'Materia'
  ];

  const raceOptions = [
    'Hyur', 'Elezen', 'Lalafell', "Miqo'te",
    'Roegadyn', 'Au Ra', 'Hrothgar', 'Viera'
  ];

  // カラーテーマコレクション
  const cardThemes = {
    cyber: { name: 'サイバー', bg: '#030712', wrapperBg: '#0f172a', text: '#22d3ee', sub: '#64748b', bio: '#94a3b8', border: '#1f2937', badgeBg: '#1f2937', badgeText: '#22d3ee', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 211, 238, 0.35)' },
    blood: { name: 'ブラッド', bg: '#180202', wrapperBg: '#270303', text: '#f43f5e', sub: '#9f1239', bio: '#fecdd3', border: '#4c0519', badgeBg: '#4c0519', badgeText: '#fb7185', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.35)' },
    royal: { name: 'ロイヤル', bg: '#0f0728', wrapperBg: '#1e1b4b', text: '#eab308', sub: '#a855f7', bio: '#fef08a', border: '#2e1065', badgeBg: '#2e1065', badgeText: '#fde047', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.35)' },
    frost: { name: 'フロスト', bg: '#082f49', wrapperBg: '#075985', text: '#38bdf8', sub: '#7dd3fc', bio: '#e0f2fe', border: '#0369a1', badgeBg: '#0369a1', badgeText: '#bae6fd', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.35)' },
    midnight: { name: '黒金', bg: '#09090b', wrapperBg: '#18181b', text: '#facc15', sub: '#a1a1aa', bio: '#e4e4e7', border: '#27272a', badgeBg: '#27272a', badgeText: '#facc15', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.3)' },
    astral: { name: 'アストラル', bg: '#0f172a', wrapperBg: '#1e293b', text: '#38bdf8', sub: '#94a3b8', bio: '#cbd5e1', border: '#1e293b', badgeBg: '#1e293b', badgeText: '#38bdf8', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.3)' },
    sakura: { name: 'サクラ', bg: '#fff5f7', wrapperBg: '#ffe4e6', text: '#881337', sub: '#be123c', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#9f1239', shadow: '0 25px 50px rgba(136, 19, 55, 0.25), 0 0 30px rgba(190, 18, 60, 0.2)' },
    strawberry: { name: 'いちご', bg: '#ffffff', wrapperBg: '#fff1f2', text: '#e11d48', sub: '#fb7185', bio: '#881337', border: '#ffe4e6', badgeBg: '#ffe4e6', badgeText: '#e11d48', shadow: '0 25px 50px rgba(225, 29, 72, 0.25), 0 0 30px rgba(225, 29, 72, 0.2)' },
    chocolat: { name: 'ショコラ', bg: '#fdfbf7', wrapperBg: '#fef3c7', text: '#451a03', sub: '#78350f', bio: '#292524', border: '#fde68a', badgeBg: '#fde68a', badgeText: '#78350f', shadow: '0 25px 50px rgba(69, 26, 3, 0.25), 0 0 30px rgba(120, 53, 15, 0.2)' },
    rose: { name: 'ロゼ', bg: '#fff1f2', wrapperBg: '#ffe4e6', text: '#9f1239', sub: '#e11d48', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#be123c', shadow: '0 25px 50px rgba(159, 18, 57, 0.25), 0 0 30px rgba(159, 18, 57, 0.2)' },
    mint: { name: 'ミント', bg: '#f0fdf4', wrapperBg: '#dcfce7', text: '#047857', sub: '#34d399', bio: '#064e3b', border: '#bbf7d0', badgeBg: '#bbf7d0', badgeText: '#047857', shadow: '0 25px 50px rgba(4, 120, 87, 0.25), 0 0 30px rgba(4, 120, 87, 0.2)' },
    lavender: { name: 'ラベンダー', bg: '#faf5ff', wrapperBg: '#f3e8ff', text: '#6b21a8', sub: '#c084fc', bio: '#3b0764', border: '#e9d5ff', badgeBg: '#e9d5ff', badgeText: '#6b21a8', shadow: '0 25px 50px rgba(107, 33, 168, 0.25), 0 0 30px rgba(107, 33, 168, 0.2)' },
    forest: { name: 'フォレスト', bg: '#f4fbf7', wrapperBg: '#d1fae5', text: '#065f46', sub: '#059669', bio: '#022c22', border: '#a7f3d0', badgeBg: '#a7f3d0', badgeText: '#047857', shadow: '0 25px 50px rgba(6, 95, 70, 0.25), 0 0 30px rgba(6, 95, 70, 0.2)' },
    white: { name: 'ホワイト', bg: '#ffffff', wrapperBg: '#f1f5f9', text: '#0f172a', sub: '#64748b', bio: '#334155', border: '#e2e8f0', badgeBg: '#e2e8f0', badgeText: '#475569', shadow: '0 25px 50px rgba(15, 23, 42, 0.25), 0 0 30px rgba(100, 116, 139, 0.15)' },
    dark: { name: 'ダーク', bg: '#1e293b', wrapperBg: '#0f172a', text: '#f8fafc', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#cbd5e1', shadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.5)' },
    gold: { name: 'ゴールド', bg: '#fefce8', wrapperBg: '#fef08a', text: '#713f12', sub: '#ca8a04', bio: '#422006', border: '#fde047', badgeBg: '#fde047', badgeText: '#854d0e', shadow: '0 25px 50px rgba(113, 63, 18, 0.25), 0 0 30px rgba(202, 138, 4, 0.25)' }
  };

  const activeCardTheme = cardThemes[cardThemeKey];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* 1. ヘッダーナビゲーション */}
      <header style={{
        backgroundColor: colors.panelBg,
        borderBottom: `1px solid ${colors.border}`,
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>📸</span>
          <h1 style={{ margin: 0, fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            FF14 SS Gallery Card
          </h1>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: colors.inputBg,
          padding: '3px',
          borderRadius: '20px',
          border: `1px solid ${colors.border}`,
          flexShrink: 0
        }}>
          <button
            onClick={() => setSiteTheme('light')}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: isLight ? colors.panelBg : 'transparent',
              color: isLight ? colors.text : colors.subText,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '11px',
              boxShadow: isLight ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>☀️</span> ライト
          </button>
          <button
            onClick={() => setSiteTheme('dark')}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: !isLight ? colors.panelBg : 'transparent',
              color: !isLight ? colors.text : colors.subText,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '11px',
              boxShadow: !isLight ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>🌙</span> ダーク
          </button>
        </div>
      </header>

      {/* 2. メインレイアウト（スマホ対応クラス app-main-layout） */}
      <div 
        className="app-main-layout"
        style={{
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '16px',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 360px) 1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* 左側（スマホでは下側）: コントロールパネル */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <SectionCard title="👤 プロフィール情報" colors={colors}>
            <div>
              <Label colors={colors}>キャラクター名</Label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(colors)} />
            </div>

            <div style={{ marginTop: '10px' }}>
              <Label colors={colors}>X (Twitter) ID</Label>
              <input value={twitterId} onChange={(e) => setTwitterId(e.target.value)} style={inputStyle(colors)} placeholder="Cheese_Dohee" />
            </div>

            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <Label colors={colors}>データセンター (DC)</Label>
                <select value={dc} onChange={(e) => setDc(e.target.value)} style={selectStyle(colors)}>
                  {dcOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label colors={colors}>種族 (FF14英語表記)</Label>
                <select value={race} onChange={(e) => setRace(e.target.value)} style={selectStyle(colors)}>
                  {raceOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <Label colors={colors}>🔤 プロフィール全体フォント</Label>
              <select value={cardFont} onChange={(e) => setCardFont(e.target.value)} style={selectStyle(colors)}>
                {fontOptions.map((f) => (
                  <option key={f.label} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '10px' }}>
              <Label colors={colors}>ひとことBio</Label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle(colors)} />
            </div>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
              <Label colors={colors}>🎨 カードデザインテーマ</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '6px' }}>
                {Object.keys(cardThemes).map((key) => {
                  const t = cardThemes[key];
                  const isSelected = cardThemeKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCardThemeKey(key)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: isSelected ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                        backgroundColor: t.bg,
                        color: t.text,
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="🖼️ アバターアイコン設定" colors={colors}>
            <div>
              <Label colors={colors}>メインアイコン画像</Label>
              <FileUploadButton onFileSelect={handleAvatarUpload} colors={colors} />
              {avatar.src && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Slider label="左右位置" value={avatar.x} onChange={(v) => setAvatar({ ...avatar, x: v })} colors={colors} />
                  <Slider label="上下位置" value={avatar.y} onChange={(v) => setAvatar({ ...avatar, y: v })} colors={colors} />
                  <Slider label="拡大" value={avatar.zoom} min={1} max={2} step={0.05} onChange={(v) => setAvatar({ ...avatar, zoom: v })} colors={colors} />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="📷 魅せるSS 3連ギャラリー" colors={colors}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{ marginTop: idx > 0 ? '14px' : '0', paddingTop: idx > 0 ? '12px' : '0', borderTop: idx > 0 ? `1px solid ${colors.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <Label colors={colors}>メインSS {idx + 1}</Label>
                  {gallery[idx].src && (
                    <span style={{ fontSize: '10px', color: colors.accent, fontWeight: '700' }}>✓ 選択済み</span>
                  )}
                </div>
                <FileUploadButton onFileSelect={handleGalleryUpload(idx)} colors={colors} />
                {gallery[idx].src && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Slider label="上下位置" value={gallery[idx].y} onChange={(v) => {
                      const next = [...gallery];
                      next[idx].y = v;
                      setGallery(next);
                    }} colors={colors} />
                    <Slider label="拡大" value={gallery[idx].zoom} min={1} max={2} step={0.05} onChange={(v) => {
                      const next = [...gallery];
                      next[idx].zoom = v;
                      setGallery(next);
                    }} colors={colors} />
                  </div>
                )}
              </div>
            ))}
          </SectionCard>
        </div>

        {/* 右側（スマホでは上側）: プレビューエリア */}
        <div 
          className="app-preview-container"
          style={{
            position: 'sticky',
            top: '70px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <button
            onClick={handleDownload}
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: '800',
              backgroundColor: colors.accent,
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
          >
            <span>📥</span> 高画質PNG画像として保存
          </button>

          <div style={{ width: '100%', maxWidth: '680px', boxSizing: 'border-box' }}>
            {/* 📥 保存対象エリア（四角フレームは影なし） */}
            <div
              ref={cardRef}
              style={{
                width: '100%',
                backgroundColor: activeCardTheme.wrapperBg,
                padding: '16px',
                boxSizing: 'border-box',
                position: 'relative',
                borderRadius: '0px',
                transition: 'background-color 0.2s ease'
              }}
            >
              {/* 角丸のカード本体に立体的な影を指定！ */}
              <div 
                className="responsive-card-inner"
                style={{
                  backgroundColor: activeCardTheme.bg,
                  borderRadius: '16px',
                  padding: '20px',
                  position: 'relative',
                  boxSizing: 'border-box',
                  transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                  fontFamily: cardFont,
                  boxShadow: activeCardTheme.shadow
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div 
                    className="responsive-avatar"
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      border: `3px solid ${activeCardTheme.bg}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      backgroundColor: activeCardTheme.border,
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {avatar.src ? (
                      <img
                        src={avatar.src}
                        alt="Avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `${avatar.x}% ${avatar.y}%`,
                          transform: `scale(${avatar.zoom})`,
                          transformOrigin: 'center'
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🐱</div>
                    )}
                  </div>

                  {/* プロフィールエリア */}
                  <div style={{ flex: 1, paddingTop: '2px', minWidth: 0 }}>
                    {/* 1行目: キャラ名 + @ID + DC/種族バッジ */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h2 
                        className="responsive-name"
                        style={{
                          margin: 0,
                          fontSize: '20px',
                          fontWeight: '800',
                          color: activeCardTheme.text,
                          lineHeight: '1.2',
                          fontFamily: 'inherit'
                        }}
                      >
                        {name}
                      </h2>
                      <span style={{ fontSize: '12px', color: activeCardTheme.sub, fontWeight: '600', fontFamily: 'inherit' }}>
                        @{twitterId}
                      </span>
                      <span style={{
                        backgroundColor: activeCardTheme.badgeBg,
                        color: activeCardTheme.badgeText,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '10.5px',
                        fontWeight: '700',
                        fontFamily: 'inherit'
                      }}>
                        {dc} | {race}
                      </span>
                    </div>

                    {/* 2行目: ひとことBio (左詰め) */}
                    <p style={{
                      margin: 0,
                      fontSize: '11.5px',
                      lineHeight: '1.4',
                      color: activeCardTheme.bio,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}>
                      {bio}
                    </p>
                  </div>
                </div>

                {/* SS ギャラリー */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  {gallery.map((item, idx) => (
                    <div
                      key={idx}
                      className="responsive-gallery-box"
                      style={{
                        width: '100%',
                        height: '240px',
                        borderRadius: '10px',
                        backgroundColor: activeCardTheme.border,
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        position: 'relative'
                      }}
                    >
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={`SS ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: `50% ${item.y}%`,
                            transform: `scale(${item.zoom})`,
                            transformOrigin: 'center'
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: activeCardTheme.sub, gap: '4px' }}>
                          <span style={{ fontSize: '18px' }}>📷</span>
                          <span style={{ fontSize: '10px', fontWeight: '700' }}>SS {idx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', borderTop: `1px solid ${activeCardTheme.border}`, paddingTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '8.5px', color: activeCardTheme.sub, fontFamily: 'inherit' }}>
                    Design Copyright © FF14 SS Showcase Card Generator. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children, colors }) {
  return (
    <div style={{
      backgroundColor: colors.panelBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '14px',
      padding: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '12.5px', fontWeight: '800', letterSpacing: '-0.2px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Label({ children, colors }) {
  return (
    <span style={{ fontSize: '11px', fontWeight: '700', color: colors.subText }}>
      {children}
    </span>
  );
}

function FileUploadButton({ onFileSelect, colors }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '8px 12px',
      backgroundColor: colors.inputBg,
      border: `1px dashed ${colors.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '11.5px',
      fontWeight: '600',
      color: colors.text,
      marginTop: '4px',
      transition: 'all 0.15s ease'
    }}>
      <span>📁 画像を選択</span>
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

function Slider({ label, value, min = 0, max = 100, step = 1, onChange, colors }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: colors.subText }}>
      <span style={{ width: '45px', flexShrink: 0, fontWeight: '600' }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, cursor: 'pointer', accentColor: colors.accent, height: '4px' }}
      />
    </div>
  );
}

const inputStyle = (colors) => ({
  width: '100%',
  padding: '8px 10px',
  backgroundColor: colors.inputBg,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  color: colors.text,
  fontSize: '12px',
  boxSizing: 'border-box',
  outline: 'none',
  marginTop: '4px'
});

const selectStyle = (colors) => ({
  width: '100%',
  padding: '8px 10px',
  backgroundColor: colors.inputBg,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  color: colors.text,
  fontSize: '12px',
  boxSizing: 'border-box',
  outline: 'none',
  marginTop: '4px',
  cursor: 'pointer'
});