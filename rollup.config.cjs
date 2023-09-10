import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

const plugins = [
  typescript({
    tsconfig: './tsconfig.json',
  }),
  commonjs(),
  resolve(),
  terser(),
];
const input = './src/index.ts';
const external = (id) => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

export default [
  {
    input,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
    },
    plugins,
    external,
  },
  {
    input,
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins,
    external,
  },
  {
    input: './dist/dts/src/index.d.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [
      dts(),
      del({ hook: 'buildEnd', targets: ['./dist/src', './dist/cjs/src'] }),
      cjsPackage(),
    ],
  },
];

function cjsPackage() {
  return {
    name: 'cjsPackage',
    buildEnd: () => {
      fs.writeFileSync('./dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }));
    },
  };
}
