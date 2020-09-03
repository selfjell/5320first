function append(input) {
    let list = document.querySelector("ul")
    let newElem = document.createElement("li")
    let button = document.createElement("input")
    
    newElem.appendChild(document.createTextNode(input))
    button.setAttribute("type","button")
    button.setAttribute("value","Delete")
    button.setAttribute("onclick","deleteElem(this)")
    
    newElem.innerHTML += button.outerHTML
    list.appendChild(newElem)
}

function deleteElem(elem) {
    let country = elem.parentNode.innerText
    elem.parentNode.remove()
    let list = JSON.parse(localStorage.countries)
    let newList = []
    for(let i = 0; i<list.length; i++){
        if(list[i] !== country){
            newList.push(list[i])
        }
    }
    localStorage.countries = JSON.stringify(newList)
 }

function func(list, myFunc){
    for(let i = 0; i<list.length; i++){
        myFunc(list[i])
    }
}

function appendButtonPress(){
    let input = document.getElementById("country").value
    let url = "https://d6wn6bmjj722w.population.io/1.0/population/" + input + "/today-and-tomorrow/"
    fetch(url)
    .then(response => 
        response.json())
    .then(
        data => {
            let list = JSON.parse(localStorage.countries)
            list.push(input);
            localStorage.countries = JSON.stringify(list)
            localStorage.setItem(input.replace(" ","_"),JSON.stringify(data))
            updatePopCount(input, getFracOfDay())
        }
    )
    .catch(error => {
        window.alert("Country not recognized")
        console.log(error)
    })
    document.getElementById("country").value = ""
}

function getCountriesFromLocalStorage(){
    let list = localStorage.getItem("countries")
    if(list === null){
        list = []
        localStorage.countries = JSON.stringify(list)
    } else {
        func(JSON.parse(list), append)
    }
    window.setInterval(updateAllDisplayedPopCount,1000)
    
}

function wordMatch(element, searchWord){
    let lowerElem = element.toLowerCase()
    let searchLower = searchWord.toLowerCase()
    return lowerElem.startsWith(searchLower)
}

function filterList(list, searchWord){
    let filtered = list.filter(x => wordMatch(x,searchWord))
    return filtered
}

function filterDisplayedList(searchBox){
    clearDisplayedList()
    let list = JSON.parse(localStorage.getItem("countries"))
    let filtered = filterList(list, searchBox.value)
    filtered.map(x => {updatePopCount(x,getFracOfDay())})
}

function clearDisplayedList(){
    let ul = document.querySelector("ul")
    ul.innerHTML = ""
}

function updateAllDisplayedPopCount(){
    let fracOfDay = getFracOfDay()

    let collection = document.getElementsByTagName("li")
    
    //transform from collection to array
    let list = [].slice.call(collection); 

    clearDisplayedList()

    for(let i = 0; i<list.length; i++){
        updatePopCount(list[i].innerText.split("-")[0].trim(),fracOfDay)
    }
}

function updatePopCount(country, fracOfDay){
    let elem = country.replace(" ","_")

    let popData = JSON.parse(localStorage.getItem(elem))
    let today = popData.total_population[0].population
    let tomorrow = popData.total_population[1].population
    
    let newPop = today + ((tomorrow - today) * fracOfDay)

    let newElem = country + " - " + Math.round(newPop)
    append(newElem)
}

function getFracOfDay(){
    let d = new Date()
    let secondsSoFarInDay = (d.getHours()*3600) + (d.getMinutes()*60) + d.getSeconds()
    return (secondsSoFarInDay / 86400)
}