export const processMangalCombinations = (str: string): string => {
  // Strip Zero Width Joiner (ZWJ) to allow proper combinations and ligatures
  str = str.replace(/\u200D/g, '');

  let prevText = "";
  while (prevText !== str) {
    prevText = str;
    // 1. Swap pending 'ि' (\uE000) with the following consonant and convert to real 'ि'
    str = str.replace(/\uE000([क-ह](?:्[क-ह])*(?:्)?)/g, '$1\u093F');
  }

  // 2. Fix half-consonant + vertical bar (ा) -> full consonant
  // Halant + short i + aa matra (legacy context) -> short i
  str = str.replace(/्\u093Fा/g, '\u093F');
  // Halant + aa matra -> full consonant
  str = str.replace(/्ा/g, '');

  // 3. Vowel formations
  str = str.replace(/अा/g, 'आ');
  str = str.replace(/ाे/g, 'ो');
  str = str.replace(/ाै/g, 'ौ');
  str = str.replace(/अो/g, 'ओ');
  str = str.replace(/अौ/g, 'औ');
  str = str.replace(/आे/g, 'ओ');
  str = str.replace(/आै/g, 'औ');

  // 4. Candra + Anusvara -> Chandrabindu
  str = str.replace(/ॅं/g, 'ँ');
  // If candra combined with base letter first, fix it when anusvara is added
  str = str.replace(/ऑं/g, 'आँ');
  str = str.replace(/ॉं/g, 'ाँ');
  str = str.replace(/ॲं/g, 'अँ');
  str = str.replace(/ऍं/g, 'एँ');

  // 5. Base letter + candra -> unified character
  str = str.replace(/आॅ/g, 'ऑ');
  str = str.replace(/अॅ/g, 'ॲ');
  str = str.replace(/एॅ/g, 'ऍ');
  str = str.replace(/ाॅ/g, 'ॉ');

  // 6. Fix Reph (र्) - typed AFTER the consonant in Remington
  str = str.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');
  
  return str;
};
