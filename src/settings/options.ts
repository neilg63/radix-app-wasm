export interface NumValueName {
  value: number;
  name: string;
  label?: string;
  icon?: string;
  classNames?: string[];
}

export const radices = [2, 5, 6, 7, 8, 10, 12, 14, 16, 20, 30, 36, 60];

export const matchRadixLabel = (base: number) => {
  switch (base) {
    case 2:
      return "binary";
    case 5:
      return "quinary";
    case 6:
      return "senary";
    case 7:
      return "septenary";
    case 8:
      return "octal";
    case 10:
      return "decimal";
    case 12:
      return "duodecimal";
    case 14:
      return "tetradecimal";
    case 16:
      return "hexadecimal";
    case 20:
      return "vigesimal";
    case 30:
      return "trigesimal";
    case 36:
      return "hexatrigesimal";
    case 60:
      return "sexagesimal";
    default:
      return ["base", base].join("-");
  }
};

export const matchRadixAbbr = (base: number) => {
  switch (base) {
    case 2:
      return "binary";
    case 8:
      return "octal";
    case 10:
      return "dec";
    case 12:
      return "duodec";
    case 16:
      return "hexadec";
    case 20:
      return "vigesimal";
    case 30:
      return "trigesimal";
    case 60:
      return "sexagesimal";
    default:
      return ["base", base].join("-");
  }
};

const matchIcon = (base: number) => {
  if (base === 2) {
    return "pi-pause";
  } else if (base < 10) {
    return "pi-caret-left";
  } else if (base === 10) {
    return "pi-percentage";
  } else if (base === 12) {
    return "pi-clock";
  } else if (base === 16) {
    return "pi-sun";
  } else if (base <= 36) {
    return "pi-caret-right";
  } else {
    return "pi-compass";
  }
};

export const radixOpts: NumValueName[] = radices.map((num) => {
  const name = matchRadixAbbr(num);
  const label = [num, matchRadixLabel(num)].join(": ");
  const icon = ["pi", matchIcon(num)].join(" ");
  const sizeClass =
    name.length > 8 ? "long" : name.length < 5 ? "short" : "medium";
  const classNames = [name, sizeClass];
  return { value: num, name, label, icon, classNames };
});

export const baseData = radices.map((num) => {
  const label = matchRadixLabel(num);
  return { value: num, label };
});
