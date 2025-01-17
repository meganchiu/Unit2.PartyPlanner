const COHORT = "2410-FTB-ET-WEB-ABM";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// Initialize events array
const state = {
  events: [],
}

// Asks API to get events
// Update state.events with events from the API
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
function addEvent() {

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