const events = [
    {
        date: '2024-09-20',
        events: [
            { title: "Réunion d'équipe", startTime: '10h00', endTime: '11h00' },
            { title: "Déjeuner avec client", startTime: '12h30', endTime: '14h00' }
        ]
    },
    {
        date: '2024-09-22',
        events: [
            { title: 'Atelier de développement', startTime: '14h00', endTime: '16h00' }
        ]
    },
    {
        date: '2024-09-25',
        events: [
            { title: 'Présentation de projet', startTime: '16h00', endTime: '17h00' }
        ]
    }
];

const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
                "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    // Display the previous month's last days as inactive
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    // Display current month's days
    for (let i = 1; i <= lastDateofMonth; i++) {
        let dateStr = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}" data-date="${dateStr}">${i}</li>`;
    }

    // Display next month's first days as inactive
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    // Add click event listeners for each day
    const dayElements = document.querySelectorAll('.days li[data-date]');
    dayElements.forEach(dayElement => {
        dayElement.addEventListener('click', () => {
            const selectedDate = dayElement.getAttribute('data-date');
            highlightCalendarCell(selectedDate);
            highlightEvent(selectedDate);
        });
    });

    populateEventList();  // Update event list for the current month
};

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }

        renderCalendar();  // Re-render calendar after month change
    });
});

// Function to display the list of events
function populateEventList() {
    const eventListElement = document.getElementById('event-list');
    const month = currMonth;
    const year = currYear;

    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let html = '';

    // Display events for each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let eventsForDate = events.find(ev => ev.date === dateStr)?.events || [];

        html += `  
            <div class="event-list-item" data-date="${dateStr}">
              <div class="event-date bg-light-green p-2 mb-2">${new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
       
            <div class="row">
                    <div class="col-2 event-icons">
                        <button class="btn btn-light me-2" style="margin: 20% 5px 0 0;">
                        <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
              `;

        if (eventsForDate.length > 0) {
            i = 0;
            eventsForDate.forEach(event => {
                ++i;
                html += `  
                  
                        <div class="col-10 ${i > 1 ? 'offset-2':''}">
                          <div class="event-card bg-pink p-3 d-flex justify-content-between align-items-center mb-4">
                            <div class="event-info">
                              <p class="mb-1 time-range">${event.startTime} - ${event.endTime}  </p>
                              <p class="mb-0 event-title">${event.title}</p>
                            </div>
                            <div class="event-icons d-flex align-items-center">
                              <button class="btn btn-light me-2">
                                <i class="bi bi-image"></i>
                              </button>
                              <button class="btn btn-light">
                                <i class="bi bi-send"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                    
                `;
            });
        } else {
            html += `  
                 
                    <div class="col-10">
                      <div class="event-card bg-pink p-3 d-flex justify-content-between align-items-center mb-4">
                        <div class="event-info">
                          <p class="mb-0 event-title">Aucun événement</p>
                        </div>
                      </div>
                    </div>
            
            `;
        }

        html += `</div> </div>`;
    }

    eventListElement.innerHTML = html;
}

// Highlight the selected calendar cell
function highlightCalendarCell(date) {
    const cells = document.querySelectorAll('.days li[data-date]');
    cells.forEach(cell => {
        if (cell.getAttribute('data-date') === date) {
            cell.classList.add('active');
        } else {
            cell.classList.remove('active');
        }
    });
}

// Highlight the selected event
function highlightEvent(date) {
    const items = document.querySelectorAll('#event-list .event-list-item');
    items.forEach(item => {
        if (item.getAttribute('data-date') === date) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            item.classList.remove('active');
        }
    });
}

populateEventList();

document.addEventListener('DOMContentLoaded', () => {
    const eventListElement = document.getElementById('event-list');
    const calendarElement = document.querySelector('.wrapper');

    const checkFixedPosition = () => {
        const items = document.querySelectorAll('#event-list .event-list-item');
        const calendarRect = calendarElement.getBoundingClientRect();
        
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const eventDate = item.querySelector('.event-date');
            
            // 
            const element = document.querySelector(`li[data-date="${date}"]`);
            const Notelement = document.querySelectorAll(`li:not([data-date="${date}"])`);

            if (eventDate) { 
                if (itemRect.top<= calendarRect.bottom+25 ) { 
                    date = item.getAttribute('data-date');

                    eventDate.classList.add('fixed');                    

                    // Vérifier si l'élément a été trouvé, puis effectuer une action
                    if (element) {
                        element.classList.add("active");
                    }
                } else {
                    //Notelement.classList.remove("active")
                    eventDate.classList.remove('fixed');                   
                        // Exemple : changer la couleur de fond de cet élément
                        Notelement.forEach(Nitem => {
                            Nitem.classList.remove("active");
                        })
                }
            }
        });
    };

    // Initial check
    checkFixedPosition();

    // Add scroll event listener to #event-list
    eventListElement.addEventListener('scroll', checkFixedPosition);
});