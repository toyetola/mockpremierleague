const express = require("express")
const router = require("express").Router();
const userController = require('../app/controllers/userController');
var session ;

router.get('/', userController.search)

module.exports = router