'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  AlertCircle,
} from 'lucide-react';
import { soundManager } from '@/utils/audio';

type ToolCategory = '文本' | '安全' | '时间' | '数据' | '网络' | '标识';

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: ToolCategory;
  icon: string;
}

const TOOLS_LIST: ToolItem[] = [
  {
    id: 'string-format',
    name: '字符串格式化',
    desc: '让文字更符合你的需要。',
    category: '文本',
    icon: 'Aa',
  },
  {
    id: 'regex-tester',
    name: '正则表达式',
    desc: '测试匹配、捕获组和正则标志。',
    category: '文本',
    icon: '.*',
  },
  {
    id: 'password-gen',
    name: '随机密码生成器',
    desc: '生成一串更难猜的密码。',
    category: '安全',
    icon: '✦',
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    desc: '在时间戳和日期之间自由转换。',
    category: '时间',
    icon: '↔',
  },
  {
    id: 'cron-parser',
    name: 'Cron 表达式',
    desc: '按时间生成 Cron 表达式，或解析已有表达式。',
    category: '时间',
    icon: '◷',
  },
  {
    id: 'json-tools',
    name: 'JSON 工具',
    desc: '让 JSON 清楚、整齐、可读。',
    category: '数据',
    icon: '{}',
  },
  {
    id: 'json-to-go',
    name: 'JSON 转 Go Struct',
    desc: '将 JSON 实时逆向为严谨的 Go 结构体定义。',
    category: '数据',
    icon: 'Go',
  },
  {
    id: 'token-gen',
    name: '高熵 Token 生成器',
    desc: 'API Key / Base62 / 密码学安全随机令牌。',
    category: '安全',
    icon: '⚿',
  },
  {
    id: 'url-codec',
    name: 'URL 编码工具',
    desc: '让 URL 传递得更准确。',
    category: '网络',
    icon: '↗',
  },
  {
    id: 'uuid-gen',
    name: 'UUID 生成器',
    desc: '一次生成多个唯一标识。',
    category: '标识',
    icon: 'ID',
  },
  {
    id: 'crypto-tools',
    name: '加密工具',
    desc: '常用 Base64、SHA-256 摘要与计算。',
    category: '安全',
    icon: '⌁',
  },
];

/* =========================================================================
   核心算法 1: JSON to Go Struct
   ========================================================================= */
function jsonToGo(jsonStr: string, rootName = 'Payload'): { code: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);

    function toPascalCase(str: string): string {
      return str
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
    }

    const structs: string[] = [];

    function parseObject(obj: any, name: string): string {
      if (obj === null) return 'any';
      if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]any';
        const elemType = parseObject(obj[0], `${name}Item`);
        return `[]${elemType}`;
      }
      if (typeof obj === 'object') {
        const typeName = toPascalCase(name);
        const fields: string[] = [];

        for (const [key, val] of Object.entries(obj)) {
          const fieldName = toPascalCase(key);
          let fieldType = 'any';

          if (val === null) {
            fieldType = 'any';
          } else if (typeof val === 'string') {
            fieldType = 'string';
          } else if (typeof val === 'number') {
            fieldType = Number.isInteger(val) ? 'int64' : 'float64';
          } else if (typeof val === 'boolean') {
            fieldType = 'bool';
          } else if (Array.isArray(val)) {
            if (val.length === 0) {
              fieldType = '[]any';
            } else if (typeof val[0] === 'object' && val[0] !== null) {
              fieldType = `[]${toPascalCase(key)}Item`;
              parseObject(val[0], `${key}Item`);
            } else {
              fieldType = `[]${typeof val[0]}`;
            }
          } else if (typeof val === 'object') {
            fieldType = toPascalCase(key);
            parseObject(val, key);
          }

          fields.push(`\t${fieldName} ${fieldType} \`json:"${key}"\``);
        }

        const structDef = `type ${typeName} struct {\n${fields.join('\n')}\n}`;
        if (!structs.some((s) => s.startsWith(`type ${typeName} struct`))) {
          structs.push(structDef);
        }
        return typeName;
      }
      return typeof obj;
    }

    parseObject(parsed, rootName);
    return { code: structs.reverse().join('\n\n') };
  } catch (err: any) {
    return { code: '', error: err.message || '无效的 JSON 格式' };
  }
}

/* =========================================================================
   核心算法 2: 高熵密码学安全 Token 生成
   ========================================================================= */
