export function convertKiToGTM(input: string): string {
  const GIGA = 1024 * 1024;
  const TERA = 1024 * 1024 * 1024;
  const MEGA = 1024;

  const value = parseInt(input.replace(/[^0-9]/g, ""), 10);

  if (value >= TERA) {
    return (value / TERA).toFixed(2) + "Ti";
  } else if (value >= GIGA) {
    return (value / GIGA).toFixed(2) + "Gi";
  } else if (value >= MEGA) {
    return (value / MEGA).toFixed(2) + "Mi";
  } else {
    return input;
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch (_) {}
}

export function downloadAsFile(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (_) {}
}
