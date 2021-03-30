export interface InfoItem {
  key: string;
  radix: number;
  content: string;
}

export const placeValueNotes = (base = 12, baseName = "") => {
  return `<h3>Place value notation</h3>
  <p>In the ${baseName} system fractions may be represented with the place value system just as in the decimal system. Each unit after the decimal separator is 1/${base} of the unit to its left.</p>`;
};

export const radixInfoItems: InfoItem[] = [
  {
    key: "binary",
    radix: 2,
    content: `<p>Base 2 is the simplest numeric system, representing all numeric values with 1 and 0s. Fractions may be represented either as rational fractions or with the place value system.</p><p>In the latter case 0.1 equals half or 0.5 in decimal, 0.01 is a quarter and 0.0101˙ is a third. Other fractions with lower prime divisors yield fairly regular patterns of 0s and 1s.</p>`,
  },
  {
    key: "quinary",
    radix: 5,
    content: `<p>Many basic number systems are based on the number of digits on one hand, which happens to be an odd primary number and is thus only divisible by itself and one.</p><p>With the place value system, rational fractions other than 1/5, 1/25, 1/125 will result in recursive sequence, e.g. 0.111111˙ for 1/4 and 0.131313˙ for 1/3. Most human civilisations moved onto the decimal system, combining two hands, the vigesimal system in twenties, often alongside duodecimal or hexagesimal subsystems for even greater divisibility.</p>`,
  },
  {
    key: "senary",
    radix: 6,
    content: `<p>As a primary number system, base 6 is rare although it is divisible by the two most useful primary numbers, 2 and 3. It needs more places to represent larger numbers, e.g. 1000 is senary is 216 in decimal and 10000 is 1296. This gives us a greater appreciation of scale when dealing with very high numbers. Like the more common duodecimal or dozenal system, base 6 is not divisible exactly by 5, although 1/5 does yield a pleasant 0.11111 sequence.</p>`,
  },
  {
    key: "septenary",
    radix: 7,
    content: `<p>Base 7 is rare as a primary number system. However, it may feature in subsystems for weekdays and some customary units of measurement, e.g. 14 pounds to a stone in the British imperial system. 7 is the fourth commonest primary number in nature.</p>`,
  },
  {
    key: "octal",
    radix: 8,
    content: `<p>Base 8 is mainly of interest for its extensive use in computer programming, although slighly less convenient than hexademical or base-16. It also serves as subsystem in many traditional measurements.</p>`,
  },
  {
    key: "decimal",
    radix: 10,
    content: `<p>Ten is the basis for the primary number system adopted by most human civilisations, although often alongside other subsystems divisible by 3 and 4.</p><p>The decimal system has two main advantages. First it matches the number of digits on our hands. Second, its core unit values can be easily memorised. Most number systems larger than 16 use multiples of ten.</p><p>However, base 10 is not divisible exactly by 3, which plays a key role in geometry, but 1/3 may be rendered in decimal notation with recurring 3s, e.g. 0.333333˙.</p>`,
  },
  {
    key: "duodecimal",
    radix: 12,
    content: `<p>If we had 6 digits on each hand, we may well have standardised on dozenal or duodecimal notation.</p><p>This numeric base requires us only to memorise two more base units and is exactly divisible by 3 and 4, although not by 5.</p><p>Many common decimal approximations such as 1%, 5% or 10% assume that nature aligns itself with the number of digits (4 fingers and 1 thumb) on each hand.</p><p>If our primary number system were based on twelves, then other fractions such as 1/6, 1/12, 1/24 or 1/144 would be rounder numbers e.g. 0.2, 0.1, 0.06 and 0.01. Rather than percent, we would use per-gross (an older term for a dozen dozens) to 1 pergross would be 1/144 in decimal. However, exact divisibility by 5 still comes in handy. Unfortunately this is represented by a recurrent sequence starting with <em>0·2497˙</em> . Large numbers would require progressively fewer characters, e.g. 1 billion in decimal would be 23ðð93 854.</p>`,
  },
  {
    key: "tetradecimal",
    radix: 14,
    content: `<p>Divisible by 1, 2 and 7, base 14 sometimes serves as a complimentary subsystem in some customary units, most notably 14 pounds to a stone in the British imperial system, and as superset of weekdays.</p>`,
  },
  {
    key: "hexadecimal",
    radix: 16,
    content: `<p>Base 16 is common in many traditional units of measurement, such as ounces per pound, as it can be halved 4 times and still yield a whole number. However, its relevance has increased largely as a superset of binary notation. However, all rational fractions based on primary numbers other than 2 will yield recurrent sequences, e.g. 0.555˙ for 1/3, 0.333˙ for 1/5 and 0.249˙ for 1/7. There is a certain beauty in the uniformity of these sequences.</p>`,
  },
  {
    key: "vigesimal",
    radix: 20,
    content: `<p>This is a superset our decimal system. It has three main advantages. First conversion to and from decimal are very easy, second it represent 1/4 with a whole number and third very large number require fewer characters, although this may make us less aware of their scale.</p>`,
  },

  {
    key: "trigesimal",
    radix: 30,
    content: `<p>30 is lowest number divisible by the first 3 prime numbers, 2, 3 and 5 and is also a superset of 10.</p><p>For practical purposes, it may be too hard to memorise numbers up to 30. For higher bases that offer greater divisibility, paired notation would be better.</p>`,
  },
  {
    key: "hexatrigesimal",
    radix: 36,
    content: `<p>36 is square of 6 and also conveniently the highest numeric base that can be represented with the digits 0 to 9 and plain letters a to z (as used in English). It's often used to convert high numbers to compact strings and is the highest base compatible with the Javascript Number.toString() function.</p>`,
  },
  {
    key: "hexagesimal",
    radix: 60,
    content: `<p>This is probably the most practical large base and is conveniently a superset of 4, 10, 12 and 20. It is divisible not only by 2 ,3, 4 and 5, but also by 6, 10, 12, 15, 20 and 30.</p>`,
  },
];
