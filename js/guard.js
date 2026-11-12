async function guard(requiredRole) {
    const { data: { session } } = await db.auth.getSession();
    if (!session) { window.location.href = "index.html"; return; }
    const { data: profile } = await db.from("profiles").select("full_name, role").eq("id", session.user.id).single();
    if (!profile || profile.role !== requiredRole) { window.location.href = "index.html"; return; }
    document.getElementById("welcome").textContent = "Welcome, " + profile.full_name;
    document.body.classList.remove("hidden");
}

async function logout() {
    await db.auth.signOut();
    window.location.href = "index.html";
}
