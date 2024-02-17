## Capital Gain Challenge 💰
hi there, thank you for taking the time to validate my solution! ٩(◕‿◕)۶

## Prerequisites
- npm installed (**mine is 10.2.3**)

## How to run
- Unzip project in a desired folder
- Go to project folder (**tech-challenge**)
```
$ npm install
$ npm run start ./test/case1.txt
```
When using npm run start, please specify input file path in line.

## How to run tests
- Go to project folder (**tech-challenge**)
```
$ npm run tests
```

## Project documentation
Regarding using external dependencies, I chose to only use node type, typescript and ts-jest for testing purposes.

For this solution, I identified two necessary "services", one for receiving and parsing the input(**InputParserService**) and other responsible for the business rules of capital gain (**InvestmentWallet**).

For receiving input data, I chose to implement my own file parser to minimize external dependencies, this task is executed by recognizing patterns and breaking down the received string. Finally, I convert the formatted string to a JSON which will be used as an object in InvestmentWallet. 

InvestmentWallet is responsible for implementing the business rules defined for capital gain, I attempted to break down validations and calculations in private methods for better readability and methods with only one responsability (following SOLID principles).

To understand how I implemented business rules, please check out my unit tests.
