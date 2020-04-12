import { useEffect } from 'react';

const useScript = (url,callback) => {
	useEffect(() => {
		const script = document.createElement('script');

		script.src = url;
		script.async = true;

		document.body.appendChild(script);

		setTimeout(e =>{
			callback ? callback('testcallback'):{};
		},5000)
		return () => {
			document.body.removeChild(script);
		}
		//empty dependencies = doesn't have anything to watch in order to reload = only runs once
	// }, [url,callback]);
	}, []);
};

// const useScript = (urls,callback) => {
// 	useEffect(() => {
//
// 		urls.forEach(u =>{
// 			var script = document.createElement('script');
// 			script.src = u;
// 			script.async = true;
// 			document.body.appendChild(script);
// 		})
//
// 		setTimeout(e =>{
// 			callback ? callback('testcallback'):{};
// 		},3000)
// 		return () => {
// 			//todo:
// 			//document.body.removeChild(script);
// 		}
// 	}, []);
// };

export default useScript;