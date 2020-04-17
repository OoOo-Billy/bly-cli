"use strict"

const fs = require("fs");
const Path = require("path");


const mst = require("./mst.json");
const dev = require("./dev.json");

const files = fs.readdirSync(__dirname).filter(file => {
  return Path.extname(file).toLowerCase() === '.json';
});

const data = [];
files.forEach(fileName => {
  data.push(JSON.parse(fs.readFileSync(__dirname + "\\" + fileName, "utf-8")));
})

console.log("data", data);
// TODO


const commands = {
  mst,
  dev
}

exports.commands = commands