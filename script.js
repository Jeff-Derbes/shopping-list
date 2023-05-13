const itemForm = document.querySelector('#item-form')
const itemInput = document.querySelector('#item-input')
const itemList = document.querySelector('#item-list')
const clearBtn = document.querySelector('#clear')
const formBtn = itemForm.querySelector('button')
const itemFilter = document.querySelector('#filter')
let isEditMode = false

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => addItemToDOM(item))

    checkUI()
}

function onAddItemSubmit(e) {
    e.preventDefault()
    const newItem = itemInput.value

    //validate input
    if (newItem === '') {
        alert('Please add an item')
        return
    }

    // Check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode = false;
    }

    addItemToDOM(newItem)
    addItemToStorage(newItem)

    checkUI()
    itemInput.value = ''
}

function addItemToDOM(item){
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button)

    itemList.append(li)
}

function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes

    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()

    itemsFromStorage.push(item)

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

function getItemsFromStorage(){
    let itemsFromStorage;
    if (localStorage.getItem('items') === null){
        itemsFromStorage = []
    }else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    console.log(itemsFromStorage)

    return itemsFromStorage
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    }else {
        setItemToEdit(e.target)
    }
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))
    item.classList.add('edit-mode')
    formBtn.innerHTML = `<i class="fa-solid fa-pen"></i>   Update Item`
    formBtn.style.backgroundColor = '#228b22'

    itemInput.value = item.textContent
}

function removeItem(item){
    if(confirm('Are you sure?')){
        // Remove from DOM
        item.remove();

        //Remove from storage
        removeItemFromStorage(item.textContent)

        checkUI()
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage()

    itemsFromStorage = itemsFromStorage.filter(i => i!== item)
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    localStorage.removeItem('items')
    checkUI()
}

function filterItems(e){
    const text = e.target.value.toLowerCase()
    const items = itemList.querySelectorAll('li')

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase()

        if(itemName.indexOf(text) !== -1){
            item.style.display = 'flex'
        }else{
            item.style.display = 'none'
        }
    })
}

function checkUI(){
    itemInput.value = ''
    const itemFilter = document.querySelector('#filter')
    const items = itemList.querySelectorAll('li')

    if (items.length === 0){
        clearBtn.style.display = 'none'
        itemFilter.style.display = 'none'
    }else {
        clearBtn.style.display = 'block'
        itemFilter.style.display = 'block'
    }

    formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`
    formBtn.style.backgroundColor = '#333'

    isEditMode = false;
}

// initialize app
function init(){
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', clearItems)
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    checkUI();
}

init()