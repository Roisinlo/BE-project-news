const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("200: GET responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET 404: responds with bad request if invalid end point", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  test("200: GET responds with relevant object according to article_id, with specified properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0]).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET 404: responds with correct error message if input article_id is valid but non-existent article", () => {
    return request(app)
      .get("/api/articles/324")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("GET 400: responds with bad request if input article id is not a number", () => {
    return request(app)
      .get("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

afterAll(() => {
  return connection.end();
});
