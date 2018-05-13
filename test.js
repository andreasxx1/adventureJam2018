const clientPromise = stitch.StitchClientFactory.create('adventurejam2018-dmszt');
//
clientPromise
.then(client => {
	const db = client.service('mongodb', 'mongodb-atlas').db('adventureJam2018');
	client.login()
	.then(() => {
		console.log(db.collection('Characters'));
	})
	.catch(err => {
	  console.error(err)
	});
});