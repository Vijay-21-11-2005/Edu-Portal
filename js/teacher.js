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

let generated = null;

async function loadQuizCourses() {
    const { data: { session } } = await db.auth.getSession();
    const { data } = await db.from("courses").select("id, code, name").eq("teacher_id", session.user.id);
    const sel = document.getElementById("quiz-course");
    sel.innerHTML = "";
    data.forEach(c => {
        const o = document.createElement("option");
        o.value = c.id;
        o.textContent = c.code + " - " + c.name;
        sel.appendChild(o);
    });
}

document.getElementById("gen-btn").addEventListener("click", async () => {
    const topic = document.getElementById("quiz-topic").value.trim();
    const count = document.getElementById("quiz-count").value;
    const box = document.getElementById("quiz-preview");
    if (!topic) return;
    box.textContent = "Generating...";
    const { data, error } = await db.functions.invoke("generate-quiz", { body: { topic, count } });
    if (error) { box.textContent = error.context ? await error.context.text() : error.message; return; }
    if (data.error) { box.textContent = data.error; return; }
    generated = data.questions;
    box.innerHTML = "";
    generated.forEach((q, i) => {
        const p = document.createElement("p");
        p.textContent = (i + 1) + ". " + q.question + " [" + q.options.join(" | ") + "] Answer: " + q.options[q.answer];
        box.appendChild(p);
    });
    document.getElementById("save-btn").classList.remove("hidden");
});

document.getElementById("save-btn").addEventListener("click", async () => {
    const { data: { session } } = await db.auth.getSession();
    const course_id = document.getElementById("quiz-course").value;
    const title = document.getElementById("quiz-topic").value.trim();
    const { error } = await db.from("quizzes").insert({ course_id, created_by: session.user.id, title, questions: generated });
    document.getElementById("quiz-preview").textContent = error ? error.message : "Quiz saved.";
    document.getElementById("save-btn").classList.add("hidden");
});
async function loadResults() {
    const { data, error } = await db.from("quiz_results").select("score, total, created_at, quizzes(title), profiles(full_name)").order("created_at", { ascending: false });
    const table = document.getElementById("results");
    if (error) { table.textContent = error.message; return; }
    if (data.length === 0) { table.textContent = "No attempts yet."; return; }
    table.innerHTML = "<tr><th>Student</th><th>Quiz</th><th>Score</th><th>Date</th></tr>";
    data.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td><td></td><td></td>";
        tr.children[0].textContent = r.profiles ? r.profiles.full_name : "Unknown";
        tr.children[1].textContent = r.quizzes.title;
        tr.children[2].textContent = r.score + " / " + r.total;
        tr.children[3].textContent = new Date(r.created_at).toLocaleDateString();
        table.appendChild(tr);
    });
}
