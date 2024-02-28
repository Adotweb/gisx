var navigator = {
    appName: "Netscape",
    appVersion: "5.0 (Windows)",
    appCodeName: "Mozilla",
    language: "en-US",
    plugins: [
        { name: "Adobe Acrobat", description: "Adobe PDF Plug-In For Firefox and Netscape", version: "11.0.02" },
        { name: "Silverlight Plug-In", description: "5.1.50907.0", version: "5.1.50907.0" },
        { name: "Java Applet Plug-in", description: "Java 8 Update 151", version: "11.151.2.12" }
    ],
    mimeTypes: [
        { type: "application/pdf", description: "Adobe Acrobat", suffixes: "pdf" },
        { type: "application/x-silverlight-2", description: "Silverlight", suffixes: "xap" },
        { type: "application/x-java-applet;version=1.8", description: "Java", suffixes: "class" }
    ],
    platform: "Win32",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
};


(async () => {

	const prefetch = await fetch("https://kaschuso.so.ch/login/sls/auth?RequestedPage=%2fksso") 


	let prefetchtext = await prefetch.text()


	let currentRequestedPage = [...prefetchtext.match(/value="[^"]+"/g)][0].split("=")[1].replaceAll(`"`, "")

	

	let Cookie = prefetch.headers.get("set-cookie")

	const script1 = await fetch("https://kaschuso.so.ch/sil-bid-check/ses.js", {
		headers:{
			Cookie
		}
	}).then(res => res.text())

	
	let seed1 = [...script1.match(/"?[^"]+="/g)][0].replaceAll(`"`, "").replaceAll("?", "").replaceAll("=", "")

	eval(script1) 

	let genBid1 = getBid

	let page1 = await fetch("")	


	console.table({seed1, transformed1: genBid1(seed1), currentRequestedPage})
})()
