// Smooth scroll for "Get Started" button
document.querySelector(".get-started").addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});
