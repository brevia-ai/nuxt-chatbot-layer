# Nuxt Chatbot Layer
A functionality for Brevia Chatbots using Nuxt Layers

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Usage

Add the dependency to `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: [
    ['github:brevia-ai/nuxt-chatbot-layer', { install: true }]
  ],
})
```

## Environment Variables

You can customize the chatbot by setting environment variables in the `.env` file of **your app**:

```ts
## Chatbot settings
NUXT_PUBLIC_MAX_MESSAGES=3
NUXT_PUBLIC_START_MESSAGE='Questo è un messaggio iniziale di test!'
NUXT_PUBLIC_EXAMPLE_QUESTIONS=["Cosa posso chiederti?"]
## Uncomment to make actions menu visible on chatbot response
# NUXT_PUBLIC_CHAT_ACTIONS = 'false'
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm build
```

