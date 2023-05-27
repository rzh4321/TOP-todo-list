import {Task, Project} from './project_class.js';
let proj_id = 0;
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
    create_empty_project(proj.name, proj.id);
})

function create_empty_project(name, id) {
    let container = document.createElement('div');
    container.classList.add('project');
    container.id = id;
    project_container.append(container);
    let title = document.createElement('span');
    title.classList.add('title');
    title.textContent = name;
    container.append(title);
}