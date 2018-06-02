
export default function encode_col(col) {
  let s = '';
  for (++col; col; col = Math.floor((col - 1) / 26))
    s = String.fromCharCode(((col - 1) % 26) + 65) + s;
  return s;
}
