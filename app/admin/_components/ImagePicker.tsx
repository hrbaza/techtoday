"use client";

const MAX_IMAGE_WIDTH = 1600;

// Resize in the browser so uploads stay small (Vercel caps request bodies).
async function resizeImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const webp = canvas.toDataURL("image/webp", 0.82);
  return webp.startsWith("data:image/webp")
    ? webp
    : canvas.toDataURL("image/jpeg", 0.85);
}

type Props = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  url: string; // saved image URL or an external link
  upload: string | null; // newly picked file, as a data: URL
  alt: string;
  defaultAlt: string;
  onUrl: (url: string) => void;
  onUpload: (dataUrl: string | null) => void;
  onAlt: (alt: string) => void;
  onError: (message: string) => void;
};

export default function ImagePicker({
  id,
  label,
  hint,
  required,
  url,
  upload,
  alt,
  defaultAlt,
  onUrl,
  onUpload,
  onAlt,
  onError,
}: Props) {
  const src = upload || url;

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      onUpload(await resizeImage(file));
      if (!alt) onAlt(defaultAlt);
    } catch {
      onError("That image could not be read. Try a JPEG or PNG.");
    }
  }

  function handleRemove() {
    onUpload(null);
    onUrl("");
    onAlt("");
  }

  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      {hint && <p className="admin-hint" style={{ marginTop: -2, marginBottom: 8 }}>{hint}</p>}
      <div className="admin-cover">
        <div className="admin-cover-preview">
          {src ? <img src={src} alt="" /> : "No image"}
        </div>
        <div className="admin-form" style={{ gap: 12 }}>
          <div className="admin-bar-actions">
            <input
              id={`${id}-file`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label={`Upload ${label.toLowerCase()}`}
              onChange={handleFile}
            />
            {!required && src && (
              <button className="admin-btn danger" type="button" onClick={handleRemove}>
                Remove
              </button>
            )}
          </div>
          <div className="admin-field">
            <label htmlFor={`${id}-url`}>…or image link</label>
            <input
              id={`${id}-url`}
              type="url"
              placeholder="https://"
              value={upload ? "" : url.startsWith("http") ? url : ""}
              disabled={Boolean(upload)}
              onChange={(event) => onUrl(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <label htmlFor={`${id}-alt`}>Image description (alt text)</label>
            <input
              id={`${id}-alt`}
              type="text"
              required={required || Boolean(src)}
              value={alt}
              onChange={(event) => onAlt(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
