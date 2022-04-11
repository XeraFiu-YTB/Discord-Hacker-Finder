
const fs = require("fs")
let error = 0

;(async() => {

    let data_raw = await getDataFromFile("./sample.json")
    let data_filtered = await getDataFromDates(data_raw, "2022-03-05", "2022-03-15")

    let data_interesting = await getInterestingDataOnStart(data_filtered)
    
    let data_ip = await removeDuplicatesIP(data_interesting)
    console.table(data_ip)

    console.log(`${error} errors`)
})()

async function getDataFromFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (err, res) => {
            if (err) reject(err)
            let data = []
            res = res.split("\r\n")
            res.forEach(arr => {
                try {
                    data.push(JSON.parse(arr))
                } catch(err) {
                    error = error + 1
                }
            })
            resolve(data)
        })
    })
}

async function getDataFromDates(data, date1, date2) {
    data1 = new Date(date1)
    data2 = new Date(date2)

    return new Promise((resolve, reject) => {
        let new_data = []
        data.forEach(arr => {
            if (arr._ingest_ts >= date1 && arr._ingest_ts <= date2) {
                new_data.push(arr)
            }
        })
        resolve(new_data)
    })
}

async function getInterestingDataOnStart(data) {
    return new Promise((resolve, reject) => {
        let new_data = []
        data.forEach(arr => {
            if(arr.event_type != "session_start") return
            new_data.push({
                event_type: arr.event_type,
                _ingest_ts: arr._ingest_ts,
                isp: arr.isp,
                ip: arr.ip,
                city: arr.city,
                region_code: arr.region_code,
                country_code: arr.country_code,
                day: arr.day,
                user_is_authenticated: arr.user_is_authenticated,
                cpu_core_count: arr.cpu_core_count
            })
        })
        new_data.sort((a, b) => {
            return new Date(a._ingest_ts) -  new Date(b._ingest_ts)
        })
        resolve(new_data)
    })
}

async function removeDuplicatesIP(data_interesting) {
    return new Promise((resolve, reject) => {
        
        let uniqueIp = data_interesting.filter((element, index) => {
            return data_interesting.findIndex(el => el.ip == element.ip) == index
        })
        resolve(uniqueIp)
    })
}