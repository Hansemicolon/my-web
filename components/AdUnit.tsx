"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit() {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

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
    <div className="w-full min-h-[100px]">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3174828754010881"
        data-ad-slot="1660306535"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
