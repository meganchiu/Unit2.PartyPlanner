const COHORT = "2410-FTB-ET-WEB-ABM";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// Initialize events array
const state = {
  events: [],
}

// Asks API to retrieve events and save locally to state.events
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    console.log(response);
    const data = await response.json();
    console.log(data);
    state.events = data.data;
    console.log(state.events);
  } catch {
    console.error(error);
  }
}

// Asks API to create a new event based on the given `event` 
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    })
    const json = await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Asks API to delete given `event`
function deleteEvent() {

}

// Renders events from state.event
function renderEvents() {
  const eventElements = state.events.map((event) => {
    console.log(`event ${event}`);
    const eventElement = document.createElement('li');
    eventElement.innerHTML = 
      `<h1>${event.name}</h1>
      <p>${event.description}</p>
      <p>${event.date}</p>
      <p>${event.location}</p>`;
    return eventElement;
  })
  const content = document.querySelector('#events');
  content.replaceChildren(...eventElements);
}

// Syncs state.event with API and re renders
async function render() {
  await getEvents();
  renderEvents();
}

render();

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Assign each value from the form
  const eventToAdd = {
    name: form.eventName.value,
    description: form.eventDescription.value,
    date: new Date(form.eventDate.value).toISOString(), // 
    location: form.eventLocation.value,
  }

  // Add new event object
  await addEvent(eventToAdd);

  // Re render
  render();
})