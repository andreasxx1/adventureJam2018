(function() {
	'use strict';

	const _			= require('lodash');
	const express 	= require('express');
	const app		= express();
	const server	= app.listen(4000);

	app.use(express.static(__dirname + '/frontend'));

})();