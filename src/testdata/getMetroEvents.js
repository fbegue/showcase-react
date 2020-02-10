//didn't have access to data that had the artists/genres I used for example data and had already in db
//so just did the following here to flub it:

//F&R

//King Princess => DJ Scheme
//Elliot Moss => Ski Mask The Slump God
//Pouya => Pouya


//recall this is meant to return many metros' results
module.exports.getMetroEvents = [
	{
		"id": 39009007,
		"displayName": "DJ Scheme, Whitney, CHAI, and Kilo Kish at Newport Music Hall (February 10, 2020)",
		"type": "Concert",
		"uri": "http://www.songkick.com/concerts/39009007-king-princess-at-newport-music-hall?utm_source=47817&utm_medium=partner",
		"status": "ok",
		"popularity": 0.033376,
		"start": {
			"date": "2020-02-10",
			"datetime": "2020-02-10T19:00:00-0500",
			"time": "19:00:00"
		},
		"performance": [
			{
				"id": 73886333,
				"displayName": "DJ Scheme",
				"billing": "headline",
				"billingIndex": 1,
				"artist": {
					"id": 9555444,
					"displayName": "DJ Scheme",
					"uri": "http://www.songkick.com/artists/9555444-king-princess?utm_source=47817&utm_medium=partner",
					"identifier": [
						{
							"mbid": "158778fe-55c1-4dd5-8a3a-9d1b968a5e52",
							"href": "http://api.songkick.com/api/3.0/artists/mbid:158778fe-55c1-4dd5-8a3a-9d1b968a5e52.json"
						}
					]
				}
			},
			{
				"id": 74368656,
				"displayName": "Whitney",
				"billing": "headline",
				"billingIndex": 2,
				"artist": {
					"id": 49377,
					"displayName": "Whitney",
					"uri": "http://www.songkick.com/artists/49377-whitney?utm_source=47817&utm_medium=partner",
					"identifier": [
						{
							"mbid": "c8adeb75-8ec5-4b0f-a5d3-13e87da1d19a",
							"href": "http://api.songkick.com/api/3.0/artists/mbid:c8adeb75-8ec5-4b0f-a5d3-13e87da1d19a.json"
						}
					]
				}
			},
			{
				"id": 74368657,
				"displayName": "CHAI",
				"billing": "headline",
				"billingIndex": 3,
				"artist": {
					"id": 1423145,
					"displayName": "CHAI",
					"uri": "http://www.songkick.com/artists/1423145-chai?utm_source=47817&utm_medium=partner",
					"identifier": [
						{
							"mbid": "049eac50-cca3-4c22-ad72-9ed71d7c408f",
							"href": "http://api.songkick.com/api/3.0/artists/mbid:049eac50-cca3-4c22-ad72-9ed71d7c408f.json"
						}
					]
				}
			},
			{
				"id": 74521805,
				"displayName": "Kilo Kish",
				"billing": "headline",
				"billingIndex": 4,
				"artist": {
					"id": 5642164,
					"displayName": "Kilo Kish",
					"uri": "http://www.songkick.com/artists/5642164-kilo-kish?utm_source=47817&utm_medium=partner",
					"identifier": [
						{
							"mbid": "8df10546-b908-4d7d-9acf-6ebc86ed80a8",
							"href": "http://api.songkick.com/api/3.0/artists/mbid:8df10546-b908-4d7d-9acf-6ebc86ed80a8.json"
						}
					]
				}
			}
		],
		"ageRestriction": null,
		"flaggedAsEnded": false,
		"venue": {
			"id": 884,
			"displayName": "Newport Music Hall",
			"uri": "http://www.songkick.com/venues/884-newport-music-hall?utm_source=47817&utm_medium=partner",
			"metroArea": {
				"displayName": "Columbus",
				"country": {
					"displayName": "US"
				},
				"state": {
					"displayName": "OH"
				},
				"id": 9480,
				"uri": "http://www.songkick.com/metro-areas/9480-us-columbus?utm_source=47817&utm_medium=partner"
			},
			"lat": 39.99753,
			"lng": -83.00743
		},
		"location": {
			"city": "Columbus, OH, US",
			"lat": 39.99753,
			"lng": -83.00743
		},
		"metro_id": 9480
	},
	{
		"id": 39248878,
		"displayName": "Ski Mask The Slump God at The Basement (February 11, 2020)",
		"type": "Concert",
		"uri": "http://www.songkick.com/concerts/39248878-elliot-moss-at-basement?utm_source=47817&utm_medium=partner",
		"status": "ok",
		"popularity": 0.013091,
		"start": {
			"date": "2020-02-11",
			"datetime": "2020-02-11T19:00:00-0500",
			"time": "19:00:00"
		},
		"performance": [
			{
				"id": 74287075,
				"displayName": "Ski Mask The Slump God",
				"billing": "headline",
				"billingIndex": 1,
				"artist": {
					"id": 8330403,
					"displayName": "Ski Mask The Slump God",
					"uri": "http://www.songkick.com/artists/8330403-elliot-moss?utm_source=47817&utm_medium=partner",
					"identifier": [
						{
							"mbid": "35c6e25d-3c5c-400e-bead-44363b3d69f1",
							"href": "http://api.songkick.com/api/3.0/artists/mbid:35c6e25d-3c5c-400e-bead-44363b3d69f1.json"
						}
					]
				}
			}
		],
		"ageRestriction": null,
		"flaggedAsEnded": false,
		"venue": {
			"id": 2466,
			"displayName": "The Basement",
			"uri": "http://www.songkick.com/venues/2466-basement?utm_source=47817&utm_medium=partner",
			"metroArea": {
				"displayName": "Columbus",
				"country": {
					"displayName": "US"
				},
				"state": {
					"displayName": "OH"
				},
				"id": 9480,
				"uri": "http://www.songkick.com/metro_areas/9480-us-columbus?utm_source=47817&utm_medium=partner"
			},
			"lat": 39.96945,
			"lng": -83.00999
		},
		"location": {
			"city": "Columbus, OH, US",
			"lat": 39.96945,
			"lng": -83.00999
		},
		"metro_id": 9480
	},
	{
		"id": 39379941,
		"displayName": "Pouya at Natalie's Coal-Fired Pizza - Worthington (February 11, 2020)",
		"type": "Concert",
		"uri": "http://www.songkick.com/concerts/39379941-paul-nelson-band-at-natalies-coalfired-pizza-worthington?utm_source=47817&utm_medium=partner",
		"status": "ok",
		"popularity": 0.000011,
		"start": {
			"date": "2020-02-11",
			"datetime": null,
			"time": null
		},
		"performance": [
			{
				"id": 74508183,
				"displayName": "Pouya",
				"billing": "headline",
				"billingIndex": 1,
				"artist": {
					"id": 9185344,
					"displayName": "Pouya",
					"uri": "http://www.songkick.com/artists/9185344-paul-nelson-band?utm_source=47817&utm_medium=partner",
					"identifier": []
				}
			}
		],
		"ageRestriction": null,
		"flaggedAsEnded": false,
		"venue": {
			"id": 2005739,
			"displayName": "Natalie's Coal-Fired Pizza - Worthington",
			"uri": "http://www.songkick.com/venues/2005739-natalies-coalfired-pizza-worthington?utm_source=47817&utm_medium=partner",
			"metroArea": {
				"displayName": "Columbus",
				"country": {
					"displayName": "US"
				},
				"state": {
					"displayName": "OH"
				},
				"id": 9480,
				"uri": "http://www.songkick.com/metro-areas/9480-us-columbus?utm_source=47817&utm_medium=partner"
			},
			"lat": 40.07669,
			"lng": -83.01936
		},
		"location": {
			"city": "Worthington, OH, US",
			"lat": 40.07669,
			"lng": -83.01936
		},
		"metro_id": 9480
	},
	{
		"id": 39469233,
		"displayName": "my wall at Dirty Dungarees (February 11, 2020)",
		"type": "Concert",
		"uri": "http://www.songkick.com/concerts/39469233-my-wall-at-dirty-dungarees?utm_source=47817&utm_medium=partner",
		"status": "ok",
		"popularity": 0,
		"start": {
			"date": "2020-02-11",
			"datetime": null,
			"time": null
		},
		"performance": [
			{
				"id": 74666432,
				"displayName": "my wall",
				"billing": "headline",
				"billingIndex": 1,
				"artist": {
					"id": 9902729,
					"displayName": "my wall",
					"uri": "http://www.songkick.com/artists/9902729-my-wall?utm_source=47817&utm_medium=partner",
					"identifier": []
				}
			}
		],
		"ageRestriction": null,
		"flaggedAsEnded": false,
		"venue": {
			"id": 3798034,
			"displayName": "Dirty Dungarees",
			"uri": "http://www.songkick.com/venues/3798034-dirty-dungarees?utm_source=47817&utm_medium=partner",
			"metroArea": {
				"displayName": "Columbus",
				"country": {
					"displayName": "US"
				},
				"state": {
					"displayName": "OH"
				},
				"id": 9480,
				"uri": "http://www.songkick.com/metro-areas/9480-us-columbus?utm_source=47817&utm_medium=partner"
			},
			"lat": 40.015,
			"lng": -83.01124
		},
		"location": {
			"city": "Columbus, OH, US",
			"lat": 40.015,
			"lng": -83.01124
		},
		"metro_id": 9480
	}
]
