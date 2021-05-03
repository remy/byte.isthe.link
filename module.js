import millify from "https://cdn.skypack.dev/pin/millify@v3.5.2-DeghhxER969QrI02sJDU/mode=imports,min/optimized/millify.js";
import $ from "./min.js";
import save from "./save.js";

const freeText = $("#free-text");

freeText.on("focus", () => {
  freeText.closest("label").querySelector('input[type="radio"]').checked = true;
});

const length = $("#length");
const output = $("output");
let byteLength = 0;

const updateValue = () => {
  let value = 0;
  if (length.value.startsWith("0x")) {
    value = parseInt(length.value, 16);
  } else if (length.value.startsWith("$")) {
    value = parseInt("0x" + length.value.substr(1), 16);
  } else {
    value = parseInt(length.value, 10);
  }

  if (isNaN(value)) value = 0;

  byteLength = value;

  output.textContent = millify(value, {
    units: ["b", "kb", "mb", "gb"],
  });
};

length.on("change", updateValue);
length.on("input", updateValue);

length.emit("change");

$("#download").on("click", () => {
  let method = $('input[name="content"]:checked').value;

  if (method === "___free_text___") {
    method = freeText.value;
  }

  let frag;

  try {
    frag = eval(method);
  } catch (e) {
    frag = method.split("").map((_) => _.charCodeAt(0));
  }

  if (Array.isArray(frag)) {
    frag = Uint8Array.from(frag);
  } else {
    frag = Uint8Array.of(frag);
  }
  const res = new Uint8Array({ length: byteLength });
  for (let i = 0; i < byteLength; i++) {
    res[i] = frag[i % frag.length];
  }
  console.log({ method, byteLength, frag, res });
  save(res, length.value + ".bin");
});
