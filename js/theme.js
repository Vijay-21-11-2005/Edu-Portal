(function () {
    var saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.createElement("button");
        btn.id = "theme-toggle";
        btn.textContent = saved === "dark" ? "Light" : "Dark";
        btn.addEventListener("click", function () {
            var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            btn.textContent = next === "dark" ? "Light" : "Dark";
        });
        document.body.appendChild(btn);
    });
})();
