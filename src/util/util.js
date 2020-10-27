import _ from "lodash";

function familyFreq(artists){
	var ret = null;
	//console.log("artists",artists);
	artists.forEach(a => {
		var fmap = {};
		for (var z = 0; z < a.genres.length; z++) {
			if (a.genres[z].family_name) {
				if (!(fmap[a.genres[z].family_name])) {
					fmap[a.genres[z].family_name] = 1
				} else {
					fmap[a.genres[z].family_name]++;
				}
			}
		}

		//check the family map defined and see who has the highest score
		if (!(_.isEmpty(fmap))) {
			//convert map to array (uses entries and ES6 'computed property names')
			//and find the max
			var arr = [];
			Object.entries(fmap).forEach(tup => {
				var r = {[tup[0]]: tup[1]};
				arr.push(r);
			});
			var m = _.maxBy(arr, function (r) {
				return Object.values(r)[0]
			});
			var f = Object.keys(m)[0];
			console.log("%", f);
			ret = f ;
		}
	})//each
	return ret;
}

export default {
	familyFreq
}