// Initialize data from localStorage or set empty arrays/objects
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let artists = JSON.parse(localStorage.getItem('artists')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    studioName: 'Ink Studio',
    openingTime: '09:00',
    closingTime: '18:00'
};

// Page detection
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Function to save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('artists', JSON.stringify(artists));
    localStorage.setItem('settings', JSON.stringify(settings));
}
const toggleSidebar = document.getElementById('toggleSidebar');
if (toggleSidebar) {
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

// Common functions
function updateBookingsList() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;
    
    bookingsList.innerHTML = '<h3>Upcoming Bookings</h3>';
    bookings.forEach((booking) => {
        const bookingItem = document.createElement('div');
        bookingItem.classList.add('booking-item');
        bookingItem.innerHTML = `
            <span>${booking.client} - ${booking.artist} (${booking.style})</span>
            <span>${booking.date} at ${booking.time}</span>
        `;
        bookingsList.appendChild(bookingItem);
    });
}

function updateBookingsTable() {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    if (!bookingsTableBody) return;
    
    bookingsTableBody.innerHTML = '';
    bookings.forEach((booking, index) => {
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
            <span>${booking.client}</span>
            <span>${booking.artist}</span>
            <span>${booking.date}</span>
            <span>${booking.time}</span>
            <span>${booking.style}</span>
            <span>$${booking.cost || 0}</span>
            <span>${booking.paymentStatus || 'Pending'}</span>
            <span>
                <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                <button class="action-btn delete-btn" data-index="${index}">Delete</button>
            </span>
        `;
        bookingsTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            bookings.splice(index, 1);
            saveToLocalStorage();
            updateBookingsTable();
            updateBookingsList();
            updateClientsTable();
            updateArtistsTable();
            updateAnalytics();
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            alert(`Edit functionality for booking #${index} to be implemented`);
        });
    });
}

function updateClientsTable() {
    const clientsTableBody = document.getElementById('clientsTableBody');
    if (!clientsTableBody) return;
    
    clientsTableBody.innerHTML = '';
    clients.forEach((client, index) => {
        const bookingCount = bookings.filter(b => b.client === client.name).length;
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
            <span>${client.name}</span>
            <span>${client.email}</span>
            <span>${client.phone}</span>
            <span>${bookingCount}</span>
            <span>
                <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                <button class="action-btn delete-btn" data-index="${index}">Delete</button>
            </span>
        `;
        clientsTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            clients.splice(index, 1);
            saveToLocalStorage();
            updateClientsTable();
            populateClientDropdown();
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            alert(`Edit functionality for client #${index} to be implemented`);
        });
    });
}

function updateArtistsTable() {
    const artistsTableBody = document.getElementById('artistsTableBody');
    if (!artistsTableBody) return;
    
    artistsTableBody.innerHTML = '';
    artists.forEach((artist, index) => {
        const bookingCount = bookings.filter(b => b.artist === artist.name).length;
        const availabilityText = artist.availability ? 
            `${artist.availability.days.join(', ')} (${artist.availability.startTime}-${artist.availability.endTime})` : 
            'Not Set';
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
            <span>${artist.name}</span>
            <span>${artist.specialty}</span>
            <span>${artist.email}</span>
            <span>${availabilityText}</span>
            <span>${bookingCount}</span>
            <span>
                <button class="action-btn edit-btn" data-index="${index}">Edit</button>
                <button class="action-btn delete-btn" data-index="${index}">Delete</button>
            </span>
        `;
        artistsTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            artists.splice(index, 1);
            saveToLocalStorage();
            updateArtistsTable();
            populateArtistDropdown();
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            alert(`Edit functionality for artist #${index} to be implemented`);
        });
    });
}

function populateClientDropdown() {
    const clientSelect = document.getElementById('clientName');
    if (!clientSelect) return;
    
    clientSelect.innerHTML = '<option value="">Select client</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.name;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
}

function populateArtistDropdown() {
    const artistSelect = document.getElementById('artist');
    if (!artistSelect) return;
    
    artistSelect.innerHTML = '<option value="">Select artist</option>';
    artists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist.name;
        option.textContent = artist.name;
        artistSelect.appendChild(option);
    });
}

