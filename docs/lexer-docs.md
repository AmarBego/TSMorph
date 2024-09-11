
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

### **Error Handling**

- **Error Detection**: Throws an error when an unexpected token is encountered.
- **Error Message**: Includes:
  - The position of the unexpected token.
  - A snippet of the surrounding context.
- **Error Example**:
  ```plaintext
  Error: Unexpected token at position 5. Context: 'let x = 10 ;'
  ```

### **Logging**

- **Token Logging**: Logs each token (excluding whitespace) as it is processed.
- **Error Logging**: Logs errors with the token position and context for debugging purposes.

### **Known Issues**

- **Multi-character Operators**: Currently does not support multi-character operators (e.g., `==`, `!=`).
- **String Literals and Comments**: Not yet implemented.

### **Future Improvements**

- **Multi-character Operators**: Support for multi-character operators.
- **String Literals and Comments**: Handling for string literals and comments.
- **Enhanced Error Messages**: Include line and column numbers in error messages.

## **Example Usage**

```typescript
import { lexer } from './lexer';

const input = 'let x = 10;';
const tokens = lexer(input);

console.log(tokens); // Output: [ { type: 'IDENTIFIER', value: 'let' }, { type: 'IDENTIFIER', value: 'x' }, { type: 'EQUALS', value: '=' }, { type: 'NUMBER', value: '10' }, { type: 'SEMICOLON', value: ';' } ]
```

## **Development and Contribution**

To contribute to the development or suggest improvements:

- **Fork the Repository**: Fork the project to your own GitHub account.
- **Create a Feature Branch**: Work on your changes in a new branch.
- **Submit a Pull Request**: Create a pull request with a detailed description of the changes.


### Updates to Documentation

- **Functionality**: Update to reflect changes in token types or behavior.
- **Error Handling**: Revise error messages and handling mechanisms as the lexer evolves.
- **Logging**: Add details on logging changes or enhancements.
- **Known Issues & Future Improvements**: Update with new issues or planned features.