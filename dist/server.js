"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appServerReference = exports.resolvers = exports.typeDefs = void 0;

var _app = _interopRequireDefault(require("./app"));

var _apolloServerExpress = require("apollo-server-express");

var _datasource = require("./datasource");

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config(); // Construct a schema, using GraphQL schema language


const typeDefs = _apolloServerExpress.gql`
  scalar Url

  type PhotoUrls {
    homecardHidpi: Url!
  }

  type HomeCardId {
    id: String!
  }

  type HomeCard {
    adId: Int!
    currencySymbol: String!
    pricePerMonth: Int!
    photoUrls: PhotoUrls!
    title: String!
  }

  type Query {
    homeCardIds(first: Int): [HomeCardId]
    homeCard(id: Int!): HomeCard
    homeCards(first: Int): [HomeCard]
  }
`; // Provide resolver functions for your schema fields

exports.typeDefs = typeDefs;
const resolvers = {
  Query: {
    homeCardIds: (root, {
      first
    }, {
      dataSources
    }) => dataSources.homeCardsAPI.getHomeCardIds(first),
    homeCard: (root, {
      id
    }, {
      dataSources
    }) => dataSources.homeCardsAPI.getAHomeCard(id),
    homeCards: (root, {
      first
    }, {
      dataSources
    }) => dataSources.homeCardsAPI.getHomeCards(first)
  }
}; // Create an instance of the apollo server

exports.resolvers = resolvers;
const server = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    homeCardsAPI: new _datasource.HomeCardsAPI()
  })
}); // Server port

const port = process.env.PORT || 4000; // Apply the express app as middleware to the apollo server

server.applyMiddleware({
  app: _app.default
}); // Use a custom handler

_app.default.use("/graphql", (0, _expressGraphql.default)({
  schema: typeDefs,
  graphiql: process.env.NODE_ENV === "development"
})); // Resolve a specific endpoint


_app.default.get("/api/homecards", (req, res) => {
  res.redirect(`/graphql?query={ homeCards { adId currencySymbol pricePerMonth photoUrls { homecardHidpi } title } }`);
});

const appServerReference = _app.default.listen({
  port
}, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  } else {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  }
});

exports.appServerReference = appServerReference;