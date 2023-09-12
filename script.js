
  // Array to hold the tasks.
  let tasks = []

  /**
   * Fetches tasks from the local storage and sets it to the tasks array.
   */
  function getTasksFromStorage(){
    // Retrieving tasks from local storage and parsing them into a JavaScript array.
    let retrievedTasks = JSON.parse(localStorage.getItem("tasks"));
    
    // If retrievedTasks is null or undefined, default to an empty array.
    tasks = retrievedTasks ?? [];
  }

  // Call function to fetch tasks from local storage immediately.
  getTasksFromStorage();

  /**
   * Populates the task list on the web page based on the current state of the tasks array.
   */
  function fillTaskInThePage(){
    // Clearing the tasks container.
    document.getElementById("tasks").innerHTML = "";
    let index = 0;

    // Iterating over each task and adding its HTML to the tasks container.
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
      
      document.getElementById("tasks").innerHTML += content;
      index++;
    }
  }

  // Call function to populate the tasks on the web page immediately.
  fillTaskInThePage();

  /**
   * Adds a new task.
   */
  function addTask(){
    // Fetching the current date and time in a specific format.
    let date = new Date();
    let minutes = date.getMinutes();
    
    if (minutes >= 0 && minutes < 10) {
        minutes = "0" + minutes
    }

    let fullDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} | ${date.getHours()}:${minutes}`;
    let taskTitle = prompt("What would you like to name this task?");

    // Keep prompting the user until a valid title is provided.
    while (taskTitle === "") {
      alert("Could you please provide a name for this task?");
      taskTitle = prompt("What would you like to name this task?");
    }

    // If the user didn't cancel the prompt, create a task object and add it to the tasks array.
    if (taskTitle != null) {
      let taskObj = {
        "title": taskTitle,
        "date": fullDate,
        "isDone": false
      }
      tasks.push(taskObj);
      storeTasks();  // Saving tasks to local storage.
      checkSelectStatus();
      fillTaskInThePage();  // Refreshing the tasks list on the web page.
      getSelectedOption();
    }
  }

  /**
   * Deletes the task at the specified index after a confirmation.
   * @param {number} index - The index of the task in the tasks array.
   */
  function deleteTask(index) {
    let task = tasks[index];
    let confirmationMessage = "Are you sure you want to delete: " + task.title;
    let taskElement = document.querySelectorAll(".task")[index];

    // If the user confirms the deletion, apply a fadeOut animation and then delete the task.
    if (confirm(confirmationMessage)) {
      taskElement.classList.add("animate__animated", "animate__lightSpeedOutRight");
      setTimeout(() => {
        tasks.splice(index, 1);
        storeTasks();  // Update the tasks in local storage.
        checkSelectStatus();
        fillTaskInThePage();  // Refresh the tasks list on the web page.
        getSelectedOption();
      }, 1000);
    }
  }

  /**
   * Edits the task at the specified index.
   * @param {number} index - The index of the task in the tasks array.
   */
  function editTask(index){
    let task = tasks[index];
    let newTaskTitle = prompt("What would you like to name the new task?", task.title);
    let taskElement = document.querySelectorAll(".task h2")[index];

    // If the user provides a valid new title, apply a fadeOut animation and then edit the task.
    if(newTaskTitle != null && newTaskTitle != ""){
      taskElement.classList.add("animate__animated", "animate__fadeOut");
      setTimeout(() => {
        task.title = newTaskTitle;
        storeTasks();  // Update the tasks in local storage.
        checkSelectStatus();
        fillTaskInThePage();  // Refresh the tasks list on the web page.
        getSelectedOption();
      }, 1000);
    }
  }

  /**
   * Toggles the completion status of the task at the specified index.
   * @param {number} index - The index of the task in the tasks array.
   */
  function toggleTaskCompletion(index){
    let task = tasks[index];
    let taskElement = document.querySelectorAll(".task")[index];
    taskElement.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => {
      task.isDone = !task.isDone;
      storeTasks();  // Update the tasks in local storage.
      checkSelectStatus();
      fillTaskInThePage();  // Refresh the tasks list on the web page.
      getSelectedOption();
    }, 900);
  }

  /**
   * Filters and displays tasks based on the selected filter option.
   */
  function getSelectedOption(){
    const tasksList = document.getElementById('tasks').children;
    const filterSelect = document.getElementById('filter-todo');
    const filterValue = filterSelect.value;

    // Show/Hide tasks based on the selected filter value.
    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];
      if (filterValue === 'all' || task.dataset.type === filterValue) {
        task.style.display = 'flex';
      } else {
        task.style.display = 'none';
      }
    }
  }

  /**
   * Checks the filter select status and updates it.
   */
  function checkSelectStatus(){
    const filterSelect = document.getElementById('filter-todo').value;

    // Adjusting the select index based on the current value.
    if(filterSelect == "all"){
      filterSelect.selectedIndex = 0;
    } else if(filterSelect == "complete"){
      filterSelect.selectedIndex = 1;
    }else if(filterSelect == "incomplete"){
      filterSelect.selectedIndex = 2;
    } 
  }

  /**
   * Deletes all tasks after a confirmation.
   */
  function deleteAllTasks(){
    // Confirmation message to alert the user before deleting all tasks.
    let confirmationMessage = "Warning! This action will delete ALL tasks, including any unfinished or completed ones. Are you sure you want to proceed?";
    
    // Fetch all the task elements from the DOM.
    let taskElements = document.querySelectorAll(".task");
    
    // Check if there are no tasks, then display an alert.
    if(tasks.length == 0) {
      alert("There are no tasks to delete!");
      return;
    } else if(confirm(confirmationMessage)) { // Display confirmation alert.
      // If user confirms, animate each task to fade out.
      for (let i = 0; i < taskElements.length; i++) {
        taskElements[i].classList.add("animate__animated", "animate__fadeOut");
      }

      // After the animation ends, delete all tasks and update the tasks in storage and on the page.
      setTimeout(() => {
        tasks.splice(0, tasks.length);
        storeTasks();
        fillTaskInThePage();
      }, 600);
    }
}

// Function to search for a task by its title.
function searchForTask() {
    // Fetch the search input from the user.
    const userInput = document.getElementById("search-box").value.toLowerCase();
    
    // Fetch the select filter from the DOM.
    const filterSelect = document.getElementById('filter-todo');

    // Loop through all tasks to see which one matches the search input.
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskTitle = task.title.toLowerCase();
        const taskElement = document.getElementsByClassName("task")[i];

        // If user input is empty, display all tasks.
        if(userInput == ""){
          taskElement.style.display = "flex";
          taskElement.classList.add("animate__animated", "animate__fadeIn");
        } else {
          // Show only tasks that match the user input and hide the rest.
          if (taskTitle === userInput) {
            taskElement.style.display = "flex";
            taskElement.classList.add("animate__animated", "animate__fadeIn");
          } else {
            taskElement.style.display = "none";
          }
        }   
    }
    
    // Reset the filter select to "all" after a search.
    filterSelect.selectedIndex = 0;
}  

// Function to switch between light and dark mode.
function changeBackgroundColor() {
    const toggle = document.getElementById("darkMode-btn");
    const icon = toggle.querySelector("i");
    const body = document.querySelector("body");
    const html = document.querySelector("html");
  
    // Toggle between moon and brightness icons.
    icon.classList.toggle("bi-moon-fill");
    icon.classList.toggle("bi-brightness-high-fill");
  
    // Apply dark or light mode based on the current icon.
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

// Load the background color from local storage on page load.
function loadBackgroundColor() {
    // Fetch the user's background preference from storage.
    const storedBackground = localStorage.getItem("background");
    const toggle = document.getElementById("darkMode-btn");
    const icon = toggle.querySelector("i");
    const body = document.querySelector("body");
    const html = document.querySelector("html");
  
    // Apply the stored background color.
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

// Call the loadBackgroundColor function when the page is fully loaded.
document.addEventListener("DOMContentLoaded", loadBackgroundColor);

// ============ STORAGE FUNCTION ============

// Store the current tasks in local storage.
function storeTasks(){
    let tasksString = JSON.stringify(tasks); // Convert tasks to a string format.
    localStorage.setItem("tasks", tasksString); // Store the stringified tasks.
}



