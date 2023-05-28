import {Task, Project} from './project_class.js';

function get_ids() {
    let projs = JSON.parse(localStorage.getItem('projs'));
    // project has never been created before
    if (projs == null || projs.length == 0) return [1, -1];
    let proj_id = projs[projs.length - 1].id + 1
    let task_id = +localStorage.getItem('task_id');
    return [proj_id, task_id];
}

let [proj_id, task_id] = get_ids();

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
    localStorage.setItem('task_id', String(task_id));
    localStorage.setItem('projs', JSON.stringify(projs));
    console.log(`YOU JUST CREATED A PROJECT THAT HAS ID OF ${proj.id}`);
    console.log(localStorage);
    console.log('------------------------');
    create_project(proj);
})

load_projects();

function load_projects() {
    let projs = JSON.parse(localStorage.getItem('projs'));
    // project has never been created before
    if (projs != null) {
        console.log(`PREVIOUS PROJECTS: ${localStorage}`);
        for (let proj of projs) {
            create_project(proj);
        }
    }
    else {
        console.log('no previous projects')
    }
}



function create_project(proj) {
    let container = document.createElement('div');
    container.classList.add('project');
    // associate project div with its project object
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
                add_task(proj, extract_info(task_form));
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
        // remove project object from storage, and update array of project ids
        localStorage.setItem('projs', JSON.stringify(projs));
        console.log(`YOU JUST DELETED A PROJECT, SO UPDATED ARRAY`);
        console.log(localStorage);
        console.log('------------------------');
    });
    return btn_container;
}

function extract_info(task_form) {
    // create task object from form and return it
    const task_name = task_form.querySelector('#task_name').value;
    let due_date = task_form.querySelector('#due').value;
    if (due_date == '') due_date = 'N/A';
    const description = task_form.querySelector('#desc').value;
    const prio = task_form.querySelector('#priority').value;
    const task_obj = {
        name: task_name,
        due: due_date,
        desc: description,
        priority : prio,
        id: task_id,
    };
    // delete task form once we extracted all task information
    task_form.remove();
    return task_obj
}

// functions called when user creates new task after filling form
function add_task(proj, task_obj) {
    // get corresponding project container
    let proj_container = document.getElementById(proj.id);
    // get corresponding task container within project div
    let task_container = proj_container.querySelector('ul');

    let task = new Task(task_obj);
    proj.add_task(task);
    // update stored project object
    task_id--;
    localStorage.setItem('task_id', String(task_id));
    localStorage.setItem('projs', JSON.stringify(projs));
    console.log(`YOU JUST CREATED A TASK OF ID ${task.id} FOR PROJECT ${proj.id}. WE ADDED TASK OBJECT TO ITS ARRAY`);
    console.log(localStorage);
    console.log('------------------------');


    // list item representing the task
    let task_li = document.createElement('li');
    task_li.classList.add('task');
    task_li.id = task.id;
    task_li.textContent = task.name;

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
            date.textContent = 'Due: ' + task.due;
            let desc = document.createElement('span');
            desc.textContent = 'Description: ' + task.desc;
            let priority = document.createElement('span');
            priority.textContent = 'Priority: ' + task.priority;

            mark_finish_btn.addEventListener('click', (e) => {
                const properties = [date, desc, priority];
                // toggle task completion
                task.completed = !task.completed;
                // update stored project object
                localStorage.setItem('projs', JSON.stringify(projs));
                console.log(`YOU JUST SET TASK OF ID ${task.id} AS COMPLETE FOR PROJECT ${proj.id}`);
                console.log(localStorage);
                console.log('------------------------');
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
                // update stored project object
                localStorage.setItem('projs', JSON.stringify(projs));
                console.log(`YOU JUST DELETED TASK OF ID ${task.id} FOR PROJECT ${proj.id}. WE DELETED TASK OBJECT FROM ITS ARRAY`);
                console.log(localStorage);
                console.log('------------------------');
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