import React, { useState } from 'react';

// ----------------------------------------------------
// 定数・テーマ定義
// ----------------------------------------------------
const fontOptions = [
  { value: 'sans-serif', label: 'ゴシック体 (Sans-serif)' },
  { value: 'serif', label: '明朝体 (Serif)' },
  { value: 'monospace', label: '等幅 (Monospace)' },
  { value: 'cursive', label: '手書き風 (Cursive)' },
];

const cardThemes = {
  modern: {
    name: 'モダンダーク',
    bg: '#1f2937',
    text: '#f9fafb',
    subText: '#9ca3af',
    accent: '#6366f1',
    border: '#374151',
  },
  light: {
    name: 'クリーンライト',
    bg: '#ffffff',
    text: '#111827',
    subText: '#6b7280',
    accent: '#3b82f6',
    border: '#e5e7eb',
  },
  cyber: {
    name: 'サイバーパンク',
    bg: '#0d0221',
    text: '#00f0ff',
    subText: '#a0a0ff',
    accent: '#ff007f',
    border: '#7000ff',
  },
  sunset: {
    name: 'サンセット',
    bg: '#2d1b2d',
    text: '#fff0f5',
    subText: '#e8a5c8',
    accent: '#ff6b6b',
    border: '#4a284a',
  },
  forest: {
    name: 'ナチュラルグリーン',
    bg: '#1c2826',
    text: '#e8f1f2',
    subText: '#94d2bd',
    accent: '#57cc99',
    border: '#2d3a37',
  },
  pastel: {
    name: 'パステルスイート',
    bg: '#fff0f3',
    text: '#590d22',
    subText: '#a4133c',
    accent: '#ff4d6d',
    border: '#ffccd5',
  },
};

// エディタ（設定パネル）側のカラーテーマ
const editorColors = {
  bg: '#0f172a',
  panelBg: '#1e293b',
  text: '#f8fafc',
  subText: '#94a3b8',
  border: '#334155',
  inputBg: '#0f172a',
  accent: '#6366f1',
};

