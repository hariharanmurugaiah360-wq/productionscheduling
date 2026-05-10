// Client-side validation for background image inputs
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

export type ValidationResult = { ok: true } | { ok: false; error: string };

export const validateImageFile = (file: File): ValidationResult => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { ok: false, error: `Unsupported format. Use ${ALLOWED_EXTENSIONS.join(", ").toUpperCase()}.` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `File too large. Max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.` };
  }
  if (file.size === 0) {
    return { ok: false, error: "File is empty." };
  }
  return { ok: true };
};

export const validateImageUrl = (raw: string): ValidationResult => {
  const url = raw.trim();
  if (!url) return { ok: false, error: "URL is empty." };

  // Allow data URLs only for images
  if (url.startsWith("data:")) {
    const match = /^data:([^;,]+)[;,]/.exec(url);
    const mime = match?.[1]?.toLowerCase() ?? "";
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return { ok: false, error: "Data URL must be a supported image type." };
    }
    if (url.length > MAX_IMAGE_BYTES * 1.4) {
      return { ok: false, error: "Embedded image is too large." };
    }
    return { ok: true };
  }

  // Only http(s) remote URLs
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "Invalid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http(s) or data URLs are allowed." };
  }
  // Strip query/hash before checking extension
  const pathname = parsed.pathname.toLowerCase();
  const ext = pathname.split(".").pop() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { ok: false, error: `URL must end in ${ALLOWED_EXTENSIONS.join(", ")}.` };
  }
  return { ok: true };
};

// Verify the URL actually loads as an image (catches 404, CORS image errors, etc.)
export const probeImage = (src: string, timeoutMs = 8000): Promise<boolean> =>
  new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => { img.src = ""; resolve(false); }, timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(true); };
    img.onerror = () => { clearTimeout(timer); resolve(false); };
    img.src = src;
  });
