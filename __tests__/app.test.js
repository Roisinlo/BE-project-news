const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const { checkIdExists } = require("../models/articles.model");

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
        expect(body.msg).toBe("status 404: Path not found");
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
        expect(body.msg).toBe("status 404: Article not found");
      });
  });
  test("GET 400: responds with error message if input article id is not a number", () => {
    return request(app)
      .get("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: GET responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: GET responds with an array of article objects ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: responds with message and error for invalid end point", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Path not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: GET responds with  an array of comment objects for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: GET responds with an array of comment objects ordered by date in descending order, most recent first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 400:  invalid ID not a nu,ber, responds with error message", () => {
    return request(app)
      .get("/api/articles/not-a-num/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid input");
      });
  });
  test("GET 404: responds with message and error if input article_id does not have an article attached", () => {
    return request(app)
      .get("/api/articles/3000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Article not found");
      });
  });
  test("200: GET responds with an empty array when queried passed an article_id that exists, but has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

describe("POST", () => {
  test("POST 201: adds a new comment using username and body from request", () => {
    const testInput = {
      username: "butter_bridge",
      body: "really important words about thoughts"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testInput)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "really important words about thoughts",
          author: "butter_bridge",
          article_id: 1,
          votes: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  });
  test("POST 201: adds a new comment using username and body from request and ignores any extra properties in body", () => {
    const testInput = {
      username: "butter_bridge",
      body: "really important words about thoughts",
      votes: 10
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testInput)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "really important words about thoughts",
          author: "butter_bridge",
          article_id: 1,
          votes: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  });
  test("POST 400: responds with invalid request error message when post request is sent with an empty object", () => {
    const testInput = {}
      return request(app)
      .post("/api/articles/1/comments")
      .send(testInput)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid request, missing information");
      })
  })
  test("POST 400: responds with invalid request error message when post request is sent with an empty body property in the object", () => {
    const testInput = {
      username: "butter_bridge", 
    }
      return request(app)
      .post("/api/articles/1/comments")
      .send(testInput)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid request, missing information");
      })
  })
  test("POST 404: responds with invalid request error message when post request is sent with an invalid username", () => {
    const testInput = {
      username: "hacker",
      body: "really important words about thoughts"
    }
      return request(app)
      .post("/api/articles/1/comments")
      .send(testInput)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: not found");
      })
  })
  test("POST 404: responds with message and error if input article_id is valid but does not have an article attached", () => {
    const testInput = {
      username: "butter_bridge",
      body: "really important words about thoughts",
      votes: 10
    };
    return request(app)
      .post("/api/articles/300/comments")
      .send(testInput)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: not found");
      });
  });
  test("POST 400: responds with error message if input article id is not a number", () => {
    return request(app)
      .post("/api/articles/notanum/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid input");
      });
  });
});
  test("POST 404: responds with message and error if there is a typo in the path", () => {
    return request(app)
      .post("/api/articles/1/commen")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Path not found");
      });
  });

  describe("PATCH", () => {
    test("PATCH 200: accepts a vote object and adds to votes in the database for specified article in api, returns article object", () => {
      const testInput = {
       inc_votes: 3 
      };
      return request(app)
        .patch("/api/articles/1")
        .send(testInput)
        .expect(200)
        .then(({ body }) => {
           expect(body).toMatchObject({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 103,
            article_img_url:
      'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });
    test("PATCH 200: accepts a negative number vote object and subtracts from votes in the database for specified article in api and returns that article", () => {
      const testInput = {
       inc_votes: -200 
      };
      return request(app)
        .patch("/api/articles/1")
        .send(testInput)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: -100,
            article_img_url:
      'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });
    test("PATCH 200: amends votes and ignores any extra properties in body", () => {
      const testInput = {
          inc_votes: -200,
          title: 'My memoir'
       }
       return request(app)
       .patch("/api/articles/1")
       .send(testInput)
       .expect(200)
       .then(({ body }) => {
         expect(body).toMatchObject({
           article_id: 1,
           title: 'Living in the shadow of a great man',
           topic: 'mitch',
           author: 'butter_bridge',
           body: 'I find this existence challenging',
           created_at: expect.any(String),
           votes: -100,
           article_img_url:
     'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
         });
       });
   });
    test("PATCH 404: responds with message and error if there is a typo in the path", () => {
      return request(app)
        .patch("/api/artles/1")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("status 404: Path not found");
        });
  });
  test("PATCH 400: responds with error message if input article id is not a number", () => {
    return request(app)
      .patch("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid input");
      });
  });
  test("PATCH 404: responds with message and error if input article_id is valid but does not have an article attached", () => {
    return request(app)
      .patch("/api/articles/300")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Article not found");
      });
  });
  test("PATCH 400: responds with invalid request error message when patch request is sent with an empty object", () => {
    const testInput = {}
      return request(app)
      .patch("/api/articles/1")
      .send(testInput)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid request, missing information");
      })
  })
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: DELETE should delete comment specified by comment_id and respond with a 204", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
  });
  test("DELETE 404: responds with message and error if input comment_id is valid but does not have an comment attached", () => {
    return request(app)
      .delete("/api/comments/100000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Comment not found");
      });
  });
  test("DELETE 400: responds with error message if input comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("status 400: invalid input");
      });
  });
  test("DELETE 404: responds with message and error if there is a typo in the path", () => {
    return request(app)
      .delete("/api/com/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("status 404: Path not found");
      });
});
});

afterAll(() => {
  return connection.end();
});

//typo