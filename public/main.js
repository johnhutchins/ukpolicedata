const BASE_URL = 'https://data.police.uk/api/'

let forceChoices = document.getElementById('forceChoices')  
let clearDataButton = document.getElementById("clearData")
clearDataButton.innerText = 'Clear Data'
clearDataButton.addEventListener('click',clearData)

function clearData(data){
    forceChoices.innerHTML = ''
    //loop through data to show the crimes here
    //forceChoices.innerHTML = data[0]
}


function showCrimeDetails(){
    let chosenCrimeId = event.srcElement.id
    let url = BASE_URL + 'outcomes-for-crime/' + chosenCrimeId
    requestAJAX(url,(dat)=>{
        console.log(dat)
        forceChoices.innerHTML = ''
        let crime = document.createElement('p')
        forceChoices.appendChild(crime)
    })
}

function showCrimes(){
    let chosenForce = event.target.innerText
    let url =  BASE_URL + 'crimes-no-location?category=all-crime&force=' + chosenForce
    requestAJAX(url,(data)=>{
        forceChoices.innerHTML = ''
        for(let j=0;j<data.length;j++){
            console.log(data[j])
            let crimeType = document.createElement('p')
            crimeType.id = data[j].persistent_id
            crimeType.innerText = data[j].category
            forceChoices.appendChild(crimeType)
            crimeType.addEventListener('click',showCrimeDetails)
        }
    })
}

//https://data.police.uk/api/leicestershire/neighbourhoods
function getNeigborhood(){
    let neighborhood
    let url = BASE_URL + ''
}


function requestForceList(){
    let url = BASE_URL + 'forces'
    requestAJAX(url,(forces)=>{
        forces.forEach((force)=>{
            let forceButton = document.createElement('button')
            forceButton.innerText = force.id
            forceButton.addEventListener('click',showCrimes)
            forceChoices.appendChild(forceButton)
        })
    })
}

//https://data.police.uk/api/forces
let showForces = document.getElementById('showForces')
showForces.addEventListener('click',requestForceList)

function requestAJAX(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText))
        }
    }
    xhr.open('GET', url, true)
    xhr.send()
}