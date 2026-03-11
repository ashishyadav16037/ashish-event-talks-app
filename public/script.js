document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  let talksData = [];

  const renderSchedule = (talks) => {
    scheduleContainer.innerHTML = '';
    let currentTime = 10 * 60; // 10:00 AM in minutes

    talks.forEach((talk, index) => {
      const startTime = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
      const endTime = `${Math.floor((currentTime + talk.duration) / 60).toString().padStart(2, '0')}:${((currentTime + talk.duration) % 60).toString().padStart(2, '0')}`;

      const talkElement = document.createElement('div');
      talkElement.classList.add('talk');
      talkElement.innerHTML = `
        <div class="time">${startTime} - ${endTime}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">By: ${talk.speakers.join(', ')}</div>
        <div class="categories">Categories: ${talk.categories.map(cat => `<span>${cat}</span>`).join('')}</div>
        <p>${talk.description}</p>
      `;
      scheduleContainer.appendChild(talkElement);

      currentTime += talk.duration;

      if (index === 2) { // Lunch break after the 3rd talk
        const breakElement = document.createElement('div');
        breakElement.classList.add('break');
        breakElement.textContent = '1:00 PM - 2:00 PM: Lunch Break';
        scheduleContainer.appendChild(breakElement);
        currentTime += 60; // 1 hour lunch break
      } else if (index < talks.length - 1) {
        currentTime += 10; // 10 minute transition
      }
    });
  };

  const fetchTalks = async () => {
    try {
      const response = await fetch('/api/talks');
      talksData = await response.json();
      renderSchedule(talksData);
    } catch (error) {
      console.error('Error fetching talks:', error);
      scheduleContainer.innerHTML = '<p>Error loading schedule. Please try again later.</p>';
    }
  };

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      const filteredTalks = talksData.filter(talk =>
        talk.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      );
      renderSchedule(filteredTalks);
    } else {
      renderSchedule(talksData);
    }
  });

  fetchTalks();
});
