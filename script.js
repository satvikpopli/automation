"use strict";

const btn = document.querySelector("button");
const numberInputs = document.querySelectorAll(".numb");
const url = "https://script.google.com/macros/s/AKfycbzp5mI1AAtz8iPUE9HqOxE5Hf3BsiUE4a__EZ_mDOVNLp-3_9L4eTmWgnPUBhp4qk6BXQ/exec";

numberInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
        // allow only number input (0-9) in input fields
        if (
            !(
                (e.keyCode > 95 && e.keyCode < 106) ||
                (e.keyCode > 47 && e.keyCode < 58) ||
                e.keyCode == 8
            )
        ) {
            e.preventDefault();
        }
    });
});

// GET Request for Results from API with given data
const fetchResults = async (data) => {
    const params = new URLSearchParams(data);
    const fullUrl = `${url}?${params}`;
    const res = await fetch(fullUrl);
    const data_1 = await res.json();
    return data_1.data;
};

// POST Request for Results to API with given data
const postResults = async (data, results) => {  
    data["results"] = results;
    console.log(data);
    // send data to API
    fetch(url, {
        // allow CORS
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((res) => {
        // enable button and show success message
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "#333";
        btn.disabled = false;
        btn.innerText = "Run";
        alert("Process Complete");
    }).catch((err) => {
        // enable button and show error message
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "#333";
        btn.disabled = false;
        btn.innerText = "Run";
        alert("Process Complete");
    });
};

const sendRequests = async (data, links) => {
    let results = [];
    for (let i = 0; i < links.length; i++) {
        const res = await fetch(links[i]);
        const data_1 = await res.json();
        results.push(data_1);
    }
    if (results.length > 0) {
        results = results.map((result) => {
            return result.message;
        });
        postResults(data, results);
    }
};


btn.addEventListener("click", async (e) => {
    e.preventDefault();
    // disable button and show loading spinner
    btn.style.cursor = "not-allowed";
    btn.style.backgroundColor = "#555";
    btn.disabled = true;
    btn.innerText = "Processing...";
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const links = await fetchResults(data);
    sendRequests(data, links);
});