export default function(cb, limit) {
  let called = false;
  return function() {
    if (!called) {
      cb(...arguments);
      called = true;
      setTimeout(function() {
        called = false;
      }, limit);
    }
  };
}