function updateAnalytics() {
    const totalBookingsEl = document.getElementById('totalBookings');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const pendingPaymentsEl = document.getElementById('pendingPayments');
    const busiestArtistEl = document.getElementById('busiestArtist');

    if (!totalBookingsEl) return;

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.cost || 0), 0);
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'Pending' || !b.paymentStatus).length;

    const artistBookings = artists.map(artist => ({
        name: artist.name,
        count: bookings.filter(b => b.artist === artist.name).length
    }));
    const busiestArtist = artistBookings.reduce((max, curr) => curr.count > max.count ? curr : max, { name: 'None', count: 0 });

    totalBookingsEl.textContent = totalBookings;
    totalRevenueEl.textContent = `$${totalRevenue}`;
    pendingPaymentsEl.textContent = pendingPayments;
    busiestArtistEl.textContent = busiestArtist.name;
}

function isArtistAvailable(artistName, date, time) {
    const artist = artists.find(a => a.name === artistName);
    if (!artist || !artist.availability) return false;

    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'short' });
    const timeInMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
    const startTimeInMinutes = parseInt(artist.availability.startTime.split(':')[0]) * 60 + parseInt(artist.availability.startTime.split(':')[1]);
    const endTimeInMinutes = parseInt(artist.availability.endTime.split(':')[0]) * 60 + parseInt(artist.availability.endTime.split(':')[1]);

    return artist.availability.days.includes(dayOfWeek) && 
           timeInMinutes >= startTimeInMinutes && 
           timeInMinutes < endTimeInMinutes;
}

// Dashboard-specific logic
if (currentPage === 'index.html' || currentPage === '') {
    // Calendar generation
    const calendar = document.getElementById('calendar');
    const daysInMonth = 31; // March 2025
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = i;
        day.addEventListener('click', () => {
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            day.classList.add('selected');
        });
        calendar.appendChild(day);
    }

    // Populate dropdowns
    populateClientDropdown();
    populateArtistDropdown();

    // Booking functionality
    const bookBtn = document.getElementById('bookBtn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const closeNotification = document.getElementById('closeNotification');

    bookBtn.addEventListener('click', () => {
        const clientName = document.getElementById('clientName').value;
        const artist = document.getElementById('artist').value;
        const time = document.getElementById('time').value;
        const style = document.getElementById('style').value;
        const selectedDay = document.querySelector('.day.selected')?.textContent;

        if (clientName && artist && time && style && selectedDay) {
            const date = `March ${selectedDay}, 2025`;
            if (!isArtistAvailable(artist, date, time)) {
                alert(`Artist ${artist} is not available on ${date} at ${time}. Please check their availability.`);
                return;
            }

            const booking = {
                client: clientName,
                artist,
                time,
                style,
                date,
                cost: Math.floor(Math.random() * 200) + 50, // Random cost $50-$250
                paymentStatus: 'Pending'
            };

            bookings.push(booking);
            saveToLocalStorage();
            updateBookingsList();
            updateBookingsTable();
            updateClientsTable();
            updateArtistsTable();
            updateAnalytics();

            notificationMessage.textContent = `Appointment with ${artist} scheduled for ${booking.date} at ${time}!`;
            notification.style.display = 'block';

            document.getElementById('clientName').value = '';
            document.getElementById('artist').value = '';
            document.getElementById('time').value = '';
            document.getElementById('style').value = '';
            document.querySelector('.day.selected')?.classList.remove('selected');
        } else {
            alert('Please fill all fields and select a date');
        }
    });

    closeNotification.addEventListener('click', () => {
        notification.style.display = 'none';
    });

    updateBookingsList();
    updateAnalytics();
}

// Bookings page-specific logic
if (currentPage === 'bookings.html') {
    updateBookingsTable();
}

