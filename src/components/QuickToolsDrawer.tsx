'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  Code2,
  FileText,
  KeyRound,
  ShieldCheck,
  Globe,
  Fingerprint,
  ArrowLeftRight,
  Sliders,
  CheckCircle2,
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

interface QuickToolsDrawerProps {
  isCurtainClosed?: boolean;
}

export default function QuickToolsDrawer({ isCurtainClosed = false }: QuickToolsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = useCallback((text: string, key = 'default') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundManager.playClick();
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    soundManager.playClick();
  };

  const handleClose = () => {
    setIsOpen(false);
    soundManager.playClick();
  };

  const handleSelectTool = (id: string) => {
    setActiveToolId(id);
    soundManager.playClick();
  };

  const handleBackToList = () => {
    setActiveToolId(null);
    soundManager.playClick();
  };

  // 监听 ESC 按键关闭抽屉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // 点击外部收起抽屉
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

  const activeTool = TOOLS_LIST.find((t) => t.id === activeToolId);

  return (
    <>
      {/* 1. 默认状态下的极简唤醒触发器 (仅在未闭幕且面板收起时显示，极致轻量克制) */}
      {!isCurtainClosed && (
        <div
          className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-300 ${
            isOpen ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-100 pointer-events-auto translate-y-0'
          }`}
        >
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A0E1A]/90 hover:bg-[#121A2C] border border-[#1E2B46] hover:border-[#5CF2C4]/50 text-xs font-mono text-[#8C9EB8] hover:text-[#5CF2C4] shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer group hover:shadow-[0_0_20px_rgba(92,242,196,0.15)]"
            title="打开快捷工具"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] animate-pulse" />
            <span className="font-semibold tracking-wide">快捷工具</span>
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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[85vh] flex flex-col rounded-2xl bg-[#090D18]/95 border border-[#1C273E] shadow-[0_12px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden select-none"
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
                {activeTool ? '当前功能' : 'TOOLS'}
              </p>
              <h3 className="text-base font-bold text-[#EAF0FF] font-sans">
                {activeTool ? activeTool.name : '快捷工具'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#121A2C] border border-[#1E2B46] text-[#7C8DA6] hover:text-[#EAF0FF] hover:bg-[#1A253D] flex items-center justify-center transition-all cursor-pointer"
            title="关闭工具面板 (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 副标题引导 */}
        <div className="px-5 py-2.5 bg-[#080B14]/40 border-b border-[#141C2E]">
          <p className="text-xs text-[#7B8BA3]">
            {activeTool ? activeTool.desc : '选一个工具，马上开始。'}
          </p>
        </div>

        {/* 内容主体区域 (列表态 vs 工具交互态) */}
        <div className="flex-1 overflow-y-auto max-h-[calc(85vh-115px)] p-4 space-y-2.5 custom-scrollbar">
          {!activeTool ? (
            /* --- [A] 工具列表 (严格对应 123.haiwell.com，红框两项已剔除) --- */
            TOOLS_LIST.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool.id)}
                className="w-full text-left p-3 rounded-xl border border-[#152033] bg-[#0E1524]/60 hover:bg-[#131D30] hover:border-[#5CF2C4]/40 transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* 左侧圆形图标徽标 */}
                  <div className="w-10 h-10 rounded-xl bg-[#162035] border border-[#21304D] flex items-center justify-center text-xs font-mono font-bold text-[#8FB5E8] group-hover:text-[#5CF2C4] group-hover:border-[#5CF2C4]/40 transition-colors shrink-0">
                    {tool.icon}
                  </div>

                  {/* 标题与描述 */}
                  <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-semibold text-[#E2EAF8] group-hover:text-white transition-colors truncate">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-[#6F7F98] truncate mt-0.5">
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
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase()
    );
  const handleKebab = () =>
    setInput((s) =>
      s
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
    );
  const handleTrim = () =>
    setInput((s) => s.split('\n').map((l) => l.trim()).filter(Boolean).join('\n'));

  return (
    <div className="space-y-3.5">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在此输入或粘贴需要转换的文本..."
          className="w-full h-32 p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between text-[11px] font-mono text-[#6A7B95] px-1 mt-1">
          <span>字符数: {input.length} · 行数: {input ? input.split('\n').length : 0}</span>
          <button
            onClick={() => onCopy(input, 'str-copy')}
            disabled={!input}
            className="flex items-center gap-1 text-[#5CF2C4] hover:underline disabled:opacity-30 cursor-pointer"
          >
            {copiedKey === 'str-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedKey === 'str-copy' ? '已复制' : '复制结果'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={handleUpper} className="tool-btn">全部大写</button>
        <button onClick={handleLower} className="tool-btn">全部小写</button>
        <button onClick={handleTitle} className="tool-btn">首字母大写</button>
        <button onClick={handleCamel} className="tool-btn">驼峰命名</button>
        <button onClick={handleSnake} className="tool-btn">下划线命名</button>
        <button onClick={handleKebab} className="tool-btn">中划线命名</button>
      </div>
      <button onClick={handleTrim} className="w-full tool-btn">
        清除空行与首尾空格
      </button>
    </div>
  );
}

/* =========================================================================
   子工具 2: 正则表达式 (Regex Tester)
   ========================================================================= */
function RegexTesterTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Today is 2026-10-09, order #42981.');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        setError(null);
        return;
      }
      const reg = new RegExp(pattern, flags);
      const res: string[] = [];
      if (flags.includes('g')) {
        let m;
        while ((m = reg.exec(text)) !== null) {
          res.push(m[0]);
          if (m.index === reg.lastIndex) reg.lastIndex++;
        }
      } else {
        const m = reg.exec(text);
        if (m) res.push(m[0]);
      }
      setMatches(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#7D8FA9]">正则表达式 / 标志</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="例如: \d+"
            className="flex-1 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#5CF2C4] focus:border-[#5CF2C4] focus:outline-none"
          />
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g / i / m"
            className="w-16 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#8FB5E8] focus:border-[#5CF2C4] focus:outline-none text-center"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#7D8FA9]">测试匹配文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-20 p-2.5 rounded-lg bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
        />
      </div>

      {error ? (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#7D8FA9]">
            <span>匹配命中: {matches.length} 处</span>
            {matches.length > 0 && (
              <button
                onClick={() => onCopy(matches.join('\n'), 'reg-copy')}
                className="text-[#5CF2C4] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'reg-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                复制所有匹配
              </button>
            )}
          </div>
          <div className="max-h-24 overflow-y-auto p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] flex flex-wrap gap-1.5">
            {matches.length > 0 ? (
              matches.map((m, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-[#16253C] border border-[#273B5E] text-[#5CF2C4] font-mono text-xs"
                >
                  {m}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#52637D] font-mono">暂无匹配</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   子工具 3: 随机密码生成器 (Password Generator)
   ========================================================================= */
function PasswordGenTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-3.5">
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] flex items-center justify-between">
        <span className="font-mono text-sm text-[#5CF2C4] tracking-wider select-all break-all">
          {password || '请勾选至少一项'}
        </span>
        <button
          onClick={() => onCopy(password, 'pwd-copy')}
          disabled={!password}
          className="ml-2 p-1.5 rounded-lg bg-[#152033] hover:bg-[#1C2C46] text-[#A2B5D2] hover:text-[#5CF2C4] transition-colors shrink-0 disabled:opacity-30 cursor-pointer"
          title="复制密码"
        >
          {copiedKey === 'pwd-copy' ? <Check className="w-4 h-4 text-[#5CF2C4]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-[#7D8FA9]">
          <span>密码长度:</span>
          <span className="text-[#5CF2C4] font-bold">{length} 位</span>
        </div>
        <input
          type="range"
          min="8"
          max="36"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[#5CF2C4] cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A2B5D2]">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] cursor-pointer">
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          <span>大写字母 (A-Z)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] cursor-pointer">
          <input
            type="checkbox"
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          <span>小写字母 (a-z)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          <span>包含数字 (0-9)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="accent-[#5CF2C4]"
          />
          <span>特殊符号 (!@#$)</span>
        </label>
      </div>

      <button
        onClick={generate}
        className="w-full py-2.5 rounded-xl bg-[#5CF2C4]/15 hover:bg-[#5CF2C4]/25 text-[#5CF2C4] border border-[#5CF2C4]/40 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        重新生成高熵密码
      </button>
    </div>
  );
}

/* =========================================================================
   子工具 4: 时间戳转换 (Timestamp Converter)
   ========================================================================= */
function TimestampTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [nowSec, setNowSec] = useState(Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [outputDate, setOutputDate] = useState('');
  const [isMilli, setIsMilli] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTsToDate = () => {
    try {
      const num = Number(inputTs);
      if (isNaN(num)) throw new Error('无效数字');
      const d = new Date(isMilli ? num : num * 1000);
      setOutputDate(d.toLocaleString('zh-CN', { hour12: false }) + ` (UTC: ${d.toISOString()})`);
    } catch {
      setOutputDate('转换失败，请输入有效时间戳');
    }
  };

  useEffect(() => {
    convertTsToDate();
  }, [inputTs, isMilli]);

  return (
    <div className="space-y-3.5">
      {/* 实时时间戳状态 */}
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#6A7B95] block">当前 Unix 时间戳 (秒)</span>
          <span className="text-sm font-mono font-bold text-[#5CF2C4]">{nowSec}</span>
        </div>
        <button
          onClick={() => onCopy(String(nowSec), 'ts-now')}
          className="px-2.5 py-1 rounded-lg bg-[#152033] hover:bg-[#1C2C46] text-[#A2B5D2] hover:text-[#5CF2C4] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
        >
          {copiedKey === 'ts-now' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
          复制当前
        </button>
      </div>

      {/* 转换输入 */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#7D8FA9]">时间戳转日期</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputTs}
            onChange={(e) => setInputTs(e.target.value.trim())}
            placeholder="输入时间戳..."
            className="flex-1 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none"
          />
          <button
            onClick={() => setInputTs(String(isMilli ? Date.now() : Math.floor(Date.now() / 1000)))}
            className="px-3 tool-btn"
          >
            填入现在
          </button>
        </div>
      </div>

      {/* 毫秒切换 */}
      <label className="flex items-center gap-2 text-xs font-mono text-[#A2B5D2] cursor-pointer">
        <input
          type="checkbox"
          checked={isMilli}
          onChange={(e) => setIsMilli(e.target.checked)}
          className="accent-[#5CF2C4]"
        />
        <span>按毫秒处理 (13位时间戳，未勾选时按10位秒处理)</span>
      </label>

      {/* 结果展示 */}
      <div className="p-2.5 rounded-lg bg-[#0B101C] border border-[#1E2B46] flex items-center justify-between text-xs font-mono text-[#5CF2C4] break-all">
        <span>{outputDate}</span>
        {outputDate && !outputDate.includes('失败') && (
          <button
            onClick={() => onCopy(outputDate, 'date-out')}
            className="ml-2 text-[#7C8DA6] hover:text-[#5CF2C4] shrink-0"
            title="复制结果"
          >
            {copiedKey === 'date-out' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 5: Cron 表达式 (Cron Parser)
   ========================================================================= */
function CronParserTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [cron, setCron] = useState('*/15 * * * *');
  const [explanation, setExplanation] = useState('');

  const parseCron = (expr: string) => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) {
      return '标准格式为 5 段：分 时 日 月 周 (例如: */5 * * * *)';
    }
    const [m, h, dom, mon, dow] = parts;
    if (expr === '* * * * *') return '每分钟执行一次';
    if (expr === '*/5 * * * *') return '每 5 分钟执行一次';
    if (expr === '*/15 * * * *') return '每 15 分钟执行一次';
    if (expr === '0 * * * *') return '每小时的整点 (第0分) 执行一次';
    if (expr === '0 0 * * *') return '每天午夜 (00:00:00) 执行一次';
    if (expr === '0 9 * * 1-5') return '每个工作日 (周一至周五) 上午 09:00:00 执行';
    if (expr === '0 0 1 * *') return '每月 1 号午夜 (00:00:00) 执行';
    return `执行计划：第 ${m} 分, 第 ${h} 时, 日期: ${dom}, 月份: ${mon}, 星期: ${dow}`;
  };

  useEffect(() => {
    setExplanation(parseCron(cron));
  }, [cron]);

  const presets = [
    { label: '每 5 分钟', val: '*/5 * * * *' },
    { label: '每小时整点', val: '0 * * * *' },
    { label: '每天午夜', val: '0 0 * * *' },
    { label: '工作日上午9点', val: '0 9 * * 1-5' },
    { label: '每月1号', val: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#7D8FA9]">Cron 表达式 (分 时 日 月 周)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#5CF2C4] font-bold focus:border-[#5CF2C4] focus:outline-none"
          />
          <button
            onClick={() => onCopy(cron, 'cron-copy')}
            className="px-3 tool-btn flex items-center gap-1"
          >
            {copiedKey === 'cron-copy' ? <Check className="w-3 h-3 text-[#5CF2C4]" /> : <Copy className="w-3 h-3" />}
            复制
          </button>
        </div>
      </div>

      {/* 预设标签 */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.val}
            onClick={() => setCron(p.val)}
            className="px-2.5 py-1 rounded-md bg-[#111A2C] border border-[#1E2A44] hover:border-[#5CF2C4]/40 text-[#8B9DB8] hover:text-[#5CF2C4] text-[11px] font-mono transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 中文语义化解读 */}
      <div className="p-3 rounded-xl bg-[#0B101C] border border-[#1E2B46] space-y-1">
        <span className="text-[10px] font-mono text-[#6A7B95] block uppercase">自然语言解析</span>
        <p className="text-xs font-mono text-[#E2EAF8]">{explanation}</p>
      </div>
    </div>
  );
}

/* =========================================================================
   子工具 6: JSON 工具 (JSON Tools)
   ========================================================================= */
function JsonTools({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [jsonStr, setJsonStr] = useState('{"name":"Ciooool","role":"Architect","stack":["Go","Next.js"]}');
  const [status, setStatus] = useState<string | null>(null);

  const format2 = () => {
    try {
      const obj = JSON.parse(jsonStr);
      setJsonStr(JSON.stringify(obj, null, 2));
      setStatus('格式化成功 (2 空格)');
    } catch (e: any) {
      setStatus('语法错误: ' + e.message);
    }
  };

  const minify = () => {
    try {
      const obj = JSON.parse(jsonStr);
      setJsonStr(JSON.stringify(obj));
      setStatus('压缩成功');
    } catch (e: any) {
      setStatus('语法错误: ' + e.message);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={jsonStr}
        onChange={(e) => setJsonStr(e.target.value)}
        placeholder="在此粘贴 JSON 文本..."
        className="w-full h-36 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="flex gap-2">
        <button onClick={format2} className="flex-1 tool-btn font-bold">
          美化 JSON (2格)
        </button>
        <button onClick={minify} className="flex-1 tool-btn">
          压缩单行 (Minify)
        </button>
        <button
          onClick={() => onCopy(jsonStr, 'json-copy')}
          className="px-3 tool-btn flex items-center gap-1"
        >
          {copiedKey === 'json-copy' ? <Check className="w-3.5 h-3.5 text-[#5CF2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          复制
        </button>
      </div>

      {status && (
        <p
          className={`text-[11px] font-mono truncate px-1 ${
            status.includes('错误') ? 'text-rose-400' : 'text-[#5CF2C4]'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

/* =========================================================================
   子工具 7: URL 编码工具 (URL Codec)
   ========================================================================= */
function UrlCodecTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [text, setText] = useState('https://github.com/ciooool?name=全栈架构师&mode=dev');

  const encode = () => {
    try {
      setText(encodeURIComponent(text));
    } catch {}
  };

  const decode = () => {
    try {
      setText(decodeURIComponent(text));
    } catch {}
  };

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入需要编码或解码的 URL / 文本..."
        className="w-full h-28 p-2.5 rounded-xl bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#E2EAF8] focus:border-[#5CF2C4] focus:outline-none resize-none"
      />

      <div className="flex gap-2">
        <button onClick={encode} className="flex-1 tool-btn font-bold">
          URL 编码 (Encode)
        </button>
        <button onClick={decode} className="flex-1 tool-btn">
          URL 解码 (Decode)
        </button>
        <button
          onClick={() => onCopy(text, 'url-copy')}
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
   子工具 8: UUID 生成器 (UUID Generator)
   ========================================================================= */
function UuidGenTool({ onCopy, copiedKey }: { onCopy: (text: string, key?: string) => void; copiedKey: string | null }) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  }, [count, uppercase, hyphens]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-[#A2B5D2]">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-[#5CF2C4]"
            />
            <span>大写</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="accent-[#5CF2C4]"
            />
            <span>带连字符</span>
          </label>
        </div>

        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="p-1 rounded bg-[#0B101C] border border-[#1E2B46] text-xs font-mono text-[#5CF2C4]"
        >
          <option value={1}>生成 1 个</option>
          <option value={5}>生成 5 个</option>
          <option value={10}>生成 10 个</option>
        </select>
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-xl bg-[#0B101C] border border-[#1E2B46] font-mono text-xs text-[#E2EAF8]">
        {uuids.map((id, i) => (
          <div key={i} className="flex items-center justify-between p-1 hover:bg-[#131D30] rounded">
            <span className="truncate pr-2">{id}</span>
            <button
              onClick={() => onCopy(id, `uuid-${i}`)}
              className="text-[#6A7B95] hover:text-[#5CF2C4] shrink-0"
              title="复制"
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
   子工具 9: 加密工具 (Crypto Tools: Base64 / SHA-256)
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
