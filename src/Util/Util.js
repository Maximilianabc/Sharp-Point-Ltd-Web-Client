const serverIP = "http://192.168.123.136";
const port = "99";

const postRequest = async (relativePath, payload) => {
	const path = `${serverIP}:${port}/apiCustomer`;
	const reqOpt = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	};
	let data;
	await fetch(path + relativePath, reqOpt)
		.then(response => response.json())
		.then(body => { data = body });
	console.log(data);
	return data;
};

export {
	postRequest
}
