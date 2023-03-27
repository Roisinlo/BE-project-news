const request = require ("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
  });

  afterAll(() => {
    return connection.end();
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
                slug: expect.any(String)
              });
            });
          });
      });
      test("GET 400: responds with bad request if invalid end point", () => {
        return request(app)
          .get("/api/topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });

    // describe("GET /api/articles/:articles_id", () => {
    //     test("200: GET responds with relevant object according to article_id, with specified properties ", () => {
    //       return request(app)
    //         .get("/api/articles/")
    //         .expect(200)
    //         .then(({ body }) => {
    //           const { topics } = body;
    //           expect(topics.length).toBe(3);
    //           topics.forEach((topic) => {
    //             expect(topic).toMatchObject({
    //               description: expect.any(String),
    //               slug: expect.any(String)
    //             });
    //           });
    //         });
    //     });