/**
 * フォローアップ株式会社 Workplace Chat
 * 機能設定ファイル
 *
 * NEXT_PUBLIC_MODE で動作モードを切り替え：
 *   full    → 全機能（デフォルト・開発用）
 *   demo    → 企業デモ用
 *   school  → 佐野中学校 夜間学級用
 *   uno     → UNO専用
 *   followup→ フォローアップ社内用
 */

export type AppMode = "full" | "demo" | "school" | "uno" | "followup";

const raw = process.env.NEXT_PUBLIC_MODE as AppMode | undefined;
export const MODE: AppMode = raw ?? "full";

export const BRAND = {
  full:     { title: "Workplace Chat",                       subtitle: "フォローアップ株式会社",                          headerBg: "linear-gradient(160deg,#0f2d5c,#1d4ed8,#0f2d5c)", accent: "#1d4ed8", dark: "#0f2d5c" },
  demo:     { title: "Workplace Chat",                       subtitle: "フォローアップ株式会社",                          headerBg: "linear-gradient(160deg,#0f2d5c,#1d4ed8,#0f2d5c)", accent: "#1d4ed8", dark: "#0f2d5c" },
  school:   { title: "🏫 泉佐野市立佐野中学校　夜間学級",  subtitle: "AI翻訳チャット　by フォローアップ株式会社",         headerBg: "linear-gradient(160deg,#0c3547,#1a6b8a,#0c3547)", accent: "#1a6b8a", dark: "#0c3547" },
  uno:      { title: "UNO Overseas Placement",               subtitle: "AI Translation Chat",                             headerBg: "linear-gradient(160deg,#1e3a5f,#2563eb,#1e3a5f)", accent: "#2563eb", dark: "#1e3a5f" },
  followup: { title: "Follow Up Team Chat",                  subtitle: "フォローアップ株式会社",                          headerBg: "linear-gradient(160deg,#1a3a5c,#1d4ed8,#1a3a5c)", accent: "#1d4ed8", dark: "#1a3a5c" },
};

export const ALL_LANGUAGES = [
  { code: "ja", label: "日本語",     flag: "🇯🇵" },
  { code: "tl", label: "Tagalog",    flag: "🇵🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ne", label: "नेपाली",      flag: "🇳🇵" },
  { code: "zh", label: "中文",        flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी",       flag: "🇮🇳" },
  { code: "ur", label: "اردو",        flag: "🇵🇰" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "id", label: "Indonesia",  flag: "🇮🇩" },
  { code: "my", label: "မြန်မာ",       flag: "🇲🇲" },
  { code: "en", label: "English",    flag: "🇺🇸" },
];

const LANG_CODES: Record<AppMode, string[]> = {
  full:     ["ja","tl","vi","ne","zh","hi","ur","de","id","my","en"],
  demo:     ["ja","tl","vi","ne","zh","hi","ur","de","id","my","en"],
  school:   ["ja","tl","vi","ne","zh","hi","ur","de","id","my","en"],
  uno:      ["ja","tl","en"],
  followup: ["ja","tl","en"],
};
export const LANGUAGES = ALL_LANGUAGES.filter(l => LANG_CODES[MODE].includes(l.code));

export const ROOMS: Record<AppMode, { id: string; label: string; icon: string; badge?: string }[]> = {
  full: [
    { id: "general",    label: "全体 / General",             icon: "💬" },
    { id: "genba-a",    label: "現場A / Site A",             icon: "🏗️" },
    { id: "genba-b",    label: "現場B / Site B",             icon: "🏠" },
    { id: "souko",      label: "倉庫 / Warehouse",            icon: "📦" },
    { id: "kaigo",      label: "介護 / Care",                 icon: "🤝" },
    { id: "factory",    label: "工場 / Factory",              icon: "🏭" },
    { id: "kokugo",     label: "国語",                        icon: "📖" },
    { id: "sugaku",     label: "数学",                        icon: "📐" },
    { id: "rika",       label: "理科",                        icon: "🔬" },
    { id: "nichigo",    label: "日本語教室",                  icon: "✍️" },
    { id: "walkin",     label: "Walk in Home",                icon: "💻", badge: "CAD" },
  ],
  demo: [
    { id: "genba-a",    label: "現場A / Site A",             icon: "🏗️" },
    { id: "genba-b",    label: "現場B / Site B",             icon: "🏠" },
    { id: "souko",      label: "倉庫 / Warehouse",            icon: "📦" },
    { id: "kaigo",      label: "介護 / Care",                 icon: "🤝" },
    { id: "factory",    label: "工場 / Factory",              icon: "🏭" },
    { id: "jimu",       label: "事務所 / Office",             icon: "🏢" },
    { id: "demo-room",  label: "DEMOルーム",                  icon: "🌐", badge: "DEMO" },
  ],
  school: [
    { id: "class-all",  label: "全体チャット / All Class",    icon: "🏫", badge: "MAIN" },
    { id: "kokugo",     label: "国語 / Japanese Language",    icon: "📖" },
    { id: "sugaku",     label: "数学 / Mathematics",          icon: "📐" },
    { id: "rika",       label: "理科 / Science",              icon: "🔬" },
    { id: "shakai",     label: "社会 / Social Studies",       icon: "🌍" },
    { id: "eigo",       label: "英語 / English",              icon: "🗣️" },
    { id: "nichigo",    label: "日本語教室 / Japanese Class",  icon: "✍️", badge: "人気" },
  ],
  uno: [
    { id: "uno-main",   label: "UNO Main",                    icon: "🌏", badge: "MAIN" },
    { id: "jobs-jp",    label: "Jobs Japan / 仕事",            icon: "💼" },
    { id: "support",    label: "Support / サポート",           icon: "🤝" },
  ],
  followup: [
    { id: "followup-team", label: "Follow Up Team",           icon: "🏢", badge: "MAIN" },
    { id: "karl-design",   label: "Design / Karl",            icon: "🎨" },
    { id: "shimizu-arch",  label: "Architecture / Shimizu",   icon: "🏗️" },
    { id: "walkin",        label: "Walk in Home サポート",     icon: "💻", badge: "CAD" },
  ],
};

export const FEATURES: Record<AppMode, Record<string, boolean>> = {
  full:     { walkinSupport: true,  deleteMessage: true,  customRoom: true,  onlineCount: true },
  demo:     { walkinSupport: false, deleteMessage: true,  customRoom: true,  onlineCount: true },
  school:   { walkinSupport: false, deleteMessage: true,  customRoom: true,  onlineCount: true },
  uno:      { walkinSupport: false, deleteMessage: true,  customRoom: false, onlineCount: true },
  followup: { walkinSupport: true,  deleteMessage: true,  customRoom: false, onlineCount: true },
};

export const FOOTER_TEXT: Record<AppMode, string> = {
  full:     "11言語 AI自動翻訳 · Powered by Claude AI · フォローアップ株式会社",
  demo:     "11言語 AI自動翻訳 · Powered by Claude AI · フォローアップ株式会社",
  school:   "🏫 佐野中学校 夜間学級 · 11言語 AI翻訳 · by フォローアップ株式会社",
  uno:      "AI Translation · UNO × Follow Up Co., Ltd.",
  followup: "🇯🇵 🇺🇸 🇵🇭 Follow Up Team · Powered by Claude AI",
};
