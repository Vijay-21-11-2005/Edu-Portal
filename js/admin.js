async function loadUsers() {
    const { data, error } = await db.from("profiles").select("id, full_name, email, role").order("created_at");
    const table = document.getElementById("users");
    if (error) { table.textContent = error.message; return; }
    table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Role</th></tr>";
    data.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td><td><select><option>student</option><option>teacher</option><option>admin</option></select></td>";
        tr.children[0].textContent = u.full_name;
        tr.children[1].textContent = u.email;
        const sel = tr.querySelector("select");
        sel.value = u.role;
        sel.addEventListener("change", async () => {
            const { error } = await db.from("profiles").update({ role: sel.value }).eq("id", u.id);
            if (error) { alert(error.message); sel.value = u.role; return; }
            loadCourses();
        });
        table.appendChild(tr);
    });
}

async function loadCourses() {
    const { data: teachers } = await db.from("profiles").select("id, full_name").eq("role", "teacher");
    const tsel = document.getElementById("course-teacher");
    tsel.innerHTML = "<option value=''>No teacher</option>";
    teachers.forEach(t => {
        const o = document.createElement("option");
        o.value = t.id;
        o.textContent = t.full_name;
        tsel.appendChild(o);
    });
    const { data, error } = await db.from("courses").select("id, code, name, teacher_id").order("created_at");
    const table = document.getElementById("courses");
    if (error) { table.textContent = error.message; return; }
    table.innerHTML = "<tr><th>Code</th><th>Name</th><th>Teacher</th><th></th></tr>";
    data.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td><td></td><td><button>Delete</button></td>";
        tr.children[0].textContent = c.code;
        tr.children[1].textContent = c.name;
        const t = teachers.find(x => x.id === c.teacher_id);
        tr.children[2].textContent = t ? t.full_name : "None";
        tr.querySelector("button").addEventListener("click", async () => {
            await db.from("courses").delete().eq("id", c.id);
            loadCourses();
        });
        table.appendChild(tr);
    });
}

document.getElementById("course-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = document.getElementById("course-code").value.trim();
    const name = document.getElementById("course-name").value.trim();
    const teacher = document.getElementById("course-teacher").value || null;
    const { error } = await db.from("courses").insert({ code, name, teacher_id: teacher });
    if (error) { alert(error.message); return; }
    e.target.reset();
    loadCourses();
});

async function loadEnrollments() {
    const { data: students } = await db.from("profiles").select("id, full_name").eq("role", "student");
    const { data: courses } = await db.from("courses").select("id, code, name");
    const ssel = document.getElementById("enroll-student");
    const csel = document.getElementById("enroll-course");
    ssel.innerHTML = "";
    csel.innerHTML = "";
    students.forEach(s => {
        const o = document.createElement("option");
        o.value = s.id;
        o.textContent = s.full_name;
        ssel.appendChild(o);
    });
    courses.forEach(c => {
        const o = document.createElement("option");
        o.value = c.id;
        o.textContent = c.code + " - " + c.name;
        csel.appendChild(o);
    });
    const { data, error } = await db.from("enrollments").select("id, profiles(full_name), courses(code, name)");
    const table = document.getElementById("enrollments");
    if (error) { table.textContent = error.message; return; }
    table.innerHTML = "<tr><th>Student</th><th>Course</th><th></th></tr>";
    data.forEach(en => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td><td><button>Remove</button></td>";
        tr.children[0].textContent = en.profiles.full_name;
        tr.children[1].textContent = en.courses.code + " - " + en.courses.name;
        tr.querySelector("button").addEventListener("click", async () => {
            await db.from("enrollments").delete().eq("id", en.id);
            loadEnrollments();
        });
        table.appendChild(tr);
    });
}

document.getElementById("enroll-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const student_id = document.getElementById("enroll-student").value;
    const course_id = document.getElementById("enroll-course").value;
    const { error } = await db.from("enrollments").insert({ student_id, course_id });
    if (error) { alert(error.message); return; }
    loadEnrollments();
});
