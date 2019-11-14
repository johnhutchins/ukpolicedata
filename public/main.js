const BASE_URL = 'https://data.police.uk/api/'

let neighborhoods = []

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
        //console.log(dat)
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

let hoodObj = {}
let hoodIds = []
function showNeighborhoods(){
    //using global var loc, you can find each neighborhood
    let neighbordhoodUrl = BASE_URL + '/' + loc + '/neighbourhoods'
    forceChoices.innerHTML = ''
    requestAJAX(neighbordhoodUrl,(hoods)=>{    
        for(let x=0;x<hoods.length;x++){
            let neighborhoodButton = document.createElement('button')
            neighborhoodButton.innerText = hoods[x].name
            neighborhoodButton.addEventListener('click',getPriorities)

            //TODO need to add this as an object within the "name" of the neigborhood
            hoodIds.push(hoods[x].id)
            hoodObj[hoods[x].name] = hoods[x].id
            forceChoices.appendChild(neighborhoodButton)
        }
    })
}

function getPriorities(){
    let chosenHood = event.target.innerText
    let hoodKeys = Object.keys(hoodObj)

    if(hoodKeys.includes(chosenHood)){
        let hoodId = hoodObj[chosenHood]
        //url should look like: https://data.police.uk/api/gwent/CC85/priorities
        let url = BASE_URL + loc + '/' + hoodId + '/priorities'
        console.log(url)
        forceChoices.innerHTML = ''
        requestAJAX(url,(data)=>{
            let fragment = new DocumentFragment()
            for(let z=0;z<data.length;z++){
                var parser = new DOMParser()
                var doc = parser.parseFromString(data[z].action, "text/html")
                fragment.appendChild(doc.documentElement)
            }
            forceChoices.appendChild(fragment)
        })
    }
}

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