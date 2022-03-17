"use strict";
// variabler
let outputEl = document.getElementById("output");
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let message = document.getElementById("message");
let codeInput = document.getElementById("code");
let nameInput = document.getElementById("name");
let progressionInput = document.getElementById("progression");
let syllabusInput = document.getElementById("syllabus");

updateBtn.style.display = "none";

// event listeners
window.onload = getCourses;
addBtn.addEventListener("click", function(event){
    event.preventDefault();
    addCourse();
});

// funktioner

// hämtar kurser & skriver ut
function getCourses() {
    outputEl.innerHTML = "";

    fetch("https://studenter.miun.se/~jeno2011/writeable/DT173G/Moment5-1/rest.php")
    .then(response => response.json())
    .then(data =>{
       data.forEach(course =>{
            outputEl.innerHTML +=
           `<tr>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td id="progressionTable">${course.progression}</td>
                <td><a href="${course.syllabus}" target="_blank" >Webblänk </a></td>
                <td><button id="${course.id}" onclick="deleteCourse('${course.id}')">Radera</button></td>
           </tr>`;
       }) 
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

// lägg till ny kurs
function addCourse() {
    // lagrar input i textfälten i variabel
    let code = codeInput.value;
    let name = nameInput.value;
    let progression = progressionInput.value;
    let syllabus = syllabusInput.value;
    
    // används i json.stringify
    let jsonStr = {
        'code': code, 
        'name': name, 
        'progression': progression, 
        'syllabus': syllabus
    }
    // fetch med POST
    fetch("https://studenter.miun.se/~jeno2011/writeable/DT173G/Moment5-1/rest.php", {
        method: 'POST',
        body: JSON.stringify(jsonStr),
    })
    .then(response => { 
        response.json()
        // om text saknas i fält
        if(response.status === 400){
            message.style.color = "red";
            message.innerHTML = "Alla fält måste fyllas i!";
        } else {
            // lyckad tillägg av kurs
            if(response.status === 201) {
                message.style.color = "green";
                message.innerHTML = "Kursen lades till!";
            // fel
            } else {
                message.style.color = "red";
                message.innerHTML = "Kursen lades inte till!";
            }
        }
    })
    .then(data =>{
        getCourses();
        // efter att ha hämtat om de nya tillägget töms formuläret
        codeInput.value = "";
        nameInput.value = "";
        progressionInput.value = "";
        syllabusInput.value = "";
    }) 
    .catch(error => {
        console.log('Error: ', error);
    })
}

// hämta enskild kurs
function getCourse(id, code, name, progression, syllabus) {
    message.innerHTML = "";

    updateBtn.style.display = "block";
    addBtn.style.display = "none";

    codeInput.value = code;
    nameInput.value = name;
    progressionInput.value = progression;
    syllabusInput.value = syllabus;

    updateBtn.addEventListener("click", function(event) {
        event.preventDefault();
        updateCourse(id);
    });
}

// raderar kurs med motsvarande id
function deleteCourse(id) {
    fetch("https://studenter.miun.se/~jeno2011/writeable/DT173G/Moment5-1/rest.php?id=" + id, {
        method: 'DELETE',
    })
    .then(response =>{ 
        response.json()
        // lyckad borttagning
        message.style.color = "green";
        message.innerHTML = "Kursen är raderad!";
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}