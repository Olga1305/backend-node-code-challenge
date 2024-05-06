module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*integration-test.ts', '**/*e2e-test.ts', '**/*unit-test.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist'],
};
