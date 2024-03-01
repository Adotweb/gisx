function getCurrentWeek() {
    // Get the current date
    const currentDate = new Date();
    
    // Calculate the first day of the week (assuming Sunday is the first day)
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0); // Reset the time to the start of the day
    
    // Calculate the last day of the week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 5);
    lastDayOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day
    
    // Format dates to YYYY-MM-DD (ISO format) or any other format you need
    const firstDayFormatted = firstDayOfWeek.toISOString().substring(0, 10);
    const lastDayFormatted = lastDayOfWeek.toISOString().substring(0, 10);
    
    // Return the start and end dates of the week
    return [firstDayFormatted, lastDayFormatted];
}

async function getToken(username, password){

	let res = await fetch("https://kaschuso.so.ch/public/ksso/authorize.php", {
		method:"POST",
		headers:{

			"Content-Type":"application/x-www-form-urlencoded",	
		},
		body:new URLSearchParams({
        		'login': username,
        		'passwort': password,
        		'response_type': 'token',
        		'client_id': 'cj79FSz1JQvZKpJY',
        		'state': 'mipeZwvnUtB4bJWCsoXhGi7d8AyQT5698jSa9ixl',
    		}),
		redirect:"manual"
	})

	if(res.status === 302){
		
		let location = res.headers.get("Location").replaceAll("#", "?")


		let token = new URL(location).searchParams.get("access_token")
		
		return token

	}else {
		throw new Error("password or username seem to be wrong")
	}

}

async function getGrades(token){


	let res = await fetch("https://kaschuso.so.ch/public/ksso/rest/v1/me/grades", {

		headers:{
			"Authorization":`Bearer ${token}`
		}		

	}).then(res => res.json())

	return res

}

async function getExams(token){


	let res = await fetch("https://kaschuso.so.ch/public/ksso/rest/v1/me/exams", {

		headers:{
			"Authorization":`Bearer ${token}`
		}		

	}).then(res => res.json())

	return res

}

async function getEvents(token, period){
	
	let [firstdate, lastdate] = period || getCurrentWeek()


	let res = await fetch(`https://kaschuso.so.ch/public/ksso/rest/v1/me/events?min_date=${firstdate}&max_date=${lastdate}`, {

		headers:{
			"Authorization":`Bearer ${token}`
		}		

	}).then(res => res.json())

	return res

}


module.exports = {
	getToken, 
	getGrades, 
	getEvents, 
	getExams
}
