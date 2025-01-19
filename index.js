const COHORT = "2410-FTB-ET-WEB-ABM";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const RSVPS_API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/rsvps`;
const GUESTS_API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/guests`;

// Initialize evens, rsvps, guests arrays
const state = {
  events: [],
  rsvps: [],
  guests: []
}

// Asks API to retrieve (GET) events and save locally to state.events
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;
  } catch (error) {
    console.error(error);
  }
}

// Asks API to retrieve (GET) rsvps and save locally to state.rsvps
async function getRsvps() {
  try {
    const response = await fetch(RSVPS_API_URL);
    const data = await response.json();
    state.rsvps = data.data;
  }
  catch (error) {
    console.error(error);
  }
}

// Asks API to retrieve (GET) guests and save locally to state.guests
async function getGuests() {
  try {
    const response = await fetch(GUESTS_API_URL);
    const data = await response.json();
    state.guests = data.data;
  } catch (error) {
    console.error(error);
  }
}

// Asks API to create (POST) a new event based on the given `event` 
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    })
    const json = await response.json();
    if (json.error) {
      throw new Error(json.message);
    }
    // Re render
    render();
  } catch (error) {
    console.error(error);
  }
}

// Asks API to create (POST) a new guest based on the given `guest`
async function addGuest(guest) {
  try {
    const response = await fetch(GUESTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(guest)
    })
    const json = await response.json();
    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

// Asks API to create (POST) a new RSVP based on the given `rsvp`
async function addRsvps(rsvp) {
  try {
    const response = await fetch(RSVPS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(rsvp)
    })
    const json = await response.json();
    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

// Asks API to delete an event with the given id
async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"});
    // Throw error if the deletion was unsuccessful
    if (!response.ok) {
      throw new Error('Unable to delete the event.');
    }
    // Re render
    render();
  } catch (error) {
    console.error(error);
  }
}

// Renders dropdown for list of available guests
function renderGuestsDropdown() {
  const guestElements = state.guests.map((guest) => {
    const guestElement = document.createElement('option');
    guestElement.innerHTML = guest.name;
    guestElement.value = guest.id;
    return guestElement;
  })
  const content = document.querySelector('#guestRsvp');
  content.replaceChildren(...guestElements);
}

// Renders dropdown for list of available events
function renderEventsDropdown() {
  const eventsDropdownElements = state.events.map((event) => {
    const eventsDropdownElement = document.createElement('option');
    eventsDropdownElement.innerHTML = event.name;
    eventsDropdownElement.value = event.id;
    return eventsDropdownElement;
  })
  const content = document.querySelector('#eventRsvp');
  content.replaceChildren(...eventsDropdownElements);
}

// Renders events from state.event
function renderEvents() {
  const eventElements = state.events.map((event) => {
    const eventElement = document.createElement('li');
    const firstPart =       
      `<div id="${event.id}">
      <h1>Event Name: ${event.name}</h1>
      <p>${event.description}</p>
      <p>Date: ${event.date}</p>
      <p>Address: ${event.location}</p>
      </div>`;
    eventElement.innerHTML = firstPart;

    let secondPart = "";
    let rsvpsToEvent = [];
    let guestArr = [];
    // Find rsvps for each event
    for (let elem of state.rsvps) {
      if (elem.eventId == event.id) {
        rsvpsToEvent.push(elem);
      }
    }
    // Link guest to each rsvp of an event 
    if (rsvpsToEvent.length > 0) {
      for (let rsvp of rsvpsToEvent) {
        for (let guest of state.guests) {
          if (rsvp.guestId === guest.id) {
            guestArr.push(guest);
          }
        }
      }
      const div = document.createElement('div');
      for (let g of guestArr) {
        let x = document.createElement('li');
        x.textContent = `Guest: ${g.name}; Email: ${g.email}; Phone: ${g.phone}`;
        div.appendChild(x);
      }
      secondPart = "<ol>" + div.innerHTML + "</ol>";
    } else {
      secondPart = `There are no guests for this event.<br><br>`
    }
    eventElement.innerHTML += secondPart;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = 'Delete Event';
    eventElement.append(deleteButton);

    deleteButton.addEventListener('click', () => {
      deleteEvent(`${event.id}`);
    });

    return eventElement;
  })

  const content = document.querySelector('#events');
  content.replaceChildren(...eventElements);
}

// Syncs state.event, state.rsvps, state.guests lol with API and re renders
async function render() {
  await getEvents();
  await getRsvps();
  await getGuests();
  renderGuestsDropdown();
  renderEventsDropdown();
  renderEvents(); 
}

// ***** SCRIPT *****

render();

const form1 = document.querySelector('#addEvent');
form1.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Assign each value received from the form
  const eventToAdd = {
    name: form1.eventName.value,
    description: form1.eventDescription.value,
    date: new Date(form1.eventDate.value).toISOString(), // 
    location: form1.eventLocation.value,
  }

  // Add new event object
  await addEvent(eventToAdd);

  // Reset form after submission
  form1.eventName.value = "";
  form1.eventDescription.value = "";
  form1.eventDate.value = "";
  form1.eventLocation.value = "";

  // Re render
  render();
})

const form2 = document.querySelector('#addGuest');
form2.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Assign each value from the form
  const guestToAdd = {
    name: form2.guestName.value,
    email: form2.guestEmail.value,
    phone: form2.guestPhone.value
  }

  // Add new event object
  await addGuest(guestToAdd);

  // Reset form after submission
  form2.guestName.value = "";
  form2.guestEmail.value = "";
  form2.guestPhone.value = "";

  // Re render
  render();
})

const form3 = document.querySelector('#addRsvp');
form3.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Assign each value from the form
  const guestId = Number(form3.guest.value);
  const eventId = Number(form3.event.value);

  const guestToRsvp = {
    guestId: guestId,
    eventId: eventId,
  };

  // Add new rsvps object
  await addRsvps(guestToRsvp);

  // Re render
  render();
});
