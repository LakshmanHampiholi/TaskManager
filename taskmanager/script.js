
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('task');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('taskList');
    const container2 = document.querySelector('.container2');

    if (taskInput.value.trim() !== "") {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskText = document.createElement('span');
        taskText.textContent = taskInput.value;

        const actionIcons = document.createElement('div');
        actionIcons.className = 'action-icons';

        const removeIcon = createIcon('fas fa-trash', function () {
            removeTask(taskItem);
        });

        const completeIcon = createIcon('fas fa-check', function () {
            toggleComplete(taskText); 
        });

        const editIcon = createIcon('fas fa-edit', function () {
            editTask(taskItem, taskText.textContent);
        });

        actionIcons.appendChild(removeIcon);
        actionIcons.appendChild(completeIcon);
        actionIcons.appendChild(editIcon);

        taskItem.appendChild(taskText);
        taskItem.appendChild(actionIcons);

        
        switch (priorityInput.value) {
            case 'low':
                taskItem.style.backgroundColor = '#d3ffd3'; 
                break;
            case 'medium':
                taskItem.style.backgroundColor = '#fffacd'; 
                break;
            case 'high':
                taskItem.style.backgroundColor = '#ffb6b6'; 
                break;
            default:
                break;
        }

        
        taskItem.dataset.priority = priorityInput.value;

        taskList.appendChild(taskItem);
        taskInput.value = "";

        saveTasks();

        updateContainer2Visibility();
    }
}

function removeTask(taskItem) {
    const taskList = document.getElementById('taskList');
    taskList.removeChild(taskItem);

    saveTasks();

    updateContainer2Visibility();
}

function toggleComplete(taskText) {
    taskText.classList.toggle('completed');

    saveTasks();
}

function editTask(taskItem, currentText) {
    const taskText = taskItem.querySelector('span');
    const editInput = document.createElement('input');
    editInput.className = 'edit-task-input';
    editInput.value = currentText;

    const editButton = document.createElement('button');
    editButton.className = 'edit-task-input-button';
    editButton.textContent = 'Save';
    editButton.onclick = function () {
        taskText.textContent = editInput.value;
        taskItem.removeChild(editInput);
        taskItem.removeChild(editButton);

        // Save tasks in L, no pussy here
        saveTasks();

  
        updateContainer2Visibility();
    };

    taskItem.appendChild(editInput);
    taskItem.appendChild(editButton);
}

function createIcon(className, clickHandler) {
    const icon = document.createElement('i');
    icon.className = className;
    icon.onclick = clickHandler;
    return icon;
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children).map(taskItem => {
        return {
            text: taskItem.querySelector('span').textContent,
            priority: getTaskPriority(taskItem),
            completed: taskItem.querySelector('span').classList.contains('completed') // Check completed class on span
        };
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';

            const taskText = document.createElement('span');
            taskText.textContent = task.text;

            const actionIcons = document.createElement('div');
            actionIcons.className = 'action-icons';

            const removeIcon = createIcon('fas fa-trash', function () {
                removeTask(taskItem);
            });

            const completeIcon = createIcon('fas fa-check', function () {
                toggleComplete(taskText); 
            });

            const editIcon = createIcon('fas fa-edit', function () {
                editTask(taskItem, taskText.textContent);
            });

            actionIcons.appendChild(removeIcon);
            actionIcons.appendChild(completeIcon);
            actionIcons.appendChild(editIcon);

            taskItem.appendChild(taskText);
            taskItem.appendChild(actionIcons);

            switch (task.priority) {
                case 'low':
                    taskItem.style.backgroundColor = '#d3ffd3';
                    break;
                case 'medium':
                    taskItem.style.backgroundColor = '#fffacd'; 
                    break;
                case 'high':
                    taskItem.style.backgroundColor = '#ffb6b6'; 
                    break;
                default:
                    break;
            }

            if (task.completed) {
                taskText.classList.add('completed');
            }

      
            taskItem.dataset.priority = task.priority;

            taskList.appendChild(taskItem);
        });
    }

  
    updateContainer2Visibility();
}

function getTaskPriority(taskItem) {

    return taskItem.dataset.priority || 'low';
}

function updateContainer2Visibility() {
    const taskList = document.getElementById('taskList');
    const container2 = document.querySelector('.container2');

    container2.style.display = taskList.children.length === 0 ? 'none' : 'block';
}
