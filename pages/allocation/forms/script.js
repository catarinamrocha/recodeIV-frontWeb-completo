//precisa mudar para chamar o local do servidor correto...
const apiUrl = "https://projeto-recodeiv.herokuapp.com/allocations";
const apiUrlProfessor = "https://projeto-recodeiv.herokuapp.com/professors";
const apiUrlCourse = "https://projeto-recodeiv.herokuapp.com/courses";
//...até aqui

const form = document.querySelector("form");

let id = 0;

const verifyId = async () => {
    await loadSelect();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');
    if(id) {
      const title = document.getElementById("title-form");
      title.innerText = "Edit Allocation";
      getData(id);
    }
};

const getData = async (id) => {
  const response = await fetch(apiUrl + `/${id}`);
  if(response.ok) {
    const data = await response.json();
    //precisa mudar para ficar igual à nomenclatura do backend...
    document.getElementById("professor").value = data.professor.id;
    document.getElementById("course").value = data.course.id;
    document.getElementById("day").value = data.days;
    document.getElementById("start").value = data.stringify(start_hour);
    document.getElementById("end").value = data.stringify(end_hour);
    // até aqui
  }
};

const loadSelect = async () => {
  const professor = document.getElementById("professor");
  const course = document.getElementById("course");
  const responseProfessor = await fetch(apiUrlProfessor);
  const responseCourse = await fetch(apiUrlCourse);
  if (responseProfessor.ok || responseCourse.ok) {
    const dataProfessor = await responseProfessor.json();
    const dataCourse = await responseCourse.json();
    for (let i = 0; i < dataProfessor.length; i++) {
      //precisa mudar para ficar igual à nomenclatura do backend...
      professor.innerHTML += `
      <option value="${dataProfessor[i].id}">${dataProfessor[i].name}</option>
      `;
    }
    for (let i = 0; i < dataCourse.length; i++) {
      course.innerHTML += `
      <option value="${dataCourse[i].id}">${dataCourse[i].name}</option>
      `;
      //...até aqui
    }
  }

  const daysOfWeek = [];
  daysOfWeek.push("Sunday");
  daysOfWeek.push("Monday");
  daysOfWeek.push("Tuesday");
  daysOfWeek.push("Wednesday");
  daysOfWeek.push("Thursday");
  daysOfWeek.push("Friday");
  daysOfWeek.push("Saturday");
  const optionsDays = daysOfWeek.map(day => {
    return `<option value="${day.toUpperCase()}">${day}</option>`
  });
  document.getElementById("day").innerHTML += optionsDays;

  const hours = [...Array(24).keys()];  
  const optionsHours = hours.map(hour => {
    return `<option value="${hour}">${hour}:00:00</option>`
  });
  document.getElementById("start").innerHTML += optionsHours;
  document.getElementById("end").innerHTML += optionsHours;
}

verifyId();

const save = (e) => {
  e.preventDefault();

  const professorId = parseInt(document.getElementById("professor").value);
  const courseId = parseInt(document.getElementById("course").value);
  const dayOfWeek = document.getElementById("day").value.trim();
  const startHour = document.getElementById("start").value;
  const endHour = document.getElementById("end").value;
  if (!professorId || !courseId || !dayOfWeek || !startHour || !endHour) {
    alert("All inputs are necessary!");
    return;
  }

  const method = id ? "PUT" : "POST";
  let url = apiUrl;
  if (id) {
    url = apiUrl + `/${id}`;
  }

//precisa mudar para ficar igual à nomenclatura do backend...
  const objRequest = {
    days: dayOfWeek,
    start_hour: convertToDate(startHour),
    end_hour: convertToDate(endHour),
    professor: {
      id: professorId
    },
    course: {
      id: courseId
    }
  };
  //...até aqui
  //console.log(objRequest);
  makeRequest(objRequest, method, url);
}

function convertToDate(hour) {
  const today = new Date();
  return new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${hour}:00:00`);
}

async function makeRequest(data, method, url) {
  const res = await fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  });

  if(!res.ok) {
    alert(`${res.status} - ${res.statusText}`);
    return;
  }

  const jsonResult = await res.json();
  if(JSON.stringify(jsonResult).includes("message")) {
    alert(jsonResult.message);
  }else {
    location.href = '../';
  }
};

form.addEventListener("submit", save);

document.getElementById("cancel").addEventListener("click", () => {
  location.href = '../';
});
