//util functions for Xlabels etc.

export function getXLabelsfromkpath(kpath) {
  /*
  To get the XLabels from the path array

  1. Flatten the array
  2. Push first element
  3. Hop along elements merging
    3a. If i == i+1 (merge into same)
    3b. If i =! i+1 (merge with |)
  4. Push last element

  input: [["X", "G"], ["G", "Y"], ["A",G]]
  -->
  ["X", "G", "Y|A", "G"]

  */
  const arr = kpath.flat();
  const result = [];
  result.push(arr[0]);

  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      result.push(arr[i]);
      i++;
    } else {
      result.push(arr[i] + "|" + arr[i + 1]);
      i++;
    }
  }

  // Always push last
  result.push(arr[arr.length - 1]);
  return result;
}

// needs testing real data
export function prettifyLabels(label) {
  // catch legacy mode
  const greekMapping = {
    GAMMA: "Γ",
    DELTA: "Δ",
    SIGMA: "Σ",
    LAMBDA: "Λ",
  };
  Object.keys(greekMapping).forEach((symbol) => {
    const regex = new RegExp(symbol, "gi");
    label = label.replace(regex, greekMapping[symbol]);
  });

  label = label.replace(/\bG\b/g, "Γ");

  // Replace mdash
  label = label.replace(/-/g, "—");

  // Mapping for subscript digits
  const subscriptMapping = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  };
  // Replace subscript
  label = label.replace(/_(.)/g, (match, p1) => subscriptMapping[p1] || match);

  return label;
}

export function getXLabelPos(paths = td.paths) {
  const xLabelPos = [0];
  for (const path of paths) {
    if (path.x.length < 3) continue; //skip short paths (these dont move x)
    xLabelPos.push(path.x[path.x.length - 1]);
  }
  return xLabelPos;
}
