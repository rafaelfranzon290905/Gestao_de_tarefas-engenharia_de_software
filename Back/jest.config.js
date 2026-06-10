/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Ativa a coleta de cobertura de código
  collectCoverage: true,
  // Onde o relatório será salvo
  coverageDirectory: 'coverage',
  // De quais arquivos ele deve coletar a cobertura
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/routes/**/*.ts',
  ],
  // Limiar de cobertura (se não atingir 60%, o teste falha)
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};