import app from "./app";
import { ApolloServer, gql } from "apollo-server-express";
import { HomeCardsAPI } from "./datasource";
import graphqlHTTP from "express-graphql";
import env from "dotenv";

env.config();

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  scalar Url

  type PhotoUrls {
    homecardHidpi: Url!
  }

  type HomeCard {
    adId: Int!
    currencySymbol: String!
    pricePerMonth: Int!
    photoUrls: PhotoUrls!
    title: String!
  }

  type Query {
    homeCard(id: Int!): HomeCard
    homeCards(first: Int): [HomeCard]
  }
`;

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    homeCard: (root, { id }, { dataSources }) =>
      dataSources.homeCardsAPI.getAHomeCard(id),
    homeCards: (root, { first }, { dataSources }) =>
      dataSources.homeCardsAPI.getHomeCards(first)
  }
};

// Create an instance of the apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    homeCardsAPI: new HomeCardsAPI()
  })
});

// Server port
const port = process.env.PORT || 4000;

// Apply the express app as middleware to the apollo server
server.applyMiddleware({ app });

// Use a custom handler
app.use(
  "/graphql",
  graphqlHTTP({
    schema: typeDefs,
    graphiql: process.env.NODE_ENV === "development"
  })
);

// Resolve a specific endpoint
app.get("/api/homecards", (req, res) => {
  res.redirect(
    `/graphql?query={ homeCards { adId currencySymbol pricePerMonth photoUrls { homecardHidpi } title } }`
  );
});

export const appServerReference = app.listen({ port }, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  } else {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  }
});
