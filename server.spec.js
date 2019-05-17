import { ApolloServer, gql } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import request from "supertest";
import { HomeCardsAPI } from "./src/datasource";
import app from "./src/app";
import { appServerReference, resolvers, typeDefs } from "./src/server";

describe("Test the root path and graphql endpoints", () => {
  afterEach(() => {
    appServerReference.close();
  });

  it("should send a 200 response for the GET / method", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  it("graphql query for a single card", () => {
    return request(app)
      .post("/graphql")
      .send({
        query:
          "{ homeCard(id:145144) { adId currencySymbol pricePerMonth photoUrls { homecardHidpi } title } }"
      })
      .then(response => {
        expect(response.body.data.homeCard.adId).not.toBeNull();
        expect(response.body.data.homeCard.currencySymbol).not.toBeNull();
        expect(response.body.data.homeCard.pricePerMonth).not.toBeNull();
        expect(
          response.body.data.homeCard.photoUrls.homecardHidpi
        ).not.toBeNull();
        expect(response.body.data.homeCard.titlei).not.toBeNull();
        expect(response.statusCode).toBe(200);
      })
      .catch(err => {
        console.log(err.message);
        console.log(err.response);
      });
  });

  it("graphql query for a set number of cards", () => {
    jest.setTimeout(1200000);
    return request(app)
      .post("/graphql")
      .send({
        query:
          "{ homeCards { adId currencySymbol pricePerMonth photoUrls { homecardHidpi } title } }"
      })
      .then(response => {
        expect(response.body.data.homeCards.length).toBe(30);
      })
      .catch(err => {
        console.log(err.message);
        console.log(err.response);
      });
  });

  it("fetches a single card", async () => {
    //   create the API
    const homeCardsAPI = new HomeCardsAPI();
    // create a test server to test against, using our production typeDefs,
    // resolvers, and dataSources.
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({ homeCardsAPI })
    });

    // mock the dataSource's underlying fetch methods
    homeCardsAPI.homeCard = jest.fn(() => mockHomeCardResponse);

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_A_HOME_CARD,
      variables: { id: 154873 }
    });
    expect(res).toMatchSnapshot();
  });

  it("fetches a set number of cards", async () => {
    // override the default timeout
    jest.setTimeout(1200000);
    //   create the API
    const homeCardsAPI = new HomeCardsAPI();
    // create a test server to test against, using our production typeDefs,
    // resolvers, and dataSources.
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({ homeCardsAPI })
    });

    // mock the dataSource's underlying fetch methods
    homeCardsAPI.homeCards = jest.fn(() => {});

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_A_NUMBER_OF_HOME_CARDS
    });
    expect(res.data.homeCards.length).toBe(30);
  });
});

const GET_A_HOME_CARD = gql`
  {
    homeCard(id: 154873) {
      adId
      currencySymbol
      pricePerMonth
      photoUrls {
        homecardHidpi
      }
      title
    }
  }
`;

const GET_A_NUMBER_OF_HOME_CARDS = gql`
  {
    homeCards {
      adId
      currencySymbol
      pricePerMonth
      photoUrls {
        homecardHidpi
      }
      title
    }
  }
`;

const mockHomeCardResponse = {
  homeCard: {
    adId: 154867,
    currencySymbol: "€",
    pricePerMonth: 380,
    photoUrls: {
      homecardHidpi:
        "https://sah-staging-photos-resized.s3-eu-west-1.amazonaws.com/pt_640_480/caaf7948ed4f0580a99383fe1d3e768697be3e030e4ef14072b81958.jpg"
    },
    title: "Modern room in 8-bedroom apartment in Aluche"
  }
};
