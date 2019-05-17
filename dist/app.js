"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

// Create an express app
const app = (0, _express.default)();
app.get("/", (req, res) => {
  res.sendStatus(200);
});
var _default = app;
exports.default = _default;