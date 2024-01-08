const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

displayTodos();
createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
    const item = {
        id: new Date().getTime(),
        text: "",
        complete: false
    }
    todos.unshift(item);

    const { itemEl, inputEl } = createTodoElement(item);
    list.prepend(itemEl);
    inputEl.removeAttribute("disabled");
    inputEl.focus();

    saveToLocalStorage();
}

function createTodoElement(item) {
    const itemEl = createItemElement(item);

    const checkboxEl = createCheckBoxElement(item, itemEl);
    const inputEl = createInputElement(item);
    const actionsEl = createActionsElement(item, itemEl, inputEl);

    itemEl.append(checkboxEl, inputEl, actionsEl);
    return { itemEl, inputEl };
}

function createItemElement(item) {
    const itemEl = document.createElement("div");
    itemEl.classList.add("item");
    
    if (item.complete) {
        itemEl.classList.add("complete");
    }

    return itemEl;
}

function createCheckBoxElement(item, itemEl) {
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    checkboxEl.checked = item.complete;

    checkboxEl.addEventListener("change", () => {
        item.complete = checkboxEl.checked;
    
        if (item.complete) {
            itemEl.classList.add("complete");
        } else {
            itemEl.classList.remove("complete");
        }
    
        saveToLocalStorage();
    });

    return checkboxEl;
}

function createInputElement(item) {
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.value = item.text;
    inputEl.setAttribute("disabled", "");

    inputEl.addEventListener("input", () => {
        item.text = inputEl.value;
    });
    
    inputEl.addEventListener("blur", () => {
        inputEl.setAttribute("disabled", "");
        saveToLocalStorage();
    });

    return inputEl;
}

function createActionsElement(item, itemEl, inputEl) {
    const actionsEl = document.createElement("div");
    actionsEl.classList.add("actions");

    const editBtnEl = createEditButtonElement(inputEl);
    const removeBtnEl = createRemoveButtonElement(item, itemEl);
    actionsEl.append(editBtnEl, removeBtnEl);

    return actionsEl;
}

function createEditButtonElement(inputEl) {
    const editBtnEl = document.createElement("button");
    editBtnEl.classList.add("material-icons");
    editBtnEl.innerHTML = "edit";

    editBtnEl.addEventListener("click", () => {
        inputEl.removeAttribute("disabled");
        inputEl.focus();
    });

    return editBtnEl;
}

function createRemoveButtonElement(item, itemEl) {
    const removeBtnEl = document.createElement("button");
    removeBtnEl.classList.add("material-icons", "remove-btn");
    removeBtnEl.innerHTML = "remove_circle";
    
    removeBtnEl.addEventListener("click", () => {
        todos = todos.filter(t => t.id !== item.id);
    
        itemEl.remove();
        saveToLocalStorage();
    });

    return removeBtnEl;
}

function saveToLocalStorage() {
    const data = JSON.stringify(todos);
    
    localStorage.setItem("my_todos", data);
}

function loadFromLocalStorage() {
    todos = JSON.parse(localStorage.getItem("my_todos")) || [];    
}

function displayTodos() {
    loadFromLocalStorage();

    todos.forEach(item => {
        const { itemEl } = createTodoElement(item);

        list.append(itemEl);
    })
}