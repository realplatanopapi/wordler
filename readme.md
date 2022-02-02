# Wordler

[wordler.xyz](https://wordler.xyz)

A lil' app that turns our favorite game into a friendly competition.

<img width="888" alt="Screen Shot 2022-01-31 at 9 14 49 PM" src="https://user-images.githubusercontent.com/6979137/151904463-f323cefc-90cd-4706-9e2d-d1a49c02b6d4.png">

## Developing

Node, Yarn, Docker, and Docker Compose will need to be installed on your machine.

### Set up your environment

Copy + pasta the `.env.example` to `.env`, and populate it with real values as needed. I've been using Vercel to manage secrets, but you'll need to create some yourself.

Wordler primarily makes use of Twitter OAuth for authentication, so you'll need to create a Twitter app also.

### Developing

In one window, start up the database:

```shell
docker-compose up
```

One the database has started up, setup Wordler:

```shell
# Install dependencies
yarn install
```

```shell
# Set up your local database
yarn db:migrate
```

Then, start the dev script:

```shell
yarn dev
```

Wordler will be available at http://localhost:3000.

## Architecture

Wordler is a full-stack TypeScript app, built with Next.js. It's hosted on Vercel, and uses Postgres as a data store. The client communicates with the server

For the most part this repo has the same file structure as any other old Next.js app, but with the following additions:

#### `client/`

Contains front-end specific code.

#### `server/`

Contains back-end specific code. Most of the core logic for the app, such as parsing Wordle results and calculating scores, lives here.

#### `common/`

Code that is shared by both the client and server, for example, for server side rendering.

#### `pages/`

Contains skeleton components and code for all the pages and API routes in the app. Most of the core components and logic live in either `client/` or `server/`.

#### `prisma/`

Contains the database schema and migrations, brought to us by the [Prisma ORM](https://www.prisma.io/). Whenever a change is made to the schema you'll need to regenerate the local Prisma client and migrate the database with `yarn db:migrate`.

Enjoy!
