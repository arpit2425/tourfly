const express = require('express');
const userRoutes = express.Router();
const userController = require('./../controllers/userController');
userRoutes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRoutes
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = userRoutes;
