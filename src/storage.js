function get_ids() {
    let projs = JSON.parse(localStorage.getItem('projs'));
    // project has never been created before
    if (projs == null || projs.length == 0) return [1, -1];
    let proj_id = projs[projs.length - 1].id + 1
    let task_id = projs[projs.length - 1].tasks[tasks.length - 1].id - 1
    return [proj_id, task_id];
}

