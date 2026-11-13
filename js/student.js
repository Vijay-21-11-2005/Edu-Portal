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
async function loadQuizzes() {
    const { data, error } = await db.from("quizzes").select("id, title, questions, courses(code)").order("created_at", { ascending: false });
    const list = document.getElementById("quiz-list");
    if (error) { list.textContent = error.message; return; }
    if (data.length === 0) { list.textContent = "No quizzes yet."; return; }
    list.innerHTML = "";
    data.forEach(q => {
        const b = document.createElement("button");
        b.textContent = q.courses.code + " - " + q.title;
        b.style.marginBottom = "8px";
        b.addEventListener("click", () => startQuiz(q));
        list.appendChild(b);
    });
}

function startQuiz(q) {
    const box = document.getElementById("quiz-box");
    box.innerHTML = "";
    const title = document.createElement("h2");
    title.textContent = q.title;
    box.appendChild(title);
    q.questions.forEach((item, i) => {
        const p = document.createElement("p");
        p.textContent = (i + 1) + ". " + item.question;
        p.style.margin = "12px 0 6px";
        box.appendChild(p);
        item.options.forEach((opt, j) => {
            const label = document.createElement("label");
            label.style.display = "block";
            label.style.fontSize = "14px";
            const r = document.createElement("input");
            r.type = "radio";
            r.name = "q" + i;
            r.value = j;
            r.style.width = "auto";
            r.style.margin = "0 8px 0 0";
            label.appendChild(r);
            label.appendChild(document.createTextNode(opt));
            box.appendChild(label);
        });
    });
    const submit = document.createElement("button");
    submit.textContent = "Submit";
    submit.style.marginTop = "16px";
    const result = document.createElement("p");
    result.style.margin = "12px 0";
    submit.addEventListener("click", async () => {
        let score = 0;
        q.questions.forEach((item, i) => {
            const picked = box.querySelector("input[name=q" + i + "]:checked");
            if (picked && Number(picked.value) === item.answer) score++;
        });
        submit.disabled = true;
        const { data: { session } } = await db.auth.getSession();
        const { error } = await db.from("quiz_results").insert({ quiz_id: q.id, student_id: session.user.id, score, total: q.questions.length });
        result.textContent = error ? error.message : "Score: " + score + " / " + q.questions.length + " (saved)";
        loadResults();
    });
    box.appendChild(submit);
    box.appendChild(result);
}
async function loadResults() {
    const { data, error } = await db.from("quiz_results").select("score, total, created_at, quizzes(title)").order("created_at", { ascending: false });
    const table = document.getElementById("my-results");
    if (error) { table.textContent = error.message; return; }
    if (data.length === 0) { table.textContent = "No attempts yet."; return; }
    table.innerHTML = "<tr><th>Quiz</th><th>Score</th><th>Date</th></tr>";
    data.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td></td><td></td><td></td>";
        tr.children[0].textContent = r.quizzes.title;
        tr.children[1].textContent = r.score + " / " + r.total;
        tr.children[2].textContent = new Date(r.created_at).toLocaleDateString("en-GB").replaceAll("/", "-");
        table.appendChild(tr);
    });
}
