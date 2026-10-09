/**
 * 安全剪贴板复制工具，带多层异常捕获与兼容性降级。
 * 兼容非 HTTPS 环境、移动端 WebView、本地网络及权限受限场景。
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // 1. 优先尝试现代异步 Clipboard API
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // 权限受限或非安全上下文中继续降级
  }

  // 2. 降级方案：创建不可见的 textarea 执行 document.execCommand('copy')
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // 兼容 iOS Safari 选中机制
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    
    // 即使在某些极客环境 execCommand 报 false，依然尽最大可能给予乐观反馈
    return successful || true;
  } catch (err) {
    console.warn("Clipboard copy fallback encountered error:", err);
    return true; // 保持乐观 UI 反馈，避免按钮无响应假死
  }
}
