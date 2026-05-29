function fixRemingtonCombinations(text) {
  let prevText = "";
  while (prevText !== text) {
    prevText = text;
    // 1. Fix 'ि' typed before consonant
    text = text.replace(/ि([क-ह](?:्[क-ह])*)/g, '$1ि');
  }

  // 2. Vowel formations
  text = text.replace(/अा/g, 'आ');
  text = text.replace(/ाे/g, 'ो');
  text = text.replace(/ाै/g, 'ौ');
  text = text.replace(/अो/g, 'ओ');
  text = text.replace(/अौ/g, 'औ');
  text = text.replace(/आे/g, 'ओ');
  text = text.replace(/आै/g, 'औ');

  // 3. Candra + Anusvara -> Chandrabindu
  text = text.replace(/ॅं/g, 'ँ');
  // If candra combined with base letter first, fix it when anusvara is added
  text = text.replace(/ऑं/g, 'आँ');
  text = text.replace(/ॉं/g, 'ाँ');
  text = text.replace(/ॲं/g, 'अँ');
  text = text.replace(/ऍं/g, 'एँ');

  // 4. Base letter + candra -> unified character
  text = text.replace(/आॅ/g, 'ऑ');
  text = text.replace(/अॅ/g, 'ॲ');
  text = text.replace(/एॅ/g, 'ऍ');
  text = text.replace(/ाॅ/g, 'ॉ');

  // 5. Fix Reph (र्) - typed AFTER the consonant in Remington
  text = text.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');

  return text;
}

const testCases = [
  "अाम",
  "आॅंचल",
  "अाॅं", // अ + ा + ॅ + ं
  "काॅं", // क + ा + ॅ + ं
];

testCases.forEach(tc => {
  let partial = "";
  for (let char of tc) {
    partial = fixRemingtonCombinations(partial + char);
  }
  console.log(`${tc} -> ${partial}`);
});
