import request from "supertest";
import app from "../app.js";
import { jest } from "@jest/globals";
import { prisma } from "../prisma/prismaClient.js";
import * as userQueries from "../prisma/userQueries.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../prisma/userQueries.js");

describe("POST /users/register", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    jest.resetAllMocks();
  });
  it("should return correct json after registering a user", async () => {
    userQueries.addUser = jest.fn(
      async (firstname, lastname, email, password, role) => {
        const user = await prisma.user.create({
          data: {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            role: role,
          },
        });
        return user;
      }
    );
    const response = await request(app).post("/users/register").send({
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "password123",
      role: "USER",
    });

    expect(response.body.user).toStrictEqual({
      id: expect.any(String),
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: expect.any(String),
      role: "USER",
    });

    const createdUser = await prisma.user.findUnique({
      where: {
        email: "john@example.com",
      },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser).toBeDefined();
    expect(createdUser.firstName).toBeDefined();
    expect(createdUser.lastName).toBeDefined();
    expect(createdUser.email).toBeDefined();
    expect(createdUser.password).toBeDefined();
    expect(createdUser.role).toBeDefined();
  });

  it("should call addUser with correct arguments", async () => {
    const userData = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "password123",
      role: "USER",
    };

    userQueries.addUser.mockResolvedValue({
      id: expect.any(String),
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: expect.any(String),
      role: "USER",
    });

    // Act: Send the registration request
    await request(app).post("/users/register").send(userData);

    // Assert: Check if addUser was called with correct arguments
    expect(userQueries.addUser.mock.calls.length).toBe(1);
    expect(userQueries.addUser.mock.calls[0][0]).toBe("John");
    expect(userQueries.addUser.mock.calls[0][1]).toBe("Doe");
    expect(userQueries.addUser.mock.calls[0][2]).toBe("john@example.com");
    expect(userQueries.addUser.mock.calls[0][3]).toEqual(expect.any(String));
    expect(userQueries.addUser.mock.calls[0][4]).toBe("USER");
  });
});

describe("POST /users/login", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: await bcrypt.hash("12345", 10),
        role: "USER",
      },
    });
    jest.clearAllMocks();
  });
  it("should send 401 status to user after incorrect login details", async () => {
    userQueries.getUser.mockResolvedValue(null);
    const response = await request(app).post("/users/login");
    expect(response.statusCode).toBe(401);
  });

  it("getUser called with proper arguments", async () => {
    userQueries.getUser.mockResolvedValue({
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const response = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "Ahnaf1234",
    });

    expect(userQueries.getUser.mock.calls.length).toBe(1);
    expect(userQueries.getUser.mock.calls[0][0]).toBe("john@example.com");
    expect(userQueries.getUser.mock.calls[0][1]).toBe("Ahnaf1234");
  });

  it("should send back token on successful call", async () => {
    userQueries.getUser.mockResolvedValue({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("im a mock token");
    const response = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "hashedPassword123",
    });

    expect(response.body.token).toBe("im a mock token");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /users/:id", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    jest.resetAllMocks();
  });
  it("should display error if user does not exists", async () => {
    userQueries.getUserProfile.mockResolvedValue(null);
    const response = await request(app).get("/users/1234");
    expect(response.body.error).toBe("user not found");
    expect(response.statusCode).toBe(404);
  });

  it("should get user is user exists", async () => {
    userQueries.getUserProfile.mockResolvedValue({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
    const response = await request(app).get("/users/1");
    expect(response.body).toStrictEqual({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("PUT /users/:id", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    jest.resetAllMocks();
  });

  it("should return an error if user not found", async () => {
    userQueries.updateUser.mockResolvedValue(null);
    const response = await request(app).put("/users/1234").send({
      firstname: "Mohammad",
      lastName: "Ahnaf",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "user not found, could not update user's details"
    );
  });

  it("should return updated user if successful", async () => {
    userQueries.updateUser.mockResolvedValue({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
    const response = await request(app).put("/users/1").send({
      firstname: "Mohammad",
      lastName: "Ahnaf",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
  });
});

describe("DELETE /users/:id", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    jest.resetAllMocks();
  });

  it("should return an error if user not found", async () => {
    userQueries.deleteUser.mockResolvedValue(null);
    const response = await request(app).delete("/users/1234");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "user not found, could not delete this user"
    );
  });

  it("should return deleted user if successful", async () => {
    userQueries.deleteUser.mockResolvedValue({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
    const response = await request(app).delete("/users/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      id: 1,
      firstName: "Ahnaf",
      lastName: "hello",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "USER",
    });
  });
});
