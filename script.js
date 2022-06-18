const form = document.querySelector(".form")
const article = document.querySelector(".article")
const submitBtn = document.querySelector(".btn")
const input = document.querySelector(".input")
const spot = document.querySelector(".spot")
const clear = document.querySelector(".clear")

let editElement;
let editFlag = false
let editID = ""

//***** EVENTS LISTENERS *****
clear.addEventListener("click", clearItems)
form.addEventListener("submit", addItem)

//***** LOAD ITEMS *****
window.addEventListener("DOMContentLoaded", setUpItems)

//****** FUNCTIONS ********
function addItem(e){
    e.preventDefault()
    const value = input.value
    
    let id = new Date().getTime().toString()
    if(value && !editFlag){
        createListItem(id,value)
        clear.addEventListener("click", clearItems)
        addToLocalStorage(id, value)
        backToDefault()
    }else if(value && editFlag){
        editElement.innerHTML = value
        display("value changed", "rgb(31, 180, 31)")
        editLocalStorage(editID,value)
        backToDefault()
    }else{
        display("please input a value", "rgba(230, 53, 53, 0.7)")
        backToDefault()
    }
}

function backToDefault(){
    input.value = ""
    editFlag = false
    editID = ""
    submitBtn.textContent = "submit"
}

function editItem(e){
    let element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling
    input.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent ="edit"
}

function deteleItem(e){
    let element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    article.removeChild(element)
    display("item removed","rgba(230, 53, 53, 0.7)")
    if(article.children.length < 1){
        clear.classList.remove("show")
    }else{
         clear.classList.add("show")
    }
    backToDefault()
    removeFromLocalStorage(id)
}

function clearItems(){
    const items = document.querySelectorAll(".dom")
    items.forEach(function(item){
        article.removeChild(item)
    })
    clear.classList.remove("show")
    display("list empty", "rgba(230, 53, 53, 0.7)")
    backToDefault()
    localStorage.removeItem("list")
}

function display(content, color){
    spot.textContent = content
    spot.style.backgroundColor = color

    setTimeout(function(){
            spot.textContent = ""
            spot.style.backgroundColor = ""
        }, 1000)
}

function createListItem(id, value){
    const element = document.createElement("div")
    let attr = document.createAttribute("data-id")
    attr.value = id
    element.setAttributeNode(attr)
    element.classList.add("dom")
    element.innerHTML = `<p>${value}</p>
            <div class="icon">
                <div class="edit"><i class="fas fa-edit"></i></div>
                <div class="delete"><i class="fas fa-trash"></i></div>
            </div>`
    display("item added", "rgb(31, 180, 31)")
    clear.classList.add("show")  
    const deleteEl = element.querySelector(".delete")
    const editEl = element.querySelector(".edit")
    editEl.addEventListener("click", editItem)
    deleteEl.addEventListener("click", deteleItem)
    article.appendChild(element)
}

//***** LOCAL STORAGE*****
function addToLocalStorage(id, value){
    let grocery = {id:id, value:value}
    // above can be wrriten like grocery = {id,value} **(ES6, if the value has the same name as the property)
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem("list", JSON.stringify(items))
}

function removeFromLocalStorage(id){
    let items = getLocalStorage()
    items = items.filter(function(item){
        if(item.id !== id){
            return item
        }
    })
    localStorage.setItem("list", JSON.stringify(items))
}

function editLocalStorage(id, value){
    let items = getLocalStorage()
    items = items.map(function(item){
        if(item.id === id){
            item.value = value
        }
        return item
    })
    localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage(){
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): []
}

//***** SETUP ITEMS *****
function setUpItems(){
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        }) 
    }
    display("","")
}