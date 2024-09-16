# Simple TypeScript Compiler

## Overview

This project aims to create a simple TypeScript compiler. The goal is to understand the fundamental components of a compiler by implementing a lexer, parser, and type checker from scratch. The project will also include a code generator to produce executable code from the parsed and type-checked source.

## Development Status

The project is currently under active development. You can check the progress on the following branches:

- [Lexer Development](https://github.com/AmarBego/TSMorph/tree/lexer-development)
- [Parser Development](https://github.com/AmarBego/TSMorph/tree/parser-development)

Please note that the main branch is not being updated at this time. All development work is happening in the feature branches mentioned above.

## Features

- **Lexer**: Tokenizes the input TypeScript code into a stream of tokens.
- **Parser**: Parses the token stream into an Abstract Syntax Tree (AST).
- **Type Checker**: Ensures the type correctness of the AST.
- **Code Generator**: Generates executable code from the AST.

## Getting Started

### Prerequisites

- Node.js
- TypeScript

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/amarbego/tsmorph.git
   cd simple-ts-compiler
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Usage

- To build the project:
  ```sh
  npm run build
  ```

- To run tests:
  ```sh
  npm test
  ```

## Project Structure

- `src/lexer.ts`: Contains the lexer implementation.
- `src/parser.ts`: Contains the parser implementation.
- `src/typeChecker.ts`: Contains the type checker implementation.
- `src/codeGenerator.ts`: Contains the code generator implementation.
- `test/`: Contains unit tests for the various components.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
