import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'tsconfig*.tsbuildinfo'],
  },
  ...nextVitals,
  {
    rules: {
      // React Compiler lint currently treats common URL/data-sync effects
      // as errors. Keep the rest of Next's lint profile active while this
      // app is not compiled with React Compiler.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  prettier,
];

export default eslintConfig;
