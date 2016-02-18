var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');
var mocha = require('mocha');
var path = require('path');
// var request = require('supertest');
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;

var binPath = path.resolve(__dirname, '../bin/kskit');
var tempDir = path.resolve(__dirname, '../temp');

describe('kskit(1)', function () {
  mocha.before(function (done) {
    this.timeout(30000);
    cleanup(done);
  });

  mocha.after(function (done) {
    this.timeout(30000);
    cleanup(done);
  });

  describe('(no args)', function () {
    var dir;
    var files;
    var output;

    mocha.before(function (done) {
      createEnvironment(function (err, newDir) {
        if (err) return done(err);
        dir = newDir;
        done();
      });
    });

    mocha.after(function (done) {
      this.timeout(30000);
      cleanup(dir, done);
    });

    it('should create basic app', function (done) {
      run(dir, [], function (err, stdout) {
        if (err) return done(err);
        files = parseCreatedFiles(stdout, dir);
        output = stdout;
        assert.equal(files.length, 10);
        done();
      });
    });
  });
});

function cleanup(dir, callback) {
  if (typeof dir === 'function') {
    callback = dir;
    dir = tempDir;
  }

  rimraf(tempDir, function (err) {
    callback(err);
  });
}

function createEnvironment(callback) {
  var num = process.pid + Math.random();
  var dir = path.join(tempDir, ('app-' + num));

  mkdirp(dir, function ondir(err) {
    if (err) return callback(err);
    callback(null, dir);
  });
}

function npmInstall(dir, callback) {
  exec('npm install', {cwd: dir}, function (err, stderr) {
    if (err) {
      err.message += stderr;
      callback(err);
      return;
    }

    callback();
  });
}

function parseCreatedFiles(output, dir) {
  var files = [];
  var lines = output.split(/[\r\n]+/);
  var match;

  for (var i = 0; i < lines.length; i++) {
    if ((match = /create.*?: (.*)$/.exec(lines[i]))) {
      var file = match[1];

      if (dir) {
        file = path.resolve(dir, file);
        file = path.relative(dir, file);
      }

      file = file.replace(/\\/g, '/');
      files.push(file);
    }
  }

  return files;
}

function run(dir, args, callback) {
  var argv = [binPath].concat(args);
  var exec = process.argv[0];
  var stderr = '';
  var stdout = '';

  var child = spawn(exec, argv, {
    cwd: dir
  });

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function ondata(str) {
    stdout += str;
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function ondata(str) {
    process.stderr.write(str);
    stderr += str;
  });

  child.on('close', onclose);
  child.on('error', callback);

  function onclose(code) {
    var err = null;

    try {
      assert.equal(stderr, '');
      assert.strictEqual(code, 0);
    } catch (e) {
      err = e;
    }

    callback(err, stdout.replace(/\x1b\[(\d+)m/g, '_color_$1_'));
  }
}