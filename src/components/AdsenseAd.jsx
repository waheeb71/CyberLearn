import { useEffect, useState } from "react";

const AdsenseAd = () => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // تحميل الإعلان بعد ثانيتين من فتح الصفحة
    const timer = setTimeout(() => {
      setShowAd(true);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }, 2000); // يمكن تغيير الوقت حسب رغبتك

    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null; // لا تعرض شيء قبل التحميل

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-2404732748519909"
      data-ad-slot="9566350827"
    ></ins>
  );
};

export default AdsenseAd;
