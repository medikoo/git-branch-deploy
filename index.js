'use strict';

var copy       = require('es5-ext/object/copy')
  , isCallable = require('es5-ext/object/is-callable')
  , callable   = require('es5-ext/object/valid-callable')
  , ExecBatch  = require('exec-batch');

module.exports = function (branch/*, options, cb*/) {
	var options = arguments[1], cb = arguments[2], remote, batch;
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
	batch = new ExecBatch(options);

	if (!remote) remote = 'origin';

	batch.add('git reset');
	batch.add('git checkout .');
	batch.add('git clean -df');
	batch.add('git checkout master');
	batch.add('git pull');
	if (branch) {
		batch.add('git fetch ' + remote);
		batch.add('git fetch ' + remote + ' ' + branch);
		batch.add('git merge --no-commit --no-ff ' + remote + '/' + branch);
		batch.add('git reset');
	}

	batch.start(cb);
};
