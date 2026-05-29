function fixRemingtonCombinations(text) {
  let prevText = "";
  while (prevText !== text) {
    prevText = text;
    text = text.replace(/ि([क-ह](्[क-ह])*)/g, '$1ि');
  }

  text = text.replace(/अा/g, 'आ');
  text = text.replace(/ाे/g, 'ो');
  text = text.replace(/ाै/g, 'ौ');
  text = text.replace(/अो/g, 'ओ');
  text = text.replace(/अौ/g, 'औ');
  text = text.replace(/आे/g, 'ओ');
  text = text.replace(/आै/g, 'औ');

  // Fix Reph (र्) - typed AFTER the consonant and matra in Remington
  // It needs to be moved BEFORE the preceding consonant group
  // Regex: matches consonant group + optional matras + 'र्'
  // and swaps them.
  // Group 1: consonant group
  // Group 2: optional matras (ा, ि, ी, ु, ू, ृ, े, ै, ो, ौ, ं, ः, ँ)
  text = text.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');

  return text;
}

const testCases = [
  "कायर्", // क + ा + य + र् -> कार्य
  "कमर्", // क + म + र् -> कर्म
  "धमर्", // ध + म + र् -> धर्म
  "अाम", // अ + ा + म -> आम
];

testCases.forEach(tc => {
  console.log(`${tc} -> ${fixRemingtonCombinations(tc)}`);
});