function generateSecureToken(format: 'base62' | 'hex' | 'uuid' | 'base64url', length: number, prefix: string): string {
  if (format === 'uuid') {
    const u = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
    return prefix ? `${prefix}_${u}` : u;
  }

  const charSets = {
    base62: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    hex: '0123456789abcdef',
    base64url: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  };

  const chars = charSets[format];
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  return prefix ? `${prefix}_${result}` : result;
}

interface QuickToolsDrawerProps {
  isCurtainClosed?: boolean;
}

export default function QuickToolsDrawer({ isCurtainClosed = false }: QuickToolsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMac, setIsMac] = useState(true);

  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  const copyToClipboard = useCallback((text: string, key = 'default') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundManager.playClick();
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    soundManager.playClick();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    soundManager.playClick();
  }, []);

  const handleSelectTool = (id: string) => {
    setActiveToolId(id);
    soundManager.playClick();
  };

  const handleBackToList = () => {
    setActiveToolId(null);
    soundManager.playClick();
  };

  // 全局唤醒快捷键监听: ⌘K / Ctrl+K 以及 ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 快捷键: Cmd+K (Mac) 或 Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          soundManager.playClick();
          return next;
        });
        return;
      }

      // ESC 键收起处理
      if (e.key === 'Escape' && isOpen) {
        if (activeToolId) {
          setActiveToolId(null);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeToolId]);

  // 全局事件监听: 支持从导航栏触发唤醒
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
      soundManager.playClick();
    };
    window.addEventListener('open-quick-tools', handleOpenEvent);
    return () => window.removeEventListener('open-quick-tools', handleOpenEvent);
  }, []);

  // 点击外部遮罩收起抽屉
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDown);
    }
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  // 打开抽屉后自动聚焦搜索框
  useEffect(() => {
    if (isOpen && !activeToolId) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeToolId]);

  const activeTool = TOOLS_LIST.find((t) => t.id === activeToolId);

  // 搜索过滤工具列表
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS_LIST;
    const q = searchQuery.toLowerCase().trim();
    return TOOLS_LIST.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.icon.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      {/* 1. 默认状态下的极简唤醒触发器 (带 ⌘K 快捷键徽标，极致克制) */}
      {!isCurtainClosed && (
        <div
          className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-300 ${
            isOpen ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-100 pointer-events-auto translate-y-0'
          }`}
        >
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A0E1A]/90 hover:bg-[#121A2C] border border-[#1E2B46] hover:border-[#5CF2C4]/50 text-xs font-mono text-[#8C9EB8] hover:text-[#5CF2C4] shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer group hover:shadow-[0_0_20px_rgba(92,242,196,0.15)]"
            title={`打开快捷工具 (${isMac ? '⌘K' : 'Ctrl+K'})`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] animate-pulse" />
            <span className="font-semibold tracking-wide">快捷工具</span>
            <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#162035] border border-[#233352] text-[#7A8DA6] group-hover:text-[#5CF2C4] transition-colors ml-0.5">
              {isMac ? '⌘ K' : 'Ctrl K'}
            </kbd>
          </button>
        </div>
      )}

      {/* 2. 背景微弱透光遮罩 (点击可直接关闭) */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 300ms cubic-bezier(0.42, 0, 0.58, 1), visibility 0s linear ' + (isOpen ? '0s' : '300ms'),
        }}
      />

      {/* 3. 展开抽屉面板容器 (平滑淡入展开、淡出收起，完美对标 123.haiwell.com) */}
      <div
        ref={drawerRef}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] flex flex-col rounded-2xl bg-[#090D18]/95 border border-[#1C273E] shadow-[0_12px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden select-none"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition:
            'opacity 320ms cubic-bezier(0.42, 0, 0.58, 1), transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s linear ' +
            (isOpen ? '0s' : '320ms'),
        }}
      >
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#162035] bg-[#0C1220]/50">
          <div className="flex items-center gap-2.5">
            {activeTool ? (
              <button
                onClick={handleBackToList}
                className="p-1 -ml-1 rounded-lg text-[#7C8DA6] hover:text-[#5CF2C4] hover:bg-[#151F33] transition-colors cursor-pointer"
                title="返回工具列表"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}

            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#5C6D89] uppercase font-semibold">
                {activeTool ? '当前功能' : 'COMMAND & TOOLS'}
              </p>
              <h3 className="text-base font-bold text-[#EAF0FF] font-sans">
                {activeTool ? activeTool.name : '快捷工具'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!activeTool && (
              <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#131B2D] border border-[#202D45] text-[#6C7E99]">
                {isMac ? '⌘ K' : 'Ctrl K'}
              </kbd>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#121A2C] border border-[#1E2B46] text-[#7C8DA6] hover:text-[#EAF0FF] hover:bg-[#1A253D] flex items-center justify-center transition-all cursor-pointer"
              title="关闭工具面板 (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 抽屉顶部搜索条 (列表态呈现，对标全局搜索 Command Palette 体验) */}
        {!activeTool && (
          <div className="px-4 pt-3 pb-2 bg-[#0A0E1B]/70 border-b border-[#141C2E]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-[#5C6D89] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索工具 (如: Go, Token, 正则, JSON, 时间)..."
                className="w-full pl-8 pr-8 py-1.5 text-xs font-mono rounded-xl bg-[#070B14] border border-[#1B273F] text-[#E2EAF8] placeholder-[#5C6D89] focus:outline-none focus:border-[#5CF2C4] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 text-[#5C6D89] hover:text-[#E2EAF8] text-xs cursor-pointer"
                  title="清空搜索"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 副标题引导 */}
        <div className="px-5 py-2 bg-[#080B14]/40 border-b border-[#141C2E]">
          <p className="text-xs text-[#7B8BA3]">
            {activeTool
              ? activeTool.desc
              : searchQuery
              ? `共找到 ${filteredTools.length} 个相关工具`
              : '选一个工具，马上开始。'}
          </p>
        </div>

        {/* 内容主体区域 (列表态 vs 工具交互态) */}
        <div className="flex-1 overflow-y-auto max-h-[calc(85vh-130px)] p-4 space-y-2 custom-scrollbar">
          {!activeTool ? (
            /* --- [A] 工具列表 (原案头工具 + 123.haiwell.com，共 11 款实用微工具) --- */
            filteredTools.length === 0 ? (
              <div className="text-center py-10 text-xs font-mono text-[#5C6D89]">
                未找到匹配的工具
              </div>
            ) : (
              filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.id)}
                  className="w-full text-left p-2.5 rounded-xl border border-[#152033] bg-[#0E1524]/60 hover:bg-[#131D30] hover:border-[#5CF2C4]/40 transition-all duration-200 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 左侧圆形图标徽标 */}
                    <div className="w-9 h-9 rounded-xl bg-[#162035] border border-[#21304D] flex items-center justify-center text-xs font-mono font-bold text-[#8FB5E8] group-hover:text-[#5CF2C4] group-hover:border-[#5CF2C4]/40 transition-colors shrink-0">
                      {tool.icon}
                    </div>

                    {/* 标题与描述 */}
                    <div className="min-w-0 pr-2">
                      <h4 className="text-sm font-semibold text-[#E2EAF8] group-hover:text-white transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-[#6F7F98] truncate mt-0.5">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  {/* 右侧标签与箭头 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#162035] text-[#7A8CA6] border border-[#202E48]">
                      {tool.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#4A5A74] group-hover:text-[#5CF2C4] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )
          ) : (
            /* --- [B] 具体工具交互面板 --- */
            <div className="py-1">
              {activeTool.id === 'string-format' && (
                <StringFormatTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'regex-tester' && (
                <RegexTesterTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'password-gen' && (
                <PasswordGenTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'timestamp' && (
                <TimestampTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'cron-parser' && (
                <CronParserTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'json-tools' && (
                <JsonTools onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'json-to-go' && (
                <JsonToGoTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'token-gen' && (
                <TokenGenTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'url-codec' && (
                <UrlCodecTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'uuid-gen' && (
                <UuidGenTool onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
              {activeTool.id === 'crypto-tools' && (
                <CryptoTools onCopy={copyToClipboard} copiedKey={copiedKey} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   子工具 1: 字符串格式化 (String Formatter)
   ========================================================================= */
function StringFormatTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('');

  const handleUpper = () => setInput((s) => s.toUpperCase());
  const handleLower = () => setInput((s) => s.toLowerCase());
  const handleTitle = () =>
    setInput((s) =>
      s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
    );
  const handleCamel = () =>
    setInput((s) =>
      s
        .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase())
    );
  const handleSnake = () =>
    setInput((s) =>
      s
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
        .replace(/[-\s]+/g, '_')
    );
  const handleTrim = () => setInput((s) => s.replace(/\s+/g, ' ').trim());

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入或粘贴文本..."
        className="w-full h-28 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="flex items-center justify-between text-[11px] font-mono text-[#6A7B95] px-1">
        <span>字符数: {input.length}</span>
        <span>单词数: {input.trim() ? input.trim().split(/\s+/).length : 0}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={handleUpper} className="tool-btn">大写 (UPPER)</button>
        <button onClick={handleLower} className="tool-btn">小写 (lower)</button>
        <button onClick={handleTitle} className="tool-btn">首字母大写</button>
        <button onClick={handleCamel} className="tool-btn">转驼峰 (camelCase)</button>
        <button onClick={handleSnake} className="tool-btn">转下划线 (snake_case)</button>
        <button onClick={handleTrim} className="tool-btn">压缩空白</button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onCopy(input, 'str-copy')}
          className="flex-1 tool-btn flex items-center justify-center gap-1.5"
        >
          {copiedKey === 'str-copy' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          复制结果
        </button>
        <button onClick={() => setInput('')} className="tool-btn text-[#E06C75]">
          清空
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 2: 正则表达式 (Regex Tester)
   ========================================================================= */
function RegexTesterTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('联系邮箱：ciooool@gmail.com 或 support@haiwell.com 随时来信。');

  const { matches, error } = useMemo(() => {
    try {
      if (!pattern) return { matches: [], error: null };
      const regex = new RegExp(pattern, flags);
      const m = Array.from(testText.matchAll(regex));
      return { matches: m, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testText]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式..."
            className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#5CF2C4] focus:border-[#5CF2C4] focus:outline-none"
          />
        </div>
        <input
          type="text"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
          className="w-16 px-2 py-1.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#8C9EB8] text-center focus:border-[#5CF2C4] focus:outline-none"
        />
      </div>

      {error ? (
        <p className="text-[11px] font-mono text-rose-400">正则错误: {error}</p>
      ) : (
        <p className="text-[11px] font-mono text-[#6A7B95]">找到 {matches.length} 处匹配</p>
      )}

      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="输入用于测试的文本..."
        className="w-full h-24 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase text-[#6A7B95]">匹配结果:</div>
        <div className="max-h-28 overflow-y-auto space-y-1 p-2 rounded-xl bg-[#0B101C] border border-[#1E2B46]">
          {matches.length === 0 ? (
            <span className="text-[11px] font-mono text-[#5C6D89]">暂无匹配项</span>
          ) : (
            matches.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono text-[#5CF2C4] bg-[#121A2C] px-2 py-1 rounded">
                <span>{m[0]}</span>
                <button
                  onClick={() => onCopy(m[0], `match-${idx}`)}
                  className="text-[#7C8DA6] hover:text-white cursor-pointer"
                >
                  {copiedKey === `match-${idx}` ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 3: 随机密码生成器 (Password Generator)
   ========================================================================= */
function PasswordGenTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[arr[i] % chars.length];
    }
    setPassword(result);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-3">
      {/* 密码展示区 */}
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] flex items-center justify-between">
        <span className="text-sm font-mono text-[#5CF2C4] select-all break-all">{password || '请至少勾选一种字符'}</span>
        <button
          onClick={() => onCopy(password, 'pwd-copy')}
          className="p-1.5 text-[#7C8DA6] hover:text-[#5CF2C4] cursor-pointer ml-2"
          title="复制密码"
        >
          {copiedKey === 'pwd-copy' ? <Check className="w-4 h-4 text-[#5CF2C4]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* 长度调节滑块 */}
      <div>
        <div className="flex justify-between text-xs font-mono text-[#8C9EB8] mb-1">
          <span>密码长度:</span>
          <span className="text-[#5CF2C4] font-bold">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[#5CF2C4] h-1.5 bg-[#121A2C] rounded-lg cursor-pointer"
        />
      </div>

      {/* 字符类型勾选 */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#8C9EB8]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useUpper}
            onChange={(e) => setUseUpper(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          大写字母 (A-Z)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useLower}
            onChange={(e) => setUseLower(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          小写字母 (a-z)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          数字 (0-9)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          特殊符号 (!@#$)
        </label>
      </div>

      <button onClick={generate} className="w-full tool-btn flex items-center justify-center gap-1.5 py-2">
        <RotateCcw className="w-3.5 h-3.5" />
        重新生成密码
      </button>
    </div>
  );
}

/* =========================================================================
   子工具 4: 时间戳转换 (Timestamp Converter)
   ========================================================================= */
function TimestampTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [currentTs, setCurrentTs] = useState(() => Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 19).replace('T', ' '));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tsToDate = () => {
    try {
      const num = Number(inputTs);
      const isMs = inputTs.length > 11;
      const d = new Date(isMs ? num : num * 1000);
      setDateStr(d.toISOString().slice(0, 19).replace('T', ' '));
    } catch {}
  };

  const dateToTs = () => {
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      setInputTs(Math.floor(d.getTime() / 1000).toString());
    } catch {}
  };

  return (
    <div className="space-y-3">
      {/* 当前时间戳跳动卡片 */}
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-[#6A7B95]">当前 Unix 时间戳 (秒)</p>
          <p className="text-base font-mono text-[#5CF2C4] font-bold">{currentTs}</p>
        </div>
        <button
          onClick={() => onCopy(currentTs.toString(), 'curr-ts')}
          className="tool-btn text-xs py-1 px-2.5 flex items-center gap-1"
        >
          {copiedKey === 'curr-ts' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
          复制
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-[#8C9EB8]">时间戳 (秒/毫秒):</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputTs}
            onChange={(e) => setInputTs(e.target.value)}
            className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none"
          />
          <button onClick={tsToDate} className="tool-btn text-xs px-3">
            转日期 ➔
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-[#8C9EB8]">标准日期 (YYYY-MM-DD HH:mm:ss):</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none"
          />
          <button onClick={dateToTs} className="tool-btn text-xs px-3">
            转时间戳 ➔
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 5: Cron 表达式 (Cron Parser)
   ========================================================================= */
function CronParserTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [cron, setCron] = useState('0 0 * * *');

  const presets = [
    { label: '每分钟', val: '* * * * *' },
    { label: '每 5 分钟', val: '*/5 * * * *' },
    { label: '每小时整点', val: '0 * * * *' },
    { label: '每天午夜', val: '0 0 * * *' },
    { label: '每周一凌晨', val: '0 0 * * 1' },
  ];

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] space-y-1">
        <p className="text-[10px] font-mono text-[#6A7B95]">Cron 表达式 (分 时 日 月 周)</p>
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="w-full bg-transparent text-base font-mono text-[#5CF2C4] font-bold focus:outline-none"
          />
          <button
            onClick={() => onCopy(cron, 'cron-copy')}
            className="tool-btn text-xs py-1 px-2.5 shrink-0 ml-2"
          >
            {copiedKey === 'cron-copy' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase text-[#6A7B95]">快捷常用预设:</div>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setCron(p.val)}
              className={`p-2 rounded-lg text-xs font-mono text-left border transition-all cursor-pointer ${
                cron === p.val
                  ? 'bg-[#18233C] border-[#5CF2C4] text-[#5CF2C4]'
                  : 'bg-[#0B101C] border-[#1E2B46] text-[#8C9EB8] hover:border-[#354668]'
              }`}
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{p.val}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 6: JSON 工具 (JSON Tools)
   ========================================================================= */
function JsonTools({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('{\n  "name": "Ciooool",\n  "role": "Architect & Maker",\n  "status": "online"\n}');
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleMinify = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError(null);
        }}
        placeholder="粘贴或输入 JSON 字符串..."
        className="w-full h-40 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
        spellCheck={false}
      />

      {error && <p className="text-[11px] font-mono text-rose-400">JSON 语法错误: {error}</p>}

      <div className="grid grid-cols-3 gap-2">
        <button onClick={handleFormat} className="tool-btn">格式化排版</button>
        <button onClick={handleMinify} className="tool-btn">压缩为单行</button>
        <button
          onClick={() => onCopy(input, 'json-copy')}
          className="tool-btn flex items-center justify-center gap-1"
        >
          {copiedKey === 'json-copy' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          复制内容
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 7: JSON 转 Go Struct (原案头工具 1 完美整合)
   ========================================================================= */
const SAMPLE_JSON_PAYLOAD = `{
  "request_id": "req_8f9021a8",
  "client": {
    "organization": "Hyperion Labs",
    "tier": "enterprise",
    "is_active": true
  },
  "metrics": {
    "qps": 84200,
    "p99_latency_ms": 3.42,
    "nodes": [
      { "id": "node-us-east-1", "healthy": true, "load": 0.42 },
      { "id": "node-ap-east-1", "healthy": true, "load": 0.38 }
    ]
  }
}`;

function JsonToGoTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON_PAYLOAD);
  const [rootName, setRootName] = useState('TelemetryPayload');

  const { code, error } = useMemo(() => {
    return jsonToGo(jsonInput, rootName || 'Payload');
  }, [jsonInput, rootName]);

  const handleBeautify = () => {
    try {
      setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
    } catch {}
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-mono text-[#6A7B95] whitespace-nowrap">根结构体:</label>
        <input
          type="text"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          placeholder="Payload"
          className="flex-1 px-2.5 py-1 text-xs font-mono rounded-lg bg-[#0B101C] border border-[#1E2B46] text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none"
        />
        <button onClick={handleBeautify} className="tool-btn text-[11px] py-1 px-2">
          格式化
        </button>
        <button onClick={() => setJsonInput(SAMPLE_JSON_PAYLOAD)} className="tool-btn text-[11px] py-1 px-2 text-[#5CF2C4]">
          示例
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-[10px] font-mono text-[#6A7B95] mb-1">JSON 输入:</div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="粘贴 JSON..."
            className="w-full h-28 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6A7B95] mb-1">
            <span>Go Struct 实时生成:</span>
            {code && !error && (
              <button
                onClick={() => onCopy(code, 'go-copy')}
                className="text-[#5CF2C4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'go-copy' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
                一键复制 Struct
              </button>
            )}
          </div>
          <div className="w-full h-32 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono overflow-auto relative">
            {error ? (
              <div className="flex items-start gap-1.5 text-rose-400 p-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : code ? (
              <pre className="text-[#5CF2C4] whitespace-pre text-[11px] leading-relaxed">{code}</pre>
            ) : (
              <div className="text-[#5C6D89] text-[11px] flex items-center justify-center h-full">请输入合法 JSON...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 8: 高熵 Token 生成器 (原案头工具 2 完美整合)
   ========================================================================= */
function TokenGenTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [format, setFormat] = useState<'base62' | 'hex' | 'uuid' | 'base64url'>('base62');
  const [length, setLength] = useState(32);
  const [prefix, setPrefix] = useState('sk_live');
  const [token, setToken] = useState(() => generateSecureToken('base62', 32, 'sk_live'));

  const handleRegenerate = () => {
    setToken(generateSecureToken(format, length, prefix));
  };

  const handleFormatChange = (f: 'base62' | 'hex' | 'uuid' | 'base64url') => {
    setFormat(f);
    setToken(generateSecureToken(f, length, prefix));
  };

  return (
    <div className="space-y-3">
      {/* 算法选择 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {[
          { id: 'base62', label: 'Base62' },
          { id: 'hex', label: 'Hex 16进制' },
          { id: 'uuid', label: 'UUID v4' },
          { id: 'base64url', label: 'Base64URL' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleFormatChange(item.id as any)}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer ${
              format === item.id
                ? 'bg-[#18233C] border-[#5CF2C4] text-[#5CF2C4] font-bold shadow-sm'
                : 'bg-[#0B101C] border-[#1E2B46] text-[#7A8DA6] hover:border-[#344669]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 长度与前缀 */}
      <div className="grid grid-cols-2 gap-3 items-center">
        {format !== 'uuid' ? (
          <div>
            <div className="flex justify-between text-[11px] font-mono text-[#6A7B95] mb-1">
              <span>熵长度:</span>
              <span className="text-[#5CF2C4] font-bold">{length} 字节</span>
            </div>
            <input
              type="range"
              min="8"
              max="128"
              step="4"
              value={length}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLength(val);
                setToken(generateSecureToken(format, val, prefix));
              }}
              className="w-full accent-[#5CF2C4] h-1.5 bg-[#121A2C] rounded-lg cursor-pointer"
            />
          </div>
        ) : (
          <div className="text-[11px] font-mono text-[#6A7B95]">RFC 4122 标准 UUID</div>
        )}

        <div>
          <label className="block text-[11px] font-mono text-[#6A7B95] mb-1">自定义前缀:</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => {
              setPrefix(e.target.value);
              setToken(generateSecureToken(format, length, e.target.value));
            }}
            placeholder="如 sk_live"
            className="w-full px-2.5 py-1 text-xs font-mono rounded-lg bg-[#0B101C] border border-[#1E2B46] text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none"
          />
        </div>
      </div>

      {/* Token 展示卡片 */}
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#6A7B95]">
          <span>生成结果 (Web Crypto API):</span>
          <button
            onClick={() => onCopy(token, 'token-copy')}
            className="text-[#5CF2C4] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'token-copy' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
            复制密匙
          </button>
        </div>
        <p className="text-xs font-mono text-[#5CF2C4] break-all select-all font-semibold">{token}</p>
      </div>

      <button onClick={handleRegenerate} className="w-full tool-btn flex items-center justify-center gap-1.5 py-2">
        <RotateCcw className="w-3.5 h-3.5" />
        重新掷取新令牌
      </button>
    </div>
  );
}

/* =========================================================================
   子工具 9: URL 编码工具 (URL Codec)
   ========================================================================= */
function UrlCodecTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('https://ciooool.dev/?tag=全栈架构&source=github');

  const handleEncode = () => {
    try {
      setInput(encodeURIComponent(input));
    } catch {}
  };

  const handleDecode = () => {
    try {
      setInput(decodeURIComponent(input));
    } catch {}
  };

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入需要编码或解码的 URL 文本..."
        className="w-full h-32 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="flex gap-2">
        <button onClick={handleEncode} className="flex-1 tool-btn">URL 编码 (Encode)</button>
        <button onClick={handleDecode} className="flex-1 tool-btn">URL 解码 (Decode)</button>
        <button
          onClick={() => onCopy(input, 'url-copy')}
          className="px-3 tool-btn flex items-center gap-1"
        >
          {copiedKey === 'url-copy' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          复制
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 10: UUID 生成器 (UUID Generator)
   ========================================================================= */
function UuidGenTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [count, setCount] = useState(3);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  }, [count, hyphens, uppercase]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-[#8C9EB8]">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          包含连字符 (-)
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          全大写 (UPPER)
        </label>
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto">
        {uuids.map((id, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#5CF2C4]">
            <span className="truncate pr-2">{id}</span>
            <button
              onClick={() => onCopy(id, `uuid-${i}`)}
              className="p-1 text-[#7C8DA6] hover:text-white cursor-pointer"
            >
              {copiedKey === `uuid-${i}` ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="flex-1 tool-btn flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          重新生成
        </button>
        <button
          onClick={() => onCopy(uuids.join('\n'), 'uuid-all')}
          className="flex-1 tool-btn flex items-center justify-center gap-1.5"
        >
          {copiedKey === 'uuid-all' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          全部复制
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 11: 加密工具 (Crypto Tools: Base64 / SHA-256)
   ========================================================================= */
function CryptoTools({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [input, setInput] = useState('Hello, World!');
  const [sha256, setSha256] = useState('');

  const handleBase64Encode = () => {
    try {
      setInput(btoa(unescape(encodeURIComponent(input))));
    } catch {}
  };

  const handleBase64Decode = () => {
    try {
      setInput(decodeURIComponent(escape(atob(input))));
    } catch {}
  };

  useEffect(() => {
    const calc = async () => {
      try {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        setSha256(hashHex);
      } catch {
        setSha256('');
      }
    };
    calc();
  }, [input]);

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入需编码或哈希计算的明文/密文..."
        className="w-full h-24 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="flex gap-2">
        <button onClick={handleBase64Encode} className="flex-1 tool-btn font-bold">
          Base64 编码
        </button>
        <button onClick={handleBase64Decode} className="flex-1 tool-btn">
          Base64 解码
        </button>
        <button
          onClick={() => onCopy(input, 'b64-copy')}
          className="px-3 tool-btn flex items-center gap-1"
        >
          {copiedKey === 'b64-copy' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          复制
        </button>
      </div>

      <div className="p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#6A7B95]">
          <span>SHA-256 哈希值</span>
          <button
            onClick={() => onCopy(sha256, 'sha-copy')}
            className="text-[#5CF2C4] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'sha-copy' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
            复制哈希
          </button>
        </div>
        <p className="text-xs font-mono text-[#5CF2C4] break-all select-all">{sha256}</p>
      </div>
    </div>
  );
}
