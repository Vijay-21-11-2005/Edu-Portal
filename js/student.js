async function loadMyCourses() {
    const { data, error } = await db.from("enrollments").select("courses(code, name)");
    const table = document.getElementById("my-courses");
    if (error) { table.textContent = error.message; return; }
    if (data.length === 0) { table.textContent = "No courses yet."; return; }
    table.innerHTML = "<tr><th>Code</th><th>Name</th></tr>";
    data.forEach(en => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td>";
        tr.children[0].textContent = en.courses.code;
        tr.children[1].textContent = en.courses.name;
        table.appendChild(tr);
    });
}
