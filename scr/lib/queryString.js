module.exports.queryString = (obj) =>
  Object.keys(obj)
    .map((key) => {
      if (typeof obj[key] === "object") {
        return `${key}=${obj[key].join(",")}`;
      }
      return `${key}=${obj[key]}`;
    })
    .join("&");

module.exports.parse = (string) =>
  Object.fromEntries(
    string.split("&").map((item) => {
      let [key, value] = item.split("=");
      if (value.indexOf(",") > -1) {
        value = value.split(",");
      }
      return [key, value];
    })
  );
