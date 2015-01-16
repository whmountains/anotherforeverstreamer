var child = require('child_process');

var vlc = child.spawn('/usr/bin/vlc', ['/home/pi/t1.mp3', '--intf', 'dummy'], {
  detached: true
});

vlc.stdout.on('data', function(data) {
  process.stdout.write(data);
});

vlc.stderr.on('data', function(data) {
  process.stderr.write(data);
});


// function(err, stdout, stderr) {
//   console.log(err + '\n\n');
//   console.log(stdout.toString() + '\n\n');
//   console.log(stderr.toString() + '\n\n');
// });
