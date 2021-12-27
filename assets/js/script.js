let submitBtn = document.querySelector('#submit-button');
console.log(submitBtn);

submitBtn.addEventListener('click', function() {
    event.preventDefault();
    console.log('clicked');
})