export default function ProfileCardBuilder() {
  // ----------------------------------------------------
  // 状態定義 (State)
  // ----------------------------------------------------
  // 基本プロフィール
  const [name, setName] = useState('山田 太郎');
  const [handle, setHandle] = useState('@yamada_taro');
  const [bio, setBio] = useState('Webディレクター / デザイナー。日常の景色やおすすめスポット、愛犬の写真を投稿しています！');
  const [tags, setTags] = useState('#Design #Photography #Tokyo');

  // アイコン画像状態
  const [avatar, setAvatar] = useState({
    src: '',
    x: 0,
    y: 0,
    zoom: 1,
  });

  // ギャラリー画像状態 (3枚)
  const [gallery, setGallery] = useState([
    { src: '', y: 0, zoom: 1 },
    { src: '', y: 0, zoom: 1 },
    { src: '', y: 0, zoom: 1 },
  ]);

  // UI状態
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'images' | 'style'
  const [cardFont, setCardFont] = useState('sans-serif');
  const [cardThemeKey, setCardThemeKey] = useState('modern');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const currentTheme = cardThemes[cardThemeKey] || cardThemes.modern;

  // ----------------------------------------------------
  // イベントハンドラー (Handlers)
  // ----------------------------------------------------
  // アイコン画像読み込み
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setAvatar((prev) => ({ ...prev, src: evt.target?.result }));
    };
    reader.readAsDataURL(file);
  };

  // ギャラリー画像 単一読み込み
  const handleGalleryUpload = (idx) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setGallery((prev) =>
        prev.map((item, i) => (i === idx ? { ...item, src: evt.target?.result } : item))
      );
    };
    reader.readAsDataURL(file);
  };

  // ギャラリー画像 3枚一括読み込み
  const handleBatchGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setGallery((prev) =>
          prev.map((item, i) => (i === index ? { ...item, src: evt.target?.result } : item))
        );
      };
      reader.readAsDataURL(file);
    });
  };

  // ギャラリー並び替え（ボタン操作）
  const moveGalleryItem = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= gallery.length) return;
    setGallery((prev) => {
      const next = [...prev];
      const [movedItem] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, movedItem);
      return next;
    });
  };

  // ドラッグ＆ドロップ関連ハンドラー
  const handleDragStart = (e, idx) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    moveGalleryItem(draggedIndex, idx);
    setDraggedIndex(null);
  };

  // ----------------------------------------------------
  // レンダリング (JSX)
  // ----------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: editorColors.bg,
        color: editorColors.text,
        padding: '20px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ==================== プレビュー領域 ==================== */}
        <div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              color: editorColors.subText,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            👁️ リアルタイムプレビュー
          </h3>

          {/* プレビューカード本体 */}
          <div
            style={{
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '16px',
              padding: '20px',
              fontFamily: cardFont,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* プロフィールヘッダー */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              {/* アバター画像枠 */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${currentTheme.accent}`,
                  backgroundColor: currentTheme.border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
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
                      transform: `translate(${avatar.x}px, ${avatar.y}px) scale(${avatar.zoom})`,
                      transition: 'transform 0.05s linear',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '28px' }}>👤</span>
                )}
              </div>

              {/* ユーザー名 & ID */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name || '名前未設定'}
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: currentTheme.subText }}>
                  {handle || '@handle'}
                </p>
              </div>
            </div>

            {/* 自己紹介文 */}
            <p
              style={{
                fontSize: '13px',
                lineHeight: '1.6',
                margin: '0 0 12px 0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {bio || '自己紹介文を入力してください。'}
            </p>

            {/* ハッシュタグ / タグ */}
            {tags && (
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: currentTheme.accent,
                  margin: '0 0 16px 0',
                }}
              >
                {tags}
              </p>
            )}

            {/* ギャラリー画像グリッド (3列) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: currentTheme.border,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={`Gallery ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `translateY(${item.y}px) scale(${item.zoom})`,
                        transition: 'transform 0.05s linear',
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '18px', opacity: 0.5 }}>📷 {idx + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== エディタ設定パネル ==================== */}
        <div
          style={{
            backgroundColor: editorColors.panelBg,
            borderRadius: '16px',
            border: `1px solid ${editorColors.border}`,
            overflow: 'hidden',
          }}
        >
          {/* タブ切り替えバー */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderBottom: `1px solid ${editorColors.border}`,
              backgroundColor: editorColors.inputBg,
            }}
          >
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              colors={editorColors}
            >
              📝 基本情報
            </TabButton>
            <TabButton
              active={activeTab === 'images'}
              onClick={() => setActiveTab('images')}
              colors={editorColors}
            >
              🖼️ 画像設定
            </TabButton>
            <TabButton
              active={activeTab === 'style'}
              onClick={() => setActiveTab('style')}
              colors={editorColors}
            >
              🎨 見た目
            </TabButton>
          </div>

          {/* タブコンテンツエリア */}
          <div style={{ padding: '16px' }}>
            {/* ---------- タブ1: 基本情報 ---------- */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle(editorColors)}>表示名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 山田 太郎"
                    style={inputStyle(editorColors)}
                  />
                </div>

                <div>
                  <label style={labelStyle(editorColors)}>ユーザーID / ハンドル名</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="例: @yamada_taro"
                    style={inputStyle(editorColors)}
                  />
                </div>

                <div>
                  <label style={labelStyle(editorColors)}>自己紹介</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="自己紹介文を入力..."
                    style={{ ...inputStyle(editorColors), resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={labelStyle(editorColors)}>ハッシュタグ / キーワード</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="例: #Design #Web #Art"
                    style={inputStyle(editorColors)}
                  />
                </div>
              </div>
            )}

            {/* ---------- タブ2: 画像設定 ---------- */}
            {activeTab === 'images' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* アイコン画像設定 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: editorColors.text }}>
                    👤 アイコン画像
                  </h4>
                  <FileUploadButton
                    label="📁 画像を変更"
                    onFileSelect={handleAvatarUpload}
                    colors={editorColors}
                  />
                  {avatar.src && (
                    <div
                      style={{
                        marginTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Slider
                        label="左右"
                        value={avatar.x}
                        min={-50}
                        max={50}
                        step={1}
                        onChange={(v) => setAvatar((prev) => ({ ...prev, x: v }))}
                        colors={editorColors}
                      />
                      <Slider
                        label="上下"
                        value={avatar.y}
                        min={-50}
                        max={50}
                        step={1}
                        onChange={(v) => setAvatar((prev) => ({ ...prev, y: v }))}
                        colors={editorColors}
                      />
                      <Slider
                        label="拡大"
                        value={avatar.zoom}
                        min={1}
                        max={2}
                        step={0.05}
                        onChange={(v) => setAvatar((prev) => ({ ...prev, zoom: v }))}
                        colors={editorColors}
                      />
                    </div>
                  )}
                </div>

                <hr
                  style={{
                    border: 'none',
                    borderTop: `1px solid ${editorColors.border}`,
                    margin: 0,
                  }}
                />

                {/* ギャラリー画像設定 */}
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: editorColors.text }}>
                    📷 ギャラリー画像 (3枚)
                  </h4>
                  <p
                    style={{
                      margin: '0 0 10px 0',
                      fontSize: '11px',
                      color: editorColors.subText,
                    }}
                  >
                    💡 PC: ドラッグ＆ドロップ / スマホ: 「▲」「▼」で並び替え
                  </p>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      backgroundColor: editorColors.accent,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    📁 3枚まとめて読み込む
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBatchGalleryUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {gallery.map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      style={{
                        marginBottom: '14px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1px solid ${editorColors.border}`,
                        backgroundColor:
                          draggedIndex === idx ? editorColors.inputBg : 'transparent',
                        cursor: 'grab',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: editorColors.subText,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          ⋮⋮ SS {idx + 1} {item.src && '✅'}
                        </span>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveGalleryItem(idx, idx - 1)}
                            style={arrowButtonStyle(editorColors, idx === 0)}
                            title="上に移動"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === gallery.length - 1}
                            onClick={() => moveGalleryItem(idx, idx + 1)}
                            style={arrowButtonStyle(
                              editorColors,
                              idx === gallery.length - 1
                            )}
                            title="下に移動"
                          >
                            ▼
                          </button>
                          <FileUploadButton
                            label="📁 変更"
                            onFileSelect={handleGalleryUpload(idx)}
                            colors={editorColors}
                          />
                        </div>
                      </div>

                      {item.src && (
                        <div
                          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                        >
                          <Slider
                            label="上下"
                            value={item.y}
                            min={-50}
                            max={50}
                            step={1}
                            onChange={(v) =>
                              setGallery((prev) =>
                                prev.map((g, i) => (i === idx ? { ...g, y: v } : g))
                              )
                            }
                            colors={editorColors}
                          />
                          <Slider
                            label="拡大"
                            value={item.zoom}
                            min={1}
                            max={2}
                            step={0.05}
                            onChange={(v) =>
                              setGallery((prev) =>
                                prev.map((g, i) => (i === idx ? { ...g, zoom: v } : g))
                              )
                            }
                            colors={editorColors}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- タブ3: 見ため ---------- */}
            {activeTab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle(editorColors)}>フォントスタイル</label>
                  <select
                    value={cardFont}
                    onChange={(e) => setCardFont(e.target.value)}
                    style={{ ...inputStyle(editorColors), cursor: 'pointer' }}
                  >
                    {fontOptions.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle(editorColors)}>カラーテーマ</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      maxHeight: '320px',
                      overflowY: 'auto',
                      paddingRight: '4px',
                    }}
                  >
                    {Object.keys(cardThemes).map((key) => {
                      const t = cardThemes[key];
                      const isSelected = cardThemeKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCardThemeKey(key)}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: isSelected
                              ? `2px solid ${editorColors.accent}`
                              : `1px solid ${editorColors.border}`,
                            background: t.bg,
                            color: t.text,
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxShadow: isSelected
                              ? '0 0 8px rgba(99, 102, 241, 0.4)'
                              : 'none',
                          }}
                        >
                          {t.name}
                        </button>
                      );
                    })}
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

