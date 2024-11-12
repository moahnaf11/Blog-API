import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { jest } from "@jest/globals";
import * as commentQueries from "../prisma/commentQueries.js";


jest.mock("../prisma/commentQueries.js");

describe("Comment tests", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });
  describe("GET /posts/:id/comments", () => {
    it("display error if no comments for the post", async () => {
      commentQueries.getAllCommentsForAPost.mockResolvedValue([]);
      const response = await request(app).get("/posts/1/comments");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("no comments on this post");
    });

    it("return comments if length is > 0", async () => {
      commentQueries.getAllCommentsForAPost.mockResolvedValue([{}, {}]);
      const response = await request(app).get("/posts/1/comments");
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([{}, {}]);
    });
  });

  describe("POST /posts/:id/comments", () => {
    it("should add comment if user is authenticated", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      commentQueries.createNewComment.mockResolvedValue({
        text: "test comment",
      });

      const response = await request(app)
        .post("/posts/1/comments")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "test comment",
        });

      expect(response.body).toStrictEqual({
        text: "test comment",
      });
      expect(response.statusCode).toBe(200);
    });

    it("should return error if token not present", async () => {
      const response = await request(app)
        .post("/posts/1/comments")
        .set("Authorization", `Bearer `)
        .send({
          text: "test comment",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });

    it("should return error if auth header not present", async () => {
      const response = await request(app)
        .post("/posts/1/comments")
        .set("Authorization", "")
        .send({
          text: "test comment",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });

    it("should return error if comment not created", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });

      commentQueries.createNewComment.mockResolvedValue(null);

      const response = await request(app)
        .post("/posts/1/comments")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "test comment",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("failed to create comment");
    });
  });

  describe("PUT /posts/:id/comments/:commentId", () => {
    it("should return error and correct status if comment not found", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue(null);
      const response = await request(app)
        .put("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "updated comment",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("comment not found");
    });

    it("should update comment if user owns comment and is logged in", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      commentQueries.updateUserComment.mockResolvedValue({
        text: "updated comment",
      });
      const response = await request(app)
        .put("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "updated comment",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ text: "updated comment" });
    });

    it("should return error if user does not own comment", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 2, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      const response = await request(app)
        .put("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "updated comment",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("cannot update other's comments");
    });

    it("should return error if user provides invalid token", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(new Error("not logged in"), null);
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      const response = await request(app)
        .put("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          text: "updated comment",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe("invalid token");
    });

    it("should return error if user does not provide token", async () => {
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      const response = await request(app)
        .put("/posts/1/comments/1")
        .set("Authorization", `Bearer `)
        .send({
          text: "updated comment",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });
  });

  describe("DELETE /posts/:id/comments/:id", () => {
    it("should delete comment is user is logged in and owns the comment", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      commentQueries.deleteUserComment.mockResolvedValue({
        text: "deleted comment",
      });
      const response = await request(app)
        .delete("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ text: "deleted comment" });
    });

    it("should return error is user logged in but does not own comment", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 4 } });
      commentQueries.deleteUserComment.mockResolvedValue({
        text: "deleted comment",
      });
      const response = await request(app)
        .delete("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("cannot delete other's comments");
    });

    it("should return error if comment not found", async () => {
      const validToken = "token123";
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue(null);
      const response = await request(app)
        .delete("/posts/1/comments/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("comment not found");
    });

    it("should return error if user does not pass in token", async () => {
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      const response = await request(app)
        .delete("/posts/1/comments/1")
        .set("Authorization", `Bearer `);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });

    it("should return error if auth header not provided", async () => {
      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { id: 1, email: "user@example.com", role: "AUTHOR" });
      });
      commentQueries.getSingleComment.mockResolvedValue({ user: { id: 1 } });
      const response = await request(app).delete("/posts/1/comments/1");

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("token not present");
    });
  });
});
