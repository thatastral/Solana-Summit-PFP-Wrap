export function resizeThumbnail(dataUrl: string, size = 96): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
