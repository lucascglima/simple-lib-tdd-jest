const { queryString, parse } = require("./queryString.js");

describe("Object to query string", () => {
  it("should create a valida query string", () => {
    const obj = {
      name: "Lucas",
      profession: "Developer",
    };

    expect(queryString(obj)).toBe("name=Lucas&profession=Developer");
  });

  it("should create a valid query string event when an array is passed value", () => {
    const obj = {
      name: "Lucas",
      profession: "Developer",
      abilities: ["JS", "NodeJS", "ReactJS"],
    };
    expect(queryString(obj)).toBe(
      "name=Lucas&profession=Developer&abilities=JS,NodeJS,ReactJS"
    );
  });

  it(" should throw an error when an object is passed as value", () => {
    const obj = {
      name: "Lucas",
      profession: "Developer",
      abilities: {
        JS: "JS",
        NodeJS: "NodeJS",
        ReactJS: "ReactJS",
      },
    };
    expect(() => queryString(obj)).toThrowError();
  });
});

describe("Query string to object", () => {
  it(" should convert a query string to object", () => {
    const qs = "name=Lucas&profession=Developer";
    expect(parse(qs)).toEqual({ name: "Lucas", profession: "Developer" });
  });

  it(" should convert a query string single key-value to object", () => {
    const qs = "name=Lucas";
    expect(parse(qs)).toEqual({ name: "Lucas" });
  });

  it(" should convert a query to an object taking care of comma separated values ", () => {
    const qs = "name=Lucas&abilities=JS,NodeJS,ReactJS";
    expect(parse(qs)).toEqual({
      name: "Lucas",
      abilities: ["JS", "NodeJS", "ReactJS"],
    });
  });
});
