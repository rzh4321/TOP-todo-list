import {Task, Project} from './project_class.js';

const projs = [];
let [proj_id, task_id] = get_ids();

let project_containers = document.querySelector('.projects');
let create_proj_btn = document.querySelector('#create-project button');
let proj_name = document.querySelector('#create-project input');

load_projects();

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
    create_project(proj);
})



function get_ids() {
    let projs = JSON.parse(localStorage.getItem('projs'));
    // project has never been created before
    if (projs == null || projs.length == 0) return [1, -1];
    let proj_id = projs[projs.length - 1].id + 1
    let task_id = +localStorage.getItem('task_id');
    return [proj_id, task_id];
}






function load_projects() {
    let stored_projs = JSON.parse(localStorage.getItem('projs'));
    if (stored_projs != null) {
        for (let proj of stored_projs) {
            // restore its methods after retrieving object from storage
            proj = new Project(proj.name, proj.id, proj)
            // push saved projs to current proj
            projs.push(proj)
            // add its project container back to document
            create_project(proj);
            // add its tasks back to document
            for (let task of proj.tasks) {
                add_task(proj, task);
            }
        }
    }
}


// adds project container to document, including two buttons to add task and delete project
function create_project(proj) {
    let proj_container = document.createElement('div');
    proj_container.classList.add('project');
    // associate project container with its project object
    proj_container.id = proj.id;
    project_containers.append(proj_container);
    // display project title
    let title = document.createElement('span');
    title.classList.add('title');
    title.textContent = proj.name;
    // create task container (ul element)
    let task_container = document.createElement('ul');
    // append title, task container, and buttons to proj container
    proj_container.append(title, task_container, create_buttons(proj));
}

// creates and returns "add task" and "delete project" buttons to project container
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
        create_task_form(proj, btn_container);
    });

    remove_proj.addEventListener('click', (e) => {
        if (confirm('Remove project?')) {
            projs.splice(projs.findIndex(project => project.id == proj.id), 1);
            document.getElementById(proj.id).remove();
            // remove project object from storage
            localStorage.setItem('projs', JSON.stringify(projs));
        }
    });
    return btn_container;
}

