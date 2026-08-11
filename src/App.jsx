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

  // カードテーマ
  const [cardThemeKey, setCardThemeKey] = useState('cyber');

  // アイコン画像 ＆ ギャラリー画像
  const [avatar, setAvatar] = useState({ src: null, x: 50, y: 50, zoom: 1 });
  const [gallery, setGallery] = useState([
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 }
  ]);

  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  
  // プレビューの縮小率（スマホ画面に収める用）
  const [scale, setScale] = useState(1);
  // 画像生成の状態管理
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  // Webフォント読み込み
  useEffect(() => {
    const linkId = 'google-fonts-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@700&family=Potta+One&family=Yuji+Syuku&family=Kiwi+Maru:wght@500;700&family=Shippori+Mincho:wght@700&family=Zen+Maru+Gothic:wght@700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  // 画面幅に合わせて1200pxのカードを縮小表示する計算
  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const parentWidth = wrapperRef.current.offsetWidth;
        // 最大1200px。画面がそれより小さければ縮小する
        const newScale = Math.min(parentWidth / 1200, 1);
        setScale(newScale);
      }
    };
    window.addEventListener('resize', updateScale);
    updateScale(); // 初回実行
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // 画像圧縮処理（スマホのメモリ不足対策で最大幅を少し小さめに）
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

  // 画像生成処理（スマホでも確実な長押し保存用モーダルを表示）
  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      // 1200x800の固定サイズで高画質にキャプチャ
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1.5, // Xで綺麗に見える1.5倍解像度 (1800x1200)
        skipFonts: false,
        style: {
          transform: 'scale(1)', // キャプチャ時は縮小を解除
          transformOrigin: 'top left'
        }
      });
      setResultImage(dataUrl);
    } catch (err) {
      console.error(err);
      alert('画像の生成に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsGenerating(false);
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

  const cardThemes = {
    cyber: { name: 'サイバー', bg: '#030712', wrapperBg: '#0f172a', text: '#22d3ee', sub: '#64748b', bio: '#94a3b8', border: '#1f2937', badgeBg: '#1f2937', badgeText: '#22d3ee', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 211, 238, 0.35)' },
    blood: { name: 'ブラッド', bg: '#180202', wrapperBg: '#270303', text: '#f43f5e', sub: '#9f1239', bio: '#fecdd3', border: '#4c0519', badgeBg: '#4c0519', badgeText: '#fb7185', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.35)' },
    royal: { name: 'ロイヤル', bg: '#0f0728', wrapperBg: '#1e1b4b', text: '#eab308', sub: '#a855f7', bio: '#fef08a', border: '#2e1065', badgeBg: '#2e1065', badgeText: '#fde047', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.35)' },
    sakura: { name: 'サクラ', bg: '#fff5f7', wrapperBg: '#ffe4e6', text: '#881337', sub: '#be123c', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#9f1239', shadow: '0 25px 50px rgba(136, 19, 55, 0.25), 0 0 30px rgba(190, 18, 60, 0.2)' },
    white: { name: 'ホワイト', bg: '#ffffff', wrapperBg: '#f1f5f9', text: '#0f172a', sub: '#64748b', bio: '#334155', border: '#e2e8f0', badgeBg: '#e2e8f0', badgeText: '#475569', shadow: '0 25px 50px rgba(15, 23, 42, 0.25), 0 0 30px rgba(100, 116, 139, 0.15)' },
    dark: { name: 'ダーク', bg: '#1e293b', wrapperBg: '#0f172a', text: '#f8fafc', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#cbd5e1', shadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.5)' }
  };
  const activeCardTheme = cardThemes[cardThemeKey] || cardThemes.cyber;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: "-apple-system, sans-serif", paddingBottom: '40px' }}>
      
      {/* 保存用モーダル（スマホ長押し対応） */}
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
      <header style={{ backgroundColor: colors.panelBg, borderBottom: `1px solid ${colors.border}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>📸 FF14 Card Maker</h1>
        <button onClick={() => setSiteTheme(isLight ? 'dark' : 'light')} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, cursor: 'pointer', fontWeight: 'bold' }}>
          {isLight ? '🌙 ダーク' : '☀️ ライト'}
        </button>
      </header>

      {/* メインエリア */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '24px', flexDirection: 'column-reverse' }}>
        
        {/* 操作パネル */}
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <SectionCard title="👤 プロフィール" colors={colors}>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(colors)} placeholder="キャラクター名" />
            <input value={twitterId} onChange={(e) => setTwitterId(e.target.value)} style={inputStyle(colors)} placeholder="X (Twitter) ID" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <input value={dc} onChange={(e) => setDc(e.target.value)} style={inputStyle(colors)} placeholder="DC (例: Mana)" />
              <input value={race} onChange={(e) => setRace(e.target.value)} style={inputStyle(colors)} placeholder="種族 (例: Miqo'te)" />
            </div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={inputStyle(colors)} placeholder="ひとこと" />
            <select value={cardFont} onChange={(e) => setCardFont(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
              {fontOptions.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
            </select>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '12px' }}>
              {Object.keys(cardThemes).map((key) => (
                <button key={key} onClick={() => setCardThemeKey(key)} style={{
                  padding: '8px', borderRadius: '6px', border: cardThemeKey === key ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                  backgroundColor: cardThemes[key].bg, color: cardThemes[key].text, fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                  {cardThemes[key].name}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="🖼️ アイコン画像" colors={colors}>
            <FileUploadButton onFileSelect={handleAvatarUpload} colors={colors} />
            {avatar.src && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Slider label="左右" value={avatar.x} step={1} onChange={(v) => setAvatar({ ...avatar, x: v })} colors={colors} />
                <Slider label="上下" value={avatar.y} step={1} onChange={(v) => setAvatar({ ...avatar, y: v })} colors={colors} />
                <Slider label="拡大" value={avatar.zoom} min={1} max={2} step={0.02} onChange={(v) => setAvatar({ ...avatar, zoom: v })} colors={colors} />
              </div>
            )}
          </SectionCard>

          <SectionCard title="📷 ギャラリー (3枚)" colors={colors}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: idx !== 2 ? `1px solid ${colors.border}` : 'none' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.subText }}>SS {idx + 1} {gallery[idx].src && '✅'}</span>
                <FileUploadButton onFileSelect={handleGalleryUpload(idx)} colors={colors} />
                {gallery[idx].src && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Slider label="上下" value={gallery[idx].y} step={1} onChange={(v) => { const n = [...gallery]; n[idx].y = v; setGallery(n); }} colors={colors} />
                    <Slider label="拡大" value={gallery[idx].zoom} min={1} max={2} step={0.02} onChange={(v) => { const n = [...gallery]; n[idx].zoom = v; setGallery(n); }} colors={colors} />
                  </div>
                )}
              </div>
            ))}
          </SectionCard>
        </div>

        {/* プレビュー ＆ 保存エリア */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              width: '100%', maxWidth: '600px', padding: '16px', fontSize: '16px', fontWeight: '800',
              backgroundColor: isGenerating ? '#94a3b8' : colors.accent, color: '#ffffff',
              border: 'none', borderRadius: '12px', cursor: isGenerating ? 'not-allowed' : 'pointer',
              marginBottom: '16px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '📥 画像を生成する (長押し保存対応)'}
          </button>

          {/* 
            【超重要】
            親コンテナ(wrapperRef)の幅に合わせて、固定サイズ(1200x800)のカードをscaleで縮小表示する。
            これにより、スマホでも崩れず、生成時も絶対に1200x800が維持される！
          */}
          <div ref={wrapperRef} style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '1200px', height: '800px', // ここでX向けの最強サイズ (3:2) を完全固定！
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.1s ease',
            }}>
              
              {/* === ここから下が出力される画像本体 === */}
              <div ref={cardRef} style={{ width: '1200px', height: '800px', backgroundColor: activeCardTheme.wrapperBg, padding: '32px', boxSizing: 'border-box' }}>
                <div style={{
                  width: '100%', height: '100%', backgroundColor: activeCardTheme.bg, borderRadius: '24px',
                  padding: '40px', boxSizing: 'border-box', fontFamily: cardFont, boxShadow: activeCardTheme.shadow,
                  display: 'flex', flexDirection: 'column', gap: '32px'
                }}>
                  
                  {/* 上部：プロフィールエリア */}
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    {/* アバター */}
                    <div style={{
                      width: '180px', height: '180px', borderRadius: '50%', border: `6px solid ${activeCardTheme.bg}`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', backgroundColor: activeCardTheme.border, overflow: 'hidden', flexShrink: 0
                    }}>
                      {avatar.src ? (
                        <img src={avatar.src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${avatar.x}% ${avatar.y}%`, transform: `scale(${avatar.zoom})` }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🐱</div>
                      )}
                    </div>

                    {/* 名前とBio */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <h2 style={{ margin: 0, fontSize: '48px', fontWeight: '800', color: activeCardTheme.text, lineHeight: '1' }}>{name}</h2>
                        <span style={{ fontSize: '24px', color: activeCardTheme.sub, fontWeight: '600' }}>@{twitterId}</span>
                      </div>
                      <div style={{ display: 'inline-block', backgroundColor: activeCardTheme.badgeBg, color: activeCardTheme.badgeText, padding: '8px 16px', borderRadius: '12px', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                        {dc} | {race}
                      </div>
                      <p style={{ margin: 0, fontSize: '22px', lineHeight: '1.6', color: activeCardTheme.bio, whiteSpace: 'pre-wrap' }}>
                        {bio}
                      </p>
                    </div>
                  </div>

                  {/* 下部：ギャラリーエリア */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', flex: 1 }}>
                    {gallery.map((item, idx) => (
                      <div key={idx} style={{ width: '100%', height: '100%', borderRadius: '16px', backgroundColor: activeCardTheme.border, overflow: 'hidden', position: 'relative' }}>
                        {item.src ? (
                          <img src={item.src} alt={`SS ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${item.y}%`, transform: `scale(${item.zoom})` }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeCardTheme.sub, fontSize: '30px' }}>📷 {idx + 1}</div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
              {/* === 出力画像ここまで === */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 部品コンポーネント
function SectionCard({ title, children, colors }) {
  return (
    <div style={{ backgroundColor: colors.panelBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800' }}>{title}</h3>
      {children}
    </div>
  );
}

function FileUploadButton({ onFileSelect, colors }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
      backgroundColor: colors.inputBg, border: `1px dashed ${colors.border}`, borderRadius: '8px',
      cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: colors.text, marginTop: '4px'
    }}>
      📁 画像を選択
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

// 👑 プラス・マイナスボタン付きの新型スライダー！
function Slider({ label, value, min = 0, max = 100, step = 1, onChange, colors }) {
  const handleDec = () => onChange(Math.max(min, value - step));
  const handleInc = () => onChange(Math.min(max, value + step));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.subText }}>
      <span style={{ width: '40px', fontWeight: 'bold' }}>{label}</span>
      <button onClick={handleDec} style={btnStyle(colors)}>－</button>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: colors.accent, height: '6px' }}
      />
      <button onClick={handleInc} style={btnStyle(colors)}>＋</button>
    </div>
  );
}

const inputStyle = (colors) => ({
  width: '100%', padding: '10px', backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`,
  borderRadius: '8px', color: colors.text, fontSize: '13px', boxSizing: 'border-box', outline: 'none', marginTop: '6px'
});

const btnStyle = (colors) => ({
  width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '6px',
  color: colors.text, fontWeight: 'bold', cursor: 'pointer'
});