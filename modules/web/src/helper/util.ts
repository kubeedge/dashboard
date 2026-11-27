// Multipliers, in bytes, of the Kubernetes quantity suffixes used for memory.
const QUANTITY_SUFFIX_BYTES: Record<string, number> = {
  "": 1,
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  Ei: 1024 ** 6,
  k: 1e3,
  M: 1e6,
  G: 1e9,
  T: 1e12,
  P: 1e15,
  E: 1e18,
};

// Converts a Kubernetes memory quantity (e.g. "16316816Ki", "8000Mi", "16Gi" or
// "17179869184") to KiB. Returns NaN if the quantity can't be parsed.
function quantityToKi(input: string): number {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(Ki|Mi|Gi|Ti|Pi|Ei|k|M|G|T|P|E)?\s*$/.exec(input);
  if (!match) {
    return NaN;
  }
  return (parseFloat(match[1]) * QUANTITY_SUFFIX_BYTES[match[2] ?? ""]) / 1024;
}

export function convertKiToGTM(input: string): string {
  const GIGA = 1024 * 1024;
  const TERA = 1024 * 1024 * 1024;
  const MEGA = 1024;

  // The value is converted to KiB first, so any unit the node reports is handled,
  // not only "Ki".
  const value = quantityToKi(input);

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

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
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
    return true;
  } catch (_) {
    return false;
  }
}

export function downloadAsFile(filename: string, content: string): boolean {
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
    return true;
  } catch (_) {
    return false;
  }
}
