import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';

export default function App() {
  const [siteTheme, setSiteTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'images' | 'style'

  // プロフィール情報
  const [name, setName] = useState('Kanon');
  const [dc, setDc] = useState('Mana');
  const [race, setRace] = useState("Miqo'te");
  const [twitterId, setTwitterId] = useState('Cheese_Dohee');
  const [bio, setBio] = useState('FF14メインアカウント。\nこだわりのスクリーンショットをアルバムのように投稿しています📷✨');

  // DC & 種族の選択肢
  const dcOptions = [
    'Mana', 'Elemental', 'Gaia', 'Meteor', 
    'Aether', 'Primal', 'Crystal', 'Dynamis', 
    'Light', 'Chaos', 'Materia'
  ];

  const raceOptions = [
    "Miqo'te", 'Hyur', 'Elezen', 'Lalafell', 
    'Roegadyn', 'Au Ra', 'Hrothgar', 'Viera'
  ];

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

  // カードテーマ
  const [cardThemeKey, setCardThemeKey] = useState('sakura');

  // アイコン画像 ＆ ギャラリー画像
  const [avatar, setAvatar] = useState({ src: null, x: 50, y: 50, zoom: 1 });
  const [gallery, setGallery] = useState([
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 }
  ]);

  const cardRef = useRef(null);
  const containerRef = useRef(null);
  
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  useEffect(() => {
    const linkId = 'google-fonts-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@700&family=Potta+One&family=Yuji+Syuku&family=Kiwi+Maru:wght@500;700&family=Shippori+Mincho:wght@700&family=Zen+Maru+Gothic:wght@700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const styleId = 'responsive-layout-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .app-container { display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: start; }
        @media (max-width: 1024px) { .app-container { display: flex; flex-direction: column; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(parentWidth / 1200, 1);
        setScale(newScale);
      }
    };
    window.addEventListener('resize', updateScale);
    updateScale();
    setTimeout(updateScale, 100);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const compressImage = (file, maxWidth = 1000) => {
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
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedUrl = await compressImage(file, 600);
      setAvatar((prev) => ({ ...prev, src: compressedUrl }));
    }
  };

  const handleBatchGalleryUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length === 0) return;

    const newGallery = [...gallery];
    for (let i = 0; i < files.length; i++) {
      const compressedUrl = await compressImage(files[i], 1000);
      newGallery[i] = { ...newGallery[i], src: compressedUrl };
    }
    setGallery(newGallery);
  };

  const handleGalleryUpload = (index) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedUrl = await compressImage(file, 1000);
      setGallery((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], src: compressedUrl };
        return next;
      });
    }
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1.5,
        skipFonts: false,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      setResultImage(dataUrl);
    } catch (err) {
      console.error(err);
      alert('画像の生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const isLight = siteTheme === 'light';
  const colors = {
    bg: isLight ? '#f1f5f9' : '#0f172a',
    panelBg: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '#e2e8f0' : '#334155',
    text: isLight ? '#0f172a' : '#f8fafc',
    subText: isLight ? '#64748b' : '#94a3b8',
    inputBg: isLight ? '#f8fafc' : '#0f172a',
    accent: '#6366f1',
    accentHover: '#4f46e5',
  };

  const cardThemes = {
    cyber: { name: 'サイバー', bg: '#030712', wrapperBg: '#0f172a', text: '#22d3ee', sub: '#64748b', bio: '#94a3b8', border: '#1f2937', badgeBg: '#1f2937', badgeText: '#22d3ee', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 211, 238, 0.35)' },
    blood: { name: 'ブラッド', bg: '#180202', wrapperBg: '#270303', text: '#f43f5e', sub: '#9f1239', bio: '#fecdd3', border: '#4c0519', badgeBg: '#4c0519', badgeText: '#fb7185', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.35)' },
    royal: { name: 'ロイヤル', bg: '#0f0728', wrapperBg: '#1e1b4b', text: '#eab308', sub: '#a855f7', bio: '#fef08a', border: '#2e1065', badgeBg: '#2e1065', badgeText: '#fde047', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.35)' },
    frost: { name: 'フロスト', bg: '#082f49', wrapperBg: '#075985', text: '#38bdf8', sub: '#7dd3fc', bio: '#e0f2fe', border: '#0369a1', badgeBg: '#0369a1', badgeText: '#bae6fd', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.35)' },
    midnight: { name: '黒金', bg: '#09090b', wrapperBg: '#18181b', text: '#facc15', sub: '#a1a1aa', bio: '#e4e4e7', border: '#27272a', badgeBg: '#27272a', badgeText: '#facc15', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.3)' },
    astral: { name: 'アストラル', bg: '#0f172a', wrapperBg: '#1e293b', text: '#38bdf8', sub: '#94a3b8', bio: '#cbd5e1', border: '#1e293b', badgeBg: '#1e293b', badgeText: '#38bdf8', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.3)' },
    sakura: { name: 'サクラ', bg: '#fff5f7', wrapperBg: '#e5e5e5', text: '#881337', sub: '#be123c', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#9f1239', shadow: '0 15px 40px rgba(136, 19, 55, 0.1)' },
    strawberry: { name: 'いちご', bg: '#ffffff', wrapperBg: '#fff1f2', text: '#e11d48', sub: '#fb7185', bio: '#881337', border: '#ffe4e6', badgeBg: '#ffe4e6', badgeText: '#e11d48', shadow: '0 15px 40px rgba(225, 29, 72, 0.1)' },
    chocolat: { name: 'ショコラ', bg: '#fdfbf7', wrapperBg: '#fef3c7', text: '#451a03', sub: '#78350f', bio: '#292524', border: '#fde68a', badgeBg: '#fde68a', badgeText: '#78350f', shadow: '0 15px 40px rgba(69, 26, 3, 0.1)' },
    rose: { name: 'ロゼ', bg: '#fff1f2', wrapperBg: '#ffe4e6', text: '#9f1239', sub: '#e11d48', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#be123c', shadow: '0 15px 40px rgba(159, 18, 57, 0.1)' },
    mint: { name: 'ミント', bg: '#f0fdf4', wrapperBg: '#dcfce7', text: '#047857', sub: '#34d399', bio: '#064e3b', border: '#bbf7d0', badgeBg: '#bbf7d0', badgeText: '#047857', shadow: '0 15px 40px rgba(4, 120, 87, 0.1)' },
    lavender: { name: 'ラベンダー', bg: '#faf5ff', wrapperBg: '#f3e8ff', text: '#6b21a8', sub: '#c084fc', bio: '#3b0764', border: '#e9d5ff', badgeBg: '#e9d5ff', badgeText: '#6b21a8', shadow: '0 15px 40px rgba(107, 33, 168, 0.1)' },
    forest: { name: 'フォレスト', bg: '#f4fbf7', wrapperBg: '#d1fae5', text: '#065f46', sub: '#059669', bio: '#022c22', border: '#a7f3d0', badgeBg: '#a7f3d0', badgeText: '#047857', shadow: '0 15px 40px rgba(6, 95, 70, 0.1)' },
    white: { name: 'ホワイト', bg: '#ffffff', wrapperBg: '#f1f5f9', text: '#0f172a', sub: '#64748b', bio: '#334155', border: '#e2e8f0', badgeBg: '#e2e8f0', badgeText: '#475569', shadow: '0 20px 40px rgba(15, 23, 42, 0.08)' },
    dark: { name: 'ダーク', bg: '#1e293b', wrapperBg: '#0f172a', text: '#f8fafc', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#cbd5e1', shadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.5)' },
    gold: { name: 'ゴールド', bg: '#fefce8', wrapperBg: '#fef08a', text: '#713f12', sub: '#ca8a04', bio: '#422006', border: '#fde047', badgeBg: '#fde047', badgeText: '#854d0e', shadow: '0 15px 40px rgba(113, 63, 18, 0.15)' }
  };
  const activeCardTheme = cardThemes[cardThemeKey] || cardThemes.sakura;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: "-apple-system, sans-serif", paddingBottom: '40px' }}>
      
      {/* モーダル */}
      {resultImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
            <h3 style={{ color: '#000', margin: '0 0 8px 0' }}>✅ 画像が完成しました！</h3>
            <p style={{ color: '#e11d48', fontWeight: 'bold', margin: '0 0 16px 0', fontSize: '14px' }}>
              スマホの方は画像を「長押し」して保存してください。<br/>(PCの方は右クリック保存)
            </p>
            <img src={resultImage} alt="Completed Card" style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button
              onClick={() => setResultImage(null)}
              style={{ marginTop: '16px', padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header style={{ backgroundColor: colors.panelBg, borderBottom: `1px solid ${colors.border}`, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>📸 FF14 Card Maker</h1>
        <button onClick={() => setSiteTheme(isLight ? 'dark' : 'light')} style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
          {isLight ? '🌙 ダーク' : '☀️ ライト'}
        </button>
      </header>

      {/* メインエリア（左: プレビュー / 右: タブ操作パネル） */}
      <div className="app-container" style={{ maxWidth: '1480px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* 左側: カードプレビューエリア */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: '70px' }}>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              width: '100%', padding: '16px', fontSize: '16px', fontWeight: '800',
              backgroundColor: isGenerating ? '#94a3b8' : colors.accent, color: '#ffffff',
              border: 'none', borderRadius: '12px', cursor: isGenerating ? 'not-allowed' : 'pointer',
              marginBottom: '16px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '📥 画像を保存する'}
          </button>

          <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', height: `${800 * scale}px`, overflow: 'hidden' }}>
            <div style={{
              width: '1200px', height: '800px',
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
            }}>
              
              {/* カード本体 */}
              <div ref={cardRef} style={{
                width: '1200px', height: '800px', backgroundColor: activeCardTheme.wrapperBg,
                padding: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{
                  flex: 1, backgroundColor: activeCardTheme.bg, borderRadius: '40px',
                  padding: '36px 44px', boxSizing: 'border-box', fontFamily: cardFont,
                  boxShadow: activeCardTheme.shadow, display: 'flex', flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  
                  {/* ヘッダーエリア */}
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '150px', height: '150px', borderRadius: '50%',
                      border: `8px solid ${activeCardTheme.wrapperBg}`, backgroundColor: activeCardTheme.border,
                      overflow: 'hidden', flexShrink: 0
                    }}>
                      {avatar.src ? (
                        <img src={avatar.src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${avatar.x}% ${avatar.y}%`, transform: `scale(${avatar.zoom})` }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🐱</div>
                      )}
                    </div>

                    <div style={{ flex: 1, paddingTop: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <h2 style={{ margin: 0, fontSize: '42px', fontWeight: '900', color: activeCardTheme.text, letterSpacing: '1px' }}>{name}</h2>
                        <span style={{ fontSize: '24px', color: activeCardTheme.sub, fontWeight: '700' }}>@{twitterId}</span>
                        <span style={{
                          backgroundColor: activeCardTheme.badgeBg, color: activeCardTheme.badgeText,
                          padding: '8px 16px', borderRadius: '12px', fontSize: '18px', fontWeight: '800'
                        }}>
                          {dc} | {race}
                        </span>
                      </div>
                      <p style={{ margin: '14px 0 0 0', fontSize: '22px', lineHeight: '1.5', color: activeCardTheme.bio, whiteSpace: 'pre-wrap', fontWeight: '500' }}>
                        {bio}
                      </p>
                    </div>

                    <div style={{ fontSize: '44px', color: activeCardTheme.sub, letterSpacing: '2px', lineHeight: '1', paddingTop: '6px', opacity: 0.6 }}>
                      •••
                    </div>
                  </div>

                  {/* ギャラリーエリア */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', flex: 1, marginTop: '28px', minHeight: 0 }}>
                    {gallery.map((item, idx) => (
                      <div key={idx} style={{
                        width: '100%', height: '100%', borderRadius: '24px', backgroundColor: activeCardTheme.border,
                        overflow: 'hidden', position: 'relative', isolation: 'isolate', transform: 'translateZ(0)'
                      }}>
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={`SS ${idx+1}`}
                            style={{
                              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                              objectFit: 'cover', objectPosition: `50% ${item.y}%`,
                              transform: `scale(${item.zoom})`, transformOrigin: `50% ${item.y}%`
                            }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeCardTheme.sub, fontSize: '30px' }}>📷 {idx + 1}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* フッター */}
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <span style={{ fontSize: '15px', color: activeCardTheme.sub, fontWeight: '500' }}>
                      Design Copyright © FF14 SS Showcase Card Generator. All rights reserved.
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 右側: タブ型操作パネル */}
        <div style={{ backgroundColor: colors.panelBg, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          
          {/* タブヘッダー */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.inputBg }}>
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} colors={colors}>
              👤 プロフィール
            </TabButton>
            <TabButton active={activeTab === 'images'} onClick={() => setActiveTab('images')} colors={colors}>
              🖼️ 画像設定
            </TabButton>
            <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} colors={colors}>
              🎨 デザイン
            </TabButton>
          </div>

          {/* タブコンテンツ */}
          <div style={{ padding: '20px' }}>
            
            {/* タブ1: プロフィール */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle(colors)}>キャラクター名</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(colors)} placeholder="例: Kanon" />
                </div>

                <div>
                  <label style={labelStyle(colors)}>X (Twitter) ID</label>
                  <input value={twitterId} onChange={(e) => setTwitterId(e.target.value)} style={inputStyle(colors)} placeholder="例: Cheese_Dohee" />
                </div>

                {/* DC・種族 (プルダウン選択) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={labelStyle(colors)}>データセンター (DC)</label>
                    <select value={dc} onChange={(e) => setDc(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                      {dcOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle(colors)}>種族</label>
                    <select value={race} onChange={(e) => setRace(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                      {raceOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle(colors)}>自己紹介・ひとこと</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} style={inputStyle(colors)} placeholder="自己紹介テキスト" />
                </div>
              </div>
            )}

            {/* タブ2: 画像設定 */}
            {activeTab === 'images' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: colors.text }}>👤 アイコン画像</h4>
                  <FileUploadButton label="📁 画像を変更" onFileSelect={handleAvatarUpload} colors={colors} />
                  {avatar.src && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Slider label="左右" value={avatar.x} step={1} onChange={(v) => setAvatar({ ...avatar, x: v })} colors={colors} />
                      <Slider label="上下" value={avatar.y} step={1} onChange={(v) => setAvatar({ ...avatar, y: v })} colors={colors} />
                      <Slider label="拡大" value={avatar.zoom} min={1} max={2} step={0.02} onChange={(v) => setAvatar({ ...avatar, zoom: v })} colors={colors} />
                    </div>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: 0 }} />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', color: colors.text }}>📷 ギャラリー画像 (3枚)</h4>
                  </div>
                  
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
                    backgroundColor: colors.accent, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px'
                  }}>
                    📁 3枚まとめて読み込む
                    <input type="file" accept="image/*" multiple onChange={handleBatchGalleryUpload} style={{ display: 'none' }} />
                  </label>

                  {[0, 1, 2].map((idx) => (
                    <div key={idx} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: idx !== 2 ? `1px solid ${colors.border}` : 'none' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.subText }}>SS {idx + 1} {gallery[idx].src && '✅'}</span>
                      <FileUploadButton label={`📁 SS ${idx + 1} を個別に選択`} onFileSelect={handleGalleryUpload(idx)} colors={colors} />
                      {gallery[idx].src && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <Slider label="上下" value={gallery[idx].y} step={1} onChange={(v) => { const n = [...gallery]; n[idx].y = v; setGallery(n); }} colors={colors} />
                          <Slider label="拡大" value={gallery[idx].zoom} min={1} max={2} step={0.02} onChange={(v) => { const n = [...gallery]; n[idx].zoom = v; setGallery(n); }} colors={colors} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* タブ3: デザイン・テーマ */}
            {activeTab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle(colors)}>カードフォント</label>
                  <select value={cardFont} onChange={(e) => setCardFont(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                    {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle(colors)}>カラーテーマ (16種)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
                    {Object.keys(cardThemes).map((key) => (
                      <button key={key} onClick={() => setCardThemeKey(key)} style={{
                        padding: '10px 8px', borderRadius: '8px',
                        border: cardThemeKey === key ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                        backgroundColor: cardThemes[key].bg, color: cardThemes[key].text, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                        <span>{cardThemes[key].name}</span>
                        {cardThemeKey === key && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, colors }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 8px', border: 'none',
        backgroundColor: active ? colors.panelBg : 'transparent',
        color: active ? colors.accent : colors.subText,
        fontWeight: active ? '800' : '600',
        fontSize: '12px', cursor: 'pointer',
        borderBottom: active ? `2px solid ${colors.accent}` : '2px solid transparent',
        transition: 'all 0.15s ease'
      }}
    >
      {children}
    </button>
  );
}

function FileUploadButton({ label, onFileSelect, colors }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
      backgroundColor: colors.inputBg, border: `1px dashed ${colors.border}`, borderRadius: '8px',
      cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: colors.text, marginTop: '4px'
    }}>
      {label}
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

function Slider({ label, value, min = 0, max = 100, step = 1, onChange, colors }) {
  const handleDec = () => onChange(Math.max(min, value - step));
  const handleInc = () => onChange(Math.min(max, value + step));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.subText }}>
      <span style={{ width: '36px', fontWeight: 'bold' }}>{label}</span>
      <button onClick={handleDec} style={btnStyle(colors)}>－</button>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ flex: 1, accentColor: colors.accent, height: '6px' }} />
      <button onClick={handleInc} style={btnStyle(colors)}>＋</button>
    </div>
  );
}

const labelStyle = (colors) => ({
  fontSize: '11px', fontWeight: 'bold', color: colors.subText, display: 'block', marginBottom: '4px'
});

const inputStyle = (colors) => ({
  width: '100%', padding: '10px', backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`,
  borderRadius: '8px', color: colors.text, fontSize: '13px', boxSizing: 'border-box', outline: 'none'
});

const btnStyle = (colors) => ({
  width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '6px',
  color: colors.text, fontWeight: 'bold', cursor: 'pointer'
});