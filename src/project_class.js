class Task {
    constructor(task) {
        this.name = task.name;
        this.due = task.due;
        this.desc = task.desc;
        this.priority = task.priority;
        this.completed = task.completed;
        this.id = task.id;
    }
}


class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    add_task(task) {
        this.tasks.push(task);
    }
    remove_task(task_id) {
        this.tasks.splice(this.tasks.findIndex(task => task.id == task_id), 1);
    }
}