import { terser } from "rollup-plugin-terser"

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/enhance.js",
      format: "es",
    },
  },
  {
    input: "src/index.js",
    plugins: [terser()],
    output: {
      file: "dist/enhance.min.js",
      format: "es",
    },
  },
  {
    input: "src/index.js",
    output: {
      dir: "cjs",
      format: "cjs",
      preserveModules: true,
    },
  },
]