function create_task_form(proj, btn_container) {
    let task_form = document.getElementById(proj.id).querySelector('form');
    // create task form since it doesnt exist yet (first time add task button is clicked)
    if (task_form == undefined) {
        task_form = document.createElement('form');
        task_form.innerHTML = `
            <label for="task_name">Name: </label>
            <input type="text" id="task_name" name="name" value="Untitled task">
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
            add_task(proj, extract_info(task_form, proj));
        });
        btn_container.append(task_form);
    }
    else {
        task_form.classList.toggle('hidden');
    }
}

// creates and returns task object from form
function extract_info(task_form, proj) {
    const task_name = task_form.querySelector('#task_name').value;
    let due_date = task_form.querySelector('#due').value;
    // give due date default value
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
    let task = new Task(task_obj);
    proj.add_task(task);
    // update storage
    task_id--;
    localStorage.setItem('task_id', String(task_id));
    localStorage.setItem('projs', JSON.stringify(projs));

    return task;
}

// adds a task item to its task container
function add_task(proj, task_obj) {
    // get corresponding project container
    let proj_container = document.getElementById(proj.id);

    // get corresponding task container within project container
    let task_container = proj_container.querySelector('ul');

    // add task to document. list item represents the task
    let task_li = document.createElement('li');
    task_li.classList.add('task');
    task_li.id = task_obj.id;
    task_li.textContent = task_obj.name;

    // show task info when clicked
    task_li.addEventListener('click', (e) => {
        show_task_info(proj, task_container, task_obj, task_li);
    });


    task_container.append(task_li);
}

function show_task_info(proj, task_container, task_obj, task_li) {
    const selector = `[data-id="${task_li.id}"]`;
    let task_clicked = task_container.querySelector(selector);
    // create task info div since it doesnt exist yet
    if (task_clicked == undefined) {
        let task_clicked = create_task_action_info(proj, task_obj, task_li)
        task_li.insertAdjacentElement('afterend', task_clicked);
    }
    else {
        task_clicked.classList.toggle('hidden');
    }
}

function create_task_action_info(proj, task_obj, task_li) {
    // create the div that appears once task is clicked
    let task_clicked = document.createElement('div');
    task_clicked.classList.add('task-clicked')
    task_clicked.dataset.id = task_li.id;

    // create task info div
    let [due_div, desc_div, priority_div] = create_task_info(task_obj);
    const properties = [due_div, desc_div, priority_div];

    // create mark finished and delete task buttons
    let btn_container = create_task_action_buttons(proj, task_obj, task_li, properties, task_clicked);

    // append buttons and task info to task_clicked div
    task_clicked.append(btn_container, due_div, desc_div, priority_div);

    return task_clicked;
}

function create_task_action_buttons(proj, task_obj, task_li, properties, task_clicked) {
    let btn_container = document.createElement('div');
    btn_container.style.cssText = "display: flex; gap: 3px;";
    let mark_finish_btn = document.createElement('button');
    let delete_task_btn = document.createElement('button');

    // make button red and change its text depending if task is finished
    if (task_obj.completed) {
        mark_finish_btn.textContent = 'Mark unfinished';
        mark_finish_btn.classList.add('red-button');
    }
    else mark_finish_btn.textContent = 'Mark finished';

    // create delete task button
    delete_task_btn.textContent = 'Delete task';
    delete_task_btn.classList.add('red-button');


    mark_finish_btn.addEventListener('click', (e) => {
        mark_task_finished(task_obj, mark_finish_btn, properties);
    });

    delete_task_btn.addEventListener('click', (e) => {
        if (confirm('Delete task?'))  
        delete_task(proj, task_obj, task_li, task_clicked);
    });


    btn_container.append(mark_finish_btn, delete_task_btn);
    return btn_container;
}

function create_task_info(task_obj) {
    // create due date info
    let due_div = document.createElement('div');
    let due = document.createElement('span');
    due.textContent = 'Due: ';
    due.classList.add('task-info');
    due_div.append(due);
    due.insertAdjacentText('afterend', task_obj.due);

    // create description info
    let desc_div = document.createElement('div');
    let desc = document.createElement('span');
    desc.textContent = 'Description: ';
    desc.classList.add('task-info');
    desc_div.append(desc);
    desc.insertAdjacentText('afterend', task_obj.desc);

    // create priority info
    let priority_div = document.createElement('div');
    let priority = document.createElement('span');
    priority.textContent = 'Priority: ';
    priority.classList.add('task-info');
    priority_div.append(priority);
    priority.insertAdjacentText('afterend', task_obj.priority);

    // set line-through if task is finished
    const properties = [due_div, desc_div, priority_div];
    if (task_obj.completed) {
        for (let prop of properties) {
            prop.classList.toggle('line-through');
        }
    }

    return [due_div, desc_div, priority_div];
}

function mark_task_finished(task_obj, mark_finish_btn, properties) {
    // toggle task completion
    task_obj.completed = !task_obj.completed;

    // update stored project object
    localStorage.setItem('projs', JSON.stringify(projs));

    // toggle line-through property
    for (let prop of properties) {
        prop.classList.toggle('line-through');
    }
    // toggle button style and text
    mark_finish_btn.classList.toggle('red-button');
    mark_finish_btn.textContent = (mark_finish_btn.textContent == 'Mark finished')? 'Mark unfinished': 'Mark finished';
}

function delete_task(proj, task_obj, task_li, task_clicked) {
    proj.remove_task(task_obj);
    task_li.remove();
    task_clicked.remove();
    // update stored project object
    localStorage.setItem('projs', JSON.stringify(projs));
}