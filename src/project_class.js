class Task {
    constructor(task) {
        this.name = task.name;
        this.due = task.due;
        this.desc = task.desc;
        this.priority = task.priority;
        this.id = task.id;
        this.completed = false;
    }
}


class Project {
    constructor(name, id, proj=null) {
        if (proj == null) {
            this.name = name;
            this.tasks = [];
            this.id = id;
        }
        else {
            this.name = proj.name;
            this.tasks = proj.tasks;
            this.id = proj.id;
        }
    }

    add_task(task) {
        this.tasks.push(task);
    }
    remove_task(task) {
        this.tasks.splice(this.tasks.findIndex(t => task.id == t.id), 1);
    }
}

export {Task, Project};