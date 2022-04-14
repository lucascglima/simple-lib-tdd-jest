const { sum } = require("./calculator");
// Padrão somando 2 números
it("should sum 2 and 2 and the result must be 4", () => {
  expect(sum(2, 2)).toBe(4);
});
// Somando 2 strings
it("should sum 2 and 2 event if one of the is a string the result must be 4", () => {
  expect(sum("2", "2")).toBe(4);
});
// Chamando várias possibilidades de erro
it("should throw an error if what is provided to the methods ", () => {
  expect(() => {
    sum("", 2);
  }).toThrowError();

  expect(() => {
    sum([2, 2]);
  }).toThrowError();

  expect(() => {
    sum({});
  }).toThrowError();

  expect(() => {
    sum();
  }).toThrowError();
});
