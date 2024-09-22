## Getting Started

### Installation

1. Clone the repository:

```bash
https://github.com/FatimaKraiczyi/AtleticaApp-UFPR.git
cd AtleticaApp-UFPR
```

2. Install dependencies:

Go to `front` folder and run the following command:

```bash
yarn
```

### Running the Application

#### Expo

To run expo app, run the following command:

```bash
cd apps/expo-app && yarn expo start
```

#### Next.js

To run next app, run the following command:

```bash
cd apps/next && yarn dev
```

## Project Structure

### Next.js

- `next`: Contains the Next.js application along with components and screens.

### Expo

- `expo`: Contains the Expo application along with components and screens.

### Front

- `apps/next`: Contains the Next.js application.
- `apps/expo-app`: Contains the Expo application.
- `packages/components`: Shared components used across platforms.
- `packages/screens`: Shared screens that can be used in both Next.js and Expo projects.
- `packages/shared`: Shared assets
