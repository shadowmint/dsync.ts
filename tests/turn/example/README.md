## Example test project

# Running tests

    npm install
    ./node_modules/typescript/bin/tsc src/module.ts --declaration --out output/module.ts.js
    ./node_modules/typescript/bin/tsc tests/__init__.ts --out output/tests.ts.js
    node output/tests.ts.js

Helpfully running tests repeated for testing:

    ./node_modules/typescript/bin/tsc tests/__init__.ts --out output/tests.ts.js; node output/tests.ts.js
