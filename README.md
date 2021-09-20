# Nasa Media Library
Work in progress Typescript / React hooks / Nextjs version, for old javascript version (and old time react) see https://github.com/Florry/nasa-library/tree/6ad2e5cdbaff6283118cdfff71aed9f039c02b36.
Base functionality is implemented.

## TODO:
- Implement real setting of cookie rather than just making a string.
- Redo all css, take advantage of nextjs css modules and get some better styling going.
- Fix all code TODOs.
- Go through backend code and clean things up (the code is only converted to typescript and is a few years old)

## // readme TODO:
- single run command for both frontend and backend
- single build command for both frontend and backend

## Requirements
- nodejs v.14 (latest/"recommended for most users" version) - https://nodejs.org/en/
    - npm v.7 (latest) - included in nodejs
- mongo db - https://www.mongodb.com/download-center?jmp=nav#community


# How to run
- npm install
- run `mongod`

then
## How to run backend
- run `npm start`

## How to run frontend
- cd `./app`
- run `npm run build`
- run `npm start`


# How to run development
- npm install
- run `mongod`

then
## How to run backend
- run `npm dev`

## How to run frontend
- cd `./app`
- run `npm dev`
