const WORDS = ["apple", "house", "guitar", "rocket", "pizza", "dragon", "bridge", "camera"];
function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
module.exports = { WORDS, pickWord };