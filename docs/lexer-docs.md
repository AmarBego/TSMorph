
# **Lexer Documentation**

The lexer is responsible for converting input TypeScript code into a stream of tokens. These tokens are categorized and used by subsequent stages of the compiler.

## **Functionality**

### **Token Types**

- **`WHITESPACE`**: Matches spaces, tabs, and newlines.
- **`IDENTIFIER`**: Matches variable names, function names, and keywords.
- **`NUMBER`**: Matches numeric literals.
- **`SEMICOLON`**: Matches the `;` character.
- **`EQUALS`**: Matches the `=` character.
- **`PLUS`**: Matches the `+` character.
- **`MINUS`**: Matches the `-` character.
- **`ASTERISK`**: Matches the `*` character.
- **`SLASH`**: Matches the `/` character.
- **`EQUALS_EQUALS`**: Matches the `==` operator.
- **`NOT_EQUALS`**: Matches the `!=` operator.
- **`LESS_EQUALS`**: Matches the `<=` operator.
- **`GREATER_EQUALS`**: Matches the `>=` operator.
- **`STRING`**: Matches string literals, including escaped characters.
- **`COMMENT`**: Matches comments (both single-line and multi-line).

### **Error Handling**

- **Error Detection**: Throws a `LexerError` when an unexpected token is encountered.
- **Error Message**: Includes:
  - The line and column number of the unexpected token.
  - A snippet of the surrounding context.
- **Error Example**:
  ```plaintext
  Error: Unexpected token at line 1, column 12, near 'let x = 42 @'
  ```

### **Logging**

- **Token Logging**: Logs each token (excluding whitespace and comments) as it is processed, including its type and position.
- **Error Logging**: Logs detailed errors with line, column numbers, and token context for debugging purposes.

### **Known Issues**

- **Unrecognized Tokens**: Unexpected tokens are skipped with error logging.
- **Complex String Literals**: Handling of complex string literals with nested or escaped characters might require further validation.

### **Future Improvements**

- **Enhanced Error Reporting**: Include better context and recovery mechanisms for unexpected tokens.
- **Performance Optimizations**: Improve performance for larger inputs and more complex tokenization scenarios.
- **Extended Token Types**: Support for additional token types and operators as needed.

## **Example Usage**

```typescript
import { lexer } from './lexer';

const input = 'let str = "hello \\"world\\"";';
const tokens = lexer(input);

console.log(tokens); // Output: [ { type: 'IDENTIFIER', value: 'let', line: 1, column: 1 }, { type: 'IDENTIFIER', value: 'str', line: 1, column: 5 }, { type: 'EQUALS', value: '=', line: 1, column: 8 }, { type: 'STRING', value: '"hello \\"world\\""', line: 1, column: 10 }, { type: 'SEMICOLON', value: ';', line: 1, column: 30 } ]
```

## **Development and Contribution**

To contribute to the development or suggest improvements:

- **Fork the Repository**: Fork the project to your own GitHub account.
- **Create a Feature Branch**: Work on your changes in a new branch.
- **Submit a Pull Request**: Create a pull request with a detailed description of the changes.

### Updates to Documentation

- **Functionality**: Updated to reflect changes in token types, including multi-character operators and string literals.
- **Error Handling**: Revised to include detailed error messages with line and column information.
- **Logging**: Added details on logging of token processing and error handling.
- **Known Issues & Future Improvements**: Updated with new issues and planned enhancements.
