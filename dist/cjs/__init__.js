"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

var _fs = require("fs");

var _path = require("path");

var _ubf = require("ubf");

var _natronArgsParser = require("natron-args-parser");

/**
 * UBF Command-Line Utility
 * @module ubf-cli
 */
function main(argv) {
  var args = (0, _natronArgsParser.parse)(argv || process.argv.slice(2), {
    greedy: true
  });

  var filename = (0, _path.resolve)(args._[0]);
  var outfile = args.o && (0, _path.resolve)(args.o);

  (0, _fs.readFile)(filename, function (err, data) {
    if (err) {
      throw err;
    }
    var parser = new _ubf.Parser();
    var result = [];

    parser.context.on("value", function (_ref) {
      var value = _ref.value;

      var json = JSON.stringify(value);
      if (outfile) {
        result.push(json);
      } else {
        console.log(json);
      }
    });

    parser.context.on("error", function (e) {
      console.error(e);
    });

    parser.parse(data);

    if (outfile) {
      (0, _fs.writeFile)(outfile, result.join("\n"), function (err) {
        if (err) {
          throw err;
        }
        console.log("Output written to " + outfile);
      });
    }
  });
}