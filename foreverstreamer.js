#!/usr/bin/env node

var path  = require('path');
var child = require('child_process');
var util  = require('util');

var isPlaying = function(doneChecking) {
  child.execFile(path.join(__dirname, 'sample-peak'), [5, 1000000], {cwd: __dirname}, function(err, stdout) {

    if (err) {
      doneChecking(err);
      return;
    }

    //split the output into lines after trimming it and see if any of the lines has a positive reading
    var isPlaying = stdout.toString().trim().split('\n').some(function(line) {
      //split the line into readings after trimming it and see if any of the reading are truey
      return line.trim().split(' ').some(function(reading) {
        //cast the reading to a number, and then to a boolean
        return (!! Number(reading));
      });
    });

    doneChecking(null, isPlaying);

  });
};

var restartPlayer = function() {
  var rScript = child.spawn(path.join(__dirname, 'restart-stream'), {
    detached: true,
    cwd: __dirname
  });

  rScript.stdout.on('data', function(data) {
    process.stdout.write(data);
  });

  rScript.stderr.on('data', function(data) {
    process.stderr.write(data);
  });
};

var checkPlaying = function() {
  isPlaying(function(err, isPlaying) {

    //log errors in checking playing state
    if (err) {
      console.error('\n\nerror checking playing state: ', err);
    }

    //set a timeout to check again in 20 seconds if we're currently playing
    if (isPlaying) {
      setTimeout(checkPlaying, 20000);
    }
    //otherwise run the restart stream script
    else {
      console.log(util.format("nothing playing at %s, restarting player", Date().toString()));

      restartPlayer();

      //set a timeout to check playing state again in 5 minutes
      setTimeout(checkPlaying, 5 * 60 * 1000);

    }

  });
};

checkPlaying();
