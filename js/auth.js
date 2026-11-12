let mode = "login";
const form = document.getElementById("auth-form");
const message = document.getElementById("message");

document.getElementById("switch-link").addEventListener("click", (e) => {
    e.preventDefault();
    mode = mode === "login" ? "signup" : "login";
    const isLogin = mode === "login";
    document.getElementById("title").textContent = isLogin ? "Login" : "Sign up";
    document.getElementById("submit-btn").textContent = isLogin ? "Login" : "Create account";
    document.getElementById("full-name").classList.toggle("hidden", isLogin);
    document.getElementById("switch-text").textContent = isLogin ? "No account?" : "Have an account?";
    e.target.textContent = isLogin ? "Sign up" : "Login";
    message.textContent = "";
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    message.textContent = "Please wait...";

    if (mode === "signup") {
        const fullName = document.getElementById("full-name").value.trim();
        const { error } = await db.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (error) { message.textContent = error.message; return; }
        message.textContent = "Account created. Now login.";
        return;
    }

    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) { message.textContent = error.message; return; }

    const { data: profile, error: pErr } = await db.from("profiles").select("role").eq("id", data.user.id).single();
    if (pErr) { message.textContent = pErr.message; return; }
    window.location.href = profile.role + ".html";
});
