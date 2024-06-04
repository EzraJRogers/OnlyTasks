const { Employee, Task } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    employees: async () => {
      return await Employee.find();
    },
    employee: async (parent, { username }) => {
      return await Employee.findOne({ username });
    },
    tasks: async () => {
      return await Task.find();
    },
  },

  Mutation: {
    addEmployee: async (parent, args) => {
      return await Employee.create(args);
    },
    updateEmployee: async (parent, args, context) => {
      if (context.employee) {
        return await Employee.findByIdAndUpdate(context.employee.id, args, {
          new: true,
        });
      }
      throw AuthenticationError;
    },
    deleteEmployee: async (parent, args, context) => {
      if (context.employee) {
        return await Employee.findByIdAndDelete(context.employee.id);
      }
    },
    addTask: async (parent, args) => {
      return await Task.create(args);
    },
    updateTask: async (parent, args, context) => {
        if (context.task) {
          return await Task.findByIdAndUpdate(context.task.id, args, {
            new: true,
          });
        }
        throw AuthenticationError;
    },
    deleteTask: async (parent, args, context) => {
        if (context.task) {
          return await Task.findByIdAndDelete(context.task.id);
        }
        throw AuthenticationError;
    },
    
    login: async (parent, { username, password }) => {
      const employee = await Employee.findOne({ username });
      if (!employee) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await employee.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(employee);
      return { token, user: employee };
    },
  },
};

module.exports = resolvers;