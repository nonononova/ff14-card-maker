import React, { useState, useRef } from 'react';

// カラーテーマ一覧
const THEMES = [
  { id: 'dark', name: 'Dark', bg: '#0f172a', cardBg: '#1e293b', text: '#f8fafc', subText: '#94a3b8', border: '#334155', inputBg: '#0f172a', accent: '#3b82f6' },
  { id: 'light', name: 'Light', bg: '#f8fafc', cardBg: '#ffffff', text: '#0f172a', subText: '#64748b', border: '#e2e8f0', inputBg: '#f1f5f9', accent: '#2563eb' },
  { id: 'emerald', name: 'Emerald', bg: '#022c22', cardBg: '#064e3b', text: '#ecfdf5', subText: '#6ee7b7', border: '#047857', inputBg: '#022c22', accent: '#10b981' },
  { id: 'purple', name: 'Purple', bg: '#2e1065', cardBg: '#4c1d95', text: '#faf5ff', subText: '#c084fc', border: '#6d28d9', inputBg: '#2e1065', accent: '#a855f7' },
];

// 幅可変・レスポンシブ対応Sliderコンポーネント
function Slider({ label, value, min = -100, max = 100, step = 1, onChange, colors }) {
  const handleStep = (delta) => {
    const nextVal = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(nextVal);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '4px 0' }}>
      <span style={{ fontSize: '13px', color: colors.subText, width: '40px', fontWeight: 'bold' }}>{label}</span>
      <button
        type="button"
        onClick={() => handleStep(-step)}
        style={{
          width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg, color: colors.text, fontSize: '16px', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', touchAction: 'manipulation'
        }}
      >
        ー
      </button>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: colors.accent, height: '32px', cursor: 'pointer', touchAction: 'none' }}
      />
      <button
        type="button"
        onClick={() => handleStep(step)}
        style={{
          width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg, color: colors.text, fontSize: '16px', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', touchAction: 'manipulation'
        }}
      >
        ＋
      </button>
    </div>
  );
}

export default function ProfileCardEditor() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'gallery' | 'theme'

  // アバターState
  const [avatar, setAvatar] = useState({
    url: null,
    x: 0,
    y: 0,
    scale: 1,
  });

  // ギャラリーState（配列要素に固有IDを持たせる）
  const [gallery, setGallery] = useState([
    { id: 'item-1', url: 'https://picsum.photos/400/300?random=1', y: 0 },
    { id: 'item-2', url: 'https://picsum.photos/400/300?random=2', y: 0 },
  ]);

  const avatarInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // 1. アバター画像アップロード（同一ファイル再選択対応）
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar((prev) => ({ ...prev, url }));
    }
    e.target.value = ''; // ファイル入力リセット
  };

  // 2. ギャラリー画像一括アップロード（Immutable更新）
  const handleBatchGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newItems = files.map((file, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        y: 0,
      }));
      setGallery((prev) => [...prev, ...newItems]);
    }
    e.target.value = ''; // ファイル入力リセット
  };

  // 3. ギャラリーY位置変更（Immutable更新）
  const handleGalleryYChange = (id, newY) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, y: newY } : item))
    );
  };

  // 4. ギャラリー順序入れ替え
  const moveGalleryItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;
    setGallery((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });
  };

  // 5. ギャラリー画像削除
  const removeGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '24px 16px', boxSizing: 'border-box' }}>
      {/* PC対応：1200pxまで柔軟に広がるメインコンテナ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '32px',
        alignItems: 'flex-start'
      }}>

        {/* 【左カラム】プレビュー表示領域（PC時は1/2幅で固定・スティッキー） */}
        <div style={{
          flex: '1 1 400px',
          minWidth: '300px',
          position: 'sticky',
          top: '24px',
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          border: `1px solid ${theme.border}`,
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: theme.subText }}>Preview</h2>

          {/* アバタープレビュー */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
              border: `3px solid ${theme.accent}`, backgroundColor: theme.inputBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {avatar.url ? (
                <img
                  src={avatar.url}
                  alt="Avatar"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transform: `translate(${avatar.x}px, ${avatar.y}px) scale(${avatar.scale})`,
                    transition: 'transform 0.05s ease-out'
                  }}
                />
              ) : (
                <span style={{ fontSize: '12px', color: theme.subText }}>No Avatar</span>
              )}
            </div>
          </div>

          {/* ギャラリープレビュー */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {gallery.map((item) => (
              <div key={item.id} style={{
                height: '100px', borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg,
                position: 'relative', border: `1px solid ${theme.border}`
              }}>
                <img
                  src={item.url}
                  alt="Gallery"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transform: `translateY(${item.y}px)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 【右カラム】操作パネル領域（PC時は1/2幅で広がる） */}
        <div style={{
          flex: '1 1 500px',
          minWidth: '300px',
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          border: `1px solid ${theme.border}`,
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          {/* タブ切り替え */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px' }}>
            {['avatar', 'gallery', 'theme'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
                  backgroundColor: activeTab === tab ? theme.accent : 'transparent',
                  color: activeTab === tab ? '#ffffff' : theme.subText,
                  fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: アバター設定 */}
          {activeTab === 'avatar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} style={{ display: 'none' }} />
              <button
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg, color: theme.text, fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                アバター画像を選択
              </button>

              <Slider label="左右" value={avatar.x} min={-100} max={100} onChange={(v) => setAvatar(prev => ({ ...prev, x: v }))} colors={theme} />
              <Slider label="上下" value={avatar.y} min={-100} max={100} onChange={(v) => setAvatar(prev => ({ ...prev, y: v }))} colors={theme} />
              <Slider label="拡大" value={avatar.scale} min={0.5} max={2.5} step={0.1} onChange={(v) => setAvatar(prev => ({ ...prev, scale: v }))} colors={theme} />
            </div>
          )}

          {/* TAB 2: ギャラリー設定 */}
          {activeTab === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input type="file" accept="image/*" multiple ref={galleryInputRef} onChange={handleBatchGalleryUpload} style={{ display: 'none' }} />
              <button
                onClick={() => galleryInputRef.current?.click()}
                style={{
                  padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg, color: theme.text, fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                画像をまとめて追加
              </button>

              {/* ギャラリー項目調整リスト（独自キー key={item.id}） */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {gallery.map((item, idx) => (
                  <div key={item.id} style={{
                    padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
                    backgroundColor: theme.inputBg, display: 'flex', flexDirection: 'column', gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: theme.subText }}>画像 {idx + 1}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => moveGalleryItem(idx, -1)} disabled={idx === 0} style={{ padding: '4px 8px', cursor: 'pointer' }}>▲</button>
                        <button onClick={() => moveGalleryItem(idx, 1)} disabled={idx === gallery.length - 1} style={{ padding: '4px 8px', cursor: 'pointer' }}>▼</button>
                        <button onClick={() => removeGalleryItem(item.id)} style={{ padding: '4px 8px', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                    {/* 上下位置移動（範囲: -100 〜 100） */}
                    <Slider label="上下" value={item.y} min={-100} max={100} onChange={(v) => handleGalleryYChange(item.id, v)} colors={theme} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: カラーテーマ（レスポンシブAuto-fillグリッド） */}
          {activeTab === 'theme' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px'
            }}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '16px', borderRadius: '12px', border: `2px solid ${theme.id === t.id ? t.accent : t.border}`,
                    backgroundColor: t.cardBg, color: t.text, fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: t.accent }} />
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}