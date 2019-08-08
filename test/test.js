const assert = require('assert');
const spawn = require('child_process').spawn;

const xml = `
<?xml version="1.0" encoding="utf-8"?>
<note importance="high" logged="true">
  <title>Happy</title>
  <todos>
    <todo>Work</todo>
    <todo>Sleep</todo>
  </todos>
</note>
`;

const json = `
{
  "_declaration": {
    "_attributes": {
      "version": "1.0",
      "encoding": "utf-8"
    }
  },
  "note": {
    "_attributes": {
      "importance": "high",
      "logged": "true"
    },
    "title": {
      "_text": "Happy"
    },
    "todos": {
      "todo": [
        {
          "_text": "Work"
        },
        {
          "_text": "Sleep"
        }
      ]
    }
  }
}`;

describe('xml-js-cli', function () {

  it('should parse xml to json', function (cb) {
    const handle = spawn('node', ['index.js', '--format', 'json']);

    let buffer = '';
    handle.stdout.on('data', (chunk) => buffer += chunk);
    handle.stdout.on('end', () => {
      const data = JSON.parse(buffer);
      assert.equal(data._declaration._attributes.version, '1.0');
      assert.equal(data.note._attributes.importance, 'high');
      assert.equal(data.note.todos.todo.length, 2);
      cb();
    });

    handle.stdin.write(xml, 'utf-8');
    handle.stdin.end();
  });

  it('should parse json back to xml', function (cb) {
    const handle = spawn('node', ['index.js', '--format', 'xml']);

    let buffer = '';
    handle.stdout.on('data', (chunk) => buffer += chunk);
    handle.stdout.on('end', () => {
      assert.equal(xml.trim(), buffer.trim());
      cb();
    });

    handle.stdin.write(json, 'utf-8');
    handle.stdin.end();
  });

});