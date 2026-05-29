function fixRemingtonCombinations(text) {
  let prevText = "";
  while (prevText !== text) {
    prevText = text;
    // 1. Fix 'ि' typed before consonant
    text = text.replace(/ि([क-ह](?:्[क-ह])*)/g, '$1ि');
  }

  // Candra + Anusvara -> Chandrabindu
  text = text.replace(/ॅं/g, 'ँ');
  
  text = text.replace(/अा/g, 'आ');
  text = text.replace(/ाे/g, 'ो');
  text = text.replace(/ाै/g, 'ौ');
  text = text.replace(/अो/g, 'ओ');
  text = text.replace(/अौ/g, 'औ');
  text = text.replace(/आे/g, 'ओ');
  text = text.replace(/आै/g, 'औ');

  // Convert combinations of base letter and candra to proper unicode
  text = text.replace(/आॅ/g, 'ऑ');
  text = text.replace(/अॅ/g, 'ॲ');
  text = text.replace(/एॅ/g, 'ऍ');
  text = text.replace(/ाॅ/g, 'ॉ');

  // Fix Reph (र्) - typed AFTER the consonant in Remington
  text = text.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');
  
  return text;
}

const testCases = [
  "आॅंचल", // आ + ॅ + ं + च + ल
  "ऑंचल", // wait, if it already has ऑ + ं, does it become आँ?
  "अाॅ", // अ + ा + ॅ -> ऑ
];

testCases.forEach(tc => {
  console.log(`${tc} -> ${fixRemingtonCombinations(tc)}`);
});
