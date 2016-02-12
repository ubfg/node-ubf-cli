/**
 * UBF Command-Line Utility
 * @module ubf-cli
 */
import {readFile, writeFile} from "fs";
import {resolve} from "path";
import {Parser} from "ubf";
import {parse as argsParse} from "natron-args-parser";

export function main(argv?: Array<string>): void {
  let args = argsParse(argv || process.argv.slice(2), {
    greedy: true,
  });

  let filename = resolve(args._[0]);
  let outfile = args.o && resolve(args.o);

  readFile(filename, (err, data) => {
    if (err) {
      throw err;
    }
    let parser = new Parser();
    let result = [];

    parser.context.on("value", ({value}) => {
      let json = JSON.stringify(value);
      if (outfile) {
        result.push(json);
      } else {
        console.log(json);
      }
    });

    parser.context.on("error", (e) => {
      console.error(e);
    });

    parser.parse(data);

    if (outfile) {
      writeFile(outfile, result.join("\n"), (err) => {
        if (err) {
          throw err;
        }
        console.log(`Output written to ${outfile}`);
      });
    }
  });
}
