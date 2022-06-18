const spot = document.querySelector(".spot")
const form = document.querySelector(".form")
const article = document.querySelector(".article")
const inputEl = document.querySelector(".input")
const formBtn = document.querySelector(".btn")
const clearBtn = document.querySelector(".clear")

let editElement;
let editFlag = false
let editID = ""
//** EVENT LISTENERS */
form.addEventListener("submit", addItem)
clearBtn.addEventListener("click", clearItem)
window.addEventListener("DOMContentLoaded", setItem)

//** FUNCTIONS */
function addItem(e){
  e.preventDefault()
  let value = inputEl.value
  let id = new Date().getTime().toString()
  
  if(value && !editFlag){
    createItem(id, value)
    display("item added", "success")
    addToLocalStorage(id, value)
    backToDefault()
  }else if(value && editFlag){
    editElement.innerHTML = value
    display("item edited", "success")
    editLocalStorage(editID, value)
    backToDefault()
  }
  else{
    display("please add an item", "failure")
    backToDefault()
  }
}

function backToDefault(){
  inputEl.value = ""
  editFlag = false
  editID = ""
  formBtn.textContent = "submit"
}

function display(text, color){
  spot.innerHTML = text
  spot.classList.add(color)

  setTimeout(function(){
    spot.innerHTML = ""
    spot.classList.remove(color)
  },1000)
}

function deleteItem(e){
  let item = e.currentTarget.parentElement.parentElement
  let id = item.dataset.id
  article.removeChild(item)
  if(article.children.length < 1){
    clearBtn.classList.remove("show")
  }else{
    clearBtn.classList.add("show")
  }
  backToDefault()
  removeFromStorage(id)
}

function editItem(e){
  let element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling
  inputEl.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.id
  formBtn.textContent = "edit"
}

function clearItem(){
  const items = document.querySelectorAll(".dom")
  items.forEach(function(item){
    article.removeChild(item)
  })
  display("item empty", "failure")
  clearBtn.classList.remove("show")
  backToDefault()
  localStorage.removeItem("list")
}

function createItem(id, value){
  let element = document.createElement("div")
  element.classList.add("dom")
  let attr = document.createAttribute("data-id")
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = ` <p>${value}</p>
                <div class="icon">
                    <div class="edit"><i class="fas fa-edit"></i></div>
                    <div class="delete"><i class="fas fa-trash"></i></div>
                </div>`
  const deleteBtn = element.querySelector(".delete")
  const editBtn = element.querySelector(".edit")
  clearBtn.classList.add("show")
  deleteBtn.addEventListener("click", deleteItem)
  editBtn.addEventListener("click", editItem)
  article.appendChild(element)
}

//** LOCAL STORAGE*/
function addToLocalStorage(id , value){
  let grocery = {id:id, value:value}
  // above can be wrriten like grocery = {id,value} **(ES6, if the value has the same name as the property)
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items))
}

function removeFromStorage(id){
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
    if(id == item.id){
      item.value = value
    }
    return item
  })
  localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage(){
  return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[]
}
//** SETUP ITEMS */
function setItem(){
  let items = getLocalStorage()
  if(items.length > 0){
    items.forEach(function(item){
    createItem(item.id, item.value)
  })
  }
}