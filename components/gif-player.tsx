'use client';

import { useEffect, useRef, useState } from 'react';
import { parseGIF, decompressFrames, ParsedFrame } from 'gifuct-js';

interface GifPlayerProps {
  src: string;
  alt: string;
  className?: string;
  skipMs?: number; // Milliseconds to skip at start (default: 2000)
  durationMs?: number; // Max duration to play in ms (default: 18000)
}

export function GifPlayer({
  src,
  alt,
  className = '',
  skipMs = 2000,
  durationMs = 18000,
}: GifPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const framesRef = useRef<ParsedFrame[]>([]);
  const gifDimsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;

    const loadGif = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[GifPlayer] Loading GIF:', src);

        // Fetch the GIF
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to fetch GIF');

        console.log('[GifPlayer] GIF fetched successfully');

        const buffer = await response.arrayBuffer();

        // Parse the GIF
        const gif = parseGIF(buffer);
        const frames = decompressFrames(gif, true);

        if (cancelled) return;

        if (frames.length === 0) {
          throw new Error('No frames in GIF');
        }

        // Store frames and dimensions
        framesRef.current = frames;
        gifDimsRef.current = { width: gif.lsd.width, height: gif.lsd.height };
        setDimensions({ width: gif.lsd.width, height: gif.lsd.height });

        // Calculate timing
        let totalTime = 0;
        const frameTimes: number[] = [];

        for (let i = 0; i < frames.length; i++) {
          frameTimes.push(totalTime);
          // GIF delay is in centiseconds (1/100th of a second)
          totalTime += frames[i].delay * 10;
        }

        // Find start frame (skip first skipMs)
        let startFrame = 0;
        for (let i = 0; i < frameTimes.length; i++) {
          if (frameTimes[i] >= skipMs) {
            startFrame = i;
            break;
          }
          // If GIF is shorter than skipMs, start from beginning
          if (i === frameTimes.length - 1) {
            startFrame = 0;
          }
        }

        // Find end frame (startFrame + durationMs)
        const endTime = frameTimes[startFrame] + durationMs;
        let endFrame = frames.length - 1;
        for (let i = startFrame; i < frameTimes.length; i++) {
          if (frameTimes[i] >= endTime) {
            endFrame = i;
            break;
          }
        }

        // Start animation
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create a temporary canvas for compositing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = gif.lsd.width;
        tempCanvas.height = gif.lsd.height;
        const tempCtx = tempCanvas.getContext('2d')!;

        let currentFrame = startFrame;
        let lastTime = performance.now();
        let frameAccumulator = 0;

        const renderFrame = (frameIndex: number) => {
          const frame = frames[frameIndex];

          // Handle disposal
          if (frameIndex === startFrame) {
            // Clear on first frame of loop
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          }

          // Create ImageData from frame patch (patch is already Uint8ClampedArray)
          const imageData = new ImageData(
            new Uint8ClampedArray(frame.patch),
            frame.dims.width,
            frame.dims.height
          );

          // Draw frame patch to temp canvas
          const patchCanvas = document.createElement('canvas');
          patchCanvas.width = frame.dims.width;
          patchCanvas.height = frame.dims.height;
          const patchCtx = patchCanvas.getContext('2d')!;
          patchCtx.putImageData(imageData, 0, 0);

          // Composite onto temp canvas
          tempCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

          // Copy to main canvas (scaled to fit)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        };

        const animate = (time: number) => {
          if (cancelled) return;

          const delta = time - lastTime;
          lastTime = time;
          frameAccumulator += delta;

          const currentDelay = frames[currentFrame].delay * 10; // Convert to ms

          if (frameAccumulator >= currentDelay) {
            frameAccumulator = 0;
            currentFrame++;

            // Loop back to start frame when reaching end
            if (currentFrame > endFrame) {
              currentFrame = startFrame;
              // Clear temp canvas on loop
              tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            }

            renderFrame(currentFrame);
          }

          animationRef.current = requestAnimationFrame(animate);
        };

        // Render first frame
        console.log('[GifPlayer] Rendering first frame:', startFrame, 'of', frames.length);
        console.log('[GifPlayer] Canvas size:', canvas.width, 'x', canvas.height);
        renderFrame(startFrame);
        setIsLoading(false);

        // Start animation
        console.log('[GifPlayer] Starting animation');
        animationRef.current = requestAnimationFrame(animate);
      } catch (err) {
        if (!cancelled) {
          console.error('GIF loading error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load GIF');
          setIsLoading(false);
        }
      }
    };

    loadGif();

    return () => {
      cancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src, skipMs, durationMs]);

  if (error) {
    // Fallback to regular img on error
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width || 300}
      height={dimensions.height || 300}
      className={className}
      style={{
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
      }}
      aria-label={alt}
    />
  );
}