// Clients page-specific logic
if (currentPage === 'clients.html') {
    const addClientBtn = document.getElementById('addClientBtn');
    addClientBtn.addEventListener('click', () => {
        const name = document.getElementById('newClientName').value;
        const email = document.getElementById('newClientEmail').value;
        const phone = document.getElementById('newClientPhone').value;

        if (name && email && phone) {
            clients.push({ name, email, phone });
            saveToLocalStorage();
            updateClientsTable();
            populateClientDropdown();

            document.getElementById('newClientName').value = '';
            document.getElementById('newClientEmail').value = '';
            document.getElementById('newClientPhone').value = '';
        } else {
            alert('Please fill all client fields');
        }
    });

    updateClientsTable();
}

// Artists page-specific logic
if (currentPage === 'artists.html') {
    const addArtistBtn = document.getElementById('addArtistBtn');
    addArtistBtn.addEventListener('click', () => {
        const name = document.getElementById('newArtistName').value;
        const specialty = document.getElementById('newArtistSpecialty').value;
        const email = document.getElementById('newArtistEmail').value;
        const days = Array.from(document.querySelectorAll('.availability-days input[name="day"]:checked')).map(input => input.value);
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        if (name && specialty && email && days.length > 0 && startTime && endTime) {
            artists.push({
                name,
                specialty,
                email,
                availability: { days, startTime, endTime }
            });
            saveToLocalStorage();
            updateArtistsTable();
            populateArtistDropdown();

            document.getElementById('newArtistName').value = '';
            document.getElementById('newArtistSpecialty').value = '';
            document.getElementById('newArtistEmail').value = '';
            document.querySelectorAll('.availability-days input').forEach(input => input.checked = false);
            document.getElementById('startTime').value = '09:00';
            document.getElementById('endTime').value = '15:00';
        } else {
            alert('Please fill all artist fields and select at least one day');
        }
    });

    updateArtistsTable();
}

// Settings page-specific logic
if (currentPage === 'settings.html') {
    const studioNameInput = document.getElementById('studioName');
    const openingTimeSelect = document.getElementById('openingTime');
    const closingTimeSelect = document.getElementById('closingTime');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const resetDataBtn = document.getElementById('resetDataBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const closeNotification = document.getElementById('closeNotification');

    // Load current settings
    studioNameInput.value = settings.studioName;
    openingTimeSelect.value = settings.openingTime;
    closingTimeSelect.value = settings.closingTime;

    saveSettingsBtn.addEventListener('click', () => {
        settings.studioName = studioNameInput.value;
        settings.openingTime = openingTimeSelect.value;
        settings.closingTime = closingTimeSelect.value;
        saveToLocalStorage();

        notificationMessage.textContent = 'Settings saved successfully!';
        notification.style.display = 'block';
    });

    resetDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
            bookings = [];
            clients = [];
            artists = [];
            settings = { studioName: 'Ink Studio', openingTime: '09:00', closingTime: '18:00' };
            saveToLocalStorage();
            updateBookingsList();
            updateBookingsTable();
            updateClientsTable();
            updateArtistsTable();
            populateClientDropdown();
            populateArtistDropdown();
            updateAnalytics();

            studioNameInput.value = settings.studioName;
            openingTimeSelect.value = settings.openingTime;
            closingTimeSelect.value = settings.closingTime;

            notificationMessage.textContent = 'All data has been reset!';
            notification.style.display = 'block';
        }
    });

    exportDataBtn.addEventListener('click', () => {
        const csvContent = [
            'Bookings\nClient,Artist,Date,Time,Style,Cost,Payment Status\n' +
            bookings.map(b => `${b.client},${b.artist},${b.date},${b.time},${b.style},${b.cost},${b.paymentStatus}`).join('\n'),
            'Clients\nName,Email,Phone\n' +
            clients.map(c => `${c.name},${c.email},${c.phone}`).join('\n'),
            'Artists\nName,Specialty,Email,Availability\n' +
            artists.map(a => `${a.name},${a.specialty},${a.email},${a.availability ? `${a.availability.days.join(';')} (${a.availability.startTime}-${a.availability.endTime})` : 'Not Set'}`).join('\n')
        ].join('\n\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'studio_data.csv';
        link.click();

        notificationMessage.textContent = 'Data exported successfully!';
        notification.style.display = 'block';
    });

    closeNotification.addEventListener('click', () => {
        notification.style.display = 'none';
    });
}
