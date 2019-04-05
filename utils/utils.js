const baseUrl = ''
export function request (options, sucCallback) {
	let url = options.url || ''
	let data = options.data || {}
	let method = options.method || 'GET'
	let header = {
		"X-DEFINED-appinfo": {
			"channel": "UAT\U6e20\U9053",
			"model": "iPhone 6",
			"os": "iOS 10.1.1",
			"verName": "2.4.0.0",
			"deviceID": "F1ACFAAF-7F7E-4B4D-981D-AF31A4E0B65C"
    }
	}
	uni.request({
		url: baseUrl + url,
		// data,
		method,
		header: header,
		success: (res) => {
			sucCallback && sucCallback(res)
		}
	})
}
