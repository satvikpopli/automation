"use strict";

const btn = document.querySelector("button");
const numberInputs = document.querySelectorAll(".numb");

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
    const url = "https://script.google.com/macros/s/AKfycbzJj26PGZUcm3e7Lq5AL3HYsj6PoO6eRBWaUnnMEj7SC_GOubl7JE2n1LFuy-z6D9HA/exec";
    const params = new URLSearchParams(data);
    const fullUrl = `${url}?${params}`;
    const res = await fetch(fullUrl);
    const data_1 = await res.json();
    return data_1.data;
};

// POST Request for Results to API with given data
const postResults = async (data, results) => {
    data["results"] = results;
    const url = "https://script.google.com/macros/s/AKfycbzJj26PGZUcm3e7Lq5AL3HYsj6PoO6eRBWaUnnMEj7SC_GOubl7JE2n1LFuy-z6D9HA/exec";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const data_1 = await res.json();
    console.log(data_1);
};

const sendRequests = (data, links) => {
    let results = [];
    for (let i = 0; i < links.length; i++) {
        try {
            fetch(links[i]).then((res) => {
                res.json().then((data) => {
                    results.push(data);
                }).catch((err) => {
                    results.push(err);
                });
            });
        } catch (error) {
            console.log("ERROR-1: ", error);
        }
    }
    console.log(results);
    postResults(data, results);
};


btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    const links = await fetchResults(data);
    sendRequests(data, links);
});