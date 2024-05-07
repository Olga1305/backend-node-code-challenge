# Bank Account API

## Requirements of the test

Develop a Bank REST API using Node.js, with the following functionalities

### Deposit

`/deposit` with **accountId** and **amount** as parameters 

### Withdrawal

`/withdraw` with **accountId** and **amount** as parameters

### Transfer

`/transfer` with **fromAccountId** **toAccountId** and **amount** as parameters

## Considerations 
* Deposits can not be above $5000 per day.
* Withdrawal supports a $200 overdraft (balance, can be down to -$200).
* Transfers don’t support overdrafts (can’t leave the balance below 0).
* Add the validations and errors you see necessary.
* The Account entity is not the main focus of the exercise, so only add what’s needed for the functionalities above.
* The code provided is a boilerplate to save you some time. Feel free to change it as you see fit

`When in doubt, don’t get blocked. Fill in the gaps and just write down in a Readme file whatever considerations or design decisions you had to make.`

## What we value
* Testing Strategy
* Effective Architectural decisions
* Effective response/error handling
* Simple design
* GIT
* Straightforward setup and execution
## The Extra Mile
* Database management
* Docker

Inspired by [Bank Kata](https://github.com/sandromancuso/Bank-kata)

# DOCUMENTATION

## How to develop?

### Prerequisite

You can use `docker-compose` to spin up locally.

### Configuration

You can set environment variables in the `.env` file.

For local development:

-   copy and paste the values from `.env.template`

### Running

Start the service in development mode:

```bash
sudo docker compose -f docker-compose.yml up --build
```
### Accessing local Redis database

If you use docker compose to run the application locally, it will also spin up a Redis database. You can access the database from a web client with:

Run:

```bash
sudo docker run --network codechallenge-be_default -p 8082:8081 -e "REDIS_HOST=redis-bank-account" ghcr.io/joeferner/redis-commander
```

When up, go to http://localhost:8082

### Running tests

#### Unit tests

```bash
npm run test:unit
```
For running integration and end-to-end tests you should have the Redis docker container built and be running

#### Integration tests

```bash
npm run test:integration
```

#### End-to-end tests

```bash
npm run test:e2e
```

### Cleaning the database

Database files are stored to <project_root>/.data/redis directory, simply use npm clean script:

```bash
npm run clean:db
```

### Auto-fix and format

```
npm run lint:fix
```


## API endpoints:

### The entry point:

`http://localhost:3300/bank/account`

## **Create Account**

| URL          | Method | Params | Query                                      | Success response | Error response |
| ------------ | ------ | ------ | ------------------------------------------ | ---------------- | -------------- |
| `/create/:withBalance` | POST    | `withBalance=<number>`   | None | Status 201       | Statuses 400, 500     |

## **Get All Accounts**

| URL             | Method | Params         | Query | Success response | Error response |
| --------------- | ------ | -------------- | ----- | ---------------- | -------------- |
| `/all` | GET    | None | None  | Status 200       | Statuses 404, 500     |

## **Deposit**

| URL       | Method | Params | Query                          | Success response | Error response |
| --------- | ------ | ------ | ------------------------------ | ---------------- | -------------- |
| `/deposit/:accountId/:depositAmount` | POST    | `accountId=<string>, depositAmount=<number>` | None | Status 201       | Statuses 400, 500    |

## **Withdrawal**

| URL       | Method | Params | Query                          | Success response | Error response |
| --------- | ------ | ------ | ------------------------------ | ---------------- | -------------- |
| `withdraw/:accountId/:withdrawalAmount` | POST    | `accountId=<string>, withdrawalAmount=<number>` | None | Status 201       | Statuses 400, 500    |

## **Transfer**

| URL       | Method | Params | Query                          | Success response | Error response |
| --------- | ------ | ------ | ------------------------------ | ---------------- | -------------- |
| `transfer/:fromAccountId/:toAccountId/:transferAmount` | POST    | `fromAccountId=<string>, toAccountId=<string>, transferAmount=<number>` | None | Status 201       | Statuses 400, 500    |
