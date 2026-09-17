const sentenceBoxThingy = document.getElementById("searchInput");

const button = document.getElementById("butt");

let count = 0;

sentenceBoxThingy.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        button.click();
        count++;
    } else if (count !== 0) {
        location.reload();

        count = 0;
    }
});

function searchWord() {
    const input = document.getElementById("searchInput").value.toLowerCase().trim();

    const wordSpace = document.getElementById("show'er");

    const word = document.getElementById(input).innerHTML;

    if (!input) {
        location.reload();
    } else {
        wordSpace.innerHTML = `<div class="word"> ${word} </div>`;
    }
}