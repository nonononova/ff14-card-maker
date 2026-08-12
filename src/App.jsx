import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [siteTheme, setSiteTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('profile');

  // プロフィール情報
  const [name, setName] = useState('光の戦士');
  const [dc, setDc] = useState('Mana');
  const [race, setRace] = useState("Miqo'te");
  const [twitterId, setTwitterId] = useState('hika_sen');
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

  // カラーテーマ
  const cardThemes = {
    glass: { name: 'クリスタル(透明感)', bg: 'rgba(255, 255, 255, 0.45)', wrapperBg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', text: '#0f172a', sub: '#475569', bio: '#1e293b', border: 'rgba(255, 255, 255, 0.6)', badgeBg: 'rgba(255, 255, 255, 0.6)', badgeText: '#0369a1', shadow: '0 20px 50px rgba(31, 38, 135, 0.15)', backdropFilter: 'blur(16px)' },
    glassDark: { name: 'ダークガラス(透明感)', bg: 'rgba(15, 23, 42, 0.55)', wrapperBg: 'linear-gradient(135deg, #0f172a 0%, #2e1065 100%)', text: '#f8fafc', sub: '#cbd5e1', bio: '#e2e8f0', border: 'rgba(255, 255, 255, 0.15)', badgeBg: 'rgba(255, 255, 255, 0.15)', badgeText: '#38bdf8', shadow: '0 25px 50px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(16px)' },
    sakura: { name: 'サクラ', bg: '#fff5f7', wrapperBg: '#e5e5e5', text: '#881337', sub: '#be123c', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#9f1239', shadow: '0 15px 40px rgba(136, 19, 55, 0.1)' },
    cyber: { name: 'サイバー', bg: '#030712', wrapperBg: '#0f172a', text: '#22d3ee', sub: '#64748b', bio: '#94a3b8', border: '#1f2937', badgeBg: '#1f2937', badgeText: '#22d3ee', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(34, 211, 238, 0.35)' },
    blood: { name: 'ブラッド', bg: '#180202', wrapperBg: '#270303', text: '#f43f5e', sub: '#9f1239', bio: '#fecdd3', border: '#4c0519', badgeBg: '#4c0519', badgeText: '#fb7185', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.35)' },
    royal: { name: 'ロイヤル', bg: '#0f0728', wrapperBg: '#1e1b4b', text: '#eab308', sub: '#a855f7', bio: '#fef08a', border: '#2e1065', badgeBg: '#2e1065', badgeText: '#fde047', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(234, 179, 8, 0.35)' },
    frost: { name: 'フロスト', bg: '#082f49', wrapperBg: '#075985', text: '#38bdf8', sub: '#7dd3fc', bio: '#e0f2fe', border: '#0369a1', badgeBg: '#0369a1', badgeText: '#bae6fd', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.35)' },
    midnight: { name: '黒金', bg: '#09090b', wrapperBg: '#18181b', text: '#facc15', sub: '#a1a1aa', bio: '#e4e4e7', border: '#27272a', badgeBg: '#27272a', badgeText: '#facc15', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.3)' },
    astral: { name: 'アストラル', bg: '#0f172a', wrapperBg: '#1e293b', text: '#38bdf8', sub: '#94a3b8', bio: '#cbd5e1', border: '#1e293b', badgeBg: '#1e293b', badgeText: '#38bdf8', shadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.3)' },
    strawberry: { name: 'いちご', bg: '#ffffff', wrapperBg: '#fff1f2', text: '#e11d48', sub: '#fb7185', bio: '#881337', border: '#ffe4e6', badgeBg: '#ffe4e6', badgeText: '#e11d48', shadow: '0 15px 40px rgba(225, 29, 72, 0.1)' },
    chocolat: { name: 'ショコラ', bg: '#fdfbf7', wrapperBg: '#fef3c7', text: '#451a03', sub: '#78350f', bio: '#292524', border: '#fde68a', badgeBg: '#fde68a', badgeText: '#78350f', shadow: '0 15px 40px rgba(69, 26, 3, 0.1)' },
    rose: { name: 'ロゼ', bg: '#fff1f2', wrapperBg: '#ffe4e6', text: '#9f1239', sub: '#e11d48', bio: '#4c0519', border: '#fecdd3', badgeBg: '#fecdd3', badgeText: '#be123c', shadow: '0 15px 40px rgba(159, 18, 57, 0.1)' },
    mint: { name: 'ミント', bg: '#f0fdf4', wrapperBg: '#dcfce7', text: '#047857', sub: '#34d399', bio: '#064e3b', border: '#bbf7d0', badgeBg: '#bbf7d0', badgeText: '#047857', shadow: '0 15px 40px rgba(4, 120, 87, 0.1)' },
    lavender: { name: 'ラベンダー', bg: '#faf5ff', wrapperBg: '#f3e8ff', text: '#6b21a8', sub: '#c084fc', bio: '#3b0764', border: '#e9d5ff', badgeBg: '#e9d5ff', badgeText: '#6b21a8', shadow: '0 15px 40px rgba(107, 33, 168, 0.1)' },
    forest: { name: 'フォレスト', bg: '#f4fbf7', wrapperBg: '#d1fae5', text: '#065f46', sub: '#059669', bio: '#022c22', border: '#a7f3d0', badgeBg: '#a7f3d0', badgeText: '#047857', shadow: '0 15px 40px rgba(6, 95, 70, 0.1)' },
    white: { name: 'ホワイト', bg: '#ffffff', wrapperBg: '#f1f5f9', text: '#0f172a', sub: '#64748b', bio: '#334155', border: '#e2e8f0', badgeBg: '#e2e8f0', badgeText: '#475569', shadow: '0 20px 40px rgba(15, 23, 42, 0.08)' },
    dark: { name: 'ダーク', bg: '#1e293b', wrapperBg: '#0f172a', text: '#f8fafc', sub: '#94a3b8', bio: '#cbd5e1', border: '#334155', badgeBg: '#334155', badgeText: '#cbd5e1', shadow: '0 25px 60px rgba(0, 0, 0, 0.8)' },
    gold: { name: 'ゴールド', bg: '#fefce8', wrapperBg: '#fef08a', text: '#713f12', sub: '#ca8a04', bio: '#422006', border: '#fde047', badgeBg: '#fde047', badgeText: '#854d0e', shadow: '0 15px 40px rgba(113, 63, 18, 0.15)' }
  };
  const [cardThemeKey, setCardThemeKey] = useState('glass');

  // アイコン画像 ＆ ギャラリー画像
  const [avatar, setAvatar] = useState({ src: null, x: 50, y: 50, zoom: 1 });
  const [gallery, setGallery] = useState([
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 },
    { src: null, y: 50, zoom: 1 }
  ]);

  // ドラッグ＆ドロップ管理State
  const [draggedIndex, setDraggedIndex] = useState(null);

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
        .app-container { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 24px; align-items: start; }
        @media (max-width: 1024px) { 
          .app-container { display: flex; flex-direction: column; } 
          .preview-area {
            position: sticky;
            top: 60px;
            z-index: 80;
            padding-bottom: 12px;
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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    moveGalleryItem(draggedIndex, targetIndex);
    setDraggedIndex(null);
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

      ctx.fillStyle = theme.bg;
      drawRoundRect(cardX, cardY, cardW, cardH, 40);
      ctx.fill();

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

      const iconSize = 150;
      const iconX = cardX + 44;
      const iconY = cardY + 36;
      const iconCenterX = iconX + iconSize / 2;
      const iconCenterY = iconY + iconSize / 2;

      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, iconSize / 2 + 8, 0, Math.PI * 2);
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
      let currentY = iconY + 42;

      ctx.fillStyle = theme.text;
      ctx.font = `900 42px ${fontName}, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(name, textStartX, currentY);
      const nameWidth = ctx.measureText(name).width;

      ctx.fillStyle = theme.sub;
      ctx.font = `700 24px ${fontName}, sans-serif`;
      ctx.fillText(`@${twitterId}`, textStartX + nameWidth + 16, currentY);
      const idWidth = ctx.measureText(`@${twitterId}`).width;

      const badgeText = `${dc} | ${race}`;
      ctx.font = `800 18px ${fontName}, sans-serif`;
      const badgePaddingH = 16;
      const badgeW = ctx.measureText(badgeText).width + badgePaddingH * 2;
      const badgeH = 36;
      const badgeX = textStartX + nameWidth + 16 + idWidth + 16;
      const badgeY = currentY - 26;

      ctx.fillStyle = theme.badgeBg;
      drawRoundRect(badgeX, badgeY, badgeW, badgeH, 12);
      ctx.fill();

      ctx.fillStyle = theme.badgeText;
      ctx.fillText(badgeText, badgeX + badgePaddingH, badgeY + 24);

      ctx.fillStyle = theme.sub;
      ctx.globalAlpha = 0.6;
      ctx.font = '44px sans-serif';
      ctx.fillText('•••', cardX + cardW - 80, currentY);
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = theme.bio;
      ctx.font = `500 22px ${fontName}, sans-serif`;
      const bioLines = bio.split('\n');
      let bioY = currentY + 40;
      bioLines.forEach((line) => {
        ctx.fillText(line, textStartX, bioY);
        bioY += 33;
      });

      const galY = cardY + 224;
      const galW = (cardW - 88 - 48) / 3;
      const galH = 410;

      for (let i = 0; i < 3; i++) {
        const gx = cardX + 44 + i * (galW + 24);
        ctx.save();
        drawRoundRect(gx, galY, galW, galH, 24);
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
          const posX = gx + (galW - drawW) / 2;
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

      ctx.fillStyle = theme.sub;
      ctx.font = `500 15px ${fontName}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(
        'Design Copyright © FF14 SS Showcase Card Generator. All rights reserved.',
        cardX + cardW / 2,
        cardY + cardH - 24
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          alert('画像の生成に失敗しました。');
          return;
        }

        const file = new File([blob], 'ff14_card.jpg', { type: 'image/jpeg' });

        if (navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          try {
            await navigator.share({
              files: [file],
              title: 'FF14 Card',
              text: 'FF14 Showcase Card',
            });
            setIsGenerating(false);
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Share error:', err);
            }
          }
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

  const triggerPCDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ff14_card.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isLight = siteTheme === 'light';
  const colors = {
    bg: isLight ? '#f8fafc' : '#090d16',
    panelBg: isLight ? '#ffffff' : '#111827',
    cardInnerBg: isLight ? '#f1f5f9' : '#1e293b',
    border: isLight ? '#e2e8f0' : '#374151',
    text: isLight ? '#0f172a' : '#f9fafb',
    subText: isLight ? '#64748b' : '#9ca3af',
    inputBg: isLight ? '#ffffff' : '#0f172a',
    accent: '#6366f1',
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  };

  const activeCardTheme = cardThemes[cardThemeKey] || cardThemes.glass;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", paddingBottom: '40px' }}>
      
      {/* モーダル */}
      {resultImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: colors.panelBg, padding: '24px', borderRadius: '20px', textAlign: 'center', maxWidth: '600px', width: '100%', border: `1px solid ${colors.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h3 style={{ color: colors.text, margin: '0 0 8px 0', fontSize: '18px' }}>✨ カードが完成しました！</h3>
            <p style={{ color: colors.subText, margin: '0 0 16px 0', fontSize: '13px', lineHeight: '1.5' }}>
              保存してSNSなどで共有しましょう。（スマホは画像を長押しで保存できます）
            </p>
            <img src={resultImage} alt="Completed Card" style={{ width: '100%', borderRadius: '12px', border: `1px solid ${colors.border}` }} />
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => triggerPCDownload(resultImage)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: colors.accentGradient, color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                💾 画像を保存
              </button>
              <button
                onClick={() => setResultImage(null)}
                style={{ padding: '12px 24px', borderRadius: '10px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardInnerBg, color: colors.text, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header style={{ backgroundColor: colors.panelBg, borderBottom: `1px solid ${colors.border}`, padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: colors.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>📸</div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>FF14 Card Maker</h1>
        </div>
        <button onClick={() => setSiteTheme(isLight ? 'dark' : 'light')} style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardInnerBg, color: colors.text, cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isLight ? '🌙 ダーク' : '☀️ ライト'}
        </button>
      </header>

      {/* メインエリア */}
      <div className="app-container" style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px 20px', boxSizing: 'border-box' }}>
        
        {/* 左側: プレビュー */}
        <div className="preview-area" style={{ width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              width: '100%', maxWidth: '1200px', padding: '16px', fontSize: '16px', fontWeight: '800',
              background: isGenerating ? '#94a3b8' : colors.accentGradient, color: '#ffffff',
              border: 'none', borderRadius: '14px', cursor: isGenerating ? 'not-allowed' : 'pointer',
              marginBottom: '20px', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '📥 画像を生成して保存'}
          </button>

          <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', height: `${800 * scale}px`, overflow: 'hidden', borderRadius: '24px' }}>
            <div style={{
              width: '1200px', height: '800px',
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
            }}>
              
              {/* カード本体 */}
              <div ref={cardRef} style={{
                width: '1200px', height: '800px', background: activeCardTheme.wrapperBg,
                padding: '40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{
                  flex: 1, background: activeCardTheme.bg, borderRadius: '40px',
                  padding: '36px 44px', boxSizing: 'border-box', fontFamily: cardFont,
                  border: `1px solid ${activeCardTheme.border}`,
                  backdropFilter: activeCardTheme.backdropFilter || 'none',
                  WebkitBackdropFilter: activeCardTheme.backdropFilter || 'none',
                  boxShadow: activeCardTheme.shadow, display: 'flex', flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  
                  {/* ヘッダー */}
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '150px', height: '150px', borderRadius: '50%',
                      border: `8px solid ${activeCardTheme.border}`, backgroundColor: activeCardTheme.border,
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
                        <h2 style={{ margin: 0, fontSize: '42px', fontWeight: '900', color: activeCardTheme.text, letterSpacing: '1px', fontFamily: cardFont }}>{name}</h2>
                        <span style={{ fontSize: '24px', color: activeCardTheme.sub, fontWeight: '700' }}>@{twitterId}</span>
                        <span style={{
                          backgroundColor: activeCardTheme.badgeBg, color: activeCardTheme.badgeText,
                          padding: '8px 16px', borderRadius: '12px', fontSize: '18px', fontWeight: '800',
                          border: `1px solid ${activeCardTheme.border}`
                        }}>
                          {dc} | {race}
                        </span>
                      </div>
                      <p style={{ margin: '14px 0 0 0', fontSize: '22px', lineHeight: '1.5', color: activeCardTheme.bio, whiteSpace: 'pre-wrap', fontWeight: '500', textAlign: 'left', fontFamily: cardFont }}>
                        {bio}
                      </p>
                    </div>

                    <div style={{ fontSize: '44px', color: activeCardTheme.sub, letterSpacing: '2px', lineHeight: '1', paddingTop: '6px', opacity: 0.6 }}>
                      •••
                    </div>
                  </div>

                  {/* ギャラリー */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', flex: 1, marginTop: '28px', minHeight: 0 }}>
                    {gallery.map((item, idx) => (
                      <div key={idx} style={{
                        width: '100%', height: '100%', borderRadius: '24px', backgroundColor: activeCardTheme.border,
                        border: `1px solid ${activeCardTheme.border}`,
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

        {/* 右側: パネル */}
        <div style={{ width: '100%', backgroundColor: colors.panelBg, border: `1px solid ${colors.border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
          
          {/* タブヘッダー */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '8px', backgroundColor: colors.cardInnerBg, borderBottom: `1px solid ${colors.border}` }}>
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} colors={colors}>
              👤 プロフ
            </TabButton>
            <TabButton active={activeTab === 'images'} onClick={() => setActiveTab('images')} colors={colors}>
              🖼️ 画像
            </TabButton>
            <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} colors={colors}>
              🎨 見ため
            </TabButton>
          </div>

          <div style={{ padding: '20px' }}>
            
            {/* タブ1: プロフィール */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SectionCard title="基本ステータス" colors={colors}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={labelStyle(colors)}>キャラクター名</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(colors)} placeholder="例: 光の戦士" />
                    </div>

                    <div>
                      <label style={labelStyle(colors)}>X (Twitter) ID</label>
                      <input value={twitterId} onChange={(e) => setTwitterId(e.target.value)} style={inputStyle(colors)} placeholder="例: hika_sen" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ minWidth: 0 }}>
                        <label style={labelStyle(colors)}>データセンター</label>
                        <select value={dc} onChange={(e) => setDc(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                          {dcOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <label style={labelStyle(colors)}>種族</label>
                        <select value={race} onChange={(e) => setRace(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                          {raceOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="自己紹介" colors={colors}>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} style={{ ...inputStyle(colors), resize: 'vertical' }} placeholder="自己紹介テキスト" />
                </SectionCard>
              </div>
            )}

            {/* タブ2: 画像設定 */}
            {activeTab === 'images' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SectionCard title="👤 アイコン画像" colors={colors}>
                  <FileUploadButton label="📁 画像を変更する" onFileSelect={handleAvatarUpload} colors={colors} fullWidth />
                  {avatar.src && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Slider label="左右" value={avatar.x} step={1} onChange={(v) => setAvatar({ ...avatar, x: v })} colors={colors} />
                      <Slider label="上下" value={avatar.y} step={1} onChange={(v) => setAvatar({ ...avatar, y: v })} colors={colors} />
                      <Slider label="拡大" value={avatar.zoom} min={1} max={2} step={0.05} onChange={(v) => setAvatar({ ...avatar, zoom: v })} colors={colors} />
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="📷 ギャラリー画像 (3枚)" colors={colors}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: colors.subText, lineHeight: '1.4' }}>
                    💡 PC: ドラッグ＆ドロップ / スマホ: 「▲」「▼」ボタンで並び替え
                  </p>
                  
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
                    background: colors.accentGradient, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px'
                  }}>
                    📁 3枚まとめて一括登録
                    <input type="file" accept="image/*" multiple onChange={handleBatchGalleryUpload} style={{ display: 'none' }} />
                  </label>

                  {gallery.map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      style={{
                        marginBottom: '12px', padding: '12px', borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: draggedIndex === idx ? colors.cardInnerBg : colors.inputBg,
                        cursor: 'grab',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: item.src ? '8px' : '0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ⋮⋮ SS {idx + 1} {item.src && '✅'}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveGalleryItem(idx, idx - 1)}
                            style={arrowButtonStyle(colors, idx === 0)}
                            title="上に移動"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === gallery.length - 1}
                            onClick={() => moveGalleryItem(idx, idx + 1)}
                            style={arrowButtonStyle(colors, idx === gallery.length - 1)}
                            title="下に移動"
                          >
                            ▼
                          </button>
                          <FileUploadButton label="変更" onFileSelect={handleGalleryUpload(idx)} colors={colors} />
                        </div>
                      </div>

                      {item.src && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: `1px dashed ${colors.border}` }}>
                          <Slider label="上下" value={item.y} step={1} onChange={(v) => { const n = [...gallery]; n[idx].y = v; setGallery(n); }} colors={colors} />
                          <Slider label="拡大" value={item.zoom} min={1} max={2} step={0.05} onChange={(v) => { const n = [...gallery]; n[idx].zoom = v; setGallery(n); }} colors={colors} />
                        </div>
                      )}
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}

            {/* タブ3: 見ため */}
            {activeTab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SectionCard title="🔤 フォントスタイル" colors={colors}>
                  <select value={cardFont} onChange={(e) => setCardFont(e.target.value)} style={{ ...inputStyle(colors), cursor: 'pointer' }}>
                    {fontOptions.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </SectionCard>

                <SectionCard title="🎨 カラーテーマ" colors={colors}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                    {Object.keys(cardThemes).map((key) => {
                      const t = cardThemes[key];
                      const isSelected = cardThemeKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setCardThemeKey(key)}
                          style={{
                            padding: '10px 12px', borderRadius: '10px',
                            border: isSelected ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                            background: colors.inputBg,
                            cursor: 'pointer', textAlign: 'left',
                            boxShadow: isSelected ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none',
                            display: 'flex', flexDirection: 'column', gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {/* カラーテーマのミニスウォッチ */}
                          <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${t.border}` }}>
                            <div style={{ flex: 1, background: t.wrapperBg }} />
                            <div style={{ flex: 1, background: t.bg }} />
                            <div style={{ flex: 1, background: t.text }} />
                          </div>
                          <span style={{ fontWeight: isSelected ? 'bold' : '600', fontSize: '11px', color: colors.text }}>
                            {t.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// 補助UIコンポーネント & スタイル定義
// ----------------------------------------------------
function SectionCard({ title, children, colors }) {
  return (
    <div style={{
      backgroundColor: colors.cardInnerBg,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      padding: '14px',
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '800', color: colors.subText, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function TabButton({ active, onClick, children, colors }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px', border: 'none',
        borderRadius: '8px',
        backgroundColor: active ? colors.panelBg : 'transparent',
        color: active ? colors.text : colors.subText,
        fontWeight: active ? 'bold' : 'normal',
        cursor: 'pointer', fontSize: '12px',
        boxShadow: active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.15s ease'
      }}
    >
      {children}
    </button>
  );
}

function FileUploadButton({ label, onFileSelect, colors, fullWidth }) {
  return (
    <label style={{
      display: fullWidth ? 'flex' : 'inline-block',
      alignItems: 'center', justifyContent: 'center',
      padding: '8px 12px', backgroundColor: colors.inputBg,
      border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer',
      fontSize: '11px', fontWeight: 'bold', color: colors.text,
      transition: 'background-color 0.15s ease'
    }}>
      {label}
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

function Slider({ label, value, min = 0, max = 100, step = 1, onChange, colors }) {
  const handleStep = (delta) => {
    const nextVal = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(nextVal);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: colors.subText, width: '28px', fontWeight: 'bold' }}>{label}</span>
      <button
        type="button"
        onClick={() => handleStep(-step)}
        style={{
          width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg, color: colors.text, fontSize: '13px', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', touchAction: 'manipulation'
        }}
      >
        ー
      </button>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1, accentColor: colors.accent, height: '24px', cursor: 'pointer', touchAction: 'none'
        }}
      />
      <button
        type="button"
        onClick={() => handleStep(step)}
        style={{
          width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg, color: colors.text, fontSize: '13px', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', touchAction: 'manipulation'
        }}
      >
        ＋
      </button>
    </div>
  );
}

const arrowButtonStyle = (colors, disabled) => ({
  padding: '4px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg,
  color: colors.text,
  fontSize: '10px',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.3 : 1,
  touchAction: 'manipulation'
});

const labelStyle = (colors) => ({
  display: 'block', fontSize: '11px', fontWeight: 'bold', color: colors.subText, marginBottom: '4px'
});

const inputStyle = (colors) => ({
  width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg, color: colors.text, fontSize: '13px', boxSizing: 'border-box',
  outline: 'none'
});
