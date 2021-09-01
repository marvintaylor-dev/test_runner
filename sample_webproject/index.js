
//select our form and listen for a submit event
document.querySelector('form').addEventListener('submit', (event) => {
    //stop the default behavior of submission
    event.preventDefault();
    //destructure off the value from the input
    const { value } = document.querySelector('input');

    //header will display the results of the conditional below
    const header = document.querySelector('h1')
    //check to see if input is a valid email by checking for an @ 
    if (value.includes('@')) {
        //must be valid
        header.innerHTML = 'Looks Good!';
    } else {
        //must be invalid
        header.innerHTML = 'Invalid Email';
    }
})