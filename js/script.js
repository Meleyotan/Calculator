let display = document.getElementById("calc_result");
let buttons = document.querySelectorAll(".calc_button");

buttons.forEach(button => {
    button.addEventListener("click", function () {
        display.innerHTML += button.innerHTML;
    })
});
