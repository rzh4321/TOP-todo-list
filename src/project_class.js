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
    constructor(name, id) {
        this.name = name;
        this.tasks = [];
        this.id = id;
    }

    add_task(task) {
        this.tasks.push(task);
    }
    remove_task(task_id) {
        this.tasks.splice(this.tasks.findIndex(task => task.id == task_id), 1);
    }
}

export {Task, Project};