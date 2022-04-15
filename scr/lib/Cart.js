import find from "lodash/find";
import remove from "lodash/remove";
import Dinero from "dinero.js";

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};
const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  // Verificando se é par
  const isEven = quantity % 2 === 0;
  if (condition?.quantity && quantity > condition.quantity) {
    // Se for par aplica 50% se for impar apenas 40%
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
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

const Money = Dinero;
Money.defautCurreny = "BRL";
Money.defautPrecision = 2;
export default class Cart {
  items = [];

  add(item) {
    const itemToLookFor = { product: item.product };
    if (find(this.items, itemToLookFor)) {
      remove(this.items, itemToLookFor);
    }
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: product.price * quantity });
      let discount = Money({ amount: 0 });

      if (condition) {
        discount = calculateDiscount(amount, quantity, condition);
      }
      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  remove(product) {
    remove(this.items, { product });
  }
  summary() {
    const total = this.getTotal();
    // Formatação da lib dinero.js
    const formatted = total.toFormat("$0,0.00");
    const items = this.items;

    return {
      total,
      formatted,
      items,
    };
  }

  checkout() {
    const { total, items } = this.summary();
    this.items = [];
    return {
      total,
      items,
    };
  }
}