"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  /** Callback when ad container height changes */
  onHeightChange?: (height: number) => void;
}

export default function AdUnit({ onHeightChange }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  // Check if ad has actual content (iframe or filled ins element)
  const checkAdLoaded = useCallback(() => {
    if (!adRef.current) return false;
    
    // Check for iframe (actual ad content)
    const hasIframe = adRef.current.querySelector("iframe") !== null;
    // Check if ins element has been filled (has children or significant height)
    const insHeight = adRef.current.getBoundingClientRect().height;
    const hasFilled = hasIframe || insHeight > 10;
    
    return hasFilled;
  }, []);

  // ResizeObserver to track container height changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const height = container.getBoundingClientRect().height;
      // Update CSS variable on document root for global access
      document.documentElement.style.setProperty("--bottom-ad-height", `${height}px`);
      onHeightChange?.(height);
      
      // Check if ad is loaded
      const loaded = checkAdLoaded();
      setIsAdLoaded(loaded);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(container);
    
    // Also observe the ins element for content changes
    if (adRef.current) {
      resizeObserver.observe(adRef.current);
    }

    // Initial measurement
    updateHeight();

    // Periodic check for ad load status (AdSense can load async)
    const checkInterval = setInterval(() => {
      const loaded = checkAdLoaded();
      if (loaded !== isAdLoaded) {
        setIsAdLoaded(loaded);
      }
    }, 500);

    return () => {
      resizeObserver.disconnect();
      clearInterval(checkInterval);
      document.documentElement.style.removeProperty("--bottom-ad-height");
    };
  }, [onHeightChange, checkAdLoaded, isAdLoaded]);

  // MutationObserver to detect when ad content is injected
  useEffect(() => {
    const insElement = adRef.current;
    if (!insElement) return;

    const mutationObserver = new MutationObserver(() => {
      const loaded = checkAdLoaded();
      setIsAdLoaded(loaded);
    });

    mutationObserver.observe(insElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [checkAdLoaded]);

  // Push ad to adsbygoogle
  useEffect(() => {
    if (isAdPushed.current) return;

    try {
      const adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle = adsbygoogle;

      if (process.env.NODE_ENV === "development") {
        console.log("[AdUnit] adsbygoogle available:", typeof window.adsbygoogle !== "undefined");
        console.log("[AdUnit] adsbygoogle array length before push:", adsbygoogle.length);
        console.log("[AdUnit] Attempting adsbygoogle.push({})...");
      }

      adsbygoogle.push({});
      isAdPushed.current = true;

      if (process.env.NODE_ENV === "development") {
        console.log("[AdUnit] push() succeeded, array length:", adsbygoogle.length);
      }
    } catch (err) {
      // Fail silently if ads are blocked
      if (process.env.NODE_ENV === "development") {
        console.warn("[AdUnit] push() failed:", err);
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      id="bottom-ad"
      className="w-full min-h-[100px]"
      style={{
        // Only allow pointer events when ad is actually loaded
        pointerEvents: isAdLoaded ? "auto" : "none",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: "block",
          // Ensure ins element also respects pointer-events
          pointerEvents: isAdLoaded ? "auto" : "none",
        }}
        data-ad-client="ca-pub-3174828754010881"
        data-ad-slot="1660306535"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
