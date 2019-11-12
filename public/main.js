const BASE_URL = 'https://data.police.uk/api/'

let forceChoices = document.getElementById('forceChoices')  
let clearDataButton = document.getElementById("clearData")
clearDataButton.innerText = 'Clear Data'
clearDataButton.addEventListener('click',clearData)

function clearData(){
    forceChoices.innerHTML = ''
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
    let forces = document.getElementsByClassName('location')
    loc = event.target.innerText
    //remove forces
    for(let k=0;k<forces.length;k++){
        forces[k].classList += ' no-display'
    }
    let prioritiesButton = document.createElement('button')
    prioritiesButton.classList += 'prioritiesButton'
    prioritiesButton.innerText = 'Show Priorities'
    forceChoices.append(prioritiesButton)
    prioritiesButton.addEventListener('click',showNeighborhoods)
    requestAJAX(url,(data)=>{
        let prioritiesButton = document.createElement('button')
        prioritiesButton.addEventListener('click',getPriorities)
        for(let j=0;j<data.length;j++){
            let crimeType = document.createElement('button')
            crimeType.classList += 'crimeCat'
            crimeType.id = data[j].persistent_id
            crimeType.innerText = data[j].category
            forceChoices.appendChild(crimeType)
            crimeType.addEventListener('click',showCrimeDetails)
        }
    })
}

function showNeighborhoods(){
    console.log("should find neighbordhood here somewhere")
    //using global var loc, you can find each neighborhood
    let neighbordhoodUrl = BASE_URL + '/' + loc + '/neighbourhoods'
    requestAJAX(neighbordhoodUrl,(hood)=>{
        console.log(hood)
    })
}

//https://data.police.uk/api/leicestershire/neighbourhoods
function getNeigborhood(){
    let neighborhood
    let url = BASE_URL + ''

}

function getPriorities(){

}

//GET NEIGHBORHOOD
function requestForceList(){
    let url = BASE_URL + 'forces'
    requestAJAX(url,(forces)=>{
        forces.forEach((force)=>{
            let forceButton = document.createElement('button')
            forceButton.innerText = force.id
            forceButton.classList += 'location'
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