// ----------------------------------------------------
// 補助UIコンポーネント & スタイル定義
// ----------------------------------------------------
function TabButton({ active, onClick, children, colors }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '12px 6px',
        border: 'none',
        backgroundColor: active ? colors.panelBg : 'transparent',
        color: active ? colors.accent : colors.subText,
        fontWeight: active ? 'bold' : 'normal',
        cursor: 'pointer',
        fontSize: '13px',
        borderBottom: active ? `2px solid ${colors.accent}` : 'none',
      }}
    >
      {children}
    </button>
  );
}

function FileUploadButton({ label, onFileSelect, colors }) {
  return (
    <label
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        backgroundColor: colors.inputBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 'bold',
        color: colors.text,
      }}
    >
      {label}
      <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
    </label>
  );
}

// タップしやすい「＋/ー」ボタン付きスライダー
function Slider({ label, value, min = 0, max = 100, step = 1, onChange, colors }) {
  const handleStep = (delta) => {
    const nextVal = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(nextVal);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
      <span style={{ fontSize: '11px', color: colors.subText, width: '28px', fontWeight: 'bold' }}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => handleStep(-step)}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg,
          color: colors.text,
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      >
        ー
      </button>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1,
          accentColor: colors.accent,
          height: '28px',
          cursor: 'pointer',
          touchAction: 'none',
        }}
      />
      <button
        type="button"
        onClick={() => handleStep(step)}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.inputBg,
          color: colors.text,
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      >
        ＋
      </button>
    </div>
  );
}

const arrowButtonStyle = (colors, disabled) => ({
  padding: '6px 10px',
  borderRadius: '6px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg,
  color: colors.text,
  fontSize: '10px',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.3 : 1,
  touchAction: 'manipulation',
});

const labelStyle = (colors) => ({
  display: 'block',
  fontSize: '12px',
  fontWeight: 'bold',
  color: colors.subText,
  marginBottom: '6px',
});

const inputStyle = (colors) => ({
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg,
  color: colors.text,
  fontSize: '13px',
  boxSizing: 'border-box',
});