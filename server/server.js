const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//import apollo
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

//import typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();
const PORT = process.env.PORT || 3001;
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
