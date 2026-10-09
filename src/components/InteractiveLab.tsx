'use client';

import React, { useState } from 'react';
import { Terminal, KeyRound, Copy, Check, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { copyToClipboard as copySafe } from '@/utils/clipboard';

// --- Tool 1: JSON to Go Struct Generator Logic ---
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

// --- Tool 2: Cryptographic Token Generator Logic ---
function generateSecureToken(format: 'base62' | 'hex' | 'uuid' | 'base64url', length: number, prefix: string): string {
  if (format === 'uuid') {
    // RFC 4122 v4
    const u = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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

const SAMPLE_JSON = `{
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

export const InteractiveLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'go' | 'token'>('go');
  const [copied, setCopied] = useState<string | null>(null);

  // Go Struct Generator State
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [rootStructName, setRootStructName] = useState<string>('TelemetryPayload');

  // Token Generator State
  const [tokenFormat, setTokenFormat] = useState<'base62' | 'hex' | 'uuid' | 'base64url'>('base62');
  const [tokenLength, setTokenLength] = useState<number>(32);
  const [tokenPrefix, setTokenPrefix] = useState<string>('sk_live');
  const [currentToken, setCurrentToken] = useState<string>(() =>
    generateSecureToken('base62', 32, 'sk_live')
  );

  const goResult = React.useMemo(() => {
    return jsonToGo(jsonInput, rootStructName || 'AutoStruct');
  }, [jsonInput, rootStructName]);

  const handleCopy = async (text: string, id: string) => {
    if (!text) return;
    const ok = await copySafe(text);
    if (ok) {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleRegenerateToken = () => {
    setCurrentToken(generateSecureToken(tokenFormat, tokenLength, tokenPrefix));
  };

  return (
    <section id="tools" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[var(--border-line)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[var(--phosphor)] bg-[var(--phosphor-subtle)] border border-[var(--phosphor-muted)] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            03 // Engineering Utility Workbench
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            案头工程微工具
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            零依赖、客户端即时运算。开箱即用的高频分布式开发辅助套件。
          </p>
        </div>

        {/* Tab 切换按键 */}
        <div className="mt-6 md:mt-0 flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)]">
          <button
            onClick={() => setActiveTab('go')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'go'
                ? 'bg-[var(--phosphor)] text-[var(--bg-base)] shadow-md shadow-[var(--phosphor-subtle)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            JSON ➔ Go Struct
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'token'
                ? 'bg-[var(--phosphor)] text-[var(--bg-base)] shadow-md shadow-[var(--phosphor-subtle)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            高熵 Token 生成器
          </button>
        </div>
      </div>

      {/* 工作台主体 */}
      <div className="rounded-2xl border border-[var(--border-line)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl backdrop-blur-md transition-colors duration-300">
        {activeTab === 'go' ? (
          <div key="go-tab" className="p-6 sm:p-8">
              {/* 控制工具条 */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-line)]">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">根结构体名称:</label>
                  <input
                    type="text"
                    value={rootStructName}
                    onChange={(e) => setRootStructName(e.target.value)}
                    placeholder="RootStruct"
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--phosphor)]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setJsonInput(SAMPLE_JSON)}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-card)] hover:border-[var(--phosphor)] border border-[var(--border-line)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[var(--phosphor)]" />
                    载入示例 JSON
                  </button>
                  <button
                    onClick={() => {
                      try {
                        setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
                      } catch {}
                    }}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-card)] hover:border-[var(--phosphor)] border border-[var(--border-line)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    美化 JSON
                  </button>
                  <button
                    onClick={() => setJsonInput('')}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-muted)] hover:text-red-400 transition-all cursor-pointer"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 代码工作区 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 输入端 */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase">
                      Raw JSON Payload (输入)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {jsonInput.length} 字符
                    </span>
                  </div>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="请在此粘贴任意复杂 JSON 数据..."
                    className="w-full h-80 p-4 font-mono text-xs leading-relaxed rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--phosphor)] resize-none"
                    spellCheck={false}
                  />
                </div>

                {/* 输出端 */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-[var(--phosphor)] uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] animate-pulse" />
                      Idiomatic Go Struct (实时生成)
                    </span>
                    {goResult.code && !goResult.error && (
                      <button
                        onClick={() => handleCopy(goResult.code, 'go-code')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--bg-card)] hover:border-[var(--phosphor)] border border-[var(--border-line)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                      >
                        {copied === 'go-code' ? (
                          <>
                            <Check className="w-3 h-3 text-[var(--phosphor)]" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            一键复制 Struct
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="w-full h-80 p-4 font-mono text-xs leading-relaxed rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-primary)] overflow-auto relative">
                    {goResult.error ? (
                      <div className="flex items-start gap-2 text-rose-500 dark:text-rose-400 p-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">JSON 解析失败</p>
                          <p className="text-[11px] mt-1 opacity-80">{goResult.error}</p>
                        </div>
                      </div>
                    ) : goResult.code ? (
                      <pre className="text-[var(--text-primary)] whitespace-pre">{goResult.code}</pre>
                    ) : (
                      <div className="text-[var(--text-muted)] flex items-center justify-center h-full">
                        请输入合法的 JSON 字符串...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key="token-tab" className="p-6 sm:p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* 格式选择 */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                    编码算法 & 格式规范
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'base62', label: 'Base62 (Alphanumeric)', desc: '防URL转义/高密度' },
                      { id: 'hex', label: 'Hex 16进制', desc: 'Hash / HMAC 密钥' },
                      { id: 'uuid', label: 'UUID v4', desc: 'RFC 4122 标准' },
                      { id: 'base64url', label: 'Base64URL Safe', desc: 'OAuth / JWT 友好' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => {
                          setTokenFormat(fmt.id as any);
                          setCurrentToken(generateSecureToken(fmt.id as any, tokenLength, tokenPrefix));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          tokenFormat === fmt.id
                            ? 'bg-[var(--phosphor-subtle)] border-[var(--phosphor)] text-[var(--text-primary)] shadow-sm'
                            : 'bg-[var(--bg-card)] border-[var(--border-line)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                        }`}
                      >
                        <div className="text-xs font-mono font-bold">{fmt.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1">{fmt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 长度与前缀 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tokenFormat !== 'uuid' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-mono text-[var(--text-secondary)]">
                          Entropy 长度: <span className="text-[var(--phosphor)] font-bold">{tokenLength} 字节</span>
                        </label>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">8 ~ 128 bytes</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="128"
                        step="4"
                        value={tokenLength}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTokenLength(val);
                          setCurrentToken(generateSecureToken(tokenFormat, val, tokenPrefix));
                        }}
                        className="w-full accent-[var(--phosphor)] bg-[var(--bg-card)]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2">
                      自定义系统前缀 (Prefix Tag)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tokenPrefix}
                        onChange={(e) => {
                          setTokenPrefix(e.target.value);
                          setCurrentToken(generateSecureToken(tokenFormat, tokenLength, e.target.value));
                        }}
                        placeholder="sk_live / req / dev"
                        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--phosphor)]"
                      />
                      <button
                        onClick={handleRegenerateToken}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-primary)] transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        重掷
                      </button>
                    </div>
                  </div>
                </div>

                {/* 结果展示卡片 */}
                <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      Generated Cryptographic Token
                    </span>
                    <button
                      onClick={() => handleCopy(currentToken, 'token-val')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--phosphor)] text-[var(--bg-base)] shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      {copied === 'token-val' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制密匙
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-line)] font-mono text-sm break-all select-all text-[var(--phosphor)]">
                    {currentToken}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-[var(--text-muted)]">
                    <span>熵来源: Web Cryptography API (`crypto.getRandomValues`)</span>
                    <span>•</span>
                    <span>高安全系数不可预测</span>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </section>
  );
};
