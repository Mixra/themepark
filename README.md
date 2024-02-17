
## Prerequisites

- [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (version 20.x.x)
- npm (version 10.x.x)

## Installation
1. Clone the repository:
```console
git clone https://github.com/Mixra/themepark.git
```
2. Navigate to the project directory:
```console
cd themepark
```

3. Rename the `example.config.env` file to `config.env` and fill in the required environment variables according to your needs (e.g., port number, database connection string, etc.).


4. Install the dependencies:
```console
npm install
```

# Usage
### Development
- Start the development server:
```console
npm run dev
```
This will run start the frontend and backend servers concurrently and watch for changes in the code. Frontend is located on `http://localhost:5173` and backend on `http://localhost:1337` by default.

### Production
1. Build the project:
```console
npm run build
```
2. Start the production server:
```console
npm start
```


