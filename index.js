#!/usr/bin/env node
var confirm       = require('confirm-cli')
var github        = require('octonode')
var child_process = require('child_process')
var execFile      = child_process.execFile
var open          = require('open')

var pasteBoard = function (callback) {
  child_process.exec('pbpaste', function (error, stdout, stderr) {
    if (error) {
      console.log('Error returned from pbpaste exec call')
      throw error
    } else {
      callback(stdout)
    }
  })
}

var clipBoard = function (data) {
  var proc = child_process.spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

function getConfFromGit(key, cb) {
  var env = {env: process.env}
  execFile('git', ['config', '--get', key], env, function (er, stdout, stderr) {
    if (er || !stdout) {
      console.log(stderr)
    }

    stdout = stdout.replace(/(\r\n|\n|\r)/gm,'');
    return cb(er, stdout)
  })
}

var getAuth = function (cb) {
  getConfFromGit('gist.username', function (er, username) {
    getConfFromGit('gist.token', function (er, token) {
      return cb({
        'username': username,
        'password': token
      })
    })
  })
}

var preMsg = function (exampleData) {
  console.log('------------------------------------------------------------')
  console.log(exampleData)
  console.log('------------------------------------------------------------')
  console.log('\n')
}

pasteBoard(function (data) {
  var exampleData = data.substr(0, 100) + '...'
  preMsg(exampleData)
  confirm('Continue Pasting?', function () {
    console.log('Sending to gist...')
    getAuth(function (credentials) {
      var client = github.client(credentials)
      var ghgist = client.gist()

      ghgist.create({
        files: {
          'copy2gist.txt': {
            'content': data
          }
        }
      }, function (err, data) {
        if (err) {
          console.log(err.body.message)
        } else {
          console.log(data.html_url)
          clipBoard(data.html_url)
          open(data.html_url)
          console.log('URL copied to your clipboard...')
        }
      })
    })
  }, function () {
    console.log('Cancelled by user.')
  })
})
