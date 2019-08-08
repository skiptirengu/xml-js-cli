const convert = require('xml-js');

const stdin = process.stdin;
const stdout = process.stdout;
const buffer = [];

stdin.resume();
stdin.setEncoding('utf-8');

stdin.on('data', (chunk) => buffer.push(chunk));
stdin.on('end', () => {
  const format = getArgument('--format', 'string');

  let output = null;
  switch (format) {
    case 'json':
      output = convert.xml2json(buffer.join(), { compact: true, spaces: 2 });
      break;
    case 'xml':
      output = convert.json2xml(buffer.join(), { compact: true, spaces: 2 });
      break;
    default:
      throw new Error(`invalid format ${format}`);
  }

  stdout.write(output, (err) => {
    if (err) throw err;
  });
});

function getArgument(name, type) {
  const pos = process.argv.indexOf(name);

  switch (type) {
    case 'boolean':
      return pos != -1;
    case 'string':
      return String(process.argv[pos + 1]).toLowerCase();
    default:
      throw new Error(`argument ${name} unknown`);
  }
}