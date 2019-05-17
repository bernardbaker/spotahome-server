import { RESTDataSource } from "apollo-datasource-rest";

export class HomeCardsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL =
      "https://frontend-interview.spotahome.com/api/public/listings/search";
  }

  async getHomeCardIds(limit = 30) {
    let args = { per_page: limit, page: 1 };
    const response = await this.get("markers/madrid", args);
    // handle error
    if (!response.ok) {
      throw new Error("Error when getting markers");
    }
    // per_page not working - so cap the results
    if (response.data.length > 30) response.data.length = 30;
    // return the response
    return response.data;
  }

  async getHomeCards(limit = 30) {
    let args = { per_page: limit, page: 1 };
    const response = await this.get("markers/madrid", args);
    // handle error
    if (!response.ok) {
      throw new Error("Error when getting markers");
    }
    // per_page not working - so cap the results
    if (response.data.length > 30) response.data.length = 30;
    // return the results
    const result = await Promise.all(
      response.data.map(item => {
        return this.getAHomeCard(item.id);
      })
    );
    return result;
  }

  async getAHomeCard(id) {
    const response = await this.get("homecards_ids", {
      "ids[]": id
    });
    // handle error
    return response.data.homecards[0];
  }
}
