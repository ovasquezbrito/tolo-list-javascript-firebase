const todoList = document.querySelector('#todo-list')
const formTask = document.querySelector('#form-todo-task')
const btnUpdate = document.querySelector('#update')
let updateID = null
let newTitle = ""

const listTodo = (doc) => {
    let li = document.createElement('li')
    li.className = "collection-item"
    li.setAttribute('data-id', doc.id)
    let div = document.createElement('div')
    let title = document.createElement('span')
    title.textContent = doc.data().title
    let anchor = document.createElement('a')
    anchor.href = "#modal1"
    anchor.className = "modal-trigger secondary-content"
    let btnEdit = document.createElement('i')
    btnEdit.className = "material-icons"
    btnEdit.innerText = "edit"
    /* eliminar*/
    let btnDelete = document.createElement('i')
    btnDelete.className = "material-icons secondary-content"
    btnDelete.innerText = "delete"

    anchor.appendChild(btnEdit)
    div.appendChild(title)
    div.appendChild(btnDelete)
    div.appendChild(anchor)
    li.appendChild(div)

    btnDelete.addEventListener('click', (e) => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id')
        db.collection('todos').doc(id).delete()

    })

    btnEdit.addEventListener('click', (e) => {
        updateID = e.target.parentElement.parentElement.parentElement.getAttribute('data-id')

    })

    todoList.append(li)
}

btnUpdate.addEventListener('click', (e) => {
    newTitle = document.getElementsByName('newtitle')[0].value
    db.collection('todos').doc(updateID).update({
        title: newTitle
    })

})

formTask.addEventListener('submit', (e) => {
    e.preventDefault()
    if (formTask.title.value === "") {
        return 
    }
    db.collection('todos').add({
        title: formTask.title.value
    })
    formTask.title.value = ''
})

db.collection('todos').orderBy('title').onSnapshot(snapshot => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type == 'added') {
            listTodo(change.doc)
        } else if (change.type == 'removed') {
            let li = todoList.querySelector(`[data-id=${change.doc.id}]`)
            todoList.removeChild(li)
        } else if (change.type == 'modified') {
            let li = todoList.querySelector(`[data-id=${updateID}]`)
            li.getElementsByTagName("span")[0].textContent = newTitle
            newTitle = ''
        }
    });
})