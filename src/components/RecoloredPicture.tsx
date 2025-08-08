import { useEffect, useState } from "react";

interface RecoloredImageProps {
  src: string,
  color: `#${string}`
  key?: any
  className?: string 
}

export function RecoloredImage(pr: RecoloredImageProps) {
  const [recoloredSrc, setRecoloredSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // needed for external images
    img.src = pr.src;

    img.onload = () => {
      const result = recolorPixels(img, pr.color);
      setRecoloredSrc(result);
    };
  }, [pr.src, pr.color]);

  if (!recoloredSrc) return <p>Loading...</p>;

  return <img src={recoloredSrc} alt="" key={pr.key} className={pr.className}/>;
}


function recolorPixels(image: any, color: string) {
  const canvas = document.createElement("canvas") as any;
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  const match = color.match(/\w\w/g);
  if (!match) throw new Error("Invalid color format");

  const [rC, gC, bC] = match.map(c => parseInt(c, 16));

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];

    data[i] = (r / 255) * rC;
    data[i + 1] = (g / 255) * gC;
    data[i + 2] = (b / 255) * bC;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
