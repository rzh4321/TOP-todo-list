(()=>{"use strict";class e{constructor(e){this.name=e.name,this.due=e.due,this.desc=e.desc,this.priority=e.priority,this.id=e.id,this.completed=!1}}class t{constructor(e,t){this.name=e,this.tasks=[],this.id=t}add_task(e){this.tasks.push(e)}remove_task(e){this.tasks.splice(this.tasks.findIndex((t=>t.id==e)),1)}}let[o,n]=function(){let e=JSON.parse(localStorage.getItem("projs"));return null==e||0==e.length?[1,-1]:[e[e.length-1].id+1,+localStorage.getItem("task_id")]}();const l=[];let s=document.querySelector(".projects"),a=document.querySelector("#create-project button"),i=document.querySelector("#create-project input");function c(t,o){let a=document.createElement("div");a.classList.add("project"),a.id=t.id,s.append(a);let i=document.createElement("span");i.classList.add("title"),i.textContent=t.name;let c=document.createElement("ul");a.append(i,c,function(t){let o=document.createElement("div");o.classList.add("btn-container");let s=document.createElement("button");s.textContent="+ add task";let a=document.createElement("button");return a.textContent="- remove project",a.classList.add("red-button"),o.append(s,a),s.addEventListener("click",(s=>{let a=document.getElementById(t.id).querySelector("form");null==a?(a=document.createElement("form"),a.innerHTML='\n                <label for="task_name">Name: </label>\n                <input type="text" id="task_name" name="name" value="Ricky">\n                <label for="due">Due: </label>\n                <input type="date" id="due" name="due">\n                <label for="desc">Description: </label>\n                <textarea id="desc" cols="30" rows="10" name="desc"></textarea>\n                <label for="priority">Priority: </label>\n                <select id="priority" name="priority">\n                    <option>Low</option>\n                    <option selected>Medium</option>\n                    <option>High</option>\n                </select>\n                <button>Done</button>\n            ',a.addEventListener("submit",(o=>{o.preventDefault(),r(t,function(t,o){const s=t.querySelector("#task_name").value;let a=t.querySelector("#due").value;""==a&&(a="N/A");const i={name:s,due:a,desc:t.querySelector("#desc").value,priority:t.querySelector("#priority").value,id:n};t.remove();let c=new e(i);return o.add_task(c),n--,localStorage.setItem("task_id",String(n)),localStorage.setItem("projs",JSON.stringify(l)),console.log(`YOU JUST CREATED A TASK OF ID ${c.id} FOR PROJECT ${o.id}. WE ADDED TASK OBJECT TO ITS ARRAY`),console.log(localStorage),console.log("------------------------"),c}(a,t))})),o.append(a)):a.classList.toggle("hidden")})),a.addEventListener("click",(e=>{l.splice(l.findIndex((e=>e.id==t.id)),1),document.getElementById(t.id).remove(),localStorage.setItem("projs",JSON.stringify(l)),console.log("YOU JUST DELETED A PROJECT, SO UPDATED ARRAY"),console.log(localStorage),console.log("------------------------")})),o}(t))}function r(e,t){let o=document.getElementById(e.id).querySelector("ul"),n=document.createElement("li");n.classList.add("task"),n.id=t.id,n.textContent=t.name,n.addEventListener("click",(s=>{const a=`[data-id="${n.id}"]`;let i=o.querySelector(a);if(null==i){i=document.createElement("div"),i.classList.add("task-clicked"),i.dataset.id=n.id;let o=document.createElement("div");o.style.cssText="display: flex; gap: 3px;";let s=document.createElement("button"),a=document.createElement("button");s.textContent="Mark finished",a.textContent="Delete task",a.classList.add("red-button");let c=document.createElement("span");c.textContent="Due: "+t.due;let r=document.createElement("span");r.textContent="Description: "+t.desc;let d=document.createElement("span");d.textContent="Priority: "+t.priority,s.addEventListener("click",(o=>{const n=[c,r,d];t.completed=!t.completed,localStorage.setItem("projs",JSON.stringify(l)),console.log(`YOU JUST SET TASK OF ID ${t.id} AS COMPLETE FOR PROJECT ${e.id}`),console.log(localStorage),console.log("------------------------");for(let e of n)e.classList.toggle("line-through");s.classList.toggle("red-button"),s.textContent="Mark finished"==s.textContent?"Mark unfinished":"Mark finished"})),a.addEventListener("click",(o=>{e.remove_task(t.id),n.remove(),i.remove(),localStorage.setItem("projs",JSON.stringify(l)),console.log(`YOU JUST DELETED TASK OF ID ${t.id} FOR PROJECT ${e.id}. WE DELETED TASK OBJECT FROM ITS ARRAY`),console.log(localStorage),console.log("------------------------")})),o.append(s,a),i.append(o,c,r,d),n.insertAdjacentElement("afterend",i)}else i.classList.toggle("hidden")})),o.append(n)}a.addEventListener("click",(e=>{let s;s=""==i.value?new t("untitled project",o):new t(i.value,o),o++,l.push(s),localStorage.setItem("task_id",String(n)),localStorage.setItem("projs",JSON.stringify(l)),console.log(`YOU JUST CREATED A PROJECT THAT HAS ID OF ${s.id}`),console.log(localStorage),console.log("------------------------"),c(s)})),function(){let e=JSON.parse(localStorage.getItem("projs"));if(null!=e){console.log(`PREVIOUS PROJECTS: ${localStorage}`);for(let t of e){c(t);for(let e of t.tasks)r(t,e)}}else console.log("no previous projects")}()})();