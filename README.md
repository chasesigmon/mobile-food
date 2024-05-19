## Description

Mobile Food Tracker (https://github.com/chasesigmon/mobile-food)

[Nest] A NestJS project.\
[NodeJS] A NodeJS (v18.12+) project.\
[Typescript] A Typescript project.\
[PNPM] A pnpm project.

The intention of this service is to provide information on a list of mobile food facilities or a single mobile food facility in San Francisco.

## Setup

```bash
# install pnpm globally if it is missing
$ npm i pnpm -g
# install with pnpm
$ pnpm run install
```

## Running the app

### Node

```bash
# run app
$ pnpm run start:prod
```

OR

### Docker

```bash
# build container
$ pnpm run docker:build
# run container
$ pnpm run docker:start
# stop container (CTRL + C to exit)
$ pnpm run docker:stop
```

The swagger documentation is located at `localhost:3000/api`.

Make requests to the app with Postman once it is running via `localhost:3000/api/`.

<img width="1456" alt="Screen Shot 2024-05-21 at 11 55 27 AM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/683bd900-640c-45cc-a92e-df85e9cd4503">

### Details

-   When the response is returned, CMD + CLICK (mac) on the `googlemapsurl` to load the page in your browser's tab.

## Development

```bash
# run app
$ pnpm run start:dev
```

### Example requests

-   List (`/api/tracker`)

*   localhost:3000/api/tracker?filter={"facilitytype": "push cart", "excludeexpired": false}&fields=fooditems,dayshours,expirationdate,zipcodes&limit=2&offset=1&sortDir=DESC

<img width="1080" alt="Screen Shot 2024-05-21 at 6 38 57 PM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/de667ed5-0f44-4465-9abe-98d02e9e0a6b">

-   Get by location id (`/api/tracker/:locationId`)

*   localhost:3000/api/tracker/1735061

<img width="1076" alt="Screen Shot 2024-05-21 at 6 36 10 PM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/2c90a060-99c0-4508-a79a-e1f617595769">


## Testing

```bash
# unit tests
$ pnpm run test

# run a specific test or tests in a specific directory
$ pnpm run test src/app/feature/healthcheck

# e2e tests
$ pnpm run test:e2e

# run a specific test or tests in a specific directory
$ pnpm run test:e2e test/healthcheck

# test coverage - generates a .gitignored /coverage directory
$ pnpm run test:cov
# it should display the coverage in the terminal
# to view in a browser navigate to ./src/coverage/lcov-report:
# -> right click `index.html` in repository
# -> click "Reveal in Finder" (mac)
# -> right click `index.html` in Finder (mac)
# -> click "Open With"
# -> click "Google Chrome"
```

## Debugging

### Node - App

Select the `Node: Debug App` option from the Run and Debug window. Place breakpoints and make requests with Postman.

### Node - Tests

First go into the unit or e2e test file, single out any tests, then select the `Node: Debug Unit Test` or `Node: Debug E2E Test` option from the Run and Debug window. Place breakpoints.

## Things I would do differently with more time or if the need arose:

-   add Bearer token authorization
-   have a data layer for database operations
-   use a `.env` file for secrets & keys that would be updated on deployment
-   have a branch with the same name as a dev ticket to link them (ex: ticket from JIRA - API-1234/mobile-food-tracker)
-   add deployment scripts & work with DevOps to make sure service is running
-   add security in the service/business logic to check users permissions for if they can see the data
-   implement a validation framework for the list query logic (ex: JOI validation)

## Extras

Healthcheck route\
<img width="1076" alt="Screen Shot 2024-05-21 at 11 56 06 AM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/dbcea338-d037-4383-9e97-75228e416ae2">

Generic list route:\
<img width="1080" alt="Screen Shot 2024-05-21 at 6 30 36 PM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/0ec0d95e-6701-48f1-995b-717443e7c4b1">

Tests run\
<img width="663" alt="Screen Shot 2024-05-21 at 2 04 50 PM" src="https://github.com/chasesigmon/mobile-food/assets/7799494/d8f1f2d2-f502-4abc-a656-fd3ef44f4dd5">
