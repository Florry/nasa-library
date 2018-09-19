# Nasa Media Library

## Requirements
- nodejs v.8 (latest/"recommended for most users" version) - https://nodejs.org/en/ 
    - npm v.5 (latest) - included in nodejs
- mongo db - https://www.mongodb.com/download-center?jmp=nav#community

## How to build
- run `npm run-script build`

## How to run
- run `mongod`
- run `npm start`
- open http://localhost:8080/# in browser

## How to test
- run `mongod`
- run `npm test`
- `cd coverage`
- open index.html
    - coverage of all lines the project
- **Note:** the tests are inconclusive

## How to run development
- run `mongod`
- run `npm start`
- `cd app`
- run `npm start`
- open http://localhost:3000/# in browser
- backend runs on http://localhost:8080