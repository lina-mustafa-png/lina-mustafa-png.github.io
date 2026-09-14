const btn1 = document.getElementById("python-btn");
const btn2 = document.getElementById("html-btn");
const btn3 = document.getElementById("java-btn");
const btn4 = document.getElementById("c-btn");


btn1.addEventListener("click", function () {
    window.location.href = "python.html";
});

btn2.addEventListener("click", function () {
    window.location.href = "html.html";
});

btn3.addEventListener("click", function () {
    window.location.href = "java.html";
});

btn4.addEventListener("click", function () {
    window.location.href = "c.html";
});