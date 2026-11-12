async function loadTeacherCourses() {
    const { data: { session } } = await db.auth.getSession();
    const { data, error } = await db.from("courses").select("id, code, name").eq("teacher_id", session.user.id);
    const table = document.getElementById("my-courses");
    if (error) { table.textContent = error.message; return; }
    if (data.length === 0) { table.textContent = "No courses assigned."; return; }
    table.innerHTML = "<tr><th>Code</th><th>Name</th></tr>";
    data.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td>";
        tr.children[0].textContent = c.code;
        tr.children[1].textContent = c.name;
        table.appendChild(tr);
    });
}
