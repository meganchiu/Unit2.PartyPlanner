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
    const data = await response.json();
    state.events = data.data;
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
    if (!response.ok) {
      throw new Error('Unable to add the event.')
    }
    const json = await response.json();
    // Re render
    render();
  } catch (error) {
    console.error(error);
  }
}

// Asks API to delete given `event`
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

// Renders events from state.event
function renderEvents() {
  const eventElements = state.events.map((event) => {
    const eventElement = document.createElement('li');
    eventElement.innerHTML = 
      `<div id="${event.id}">
      <h1>Event Name: ${event.name}</h1>
      <p>${event.description}</p>
      <p>Date: ${event.date}</p>
      <p>Address: ${event.location}</p>
      </div>`;
    
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

// Syncs state.event with API and re renders
async function render() {
  await getEvents();
  renderEvents();
}

// ***** SCRIPT *****

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