import { useState, useRef, useEffect } from 'react';

// --- 画像調整用モーダルコンポーネント ---
function CropModal({ imageSrc, cropType = 'gallery', initialX = 50, initialY = 50, initialZoom = 1, onSave, onClose }) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const isAvatar = cropType === 'avatar';

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX - x, y: e.clientY - y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = Math.min(100, Math.max(0, e.clientX - startPos.current.x));
    const newY = Math.min(100, Math.max(0, e.clientY - startPos.current.y));
    setX(newX);
    setY(newY);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startPos.current = { x: e.touches[0].clientX - x, y: e.touches[0].clientY - y };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = Math.min(100, Math.max(0, e.touches[0].clientX - startPos.current.x));
    const newY = Math.min(100, Math.max(0, e.touches[0].clientY - startPos.current.y));
    setX(newX);
    setY(newY);
  };

  // 実際の設定比率に合わせる（アイコン: 1:1円形, ギャラリー: 284:455 の縦長比率）
  const containerWidth = isAvatar ? 260 : 250;
  const containerHeight = isAvatar ? 260 : Math.round(250 * (455 / 284)); // 約 400px

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', maxWidth: '480px', width: '100%', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>✋ 画像の位置・縮小拡大の調整</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          実物と同じ比率の枠内をドラッグ（操作）して表示範囲を決めてください。
        </p>

        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            borderRadius: isAvatar ? '50%' : '20px',
            border: '3px dashed #6366f1',
            overflow: 'hidden', position: 'relative', cursor: isDragging ? 'grabbing' : 'grab',
            backgroundColor: '#0f172a', userSelect: 'none', touchAction: 'none',
            isolation: 'isolate', boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <img
            src={imageSrc}
            alt="Crop target"
            draggable={false}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: `${x}% ${y}%`,
              transform: `scale(${zoom})`,
              pointerEvents: 'none'
            }}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>🔍 拡大率</span>
          <input
            type="range" min="1" max="2.5" step="0.05" value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', width: '100%' }}>
          <button
            onClick={() => onSave({ x, y, zoom })}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            決定する
          </button>
          <button
            onClick={onClose}
            style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#334155', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [siteTheme, setSiteTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('profile');

  // 初期値の変更
  const [name, setName] = useState('光の戦士');
  const [dc, setDc] = useState('Mana');
  const [race, setRace] = useState("Miqo'te");
  const [twitterId, setTwitterId] = useState('hika_sen');
  const [bio, setBio] = useState('FF14メインアカウント。\nこだわりのスクリーンショットをアルバムのように投稿しています📷✨');

  const dcOptions = ['Mana', 'Elemental', 'Gaia', 'Meteor', 'Aether', 'Primal', 'Crystal', 'Dynamis', 'Light', 'Chaos', 'Materia'];
  const raceOptions = ["Miqo'te", 'Hyur', 'Elezen', 'Lalafell', 'Roegadyn', 'Au Ra', 'Hrothgar', 'Viera'];

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

  // 全24種類のテーマ（4カテゴリ）
  const themeCategories = ['すべて', 'シンプル', 'かわいい', 'かっこいい', 'ゴージャス'];
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const cardThemes = {
    // --- シンプル ---
    white: { category: 'シンプル', name: 'ホワイト', bg: '#ffffff', wrapperBg: '#f1f5f9', text: '#0f172a', sub: '#64748b', bio: '#334155', border: '#e2e8f0', badgeBg: '#e2e8f0', badgeText: '#475569', shadow: '0 20px 40px rgba(15, 23, 42, 0.12)', shadowColor: 'rgba(15, 23, 42, 0.2)' },
    dark: { category: 'シンプル', name: 'ダーク', bg: '#1e293b', wrapperBg: '#0f172a', text: '#f8fafc', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#cbd5e1', shadow: '0 25px 60px rgba(0, 0, 0, 0.8)', shadowColor: 'rgba(0, 0, 0, 0.7)' },
    monochrome: { category: 'シンプル', name: 'モノクロ', bg: '#111111', wrapperBg: '#222222', text: '#ffffff', sub: '#888888', bio: '#cccccc', border: '#333333', badgeBg: '#333333', badgeText: '#ffffff', shadow: '0 20px 50px rgba(0,0,0,0.8)', shadowColor: 'rgba(0, 0, 0, 0.8)' },
    gray: { category: 'シンプル', name: 'グレイッシュ', bg: '#f8fafc', wrapperBg: '#e2e8f0', text: '#334155', sub: '#64748b', bio: '#475569', border: '#cbd5e1', badgeBg: '#cbd5e1', badgeText: '#1e293b', shadow: '0 15px 35px rgba(0,0,0,0.1)', shadowColor: 'rgba(0,0,0,0.15)' },
    mocha: { category: 'シンプル', name: 'モカ', bg: '#fdfbf7', wrapperBg: '#f5f0eb', text: '#54433a', sub: '#8c7a6b', bio: '#6e5d4f', border: '#e6ded6', badgeBg: '#e6ded6', badgeText: '#54433a', shadow: '0 15px 35px rgba(84,67,58,0.15)', shadowColor: 'rgba(84,67,58,0.2)' },
    minimal: { category: 'シンプル', name: 'ミニマル', bg: '#ffffff', wrapperBg: '#e5e7eb', text: '#111827', sub: '#6b7280', bio: '#374151', border: '#d1d5db', badgeBg: '#f3f4f6', badgeText: '#111827', shadow: '0 10px 30px rgba(0,0,0,0.08)', shadowColor: 'rgba(0,0,0,0.12)' },

    // --- かわいい ---
    sakura: { category: 'かわいい', name: 'サクラ', bg: '#fff0f3', wrapperBg: '#ffe4e8', text: '#9f1239', sub: '#be123c', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#9f1239', shadow: '0 18px 45px rgba(136, 19, 55, 0.18)', shadowColor: 'rgba(136, 19, 55, 0.25)' },
    strawberry: { category: 'かわいい', name: 'いちご', bg: '#ffffff', wrapperBg: '#fff1f2', text: '#e11d48', sub: '#fb7185', bio: '#881337', border: '#ffe4e6', badgeBg: '#ffe4e6', badgeText: '#e11d48', shadow: '0 18px 45px rgba(225, 29, 72, 0.18)', shadowColor: 'rgba(225, 29, 72, 0.25)' },
    mint: { category: 'かわいい', name: 'ミント', bg: '#f0fdf4', wrapperBg: '#dcfce7', text: '#15803d', sub: '#22c55e', bio: '#14532d', border: '#bbf7d0', badgeBg: '#bbf7d0', badgeText: '#15803d', shadow: '0 18px 45px rgba(21, 128, 61, 0.18)', shadowColor: 'rgba(21, 128, 61, 0.25)' },
    lavender: { category: 'かわいい', name: 'ラベンダー', bg: '#faf5ff', wrapperBg: '#f3e8ff', text: '#7e22ce', sub: '#a855f7', bio: '#581c87', border: '#e9d5ff', badgeBg: '#e9d5ff', badgeText: '#7e22ce', shadow: '0 18px 45px rgba(126, 34, 206, 0.18)', shadowColor: 'rgba(126, 34, 206, 0.25)' },
    honey: { category: 'かわいい', name: 'ハニー', bg: '#fffbeb', wrapperBg: '#fef3c7', text: '#b45309', sub: '#f59e0b', bio: '#78350f', border: '#fde68a', badgeBg: '#fde68a', badgeText: '#b45309', shadow: '0 18px 45px rgba(180, 83, 9, 0.18)', shadowColor: 'rgba(180, 83, 9, 0.25)' },
    peach: { category: 'かわいい', name: 'ピーチ', bg: '#fff7ed', wrapperBg: '#ffedd5', text: '#c2410c', sub: '#f97316', bio: '#7c2d12', border: '#fed7aa', badgeBg: '#fed7aa', badgeText: '#c2410c', shadow: '0 18px 45px rgba(194, 65, 12, 0.18)', shadowColor: 'rgba(194, 65, 12, 0.25)' },

    // --- かっこいい ---
    cyber: { category: 'かっこいい', name: 'サイバー', bg: '#030712', wrapperBg: '#0f172a', text: '#22d3ee', sub: '#64748b', bio: '#94a3b8', border: '#1f2937', badgeBg: '#1f2937', badgeText: '#22d3ee', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 211, 238, 0.35)', shadowColor: 'rgba(34, 211, 238, 0.45)' },
    blood: { category: 'かっこいい', name: 'ブラッド', bg: '#180202', wrapperBg: '#270303', text: '#f43f5e', sub: '#9f1239', bio: '#fecdd3', border: '#4c0519', badgeBg: '#4c0519', badgeText: '#fb7185', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.35)', shadowColor: 'rgba(244, 63, 94, 0.45)' },
    frost: { category: 'かっこいい', name: 'フロスト', bg: '#082f49', wrapperBg: '#075985', text: '#38bdf8', sub: '#7dd3fc', bio: '#e0f2fe', border: '#0369a1', badgeBg: '#0369a1', badgeText: '#bae6fd', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.35)', shadowColor: 'rgba(56, 189, 248, 0.45)' },
    navy: { category: 'かっこいい', name: 'ネイビー', bg: '#0f172a', wrapperBg: '#1e293b', text: '#38bdf8', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#38bdf8', shadow: '0 20px 50px rgba(0,0,0,0.6)', shadowColor: 'rgba(0, 0, 0, 0.6)' },
    emerald: { category: 'かっこいい', name: 'エメラルド', bg: '#022c22', wrapperBg: '#064e3b', text: '#34d399', sub: '#059669', bio: '#a7f3d0', border: '#047857', badgeBg: '#047857', badgeText: '#a7f3d0', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(52, 211, 153, 0.3)', shadowColor: 'rgba(52, 211, 153, 0.4)' },
    neonPurple: { category: 'かっこいい', name: 'ネオンパープル', bg: '#1a0b2e', wrapperBg: '#2b1055', text: '#c084fc', sub: '#8b5cf6', bio: '#e9d5ff', border: '#581c87', badgeBg: '#581c87', badgeText: '#c084fc', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(192, 132, 252, 0.35)', shadowColor: 'rgba(192, 132, 252, 0.45)' },

    // --- ゴージャス ---
    midnight: { category: 'ゴージャス', name: '黒金', bg: '#09090b', wrapperBg: '#18181b', text: '#facc15', sub: '#a1a1aa', bio: '#e4e4e7', border: '#27272a', badgeBg: '#27272a', badgeText: '#facc15', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.3)', shadowColor: 'rgba(250, 204, 21, 0.4)' },
    royal: { category: 'ゴージャス', name: 'ロイヤル', bg: '#0f0728', wrapperBg: '#1e1b4b', text: '#eab308', sub: '#a855f7', bio: '#fef08a', border: '#2e1065', badgeBg: '#2e1065', badgeText: '#fde047', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.35)', shadowColor: 'rgba(234, 179, 8, 0.45)' },
    glass: { category: 'ゴージャス', name: 'クリスタル', bg: 'rgba(255, 255, 255, 0.45)', wrapperBg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', text: '#0f172a', sub: '#475569', bio: '#1e293b', border: 'rgba(255, 255, 255, 0.6)', badgeBg: 'rgba(255, 255, 255, 0.6)', badgeText: '#0369a1', shadow: '0 20px 50px rgba(31, 38, 135, 0.2)', backdropFilter: 'blur(16px)', shadowColor: 'rgba(31, 38, 135, 0.3)' },
    glassDark: { category: 'ゴージャス', name: 'ダークガラス', bg: 'rgba(15, 23, 42, 0.55)', wrapperBg: 'linear-gradient(135deg, #0f172a 0%, #2e1065 100%)', text: '#f8fafc', sub: '#cbd5e1', bio: '#e2e8f0', border: 'rgba(255, 255, 255, 0.15)', badgeBg: 'rgba(255, 255, 255, 0.15)', badgeText: '#38bdf8', shadow: '0 25px 50px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(16px)', shadowColor: 'rgba(0, 0, 0, 0.65)' },
    champagne: { category: 'ゴージャス', name: 'シャンパン', bg: '#2b2319', wrapperBg: '#3d3224', text: '#f3d08a', sub: '#c5a059', bio: '#fcefc7', border: '#594935', badgeBg: '#594935', badgeText: '#f3d08a', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(243, 208, 138, 0.3)', shadowColor: 'rgba(243, 208, 138, 0.4)' },
    deepRose: { category: 'ゴージャス', name: 'ディープローズ', bg: '#230914', wrapperBg: '#3b1022', text: '#f472b6', sub: '#be185d', bio: '#fbcfe8', border: '#58122c', badgeBg: '#58122c', badgeText: '#f472b6', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 114, 182, 0.3)', shadowColor: 'rgba(244, 114, 182, 0.4)' }
  };
  const [cardThemeKey, setCardThemeKey] = useState('sakura');

  const [avatar, setAvatar] = useState({ src: null, x: 50, y: 50, zoom: 1 });
  const [gallery, setGallery] = useState([
    { src: null, x: 50, y: 50, zoom: 1 },
    { src: null, x: 50, y: 50, zoom: 1 },
    { src: null, x: 50, y: 50, zoom: 1 }
  ]);

  // ドラッグ＆ドロップ状態の管理
  const [isDragOverAvatar, setIsDragOverAvatar] = useState(false);
  const [dragOverGalleryIndex, setDragOverGalleryIndex] = useState(null);

  const [activeCrop, setActiveCrop] = useState(null);
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
      link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@700&family=Potta One&family=Yuji+Syuku&family=Kiwi+Maru:wght@500;700&family=Shippori+Mincho:wght@700&family=Zen+Maru+Gothic:wght@700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const styleId = 'responsive-layout-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .app-container { 
          display: grid; 
          grid-template-columns: minmax(0, 1fr) 380px; 
          gap: 24px; 
          align-items: start;
        }
        .panel-area {
          position: sticky;
          top: 70px;
          max-height: calc(100vh - 90px);
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 1024px) { 
          .app-container { 
            display: flex; 
            flex-direction: column; 
          } 
          .preview-area {
            position: sticky;
            top: 54px;
            z-index: 80;
            padding-bottom: 12px;
          }
          .panel-area {
            position: static;
            max-height: 500px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(parentWidth / 1200, 1.0);
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
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
      };
    });
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    const compressedUrl = await compressImage(file, 600);
    setAvatar({ src: compressedUrl, x: 50, y: 50, zoom: 1 });
    setActiveCrop({ type: 'avatar', src: compressedUrl, x: 50, y: 50, zoom: 1 });
  };

  const handleGalleryUpload = (index) => async (file) => {
    if (!file) return;
    const compressedUrl = await compressImage(file, 1000);
    setGallery((prev) => {
      const next = [...prev];
      next[index] = { src: compressedUrl, x: 50, y: 50, zoom: 1 };
      return next;
    });
    setActiveCrop({ type: 'gallery', index, src: compressedUrl, x: 50, y: 50, zoom: 1 });
  };

  // ドラッグ＆ドロップ処理（プレビュー画面から直接）
  const handleDropAvatar = async (e) => {
    e.preventDefault();
    setIsDragOverAvatar(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleAvatarUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDropGallery = (index) => async (e) => {
    e.preventDefault();
    setDragOverGalleryIndex(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleGalleryUpload(index)(e.dataTransfer.files[0]);
    }
  };

  const handleSaveCrop = (cropData) => {
    if (activeCrop.type === 'avatar') {
      setAvatar((prev) => ({ ...prev, ...cropData }));
    } else if (activeCrop.type === 'gallery') {
      setGallery((prev) => {
        const next = [...prev];
        next[activeCrop.index] = { ...next[activeCrop.index], ...cropData };
        return next;
      });
    }
    setActiveCrop(null);
  };

  const moveGalleryItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= gallery.length) return;
    const newGallery = [...gallery];
    const [moved] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, moved);
    setGallery(newGallery);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      const theme = cardThemes[cardThemeKey] || cardThemes.sakura;

      const drawRoundRect = (x, y, w, h, r) => {
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
        }
      };

      // 背景の描画
      if (theme.wrapperBg.startsWith('linear-gradient')) {
        const grad = ctx.createLinearGradient(0, 0, 1200, 800);
        if (cardThemeKey === 'glassDark') {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(1, '#2e1065');
        } else {
          grad.addColorStop(0, '#a1c4fd');
          grad.addColorStop(1, '#c2e9fb');
        }
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = theme.wrapperBg;
      }
      ctx.fillRect(0, 0, 1200, 800);

      const margin = 40;
      const cardW = 1200 - margin * 2;
      const cardH = 800 - margin * 2;
      const cardX = margin;
      const cardY = margin;

      // 1. 角丸カードの外側にドロップシャドウを描画
      ctx.save();
      ctx.shadowColor = theme.shadowColor || 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;

      ctx.fillStyle = theme.bg;
      drawRoundRect(cardX, cardY, cardW, cardH, 40);
      ctx.fill();
      ctx.restore();

      const loadImage = (src) => {
        return new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });
      };

      const avatarImg = await loadImage(avatar.src);
      const galleryImgs = await Promise.all(gallery.map((g) => loadImage(g.src)));

      const iconSize = 140;
      const iconX = cardX + 44;
      const iconY = cardY + 36;
      const iconCenterX = iconX + iconSize / 2;
      const iconCenterY = iconY + iconSize / 2;

      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, iconSize / 2 + 6, 0, Math.PI * 2);
      ctx.fillStyle = theme.border;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, iconSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = theme.border;
      ctx.fillRect(iconX, iconY, iconSize, iconSize);

      if (avatarImg) {
        const scale = avatar.zoom || 1;
        const imgW = iconSize * scale;
        const imgH = (iconSize * (avatarImg.height / avatarImg.width)) * scale;
        const offsetX = iconX + (iconSize - imgW) * ((avatar.x || 50) / 100);
        const offsetY = iconY + (iconSize - imgH) * ((avatar.y || 50) / 100);
        ctx.drawImage(avatarImg, offsetX, offsetY, imgW, imgH);
      } else {
        ctx.fillStyle = theme.sub;
        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐱', iconCenterX, iconCenterY);
      }
      ctx.restore();

      const fontName = cardFont.split(',')[0].replace(/'/g, '').trim();
      const textStartX = iconX + iconSize + 24;
      let currentY = iconY + 38;

      ctx.fillStyle = theme.text;
      ctx.font = `900 40px ${fontName}, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(name, textStartX, currentY);
      const nameWidth = ctx.measureText(name).width;

      ctx.fillStyle = theme.sub;
      ctx.font = `700 22px ${fontName}, sans-serif`;
      ctx.fillText(`@${twitterId}`, textStartX + nameWidth + 16, currentY);
      const idWidth = ctx.measureText(`@${twitterId}`).width;

      const badgeText = `${dc} | ${race}`;
      ctx.font = `800 17px ${fontName}, sans-serif`;
      const badgePaddingH = 14;
      const badgeW = ctx.measureText(badgeText).width + badgePaddingH * 2;
      const badgeH = 34;
      const badgeX = textStartX + nameWidth + 16 + idWidth + 16;
      const badgeY = currentY - 24;

      ctx.fillStyle = theme.badgeBg;
      drawRoundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();

      ctx.fillStyle = theme.badgeText;
      ctx.fillText(badgeText, badgeX + badgePaddingH, badgeY + 23);

      ctx.fillStyle = theme.sub;
      ctx.globalAlpha = 0.6;
      ctx.font = '40px sans-serif';
      ctx.fillText('•••', cardX + cardW - 80, currentY);
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = theme.bio;
      ctx.font = `500 21px ${fontName}, sans-serif`;
      const bioLines = bio.split('\n');
      let bioY = currentY + 38;
      bioLines.forEach((line) => {
        ctx.fillText(line, textStartX, bioY);
        bioY += 32;
      });

      // --- ギャラリー画像エリア（高さ拡大 430px -> 455px） ---
      const galY = cardY + 210;
      const galW = (cardW - 88 - 48) / 3;
      const galH = 455;

      for (let i = 0; i < 3; i++) {
        const gx = cardX + 44 + i * (galW + 24);
        ctx.save();
        drawRoundRect(gx, galY, galW, galH, 28);
        ctx.clip();

        ctx.fillStyle = theme.border;
        ctx.fillRect(gx, galY, galW, galH);

        const gItem = gallery[i];
        const gImg = galleryImgs[i];

        if (gImg) {
          const zoom = gItem.zoom || 1;
          const imgRatio = gImg.width / gImg.height;
          const rectRatio = galW / galH;
          let drawW, drawH;
          if (imgRatio > rectRatio) {
            drawH = galH * zoom;
            drawW = drawH * imgRatio;
          } else {
            drawW = galW * zoom;
            drawH = drawW / imgRatio;
          }
          const posX = gx + (galW - drawW) * ((gItem.x || 50) / 100);
          const posY = galY + (galH - drawH) * ((gItem.y || 50) / 100);

          ctx.drawImage(gImg, posX, posY, drawW, drawH);
        } else {
          ctx.fillStyle = theme.sub;
          ctx.font = '30px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`📷 ${i + 1}`, gx + galW / 2, galY + galH / 2);
        }
        ctx.restore();
      }

      // --- 下部著作権表記（スクエニ権利表記のみ） ---
      ctx.fillStyle = theme.sub;
      ctx.font = `500 13px ${fontName}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(
        '(C) SQUARE ENIX CO., LTD. All Rights Reserved.',
        cardX + cardW / 2,
        cardY + cardH - 18
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsGenerating(false);
          alert('画像の生成に失敗しました。');
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        setResultImage(blobUrl);
        setIsGenerating(false);
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('Card generation failed:', error);
      alert('画像生成中にエラーが発生しました。');
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
  };

  const activeCardTheme = cardThemes[cardThemeKey] || cardThemes.sakura;

  // テーマのカテゴリフィルタリング
  const filteredThemes = Object.keys(cardThemes).filter((key) => {
    if (selectedCategory === 'すべて') return true;
    return cardThemes[key].category === selectedCategory;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: "-apple-system, sans-serif", paddingBottom: '40px' }}>
      
      {activeCrop && (
        <CropModal
          imageSrc={activeCrop.src}
          cropType={activeCrop.type}
          initialX={activeCrop.x}
          initialY={activeCrop.y}
          initialZoom={activeCrop.zoom}
          onSave={handleSaveCrop}
          onClose={() => setActiveCrop(null)}
        />
      )}

      {resultImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
            <h3 style={{ color: '#000', margin: '0 0 8px 0' }}>✅ 画像が完成しました！</h3>
            <p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>長押しまたは下のボタンで保存できます。</p>
            <img src={resultImage} alt="Completed Card" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href={resultImage} download="ff14_card.jpg" style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: colors.accent, color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                💾 保存する
              </a>
              <button onClick={() => setResultImage(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{ backgroundColor: colors.panelBg, borderBottom: `1px solid ${colors.border}`, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>📸 FF14 Card Maker</h1>
        <button onClick={() => setSiteTheme(isLight ? 'dark' : 'light')} style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
          {isLight ? '🌙 ダーク' : '☀️ ライト'}
        </button>
      </header>

      <div className="app-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px', boxSizing: 'border-box' }}>
        
        <div className="preview-area" style={{ width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              width: '100%', padding: '16px', fontSize: '16px', fontWeight: '800',
              backgroundColor: isGenerating ? '#94a3b8' : colors.accent, color: '#ffffff',
              border: 'none', borderRadius: '12px', cursor: isGenerating ? 'not-allowed' : 'pointer',
              marginBottom: '16px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)', height: '48px'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '📥 画像を保存する'}
          </button>

          <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', height: `${800 * scale}px`, overflow: 'hidden' }}>
            <div style={{ width: '1200px', height: '800px', transform: `scale(${scale})`, transformOrigin: 'top center' }}>
              <div ref={cardRef} style={{ width: '1200px', height: '800px', background: activeCardTheme.wrapperBg, padding: '40px', boxSizing: 'border-box', display: 'flex' }}>
                
                {/* 外側に影（boxShadow）を持つメインカード */}
                <div style={{
                  flex: 1, background: activeCardTheme.bg, borderRadius: '40px', padding: '36px 44px 20px 44px',
                  fontFamily: cardFont, border: `1px solid ${activeCardTheme.border}`,
                  boxShadow: activeCardTheme.shadow,
                  backdropFilter: activeCardTheme.backdropFilter || 'none', display: 'flex', flexDirection: 'column',
                  overflow: 'hidden', isolation: 'isolate'
                }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* アイコン（ドラッグ＆ドロップ対応） */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOverAvatar(true); }}
                      onDragLeave={() => setIsDragOverAvatar(false)}
                      onDrop={handleDropAvatar}
                      style={{ 
                        width: '140px', height: '140px', borderRadius: '50%', 
                        border: `${isDragOverAvatar ? '8px solid #6366f1' : `6px solid ${activeCardTheme.border}`}`,
                        backgroundColor: activeCardTheme.border, 
                        overflow: 'hidden', flexShrink: 0, isolation: 'isolate', transform: 'translateZ(0)',
                        transition: 'border 0.2s ease', cursor: 'pointer', position: 'relative'
                      }}
                      title="ここに画像をドラッグ＆ドロップできます"
                    >
                      {avatar.src ? (
                        <img src={avatar.src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${avatar.x}% ${avatar.y}%`, transform: `scale(${avatar.zoom})` }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🐱</div>
                      )}
                      {isDragOverAvatar && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(99,102,241,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>ドロップ!</div>
                      )}
                    </div>

                    <div style={{ flex: 1, paddingTop: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <h2 style={{ margin: 0, fontSize: '40px', fontWeight: '900', color: activeCardTheme.text }}>{name}</h2>
                        <span style={{ fontSize: '22px', color: activeCardTheme.sub, fontWeight: '700' }}>@{twitterId}</span>
                        <span style={{ backgroundColor: activeCardTheme.badgeBg, color: activeCardTheme.badgeText, padding: '6px 14px', borderRadius: '10px', fontSize: '17px', fontWeight: '800' }}>{dc} | {race}</span>
                      </div>
                      <p style={{ margin: '12px 0 0 0', fontSize: '21px', color: activeCardTheme.bio, whiteSpace: 'pre-wrap' }}>{bio}</p>
                    </div>
                  </div>

                  {/* ギャラリー領域：高さ拡大 (455px) ＆ ドラッグ＆ドロップ対応 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', height: '455px', marginTop: '20px' }}>
                    {gallery.map((item, idx) => {
                      const isHover = dragOverGalleryIndex === idx;
                      return (
                        <div
                          key={idx}
                          onDragOver={(e) => { e.preventDefault(); setDragOverGalleryIndex(idx); }}
                          onDragLeave={() => setDragOverGalleryIndex(null)}
                          onDrop={handleDropGallery(idx)}
                          style={{ 
                            borderRadius: '28px', backgroundColor: activeCardTheme.border, 
                            border: isHover ? '4px solid #6366f1' : 'none',
                            overflow: 'hidden', position: 'relative', isolation: 'isolate', transform: 'translateZ(0)',
                            transition: 'border 0.2s ease', cursor: 'pointer'
                          }}
                          title="ここに画像をドラッグ＆ドロップできます"
                        >
                          {item.src ? (
                            <img src={item.src} alt={`SS ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${item.x}% ${item.y}%`, transform: `scale(${item.zoom})` }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeCardTheme.sub, fontSize: '30px' }}>📷 {idx + 1}</div>
                          )}
                          {isHover && (
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(99,102,241,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>ここにドロップ!</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 最下部著作権表記（スクエニ権利表記のみ） */}
                  <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: activeCardTheme.sub, opacity: 0.9 }}>
                      (C) SQUARE ENIX CO., LTD. All Rights Reserved.
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className="panel-area" style={{ backgroundColor: colors.panelBg, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, flexShrink: 0 }}>
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} colors={colors}>👤 プロフ</TabButton>
            <TabButton active={activeTab === 'images'} onClick={() => setActiveTab('images')} colors={colors}>🖼️ 画像</TabButton>
            <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} colors={colors}>🎨 見ため</TabButton>
          </div>

          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div><label style={labelStyle(colors)}>名前</label><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(colors)} /></div>
                <div><label style={labelStyle(colors)}>X ID</label><input value={twitterId} onChange={(e) => setTwitterId(e.target.value)} style={inputStyle(colors)} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><label style={labelStyle(colors)}>DC</label><select value={dc} onChange={(e) => setDc(e.target.value)} style={inputStyle(colors)}>{dcOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                  <div><label style={labelStyle(colors)}>種族</label><select value={race} onChange={(e) => setRace(e.target.value)} style={inputStyle(colors)}>{raceOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                </div>
                <div><label style={labelStyle(colors)}>自己紹介</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} style={inputStyle(colors)} /></div>
              </div>
            )}

            {activeTab === 'images' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>👤 アイコン (ドラッグ＆ドロップ可)</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <FileUploadButton label="📁 ファイル変更" onFileSelect={(e) => handleAvatarUpload(e.target.files[0])} colors={colors} />
                    {avatar.src && (
                      <button
                        onClick={() => setActiveCrop({ type: 'avatar', src: avatar.src, x: avatar.x, y: avatar.y, zoom: avatar.zoom })}
                        style={cropButtonStyle(colors)}
                      >
                        🖐️ 範囲を微調整
                      </button>
                    )}
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: 0 }} />

                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>📷 ギャラリー (3枚・ドラッグ＆ドロップ可)</h4>
                  {gallery.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.subText }}>SS {idx + 1} {item.src && '✅'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button disabled={idx === 0} onClick={() => moveGalleryItem(idx, idx - 1)} style={arrowStyle(colors, idx === 0)}>▲</button>
                          <button disabled={idx === gallery.length - 1} onClick={() => moveGalleryItem(idx, idx + 1)} style={arrowStyle(colors, idx === gallery.length - 1)}>▼</button>
                          <FileUploadButton label="📁 変更" onFileSelect={(e) => handleGalleryUpload(idx)(e.target.files[0])} colors={colors} />
                        </div>
                      </div>

                      {item.src && (
                        <div style={{ marginTop: '8px' }}>
                          <button
                            onClick={() => setActiveCrop({ type: 'gallery', index: idx, src: item.src, x: item.x || 50, y: item.y || 50, zoom: item.zoom || 1 })}
                            style={{ ...cropButtonStyle(colors), width: '100%' }}
                          >
                            🖐️ 範囲を微調整
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle(colors)}>フォント</label>
                  <select value={cardFont} onChange={(e) => setCardFont(e.target.value)} style={inputStyle(colors)}>
                    {fontOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle(colors)}>カラーテーマ (全24種類)</label>
                  {/* カテゴリ切り替えタブ */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
                    {themeCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '4px 10px', borderRadius: '12px', border: 'none',
                          fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                          backgroundColor: selectedCategory === cat ? colors.accent : colors.inputBg,
                          color: selectedCategory === cat ? '#ffffff' : colors.subText
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* テーマグリッド一覧 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredThemes.map((key) => (
                      <button
                        key={key}
                        onClick={() => setCardThemeKey(key)}
                        style={{
                          padding: '10px 8px', borderRadius: '8px', textAlign: 'center',
                          border: cardThemeKey === key ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                          background: cardThemes[key].bg, color: cardThemes[key].text, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                      >
                        {cardThemes[key].name}
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
    <button onClick={onClick} style={{ padding: '12px 6px', border: 'none', backgroundColor: active ? colors.panelBg : 'transparent', color: active ? colors.accent : colors.subText, fontWeight: active ? 'bold' : 'normal', cursor: 'pointer', fontSize: '13px', borderBottom: active ? `2px solid ${colors.accent}` : 'none' }}>
      {children}
    </button>
  );
}

function FileUploadButton({ label, onFileSelect, colors }) {
  return (
    <label style={{ padding: '6px 12px', backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: colors.text }}>
      {label}
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

const cropButtonStyle = (colors) => ({
  padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.accent}`,
  backgroundColor: 'rgba(99, 102, 241, 0.1)', color: colors.accent,
  fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
});

const arrowStyle = (colors, disabled) => ({
  padding: '4px 8px', borderRadius: '4px', border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg, color: colors.text, fontSize: '10px',
  cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.3 : 1
});

const labelStyle = (colors) => ({ display: 'block', fontSize: '12px', fontWeight: 'bold', color: colors.subText, marginBottom: '6px' });
const inputStyle = (colors) => ({ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, fontSize: '13px', boxSizing: 'border-box' });