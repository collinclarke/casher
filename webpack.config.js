module.exports = {
  context: __dirname,
  entry: "./lib/main.js",
  output: {
    filename: "casher.js"
  },
  resolve: {
    extensions: [".js", "*"]
  }
};
