
let tasks = []

function getTasksFromStorage(){
  let retrievedTasks = JSON.parse(localStorage.getItem("tasks"))
  tasks = retrievedTasks ?? []

  // if(retrievedTasks == null){
  //   tasks = []
  // }else{
  //   tasks = retrievedTasks
  // }
}

getTasksFromStorage()


function fillTaskInThePage(){
  document.getElementById("tasks").innerHTML = ""

  let index = 0
  for (var task of tasks) {
    let content = 
      `<div class="task ${task.isDone ? 'done' : ''}" data-type="${task.isDone ? 'completed' : 'incomplete'}">

        <div id="task-info">
            <h2>${task.title}</h2>
            <div>
               <i class="bi bi-calendar-week" id="task-date"></i>


              <span>
              ${task.date}
              </span>
            </div>
        </div>

        <div id="task-actions">
          <button onclick="deleteTask(${index})" style="background-color: rgb(114, 0, 0); color: white;">
            <span class="material-symbols-outlined">
              delete
            </span>
          </button>

          ${task.isDone ? `
            <button onclick="toggleTaskCompletion(${index})" style="background-color: rgb(118, 0, 101); color: white;">
                <span class="material-symbols-outlined">
                  close
                </span>
              </button>
          ` : `
            <button onclick="toggleTaskCompletion(${index})" style="background-color: #298c64; color: white;">
              <span class="material-symbols-outlined">
                done
              </span>
            </button>
          `}

          <button onclick="editTask(${index})" style="background-color: rgba(40, 22, 106, 0.692); color: white;">
            <span class="material-symbols-outlined">
              edit
            </span>
          </button>
        </div>
      </div>`

    document.getElementById("tasks").innerHTML += content
    index++
  }
}

fillTaskInThePage()

function addTask(){
  let date = new Date()
  let fullDate = date.getDate() +"/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " | " + date.getHours() + ":" + date.getMinutes()
  let taskTitle = prompt("What would you like to name this task?");

  while (taskTitle === "") {
    alert("Could you please provide a name for this task?");
    taskTitle = prompt("What would you like to name this task?");
  }

  if (taskTitle != null) {
    let taskObj = {
      "title": taskTitle,
      "date": fullDate,
      "isDone": false
    }
    tasks.push(taskObj)
    storeTasks()
    checkSelectStatus()
    fillTaskInThePage()
    getSelectedOption()
  }
}


function deleteTask(index) {
  let task = tasks[index];
  let confirmationMessage = "Are you sure you want to delete: " + task.title;
  let taskElement = document.querySelectorAll(".task")[index];

  if (confirm(confirmationMessage)) {
    // Apply the fadeOut animation
    taskElement.classList.add("animate__animated", "animate__lightSpeedOutRight");

    // Wait for the animation to complete (700ms = 0.7s)
    setTimeout(() => {
      tasks.splice(index, 1);
      storeTasks();
      checkSelectStatus();
      fillTaskInThePage();
      getSelectedOption();
    }, 1000);
  }
}

function editTask(index){
  let task = tasks[index]
  let newTaskTitle = prompt("What would you like to name the new task?", task.title);
  let taskElement = document.querySelectorAll(".task h2")[index];

  if(newTaskTitle != null && newTaskTitle != ""){

    taskElement.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => {
     task.title = newTaskTitle
     storeTasks()
     checkSelectStatus()
     fillTaskInThePage()
     getSelectedOption()
     }, 1000);
    }
  }

  function toggleTaskCompletion(index){
    let task = tasks[index]
    let taskElement = document.querySelectorAll(".task")[index];
    taskElement.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => {
      task.isDone = !task.isDone
      storeTasks()
      checkSelectStatus()
      fillTaskInThePage()
      getSelectedOption()
    }, 900)
  }

  function getSelectedOption(){
    const tasksList = document.getElementById('tasks').children;
    const filterSelect = document.getElementById('filter-todo');
    const filterValue = filterSelect.value;
    
    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];
      
      if (filterValue === 'all' || task.dataset.type === filterValue) {
        task.style.display = 'flex';
      } else {
        task.style.display = 'none';
        
      }
    }
  }

  
  function checkSelectStatus(){
    const filterSelect = document.getElementById('filter-todo').value

     if(filterSelect == "all"){
     filterSelect.selectedIndex = 0
     } else if(filterSelect == "complete"){
     filterSelect.selectedIndex = 1
     }else if(filterSelect == "incomplete"){
     filterSelect.selectedIndex = 2
     } 
  }


  function deleteAllTasks(){
    let confirmationMessage = "Warning! This action will delete ALL tasks, including any unfinished or completed ones. Are you sure you want to proceed?";
    let taskElements = document.querySelectorAll(".task")
    
    if(tasks.length == 0) {
      alert("There are no tasks to delete!")
      return;
    } else if(confirm(confirmationMessage)) {
      for (let i = 0; i < taskElements.length; i++) {
        taskElements[i].classList.add("animate__animated", "animate__fadeOut");
      }
  
      setTimeout(() => {
        tasks.splice(0, tasks.length)
        storeTasks()
        fillTaskInThePage()
      }, 600);
    }
  };

  function searchForTask() {
      const userInput = document.getElementById("search-box").value.toLowerCase();
      const filterSelect = document.getElementById('filter-todo')

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskTitle = task.title.toLowerCase();
        const taskElement = document.getElementsByClassName("task")[i];

        if(userInput == ""){
          taskElement.style.display = "flex";
          taskElement.classList.add("animate__animated", "animate__fadeIn");
        }else{
          if (taskTitle === userInput) {
            taskElement.style.display = "flex";
            taskElement.classList.add("animate__animated", "animate__fadeIn");
            
          } else {
            taskElement.style.display = "none";
          }
        }
          
      }
      filterSelect.selectedIndex = 0
    }  

  function changeBackgroundColor() {
    const toggle = document.getElementById("darkMode-btn");
    const icon = toggle.querySelector("i");
    const body = document.querySelector("body");
    const html = document.querySelector("html");
  
    // Toggle the icon classes
    icon.classList.toggle("bi-moon-fill");
    icon.classList.toggle("bi-brightness-high-fill");
  
    // Check if the 'bi-moon-fill' class is present
    if (icon.classList.contains("bi-moon-fill")) {
      body.style.background = "rgb(227 227 227)";
      html.style.background = "rgb(227 227 227)";
      localStorage.setItem("background", "light");
    } else {
      body.style.background = "rgb(54, 23, 115)";
      html.style.background = "rgb(54, 23, 115)";
      localStorage.setItem("background", "dark");
    }
  }
  
  function loadBackgroundColor() {
    const storedBackground = localStorage.getItem("background");
    const toggle = document.getElementById("darkMode-btn");
    const icon = toggle.querySelector("i");
    const body = document.querySelector("body");
    const html = document.querySelector("html");
  
    if (storedBackground === "dark") {
      body.style.background = "rgb(54, 23, 115)";
      html.style.background = "rgb(54, 23, 115)";
      icon.classList.remove("bi-moon-fill");
      icon.classList.add("bi-brightness-high-fill");
    } else {
      body.style.background = "rgb(227 227 227)";
      html.style.background = "rgb(227 227 227)";
      icon.classList.remove("bi-brightness-high-fill");
      icon.classList.add("bi-moon-fill");
    }
  }
  
  // Call the loadBackgroundColor function when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", loadBackgroundColor);

  // ============ STORAGE FUNCTION ============

  function storeTasks(){
    let tasksString = JSON.stringify(tasks)
    localStorage.setItem("tasks", tasksString)
  }



