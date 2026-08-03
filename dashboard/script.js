async function loadDashboard() {

    const response = await fetch("/dashboard/stats");
    const data = await response.json();

    document.getElementById("totalRequests").innerText =
        data.total_requests;

    document.getElementById("blockedRequests").innerText =
        data.blocked_requests;

    document.getElementById("successRequests").innerText =
        data.success_requests;

    document.getElementById("systemHealth").innerText =
        data.system_health;

    // Added attack attempts data binding mapping
    document.getElementById("attackAttempts").innerText =
        data.attack_attempts;

    const ctx = document.getElementById("requestChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Total",
                "Success",
                "Blocked"
            ],
            datasets: [{
                label: "Requests",
                data: [
                    data.total_requests,
                    data.success_requests,
                    data.blocked_requests
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white"
                    }
                },
                x: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });

    // Added Pie Chart initialization logic right after the bar chart
    const pieCtx = document
        .getElementById("pieChart")
        .getContext("2d");

    new Chart(pieCtx, {

        type: "pie",

        data: {

            labels: [
                "Success",
                "Blocked"
            ],

            datasets: [{

                data: [
                    data.success_requests,
                    data.blocked_requests
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {
                        color: "white"
                    }

                }

            }

        }

    }); 

}

loadDashboard();

// Added function to fetch and render recent log entries
async function loadActivity() {

    const response = await fetch("/dashboard/activity");

    const data = await response.json();

    const table = document.getElementById("activityTable");

    table.innerHTML = "";

    data.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${item.username}</td>
                <td>${item.role}</td>
                <td>${item.status}</td>
                <td>${item.prompt}</td>
                <td>${item.timestamp}</td>
            </tr>
        `;

    });

}

loadActivity();
