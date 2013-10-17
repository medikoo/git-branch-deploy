'use strict';

var lock       = require('es5-ext/function/#/lock')
  , copy       = require('es5-ext/object/copy')
  , isCallable = require('es5-ext/object/is-callable')
  , callable   = require('es5-ext/object/valid-callable')
  , escape     = require('es5-ext/reg-exp/escape')
  , exec       = require('exec-batch/exec')

  , tracksBranch;

tracksBranch = function (out, name) {
	return RegExp('(?:^|\n) (?:\\*: ) ' + escape(name) + '(?:$|\n)').test(out);
};

module.exports = function (branch/*, options, cb*/) {
	var options = arguments[1], cb = arguments[2], remote, flow;
	if (cb != null) {
		callable(cb);
		options = Object(options);
	} else if (isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = Object(options);
	}
	if (options.remote != null) {
		remote = options.remote;
		options = copy(options);
		delete options.remote;
	}

	flow = exec('git reset')
		.then(lock.call(exec, 'git checkout .'))
		.then(lock.call(exec, 'git clean -df'))
		.then(lock.call(exec, 'git checkout master'))
		.then(lock.call(exec, 'git pull'))
		.then(lock.call(exec, 'git fetch' + (remote ? (' ' + remote) : '')));

	if (!remote) {
		flow = flow.then(lock.call(exec, 'git branch'))
			.then(function (std) {
				if (!tracksBranch(std.out, branch)) return;
				return exec('git branch --track ' + branch);
			});
	}

	flow.then(lock.call(exec, 'git merge --no-commit --no-ff ' +
		(remote ? (remote + '/') : '') + branch))
		.then(lock.call(exec, 'git reset')).done();
};
