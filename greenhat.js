var async = require('async');
var exec= require('child_process').exec;


//Sat Dec 12 00:00:00 2015  -0400
function getCurrentDateStr (startDate) {
	startDate.setDate(startDate.getDate() - 1);
	var dStr = startDate.toString();
	dArr = dStr.split(' ').slice(0, 5);
	var tmp;
	tmp = dArr[3];
	dArr[3] = dArr[4];
	dArr[4] = tmp;
	return dArr.join(' ') + ' -0400';
}

function handleOutput(err, stdout, stderr) {
	if(err) {
		console.error('An error occurred: ', err);
	}
	if(stdout) {
		console.log(stdout);
	}
	if(stderr) {
		console.error(stderr);
	}
}

function main() {

  var options = process.argv.slice(2);
  var n, startdate;
  if(options.length < 1 || options.length > 2) {
    console.error("Bad params length");
    return;
  }
  n = parseInt(options[0]);
  startdate = options.length > 1 ? new Date(options[1]) : new Date()
	console.log('start');
	async.timesSeries(n, function (i, next) {
		var curdate = getCurrentDateStr(startdate)
		console.log('Full contribution for date: ', curdate);
		var numCommits = Math.floor((Math.random() * 10) + 1);
		async.timesSeries(numCommits, function (index, cb) {
			commit(curdate, cb);
		}, next)
	}, function () {
		console.log('done');
		exec("git rm realwork.txt; git commit -m 'delete'; git push;" , handleOutput);
	});
}

function commit(curdate, callback) {
	exec("echo '"
		+ curdate
		+ Math.floor((Math.random() * 1000000) + 1)
		+ "' > realwork.txt; git add realwork.txt; GIT_AUTHOR_DATE='"
		+ curdate
		+ "' GIT_COMMITTER_DATE='"
		+ curdate
		+ "' git commit -m 'update'; git push;", function (err, stdout, stderr) {
			handleOutput(err, stdout, stderr);
			callback();
		});
}

main();
