import { useEffect } from "react";

const AdsenseAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <>
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-format="autorelaxed"
           data-ad-client="ca-pub-2404732748519909"
           data-ad-slot="9566350827">
      </ins>
    </>
  );
};

export default AdsenseAd;
