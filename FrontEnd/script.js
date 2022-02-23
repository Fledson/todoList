const taskList = []
const completeTaskList = []

const Tasks = {
  // adicionar um novo todo
  newTask: document.querySelector('#task'),
  getTask(){
    const taskDescription = Tasks.newTask.value
      return taskDescription
  },
  addTodo(){  

    const task = Tasks.getTask()
    if(String(task).trim() === ''){
      throw new Error('Defina um nome para sua tarefa!')
    }
    const todo = {
      "id": taskList.length + 1,
      "taskDescription": `${task}`,
      "status": "Pendente"
    }
    try {
      taskList.push(todo)  
      Utils.api('/task','POST', todo)
      app.reload()
    } catch (error) {
      throw new Error('Erro ao adicionar a nova tarefa, por favor tente novamente')
    }
  },
  editTodo(index){
    const input = document.querySelector('#task')
    
    
    // input.value = taskList[index].taskDescription
    const title = tasks[index].firstChild.nextElementSibling
    console.log(title.firstChild.data)
  },
  removeTodo(index){

    taskList.splice(index, 1)
    app.reload()
      
  },
  completeTodo(index){
    const tasks = document.querySelectorAll('.taskCard')
    tasks[index].classList.toggle('complete')
    const id = tasks[index].getAttribute('id')
    Utils.api(`/completeTask/${id}`, 'POST')
    Utils.salveNewTask(index)
    Utils.filterCompleteTask(index)
    app.reload()
  },
  reopenTask(index){
    completeTaskList[index].status = 'Pendente'
    taskList.push(completeTaskList[index])
    completeTaskList.splice(index, 1)
    app.reload()
  },
  removeCompleteTodo(index){
    completeTaskList.splice(index, 1)
    app.reload()
  },
  clearValues(){
    Tasks.newTask.value = ''
  },
  submit(event) {
    event.preventDefault()

    try {
      Tasks.addTodo()
      Tasks.clearValues()
    } catch (error) {
      alert(error.message)
      console.log(error)
    }
  }
}

const domManipulation = {
  // pegando a ul aonde vou adicionar os elementos
  taskList: document.querySelector('.listTodo ul'),
  taskCompleteList: document.querySelector('.completeListTodo ul'),
  addTodoList(task, index){

    if(task.status != 'Pendente') {
      return 
    }

    // criando o elemento li que vai receber meu todo
    const li = document.createElement('li')
    li.setAttribute('class','taskCard')
    li.setAttribute('id',task.id)
    li.addEventListener('click', () => Utils.editableTask(index))
    li.addEventListener('blur',()=> Utils.salveNewTask(index))
  
    // criando o conteudo do meu li
    li.innerHTML = domManipulation.addTodoListInHtml(task, index);
    //adicioanr o li criado dentro da ul
    domManipulation.taskList.appendChild(li)
  },
  addTodoListInHtml(task, index){
    const liHtml = `
      <span class="taskTitle" onFocus=(Utils.salveNewTask(${index}))>${task.taskDescription}</span>
      <div class="actions">
        <a href="#" class="btn finish" onclick=(${task.status === 'Complete' ? `Tasks.reopenTask(${index})` : `Tasks.completeTodo(${index})`})><img src="./assets/complete.svg" alt="finalizar tarefa"></a>
        <a href="#" class="btn delete" onclick=(${task.status === 'Complete' ? `Tasks.removeCompleteTodo(${index})` : `Tasks.removeTodo(${index})`})><img src="./assets/delete.svg" alt="deletar tarefa"></a>
      </div>
    `
    return liHtml
  },
  addCompleteTodoList(task, index){
    const li = document.createElement('li')
    li.setAttribute('class','taskCard')
    task.status == 'Pendente' ? '' : li.setAttribute('class','taskCard complete')
    // criando o conteudo do meu li
    li.innerHTML = domManipulation.addTodoListInHtml(task, index);
    //adicioanr o li criado dentro da ul
    domManipulation.taskCompleteList.appendChild(li)
  }
}

const Utils = {
  filterCompleteTask(index){
    taskList[index].status = 'Complete'
    completeTaskList.push(taskList[index])
    Tasks.removeTodo(index)
    console.log(completeTaskList)
  },
  editableTask(index){
    const tasks = document.querySelectorAll('.taskCard')
    if(tasks.length > 0){
      tasks[index].childNodes[1].setAttribute('contenteditable', 'true')
    }
  },
  salveNewTask(index){
    const tasks = document.querySelectorAll('.taskCard')
    const newTask = tasks[index].childNodes[1].innerHTML
    taskList[index].taskDescription = newTask
  },
  api(rota, method, body, header){

    fetch(`http://127.0.0.1:3333${rota}`, {
      method: method, 
      headers: {
        'Access-Control-Allow-Origin':	'*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json()).then(res => console.log(res))
  }
}



const app = {
  openApi(){
    fetch('http://127.0.0.1:3333/').then(res => res.json()).then(data => {
      for (const task of data) {
        if(task.status === 'Pendente'){
          taskList.push(task)
          console.log('PENDENTE', task)
        }else{
          completeTaskList.push(task)
          console.log('COMPLETA', task)
        }

    }
    app.init()
})
  },
  init(){
    taskList.forEach((task, index) => {
      domManipulation.addTodoList(task, index)
    })
    completeTaskList.forEach((task, index) => {
      domManipulation.addCompleteTodoList(task, index)
    })
  },
  reload(){
    document.querySelector('.listTodo ul').innerHTML = ''
    document.querySelector('.completeListTodo ul').innerHTML = ''
    app.init()
  }
}

app.openApi()