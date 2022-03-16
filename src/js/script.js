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

    fetch("http://localhost/webbutv3/Moment5/rest")
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
                <td><button id="${course.id}" onclick="getCourse('${course.id}', '${course.code}', '${course.name}', '${course.progression}', '${course.syllabus}')">Redigera</button></td>
           </tr>`;
       }) 
    })
    .catch(error => {
        console.log('Error: ', error)
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
    fetch("http://localhost/webbutv3/Moment5/rest", {
        method: 'POST',
        body: JSON.stringify(jsonStr),
    })
    .then(response => { 
        response.json()
        // om text saknas i fält
        if(response.status === 400){
            message.style.color = "rgb(212, 25, 0)";
            message.innerHTML = "Alla fält måste fyllas i!";
        } else {
            // lyckad tillägg av kurs
            if(response.status === 201) {
                message.style.color = "green";
                message.innerHTML = "Kursen lades till!";
                codeInput.value = "";
                nameInput.value = "";
                progressionInput.value = "";
                syllabusInput.value = "";
                getCourses();
            // fel
            } else {
                message.style.color = "rgb(212, 25, 0)";
                message.innerHTML = "Kursen lades inte till!";
            }
        }
    }) 
    .catch(error => {
        console.log('Error: ', error)
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

// uppdatera kurs med motsvarande id
function updateCourse(id) {
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

    // alla fält måste vara ifyllda
    if(code == "" || name == "" || progression == "" || syllabus == "") {
        message.style.color = "red";
        message.innerHTML = "Fyll i alla fält!"
    } else {
        // fetch med PUT
        fetch("http://localhost/webbutv3/Moment5/rest?id=" + id, {
            method: 'PUT',
            header:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(jsonStr),
        })
        .then(response => {
            response.json()
            if(response.status === 200) {
                // lyckad uppdatering
                message.innerHTML = "Kurs uppdaterad!";
                message.style.color = "green";
            } else {
                // fel vid uppdatering
                message.innerHTML = "Kurs ej uppdaterad!";
                message.style.color = "red";
            }
        })
        .then(data => {
            location.reload();
        })
        .catch(error => {
            console.log('Error', error);
        })
    }
}

// raderar kurs med motsvarande id
function deleteCourse(id) {
    fetch("http://localhost/webbutv3/Moment5/rest?id=" + id, {
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
        console.log('Error: ', error)
    })
}