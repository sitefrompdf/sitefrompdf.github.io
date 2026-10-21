# sitefrompdf

सरकारी यात्रा भत्ता एवं अन्य फ़ॉर्म (Tour TA, Transfer TA, LTC, CEA, Form No. 3) ऑनलाइन भरने और A4 में प्रिंट/PDF सेव करने की वेबसाइट।

लाइव साइट: https://sitefrompdf.github.io/

## फ़ाइलें
- `index.html` : होम पेज (खाली PDF डाउनलोड + फ़ॉर्म की सूची)
- `tour-ta.html`, `tfr.html`, `ltcbill.html`, `cea.html`, `form3.html` : ऑनलाइन फ़ॉर्म (A4 लेआउट)
- `pdfs/` : खाली PDF फ़ॉर्म
- `images/` : फ़ॉर्म के साथ छपने वाले पेज, बैनर और ऐप आइकन
- `sw.js`, `manifest.json` : PWA (ऑफ़लाइन और इंस्टॉल)
- `privacy-policy.html`, `terms.html` : नीतियाँ
- `ads.txt`, `robots.txt`, `sitemap.xml` : विज्ञापन और सर्च इंजन के लिए

## अपडेट करते समय
- किसी भी पेज/चित्र में बड़ा बदलाव करें तो `sw.js` में `CACHE_NAME` का नंबर बढ़ाएँ (v3 → v4)।
- नया पेज जोड़ें तो उसे `sw.js` की `urlsToCache` और `sitemap.xml` में भी जोड़ें।
