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
    container.append(title, create_buttons(proj));
}

function create_buttons(proj) {
    let btn_container = document.createElement('div');
    btn_container.classList.add('btn-container');
    let add_task_btn = document.createElement('button');
    add_task_btn.textContent = "+ add task";
    let remove_proj = document.createElement('button');
    remove_proj.textContent = "- remove project";
    remove_proj.style.backgroundColor = 'red';
    btn_container.append(add_task_btn, remove_proj);

    add_task_btn.addEventListener('click', (e) => {
        let task_form = document.getElementById(proj.id).querySelector('form');
        if (task_form == undefined) {
            alert('sdasd')
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
    let btn_container = proj_container.querySelector('.btn-container');
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
    task_id--;
    let task = new Task(task_obj);
    console.log(task);
    proj.add_task(task);
    let task_div = document.createElement('div');
    task_div.classList.add('task');
    task_div.textContent = task.name;
    task_form.remove();
    btn_container.insertAdjacentElement('beforebegin', task_div);
}