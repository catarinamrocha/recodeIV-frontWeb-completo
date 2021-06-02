const apiUrl = "https://projeto-recodeiv.herokuapp.com/departments";
const form = document.querySelector("form");

let id = 0;

const verifyId = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');

    if(id) {
        const title = document.getElementById("title-form");
        title.innerText = "Edit Department";
        getData(id);
    }
}

const getData = async (id) => {
    const response = await fetch(apiUrl + `/${id}`);
    if(response.ok) {
        const data = await response.json();
        document.getElementById("name").value = data.name;
    }
};

verifyId();

const save = (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    if(!name) {
        alert("Department's name is necessary!");
        return;
    }

    const method = id ? "PUT" : "POST";
    let url = apiUrl;
    if(id) {
        url = apiUrl + `/${id}`;
    }

    makeRequest({name}, method, url);
}

form.addEventListener("submit", save);

async function makeRequest(data, method, url) {
    const res = await fetch(url,
        {
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
}

document.getElementById("cancel").addEventListener("click", () => {
    location.href = '../';
})