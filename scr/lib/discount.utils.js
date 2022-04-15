import Dinero from "dinero.js";

const Money = Dinero;
Money.defautCurreny = "BRL";
Money.defautPrecision = 2;
const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};
const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  // debugger;
  // Verificando se é par
  const isEven = quantity % 2 === 0;
  if (condition?.quantity && quantity > condition.quantity) {
    // Se for par aplica 50% se for impar apenas 40%
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

export const calculateDiscount = (amount, quantity, condition) => {
  const list = Array.isArray(condition) ? condition : [condition];
  // Pegando apenas o melhor desconto
  // Retorna apenas o primeiro item da lista que foi ordenada pelo sort
  const [higherDiscount] = list
    .map((cond) => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount();
      }
    })
    .sort((a, b) => b - a);

  return Money({ amount: higherDiscount });
};
