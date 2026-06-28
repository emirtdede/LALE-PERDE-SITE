/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface ImageCropModalProps {
  imageSrc: string;
  type?: 'cover' | 'detail' | 'square';
  onCrop: (croppedWebp: string) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, type = 'cover', onCrop, onCancel }) => {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  let containerWidth = 300;
  let containerHeight = 400;
  let canvasWidth = 600;
  let canvasHeight = 800;

  if (type === 'detail') {
    containerWidth = 400;
    containerHeight = 300;
    canvasWidth = 800;
    canvasHeight = 600;
  } else if (type === 'square') {
    containerWidth = 300;
    containerHeight = 300;
    canvasWidth = 600;
    canvasHeight = 600;
  }

  const [initSize, setInitSize] = useState({ w: containerWidth, h: containerHeight });
  const imgRef = useRef<HTMLImageElement>(null);

  const clampOffset = (x: number, y: number, currentZoom: number) => {
    const W_render = initSize.w * currentZoom;
    const H_render = initSize.h * currentZoom;

    const maxBoundX = Math.max(0, (W_render - containerWidth) / 2);
    const minBoundX = Math.min(0, (containerWidth - W_render) / 2);

    const maxBoundY = Math.max(0, (H_render - containerHeight) / 2);
    const minBoundY = Math.min(0, (containerHeight - H_render) / 2);

    return {
      x: Math.max(minBoundX, Math.min(maxBoundX, x)),
      y: Math.max(minBoundY, Math.min(maxBoundY, y))
    };
  };

  useEffect(() => {
    setOffset(prev => clampOffset(prev.x, prev.y, zoom));
  }, [zoom, initSize]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    let w = containerWidth;
    let h = containerHeight;
    if (imageRatio > containerRatio) {
      w = containerHeight * imageRatio;
      h = containerHeight;
    } else {
      w = containerWidth;
      h = containerWidth / imageRatio;
    }
    setInitSize({ w, h });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setOffset(clampOffset(rawX, rawY, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const rawX = e.touches[0].clientX - dragStart.x;
    const rawY = e.touches[0].clientY - dragStart.y;
    setOffset(clampOffset(rawX, rawY, zoom));
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W_render = initSize.w * zoom;
    const H_render = initSize.h * zoom;
    const Left = (containerWidth - W_render) / 2 + offset.x;
    const Top = (containerHeight - H_render) / 2 + offset.y;

    const scaleFactor = canvasWidth / containerWidth;
    const dw = W_render * scaleFactor;
    const dh = H_render * scaleFactor;
    const dx = Left * scaleFactor;
    const dy = Top * scaleFactor;

    ctx.drawImage(img, dx, dy, dw, dh);
    const webpData = canvas.toDataURL('image/webp', 0.85);
    onCrop(webpData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 99999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1a1a1a', padding: '20px', borderRadius: '12px',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Görseli Kırp</h3>
        
        <div 
          style={{ 
            width: containerWidth, height: containerHeight, 
            overflow: 'hidden', position: 'relative', 
            background: '#000', cursor: isDragging ? 'grabbing' : 'grab',
            border: '2px dashed #444', borderRadius: '8px'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <img 
            ref={imgRef}
            src={imageSrc} 
            alt="Crop target" 
            onLoad={handleImageLoad}
            style={{
              width: initSize.w,
              height: initSize.h,
              maxWidth: 'none',
              pointerEvents: 'none',
              transform: `translate(${(containerWidth - initSize.w)/2 + offset.x}px, ${(containerHeight - initSize.h)/2 + offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#ccc' }}>Yakınlaştırma:</span>
          <input 
            type="range" min="1" max="3" step="0.01" value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#BD954B' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            type="button" onClick={onCancel}
            style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            İptal
          </button>
          <button 
            type="button" onClick={handleCrop}
            style={{ padding: '8px 16px', background: '#BD954B', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Kırp ve Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
