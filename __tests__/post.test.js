import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { jest } from "@jest/globals";
import { prisma } from "../prisma/prismaClient.js";
import * as postQueries from "../prisma/postQueries.js";
import { authenticateToken } from "../authenticateToken.js";
import { checkRole } from "../routes/postsRouter.js";

jest.mock("../prisma/postQueries.js");

describe("Post router tests", () => {
  beforeEach(async () => {
    await prisma.post.deleteMany();
    jest.resetAllMocks();
  });
  describe("GET /posts", () => {
    it("should show error if no posts", async () => {
      postQueries.getAllPosts.mockResolvedValue([]);
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("no posts");
    });

    it("should get all posts", async () => {
      postQueries.getAllPosts.mockResolvedValue([{}, {}]);
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([{}, {}]);
    });
  });

  describe("GET /posts/:id", () => {
    it("show error if specific post doesn't exist", async () => {
      postQueries.getSinglePost.mockResolvedValue(null);
      const response = await request(app).get("/posts/1");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("cannot find the post");
    });

    it("should get specific post", async () => {
      postQueries.getSinglePost.mockResolvedValue({});
      const response = await request(app).get("/posts/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe("POST /posts", () => {
    it("allow user to create post if user is author and logged in", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.createNewPost.mockResolvedValue({});

      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          title: "test post",
          content: "test",
          published: "true",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
    });

    it("should return error if user not authenticated", async () => {
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(new Error("invalid token"), null);
      });

      const response = await request(app).post("/posts");

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });

    it("return error if user is not an author", async () => {
      const validToken = "token";
      const secret = "mysecret";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "USER" });
      });

      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          title: "test post",
          content: "test",
          published: "true",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe(
        "only authors can create/ update and delete posts"
      );
    });
  });

  describe("PUT /posts/:id", () => {
    it("should update a post if user is logged in and the author", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue({
        id: 1,
        userId: 1,
        title: "Old Title",
        content: "Old content",
        published: false,
      });

      const data = {
        title: "test post",
        content: "test",
        published: "true",
      };

      postQueries.updateUserPost.mockResolvedValue(data);

      const response = await request(app)
        .put("/posts/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(data);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(data);
    });

    it("should return error if user does not own the post", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue({
        id: 1,
        userId: 2,
        title: "Old Title",
        content: "Old content",
        published: false,
      });

      const data = {
        title: "test post",
        content: "test",
        published: "true",
      };

      const response = await request(app)
        .put("/posts/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(data);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("cannot update soneone else's post");
    });

    it("should return not found error if post not found", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue(null);

      const data = {
        title: "test post",
        content: "test",
        published: "true",
      };

      const response = await request(app)
        .put("/posts/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(data);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("post not found");
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete the post if user is owner", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue({
        id: 1,
        userId: 1,
        title: "Old Title",
        content: "Old content",
        published: false,
      });

      postQueries.deleteUserPost.mockResolvedValue({
        id: 1,
        userId: 1,
        title: "Old Title",
        content: "Old content",
        published: false,
      });

      const response = await request(app)
        .delete("/posts/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        id: 1,
        userId: 1,
        title: "Old Title",
        content: "Old content",
        published: false,
      });
    });

    it("should return error if user does not own the post", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue({
        id: 1,
        userId: 2,
        title: "Old Title",
        content: "Old content",
        published: false,
      });

      const response = await request(app)
        .delete("/posts/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("cannot delete someone else's post");
    });

    it("should return not found error if post not found", async () => {
      const validToken = "token";
      jwt.verify = jest.fn((validToken, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      postQueries.getSinglePost.mockResolvedValue(null);

      const response = await request(app)
        .delete("/posts/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("post not found");
    });
  });

  describe("test authenticateToken and checkRole", () => {
    it("test authenticateToken to call next and attach user to req.user", async () => {
      const req = {
        headers: { authorization: "Bearer validToken" },
      };
      const res = {};
      const next = jest.fn();

      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      authenticateToken(req, res, next);
      expect(req.user).toEqual({
        id: 1,
        email: "user@example.com",
        role: "AUTHOR",
      });
      expect(next).toHaveBeenCalled();
    });

    it("test authenticateToken to return 401 error if authheader is missing", async () => {
      const req = {
        headers: { authorization: "" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      authenticateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "token not present" });
      expect(next).not.toHaveBeenCalled();
    });

    it("test authenticateToken to return 401 error if split value is null", async () => {
      const req = {
        headers: { authorization: "shhsgff " },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      authenticateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "token not present" });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next if checkRole user role is AUTHOR", async () => {
      const req = {
        user: {
          role: "AUTHOR",
        },
      };
      const res = {};
      const next = jest.fn();

      checkRole(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("does not call next if role if role is not author", async () => {
      const req = {
        user: {
          role: "USER",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      checkRole(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "only authors can create/ update and delete posts",
      });
    });
  });
});
