import {Task, Project} from './project_class.js';
let proj_id = 1;
let task_id = -1;
const projs = [];

let project_container = document.querySelector('.projects');
let create_proj_btn = document.querySelector('#create-project button');
let proj_name = document.querySelector('#create-project input');

create_proj_btn.addEventListener('click', (e) => {
    let proj;
    if (proj_name.value == '') {
        proj = new Project('untitled project', proj_id);
    }
    else {
        proj = new Project(proj_name.value, proj_id)
    }
    proj_id++;
    projs.push(proj);
    create_empty_project(proj);
})



function create_empty_project(proj) {
    let container = document.createElement('div');
    container.classList.add('project');
    container.id = proj.id;
    project_container.append(container);
    let title = document.createElement('span');
    title.classList.add('title');
    title.textContent = proj.name;
    let task_container = document.createElement('ul');
    container.append(title, task_container, create_buttons(proj));
}

function create_buttons(proj) {
    let btn_container = document.createElement('div');
    btn_container.classList.add('btn-container');
    let add_task_btn = document.createElement('button');
    add_task_btn.textContent = "+ add task";
    let remove_proj = document.createElement('button');
    remove_proj.textContent = "- remove project";
    remove_proj.classList.add('red-button')
    btn_container.append(add_task_btn, remove_proj);

    add_task_btn.addEventListener('click', (e) => {
        let task_form = document.getElementById(proj.id).querySelector('form');
        // create task form since it doesnt exist yet (first time add task button is clicked)
        if (task_form == undefined) {
            task_form = document.createElement('form');
            task_form.innerHTML = `
                <label for="task_name">Name: </label>
                <input type="text" id="task_name" name="name" value="Ricky">
                <label for="due">Due: </label>
                <input type="date" id="due" name="due">
                <label for="desc">Description: </label>
                <textarea id="desc" cols="30" rows="10" name="desc"></textarea>
                <label for="priority">Priority: </label>
                <select id="priority" name="priority">
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                </select>
                <button>Done</button>
            `;
            task_form.addEventListener('submit', (e) => {
                e.preventDefault();
                add_task(task_form, proj);
            });
            btn_container.append(task_form);
        }
        else {
            task_form.classList.toggle('hidden');
        }
    });

    remove_proj.addEventListener('click', (e) => {
        projs.splice(projs.findIndex(project => project.id == proj.id), 1);
        document.getElementById(proj.id).remove();
    });
    return btn_container;
}

function add_task(task_form, proj) {
    let proj_container = document.getElementById(proj.id);
    let task_container = proj_container.querySelector('ul');

    // create task object and append to project object
    const task_name = proj_container.querySelector('#task_name').value;
    const due_date = proj_container.querySelector('#due').value;
    const description = proj_container.querySelector('#desc').value;
    const prio = proj_container.querySelector('#priority').value;
    const task_obj = {
        name: task_name,
        due: due_date,
        desc: description,
        priority : prio,
        id: task_id,
    };
    let task = new Task(task_obj);
    proj.add_task(task);

    // list item representing the task
    let task_li = document.createElement('li');
    task_li.classList.add('task');
    task_li.id = task_id;
    task_id--;
    task_li.textContent = task.name;
    // delete task form once we extracted all task information
    task_form.remove();

    task_li.addEventListener('click', (e) => {
        const selector = `[data-id="${task_li.id}"]`;
        let task_clicked = task_container.querySelector(selector);
        // create task info div since it doesnt exist yet
        if (task_clicked == undefined) {
            task_clicked = document.createElement('div');
            task_clicked.classList.add('task-clicked')
            task_clicked.dataset.id = task_li.id;
            // create mark finished and delete task buttons
            let btn_container = document.createElement('div');
            btn_container.style.cssText = "display: flex; gap: 3px;";
            let mark_finish_btn = document.createElement('button');
            let delete_task_btn = document.createElement('button');
            mark_finish_btn.textContent = 'Mark finished';
            delete_task_btn.textContent = 'Delete task';
            delete_task_btn.classList.add('red-button');
            // create due date, description, and priority info
            let date = document.createElement('span');
            date.textContent = 'Due: ' + task.date;
            let desc = document.createElement('span');
            desc.textContent = 'Description: ' + task.desc;
            let priority = document.createElement('span');
            priority.textContent = 'Priority: ' + task.priority;

            mark_finish_btn.addEventListener('click', (e) => {
                const properties = [date, desc, priority];
                // toggle task completion
                task.completed = !task.completed;
                // toggle line-through property
                for (let prop of properties) {
                    prop.classList.toggle('line-through');
                }
                // toggle button style and text
                mark_finish_btn.classList.toggle('red-button');
                mark_finish_btn.textContent = (mark_finish_btn.textContent == 'Mark finished')? 'Mark unfinished': 'Mark finished';
            });

            delete_task_btn.addEventListener('click', (e) => {
                proj.remove_task(task.id);
                task_li.remove();
                task_clicked.remove();
            });


            btn_container.append(mark_finish_btn, delete_task_btn);
            task_clicked.append(btn_container, date, desc, priority);
            task_li.insertAdjacentElement('afterend', task_clicked);
            
        }
        else {
            task_clicked.classList.toggle('hidden');
        }
    });


    task_container.append(task_li);
}