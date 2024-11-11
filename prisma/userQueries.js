import { prisma } from "./prismaClient.js";

const getUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log("user", user);
  return user;
};

const addUser = async (firstname, lastname, email, password, role) => {
  const user = await prisma.user.create({
    data: {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      role: role,
    },
  });

  console.log("created user", user);
  return user;
};

const getUserProfile = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  console.log("user profile", user);
  return user;
};

const updateUser = async (id, firstname, lastname) => {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      firstName: firstname,
      lastName: lastname,
    },
  });
  console.log("updated user", user);
  return user;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  console.log("deleted user", user);
};

export { getUser, addUser, getUserProfile, updateUser, deleteUser };
