function requireAll(r) {
  r.keys().forEach(r);
}

const app = {
  init() {
    console.log(this.files);
  },
  files: requireAll(require.context("./sketches/", true, /\.js$/)),
};

app.init();
