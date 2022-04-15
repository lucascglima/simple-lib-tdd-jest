import Cart from "./Cart";
let cart = new Cart();
let product = {
  name: "Cadeira Gamer Preta",
  price: 35388, // 353,88 | 353.88
};
let product2 = {
  name: "Mouse Gamer",
  price: 5888, // 58,88 | 58.88
};
describe("getTotal()", () => {
  beforeEach(() => {
    cart = new Cart();
  });
  it("should return 0 when getTotal() is executed in a newly created instance", () => {
    expect(cart.getTotal().getAmount()).toBe(0);
  });

  it("should mutiply quantity and price and recife the totoal amount", () => {
    const item = {
      product,
      quantity: 2, // 70776
    };
    cart.add(item);
    expect(cart.getTotal().getAmount()).toBe(70776);
  });

  it("should ensure no more than on product exists at a time", () => {
    cart.add({
      product,
      quantity: 2, // 70776
    });
    cart.add({
      product,
      quantity: 1, // 353,88 | 353.88
    });
    expect(cart.getTotal().getAmount()).toEqual(35388);
  });

  it("should update total when a product gets included and then remove", () => {
    cart.add({
      product,
      quantity: 2, // 70776
    });

    cart.add({
      product: product2,
      quantity: 1, // 58,88 | 58.88
    });

    cart.remove(product);
    expect(cart.getTotal().getAmount()).toEqual(5888);
  });
});

describe("checkout()", () => {
  it("should return and object with the total and the list of items ", () => {
    cart.add({
      product,
      quantity: 5, // 1769,41 | 17.69,41
    });

    cart.add({
      product: product2,
      quantity: 1, // 58,88 | 58.88
    });
    //  Opção 1: Cria uma linha com snapshot dentro do arquivo
    // expect(cart.checkout()).toMatchInlineSnapshot();
    //  Opção 2: Cria uma linha com snapshot dentro da pastas de snapshots serve tanto para testar methodos quanto para componentes
    expect(cart.checkout()).toMatchSnapshot();
  });

  it("should return and object with the total and the list of items when summary() is called", () => {
    cart.add({
      product,
      quantity: 5, // 1769,41 | 17.69,41
    });

    cart.add({
      product: product2,
      quantity: 1, // 58,88 | 58.88
    });
    //  Opção 1: Cria uma linha com snapshot dentro do arquivo de testes (aqui)
    // expect(cart.checkout()).toMatchInlineSnapshot();
    //  Opção 2: Cria uma linha com snapshot dentro da pastas de snapshots serve tanto para testar methodos quanto para componentes
    expect(cart.summary()).toMatchSnapshot();
    // Para Garantir que o total é maior que zero
    expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
  });

  it("should include formatted amount in the summary", () => {
    cart.add({
      product,
      quantity: 5, // 1769,41 | 17.69,41
    });

    cart.add({
      product: product2,
      quantity: 1, // 58,88 | 58.88
    });
    expect(cart.summary().formatted).toEqual("$1,828.28");
  });

  it("should reset the cart when checkout() is called", () => {
    cart.add({
      product: product2,
      quantity: 3, //176,64 | 17.66,64
    });

    cart.checkout();
    expect(cart.getTotal().getAmount()).toEqual(0);
  });
});

describe("special conditions", () => {
  it("should apply percentage discount when certain quantity threshold is passed", () => {
    // Condição de desconto aplicada
    // Percentual de 30% quanto a quantidade for maior que 2
    const condition = {
      percentage: 30,
      minimum: 2,
    };
    cart.add({
      product,
      condition,
      quantity: 3,
    });
    // total 743,148 arredondado para cima com a lib dinero.js
    expect(cart.getTotal().getAmount()).toEqual(74315);
  });

  it("should apply quantity discount for event quantities", () => {
    const condition = {
      quantity: 2,
    };
    cart.add({
      product,
      condition,
      quantity: 4,
    });

    expect(cart.getTotal().getAmount()).toEqual(70776);
  });

  it("should NOT apply quantity discount for event quantities when quantities is below or equal minimum", () => {
    const condition = {
      quantity: 2,
    };
    cart.add({
      product,
      condition,
      quantity: 1,
    });

    expect(cart.getTotal().getAmount()).toEqual(35388);
  });

  it("should apply quantity discount odd quantities ", () => {
    //Caso a compra seja de 5 produtos o desconto será aplicado apenas para 4
    //Neste caso atendendo a condição de desconto a cada 2 produtos
    // Neste caso será aplicado apenas 40% de desconto em vez de 50%
    const condition = {
      quantity: 2,
    };
    cart.add({
      product,
      condition,
      quantity: 5,
    });

    expect(cart.getTotal().getAmount()).toEqual(106164);
  });

  it("should apply not percentage discount when quantity is below or equal minimum", () => {
    const condition = {
      percentage: 30,
      minimum: 2,
    };
    cart.add({
      product,
      condition,
      quantity: 2,
    });
    expect(cart.getTotal().getAmount()).toEqual(70776);
  });

  it("should receive two or more conditions and determine/apply the best discount. First Case", () => {
    const condition1 = {
      percentage: 30, // 30% de desconto
      minimum: 2,
    };
    // Condição de desconto aplicada por ser melhor para o cliente
    const condition2 = {
      quantity: 2, // 40% de desconto caso par, 50% caso impar
    };
    cart.add({
      product,
      condition: [condition1, condition2],
      quantity: 5,
    });
    expect(cart.getTotal().getAmount()).toEqual(106164);
  });

  it("should receive two or more conditions and determine/apply the best discount. Second Case", () => {
    const condition1 = {
      percentage: 80, // 80% de desconto
      minimum: 2,
    };
    // Condição de desconto aplicada por ser melhor para o cliente
    const condition2 = {
      quantity: 2, // 50% de desconto caso par, 50% caso impar
    };
    cart.add({
      product,
      condition: [condition1, condition2],
      quantity: 5,
    });
    expect(cart.getTotal().getAmount()).toEqual(35388);
  });
});
