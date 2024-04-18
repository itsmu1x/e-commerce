# Megastore

A Next.js 14 e-commerce web application for selling clothes, handling payments via Stripe and CryptoAPI, and using Tailwind CSS, Prisma, PostgreSQL, and other third-party tools.

### Requirements

-   You should have an [Stripe](https://stripe.com/) account.
-   You should have an [ImageKit](https://imagekit.io/) account.

### Installing your dependencies

-   Using [NPM](https://nodejs.org/en) run `npm install`
-   Using [Yarn](https://yarnpkg.com/) run `yarn install`
-   Using [Bun](https://bun.sh) run `bun install`

### Setting your `.env`

To simplify the setup process, I will explain each value that should be entered in the `.env` file to make it easier and don't panic it is actually a piece of cake.

-   `NEXT_PUBLIC_COOKIE_NAME` it is the actual cookie name for authentication
-   `ORIGIN` is a combination of a scheme, hostname, and port (if specified), for example `http://localhost`.
-   `JWT_SECRET` it is the json web token secret make sure you do not share this
-   `DATABASE_URL` the database connection uri
-   `IK_URL` ImageKit URL (check the imagekit docs)
-   `IK_PUBLIC` ImageKit Public Key
-   `IK_PRIVATE` ImageKit Private Key
-   `STRIPE_KEY` Stripe Secret Key
-   `CIPHER_KEY` Base64 String (32 length) for the encryption of the cart and the payments.

Here's how to create a `CIPHER_KEY`:
```ts
import crypto from "node:crypto"
crypto.randomBytes(32).toString("base64")
```

### Running the app (development mode)

-   Using [NPM](https://nodejs.org/en) run `npm run dev`
-   Using [Yarn](https://yarnpkg.com/) run `yarn run dev`
-   Using [Bun](https://bun.sh) run `bun run dev`
