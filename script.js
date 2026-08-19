// ==========================================
// 2k2 - CRUD Profile Management System
// ==========================================
// Storage hooks ready for Vercel integration
// Replace localStorage calls with your storage API

const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('k2_users') || '[]'),
    setUsers: (data) => localStorage.setItem('k2_users', JSON.stringify(data)),
    getProviders: () => JSON.parse(localStorage.getItem('k2_providers') || '[]'),
    setProviders: (data) => localStorage.setItem('k2_providers', JSON.stringify(data)),
    getListings: () => JSON.parse(localStorage.getItem('k2_listings') || '[]'),
    setListings: (data) => localStorage.setItem('k2_listings', JSON.stringify(data)),
    getVenues: () => JSON.parse(localStorage.getItem('k2_venues') || '[]'),
    setVenues: (data) => localStorage.setItem('k2_venues', JSON.stringify(data)),
    clearAll: () => { localStorage.removeItem('k2_users'); localStorage.removeItem('k2_providers'); localStorage.removeItem('k2_listings'); localStorage.removeItem('k2_venues'); }
};

const DIRECTORY_TYPES = {
    'content-creator': { label: 'Content Creator', icon: 'fa-video', color: '#8b5cf6' },
    'model': { label: 'Model', icon: 'fa-camera-retro', color: '#ec4899' },
    'exotic-dancer': { label: 'Exotic Dancer', icon: 'fa-music', color: '#f59e0b' },
    'escort': { label: 'Escort', icon: 'fa-gem', color: '#6366f1' },
    'nude-chef': { label: 'Nude Chef', icon: 'fa-utensils', color: '#ef4444' }
};

const VENUE_TYPES = {
    'nightclub': { label: 'Nightclub', icon: 'fa-moon', color: '#6366f1' },
    'lounge': { label: 'Lounge', icon: 'fa-couch', color: '#8b5cf6' },
    'restaurant': { label: 'Restaurant', icon: 'fa-utensils', color: '#f59e0b' },
    'hotel': { label: 'Hotel', icon: 'fa-bed', color: '#3b82f6' },
    'event-space': { label: 'Event Space', icon: 'fa-calendar-alt', color: '#ec4899' },
    'private-venue': { label: 'Private Venue', icon: 'fa-key', color: '#10b981' },
    'beach-club': { label: 'Beach Club', icon: 'fa-umbrella-beach', color: '#06b6d4' },
    'rooftop': { label: 'Rooftop Bar', icon: 'fa-city', color: '#f97316' }
};

let currentViewUserId = null;
let currentViewProviderId = null;
let currentViewListingId = null;
let currentViewVenueId = null;
let deleteTarget = { type: null, id: null };
let userTags = [];
let providerTags = [];
let listingTags = [];
let listingGallery = [];
let currentDirectoryFilter = 'all';
let venueTags = [];
let venueGallery = [];
let currentVenueDirectoryFilter = 'all';

// ==========================================
// Navigation
// ==========================================
function navigateTo(page) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));

    const targetPage = document.getElementById('page-' + page);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.animation = 'none';
        targetPage.offsetHeight;
        targetPage.style.animation = 'pageFadeIn 0.5s ease';
    }

    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    if (page === 'user-dashboard') renderUserProfiles();
    if (page === 'provider-dashboard') renderProviderProfiles();
    if (page === 'user-create') resetUserForm();
    if (page === 'provider-create') resetProviderForm();
    if (page === 'directory') renderDirectory();
    if (page === 'provider-directory') renderListings();
    if (page === 'provider-listing-create') resetListingForm();
    if (page === 'venue-directory') renderVenueDirectory();
    if (page === 'provider-venue-directory') renderVenueListings();
    if (page === 'provider-venue-create') resetVenueForm();
}

// ==========================================
// Sidebar
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');

    menuToggle.addEventListener('click', () => { sidebar.classList.remove('hidden'); menuToggle.classList.remove('visible'); });
    closeBtn.addEventListener('click', () => { sidebar.classList.add('hidden'); menuToggle.classList.add('visible'); });

    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-page'));
        });
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

    // Tags input
    document.getElementById('userTagsInput')?.addEventListener('keydown', handleUserTagInput);
    document.getElementById('providerTagsInput')?.addEventListener('keydown', handleProviderTagInput);
    document.getElementById('listingTagsInput')?.addEventListener('keydown', handleListingTagInput);
    document.getElementById('venueTagsInput')?.addEventListener('keydown', handleVenueTagInput);
    document.getElementById('directorySearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchDirectory(); });
    document.getElementById('venueSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchVenueDirectory(); });

    // Auto-detect page and render
    const isProviderPage = window.location.pathname.includes('provider.html');
    if (isProviderPage) {
        document.getElementById('providerProfilesList') && renderProviderProfiles();
        document.getElementById('listingsList') && renderListings();
        document.getElementById('venueListingsList') && renderVenueListings();
    } else {
        document.getElementById('userProfilesList') && renderUserProfiles();
        document.getElementById('directoryList') && renderDirectory();
        document.getElementById('venueDirectoryList') && renderVenueDirectory();
    }
});

function closeSidebar() {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('menuToggle').classList.add('visible');
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || icons.success}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-hide'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ==========================================
// GENERAL USER - CRUD
// ==========================================
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

function resetUserForm() {
    document.getElementById('userProfileForm').reset();
    document.getElementById('userProfileId').value = '';
    document.getElementById('userFormTitle').textContent = 'Create General User Profile';
    document.getElementById('userSubmitBtn').textContent = 'Create Profile';
    userTags = [];
    renderUserTags();
    document.getElementById('userPhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleUserSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('userProfileId').value;
    const now = new Date().toISOString();
    
    const profile = {
        id: id || generateId(),
        fullName: document.getElementById('userFullName').value,
        email: document.getElementById('userFormEmail').value,
        phone: document.getElementById('userFormPhone').value,
        location: document.getElementById('userFormLocation').value,
        dob: document.getElementById('userDob').value,
        gender: document.getElementById('userGender').value,
        bio: document.getElementById('userFormBio').value,
        website: document.getElementById('userFormWebsite').value,
        interests: [...userTags],
        photo: document.getElementById('userPhotoPreview').querySelector('img')?.src || '',
        status: 'active',
        createdAt: id ? undefined : now,
        updatedAt: now
    };

    const users = Storage.getUsers();
    if (id) {
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) { profile.createdAt = users[idx].createdAt; users[idx] = profile; }
        showToast('Profile updated successfully!');
    } else {
        profile.createdAt = now;
        users.push(profile);
        showToast('Profile created successfully!');
    }
    Storage.setUsers(users);
    navigateTo('user-dashboard');
}

function renderUserProfiles(filter = 'all') {
    const users = Storage.getUsers();
    const container = document.getElementById('userProfilesList');
    const filtered = filter === 'all' ? users : users.filter(u => u.status === filter);

    document.getElementById('userCount').textContent = users.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-user-plus"></i><h3>No profiles yet</h3><p>Create your first profile to get started</p><button class="btn btn-primary" onclick="navigateTo('user-create')">Create Profile</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((u, i) => `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s" onclick="viewUserProfile('${u.id}')">
            <div class="list-card-avatar">${u.photo ? `<img src="${u.photo}" alt="">` : `<i class="fas fa-user"></i>`}</div>
            <div class="list-card-info">
                <h3>${u.fullName}</h3>
                <p>${u.email}</p>
                <div class="list-card-tags">${(u.interests || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${u.status}">${u.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editUserById('${u.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterUserProfiles() { renderUserProfiles(document.getElementById('userFilter').value); }

function viewUserProfile(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    currentViewUserId = id;

    document.getElementById('userViewName').textContent = u.fullName;
    document.getElementById('userViewEmail').textContent = u.email;
    document.getElementById('userViewPhone').textContent = u.phone || '-';
    document.getElementById('userViewLocation').textContent = u.location || '-';
    document.getElementById('userViewDob').textContent = u.dob ? new Date(u.dob).toLocaleDateString() : '-';
    document.getElementById('userViewGender').textContent = u.gender || '-';
    document.getElementById('userViewBio').textContent = u.bio || 'No bio provided.';
    document.getElementById('userViewWebsite').textContent = u.website || '-';
    document.getElementById('userViewWebsite').href = u.website || '#';
    document.getElementById('userViewCreated').textContent = u.createdAt ? new Date(u.createdAt).toLocaleString() : '-';
    document.getElementById('userViewUpdated').textContent = u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '-';
    document.getElementById('userViewStatus').textContent = u.status;
    
    const avatarImg = document.getElementById('userViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    if (u.photo) { avatarImg.src = u.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; }

    const interestsContainer = document.getElementById('userViewInterests');
    if (u.interests && u.interests.length > 0) {
        interestsContainer.innerHTML = u.interests.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        interestsContainer.innerHTML = '<span class="tag empty-tag">No interests added</span>';
    }

    navigateTo('user-profile');
}

function editUserById(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    populateUserForm(u);
    navigateTo('user-create');
}

function editUserProfile() {
    if (!currentViewUserId) return;
    editUserById(currentViewUserId);
}

function populateUserForm(u) {
    document.getElementById('userProfileId').value = u.id;
    document.getElementById('userFullName').value = u.fullName || '';
    document.getElementById('userFormEmail').value = u.email || '';
    document.getElementById('userFormPhone').value = u.phone || '';
    document.getElementById('userFormLocation').value = u.location || '';
    document.getElementById('userDob').value = u.dob || '';
    document.getElementById('userGender').value = u.gender || '';
    document.getElementById('userFormBio').value = u.bio || '';
    document.getElementById('userFormWebsite').value = u.website || '';
    document.getElementById('userFormTitle').textContent = 'Edit General User Profile';
    document.getElementById('userSubmitBtn').textContent = 'Update Profile';
    userTags = [...(u.interests || [])];
    renderUserTags();
    
    const preview = document.getElementById('userPhotoPreview');
    if (u.photo) { preview.innerHTML = `<img src="${u.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function deleteUserProfile() { if (currentViewUserId) promptDeleteUser(currentViewUserId); }

function promptDeleteUser(id) {
    deleteTarget = { type: 'user', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this user profile. This action cannot be undone.';
    document.getElementById('deleteModal').classList.add('active');
}

function promptDeleteProvider(id) {
    deleteTarget = { type: 'provider', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this business profile and all its services. This action cannot be undone.';
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); deleteTarget = { type: null, id: null }; }

function confirmDelete() {
    if (deleteTarget.type === 'user') {
        const users = Storage.getUsers().filter(u => u.id !== deleteTarget.id);
        Storage.setUsers(users);
        showToast('User profile deleted.', 'info');
        currentViewUserId = null;
        navigateTo('user-dashboard');
    } else if (deleteTarget.type === 'provider') {
        const providers = Storage.getProviders().filter(p => p.id !== deleteTarget.id);
        Storage.setProviders(providers);
        showToast('Business profile deleted.', 'info');
        currentViewProviderId = null;
        navigateTo('provider-dashboard');
    }
    closeDeleteModal();
}

// ==========================================
// GENERAL USER - Tags
// ==========================================
function handleUserTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !userTags.includes(val)) { userTags.push(val); renderUserTags(); }
        e.target.value = '';
    }
}

function addSuggestedTag(tag) {
    if (!userTags.includes(tag)) { userTags.push(tag); renderUserTags(); }
}

function removeUserTag(index) { userTags.splice(index, 1); renderUserTags(); }

function renderUserTags() {
    const container = document.getElementById('userTagsDisplay');
    if (!container) return;
    container.innerHTML = userTags.map((t, i) => `<span class="tag">${t}<button type="button" onclick="removeUserTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// SERVICE PROVIDER - CRUD
// ==========================================
function resetProviderForm() {
    document.getElementById('providerProfileForm').reset();
    document.getElementById('providerProfileId').value = '';
    document.getElementById('providerFormTitle').textContent = 'Create Service Provider Profile';
    document.getElementById('providerSubmitBtn').textContent = 'Create Profile';
    providerTags = [];
    renderProviderTags();
    document.getElementById('providerLogoPreview').innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>';
    
    const servicesList = document.getElementById('providerServicesList');
    servicesList.innerHTML = `<div class="service-item">
        <input type="text" placeholder="Service name" class="service-name" required>
        <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01">
        <input type="text" placeholder="Description (optional)" class="service-desc">
        <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>
    </div>`;

    document.getElementById('provMon').checked = true;
    document.getElementById('provTue').checked = true;
    document.getElementById('provWed').checked = true;
    document.getElementById('provThu').checked = true;
    document.getElementById('provFri').checked = true;
    document.getElementById('provSat').checked = false;
    document.getElementById('provSun').checked = false;
}

function addServiceItem() {
    const list = document.getElementById('providerServicesList');
    const item = document.createElement('div');
    item.className = 'service-item';
    item.style.animation = 'serviceSlide 0.3s ease';
    item.innerHTML = `<input type="text" placeholder="Service name" class="service-name" required>
        <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01">
        <input type="text" placeholder="Description (optional)" class="service-desc">
        <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>`;
    list.appendChild(item);
}

function removeServiceItem(btn) {
    const item = btn.closest('.service-item');
    const list = document.getElementById('providerServicesList');
    if (list.children.length > 1) {
        item.style.animation = 'serviceSlide 0.3s ease reverse';
        setTimeout(() => item.remove(), 300);
    } else {
        showToast('At least one service is required.', 'warning');
    }
}

function handleProviderSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('providerProfileId').value;
    const now = new Date().toISOString();

    const serviceItems = document.querySelectorAll('#providerServicesList .service-item');
    const services = [];
    serviceItems.forEach(item => {
        const name = item.querySelector('.service-name')?.value.trim();
        if (name) {
            services.push({
                name,
                price: item.querySelector('.service-price')?.value || '',
                description: item.querySelector('.service-desc')?.value || ''
            });
        }
    });

    const availability = {
        mon: document.getElementById('provMon').checked,
        tue: document.getElementById('provTue').checked,
        wed: document.getElementById('provWed').checked,
        thu: document.getElementById('provThu').checked,
        fri: document.getElementById('provFri').checked,
        sat: document.getElementById('provSat').checked,
        sun: document.getElementById('provSun').checked,
        workStart: document.getElementById('providerWorkStart').value,
        workEnd: document.getElementById('providerWorkEnd').value
    };

    const profile = {
        id: id || generateId(),
        businessName: document.getElementById('providerBusinessName').value,
        businessType: document.getElementById('providerBusinessType').value,
        contactPerson: document.getElementById('providerContactPerson').value,
        email: document.getElementById('providerFormEmail').value,
        phone: document.getElementById('providerFormPhone').value,
        estYear: document.getElementById('providerEstYear').value,
        website: document.getElementById('providerFormWebsite').value,
        address: document.getElementById('providerFormAddress').value,
        description: document.getElementById('providerFormDescription').value,
        tagline: document.getElementById('providerFormTagline').value,
        services,
        categories: [...providerTags],
        availability,
        logo: document.getElementById('providerLogoPreview').querySelector('img')?.src || '',
        status: 'active',
        updatedAt: now
    };

    const providers = Storage.getProviders();
    if (id) {
        const idx = providers.findIndex(p => p.id === id);
        if (idx !== -1) { profile.createdAt = providers[idx].createdAt; providers[idx] = profile; }
        showToast('Business profile updated!');
    } else {
        profile.createdAt = now;
        providers.push(profile);
        showToast('Business profile created!');
    }
    Storage.setProviders(providers);
    navigateTo('provider-dashboard');
}

function renderProviderProfiles(filter = 'all') {
    const providers = Storage.getProviders();
    const container = document.getElementById('providerProfilesList');
    const filtered = filter === 'all' ? providers : providers.filter(p => p.status === filter);

    document.getElementById('providerCount').textContent = providers.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><h3>No business profiles yet</h3><p>Create your first business profile to get started</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-create')">Create Profile</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((p, i) => `
        <div class="profile-list-card provider-list-card" style="animation-delay:${i * 0.1}s" onclick="viewProviderProfile('${p.id}')">
            <div class="list-card-avatar provider-avatar-sm">${p.logo ? `<img src="${p.logo}" alt="">` : `<i class="fas fa-briefcase"></i>`}</div>
            <div class="list-card-info">
                <h3>${p.businessName}</h3>
                <p>${p.email} &middot; ${p.businessType}</p>
                <div class="list-card-tags">${(p.categories || []).slice(0, 3).map(t => `<span class="mini-tag provider-mini">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${p.status}">${p.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editProviderById('${p.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteProvider('${p.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterProviderProfiles() { renderProviderProfiles(document.getElementById('providerFilter').value); }

function viewProviderProfile(id) {
    const providers = Storage.getProviders();
    const p = providers.find(pr => pr.id === id);
    if (!p) return;
    currentViewProviderId = id;

    document.getElementById('providerViewName').textContent = p.businessName;
    document.getElementById('providerViewEmail').textContent = p.email;
    document.getElementById('providerViewType').textContent = p.businessType;
    document.getElementById('providerViewPhone').textContent = p.phone || '-';
    document.getElementById('providerViewAddress').textContent = p.address || '-';
    document.getElementById('providerViewContact').textContent = p.contactPerson || '-';
    document.getElementById('providerViewEst').textContent = p.estYear || '-';
    document.getElementById('providerViewTagline').textContent = p.tagline || '';
    document.getElementById('providerViewDescription').textContent = p.description || 'No description provided.';
    document.getElementById('providerViewWebsite').textContent = p.website || '-';
    document.getElementById('providerViewWebsite').href = p.website || '#';
    document.getElementById('providerViewCreated').textContent = p.createdAt ? new Date(p.createdAt).toLocaleString() : '-';
    document.getElementById('providerViewUpdated').textContent = p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '-';
    document.getElementById('providerViewStatus').textContent = p.status;
    document.getElementById('providerViewHours').textContent = (p.availability?.workStart || '09:00') + ' - ' + (p.availability?.workEnd || '17:00');

    const logoImg = document.getElementById('providerViewAvatar');
    const logoPlaceholder = logoImg.nextElementSibling;
    if (p.logo) { logoImg.src = p.logo; logoImg.style.display = 'block'; logoPlaceholder.style.display = 'none'; }
    else { logoImg.style.display = 'none'; logoPlaceholder.style.display = 'flex'; }

    const servicesContainer = document.getElementById('providerViewServices');
    if (p.services && p.services.length > 0) {
        servicesContainer.innerHTML = p.services.map(s => `
            <div class="service-view-item">
                <div class="service-view-info">
                    <span class="service-view-name">${s.name}</span>
                    <span class="service-view-desc">${s.description || ''}</span>
                </div>
                <span class="service-view-price">${s.price ? '$' + s.price : 'Free'}</span>
            </div>
        `).join('');
    } else {
        servicesContainer.innerHTML = '<p class="empty-text">No services added</p>';
    }

    const categoriesContainer = document.getElementById('providerViewCategories');
    if (p.categories && p.categories.length > 0) {
        categoriesContainer.innerHTML = p.categories.map(t => `<span class="tag provider-tag">${t}</span>`).join('');
    } else {
        categoriesContainer.innerHTML = '<span class="tag empty-tag">No categories added</span>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('providerViewAvailability');
    availContainer.innerHTML = days.map((d, i) => `<span class="day-badge ${p.availability?.[d] ? 'day-active' : 'day-inactive'}">${dayLabels[i]}</span>`).join('');

    navigateTo('provider-profile');
}

function editProviderById(id) {
    const providers = Storage.getProviders();
    const p = providers.find(pr => pr.id === id);
    if (!p) return;
    populateProviderForm(p);
    navigateTo('provider-create');
}

function editProviderProfile() { if (currentViewProviderId) editProviderById(currentViewProviderId); }

function populateProviderForm(p) {
    document.getElementById('providerProfileId').value = p.id;
    document.getElementById('providerBusinessName').value = p.businessName || '';
    document.getElementById('providerBusinessType').value = p.businessType || '';
    document.getElementById('providerContactPerson').value = p.contactPerson || '';
    document.getElementById('providerFormEmail').value = p.email || '';
    document.getElementById('providerFormPhone').value = p.phone || '';
    document.getElementById('providerEstYear').value = p.estYear || '';
    document.getElementById('providerFormWebsite').value = p.website || '';
    document.getElementById('providerFormAddress').value = p.address || '';
    document.getElementById('providerFormDescription').value = p.description || '';
    document.getElementById('providerFormTagline').value = p.tagline || '';
    document.getElementById('providerFormTitle').textContent = 'Edit Service Provider Profile';
    document.getElementById('providerSubmitBtn').textContent = 'Update Profile';

    providerTags = [...(p.categories || [])];
    renderProviderTags();

    if (p.availability) {
        document.getElementById('provMon').checked = p.availability.mon || false;
        document.getElementById('provTue').checked = p.availability.tue || false;
        document.getElementById('provWed').checked = p.availability.wed || false;
        document.getElementById('provThu').checked = p.availability.thu || false;
        document.getElementById('provFri').checked = p.availability.fri || false;
        document.getElementById('provSat').checked = p.availability.sat || false;
        document.getElementById('provSun').checked = p.availability.sun || false;
        document.getElementById('providerWorkStart').value = p.availability.workStart || '09:00';
        document.getElementById('providerWorkEnd').value = p.availability.workEnd || '17:00';
    }

    const servicesList = document.getElementById('providerServicesList');
    if (p.services && p.services.length > 0) {
        servicesList.innerHTML = p.services.map(s => `
            <div class="service-item">
                <input type="text" placeholder="Service name" class="service-name" value="${s.name}" required>
                <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01" value="${s.price || ''}">
                <input type="text" placeholder="Description (optional)" class="service-desc" value="${s.description || ''}">
                <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    const preview = document.getElementById('providerLogoPreview');
    if (p.logo) { preview.innerHTML = `<img src="${p.logo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>'; }
}

function deleteProviderProfile() { if (currentViewProviderId) promptDeleteProvider(currentViewProviderId); }

// ==========================================
// SERVICE PROVIDER - Tags
// ==========================================
function handleProviderTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !providerTags.includes(val)) { providerTags.push(val); renderProviderTags(); }
        e.target.value = '';
    }
}

function addProviderSuggestedTag(tag) {
    if (!providerTags.includes(tag)) { providerTags.push(tag); renderProviderTags(); }
}

function removeProviderTag(index) { providerTags.splice(index, 1); renderProviderTags(); }

function renderProviderTags() {
    const container = document.getElementById('providerTagsDisplay');
    if (!container) return;
    container.innerHTML = providerTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeProviderTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// PHOTO UPLOAD
// ==========================================
function previewPhoto(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" alt="">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ==========================================
// DIRECTORY - BROWSE (General User Page)
// ==========================================
function renderDirectory() {
    const listings = Storage.getListings();
    const container = document.getElementById('directoryList');
    if (!container) return;

    let filtered = listings.filter(l => l.status === 'active');
    
    if (currentDirectoryFilter !== 'all') {
        filtered = filtered.filter(l => l.category === currentDirectoryFilter);
    }

    const locationVal = document.getElementById('directoryLocationFilter')?.value || '';
    if (locationVal) {
        filtered = filtered.filter(l => l.location && l.location.toLowerCase().includes(locationVal.toLowerCase()));
    }

    const searchVal = (document.getElementById('directorySearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(searchVal) ||
            l.location.toLowerCase().includes(searchVal) ||
            (l.tags || []).some(t => t.toLowerCase().includes(searchVal))
        );
    }

    const sortVal = document.getElementById('directorySort')?.value || 'newest';
    filtered.sort((a, b) => {
        if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
        if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    document.getElementById('directoryCount').textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No profiles found</h3><p>Try adjusting your filters or search terms</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((l, i) => {
        const type = DIRECTORY_TYPES[l.category] || {};
        return `
        <div class="directory-card" style="animation-delay:${i * 0.05}s" onclick="viewDirectoryListing('${l.id}')">
            <div class="directory-card-photo">
                ${l.photo ? `<img src="${l.photo}" alt="">` : `<div class="directory-card-icon" style="background:${type.color}"><i class="fas ${type.icon || 'fa-user'}"></i></div>`}
            </div>
            <div class="directory-card-body">
                <div class="directory-card-header">
                    <h3>${l.name}</h3>
                    <span class="directory-type-badge" style="background:${type.color}20; color:${type.color}">${type.label || l.category}</span>
                </div>
                <p class="directory-card-location"><i class="fas fa-map-marker-alt"></i> ${l.location}</p>
                <div class="directory-card-tags">${(l.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
                <div class="directory-card-footer">
                    <span class="directory-card-rate">${l.rate || 'Contact'}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterDirectory(type) {
    currentDirectoryFilter = type;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    renderDirectory();
}

function searchDirectory() { renderDirectory(); }

function viewDirectoryListing(id) {
    const listings = Storage.getListings();
    const l = listings.find(item => item.id === id);
    if (!l) return;
    currentViewListingId = id;

    const type = DIRECTORY_TYPES[l.category] || {};
    
    document.getElementById('dirViewName').textContent = l.name;
    document.getElementById('dirViewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${l.location}`;
    document.getElementById('dirViewEmail').textContent = l.email;
    document.getElementById('dirViewPhone').textContent = l.phone || '-';
    document.getElementById('dirViewRate').textContent = l.rate || 'Contact for rate';
    document.getElementById('dirViewBio').textContent = l.bio || '-';
    document.getElementById('dirViewWebsite').textContent = l.website || '-';
    document.getElementById('dirViewWebsite').href = l.website || '#';

    const typeBadge = document.getElementById('dirViewType');
    typeBadge.textContent = type.label || l.category;
    typeBadge.style.background = (type.color || '#6366f1') + '20';
    typeBadge.style.color = type.color || '#6366f1';

    const avatarImg = document.getElementById('dirViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    const avatarContainer = document.getElementById('directoryViewAvatar');
    if (l.photo) { avatarImg.src = l.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; avatarPlaceholder.style.background = `linear-gradient(135deg, ${type.color}, ${type.color}dd)`; }

    const tagsContainer = document.getElementById('dirViewTags');
    if (l.tags && l.tags.length > 0) {
        tagsContainer.innerHTML = l.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No specialties listed</span>';
    }

    const galleryContainer = document.getElementById('dirViewGallery');
    if (l.gallery && l.gallery.length > 0) {
        galleryContainer.innerHTML = l.gallery.map(img => `<div class="gallery-item"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('dirViewAvailability');
    availContainer.innerHTML = days.map((d, i) => `<span class="day-badge ${l.availability?.[d] ? 'day-active' : 'day-inactive'}">${dayLabels[i]}</span>`).join('');

    navigateTo('directory-view');
}

// ==========================================
// DIRECTORY - CRUD (Provider Page)
// ==========================================
function resetListingForm() {
    const form = document.getElementById('listingForm');
    if (!form) return;
    form.reset();
    document.getElementById('listingId').value = '';
    document.getElementById('listingFormTitle').textContent = 'Create Directory Listing';
    document.getElementById('listingSubmitBtn').textContent = 'Publish Listing';
    listingTags = [];
    listingGallery = [];
    renderListingTags();
    renderGalleryUpload();
    document.getElementById('listingPhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleListingSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('listingId').value;
    const now = new Date().toISOString();

    const listing = {
        id: id || generateId(),
        name: document.getElementById('listingName').value,
        category: document.getElementById('listingCategory').value,
        email: document.getElementById('listingEmail').value,
        phone: document.getElementById('listingPhone').value,
        location: document.getElementById('listingLocation').value,
        rate: document.getElementById('listingRate').value,
        website: document.getElementById('listingWebsite').value,
        bio: document.getElementById('listingBio').value,
        tags: [...listingTags],
        gallery: [...listingGallery],
        photo: document.getElementById('listingPhotoPreview').querySelector('img')?.src || '',
        availability: {
            mon: document.getElementById('listMon').checked,
            tue: document.getElementById('listTue').checked,
            wed: document.getElementById('listWed').checked,
            thu: document.getElementById('listThu').checked,
            fri: document.getElementById('listFri').checked,
            sat: document.getElementById('listSat').checked,
            sun: document.getElementById('listSun').checked
        },
        status: 'active',
        updatedAt: now
    };

    const listings = Storage.getListings();
    if (id) {
        const idx = listings.findIndex(l => l.id === id);
        if (idx !== -1) { listing.createdAt = listings[idx].createdAt; listings[idx] = listing; }
        showToast('Listing updated successfully!');
    } else {
        listing.createdAt = now;
        listings.push(listing);
        showToast('Listing published successfully!');
    }
    Storage.setListings(listings);
    navigateTo('provider-directory');
}

function renderListings(filter = 'all') {
    const listings = Storage.getListings();
    const container = document.getElementById('listingsList');
    const countEl = document.getElementById('listingCount');
    if (!container) return;

    const filtered = filter === 'all' ? listings : listings.filter(l => l.category === filter);
    if (countEl) countEl.textContent = listings.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><h3>No listings yet</h3><p>Create your first directory listing to get discovered</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-listing-create')">Create Listing</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((l, i) => {
        const type = DIRECTORY_TYPES[l.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${type.color}20; color:${type.color}">
                ${l.photo ? `<img src="${l.photo}" alt="">` : `<i class="fas ${type.icon || 'fa-user'}"></i>`}
            </div>
            <div class="list-card-info">
                <h3>${l.name}</h3>
                <p>${type.label || l.category} &middot; ${l.location}</p>
                <div class="list-card-tags">${(l.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${l.status}">${l.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editListingById('${l.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteListing('${l.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterListings() { renderListings(document.getElementById('listingFilter').value); }

function editListingById(id) {
    const listings = Storage.getListings();
    const l = listings.find(item => item.id === id);
    if (!l) return;
    populateListingForm(l);
    navigateTo('provider-listing-create');
}

function populateListingForm(l) {
    document.getElementById('listingId').value = l.id;
    document.getElementById('listingName').value = l.name || '';
    document.getElementById('listingCategory').value = l.category || '';
    document.getElementById('listingEmail').value = l.email || '';
    document.getElementById('listingPhone').value = l.phone || '';
    document.getElementById('listingLocation').value = l.location || '';
    document.getElementById('listingRate').value = l.rate || '';
    document.getElementById('listingWebsite').value = l.website || '';
    document.getElementById('listingBio').value = l.bio || '';
    document.getElementById('listingFormTitle').textContent = 'Edit Directory Listing';
    document.getElementById('listingSubmitBtn').textContent = 'Update Listing';

    listingTags = [...(l.tags || [])];
    listingGallery = [...(l.gallery || [])];
    renderListingTags();
    renderGalleryUpload();

    if (l.availability) {
        document.getElementById('listMon').checked = l.availability.mon || false;
        document.getElementById('listTue').checked = l.availability.tue || false;
        document.getElementById('listWed').checked = l.availability.wed || false;
        document.getElementById('listThu').checked = l.availability.thu || false;
        document.getElementById('listFri').checked = l.availability.fri || false;
        document.getElementById('listSat').checked = l.availability.sat || false;
        document.getElementById('listSun').checked = l.availability.sun || false;
    }

    const preview = document.getElementById('listingPhotoPreview');
    if (l.photo) { preview.innerHTML = `<img src="${l.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function promptDeleteListing(id) {
    deleteTarget = { type: 'listing', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this directory listing.';
    document.getElementById('deleteModal').classList.add('active');
}

// ==========================================
// DIRECTORY - Tags
// ==========================================
function handleListingTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !listingTags.includes(val)) { listingTags.push(val); renderListingTags(); }
        e.target.value = '';
    }
}

function addListingSuggestedTag(tag) {
    if (!listingTags.includes(tag)) { listingTags.push(tag); renderListingTags(); }
}

function removeListingTag(index) { listingTags.splice(index, 1); renderListingTags(); }

function renderListingTags() {
    const container = document.getElementById('listingTagsDisplay');
    if (!container) return;
    container.innerHTML = listingTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeListingTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// DIRECTORY - Gallery
// ==========================================
function addGalleryImage(input) {
    if (input.files && input.files[0] && listingGallery.length < 6) {
        const reader = new FileReader();
        reader.onload = function(e) {
            listingGallery.push(e.target.result);
            renderGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeGalleryImage(index) {
    listingGallery.splice(index, 1);
    renderGalleryUpload();
}

function renderGalleryUpload() {
    const container = document.getElementById('galleryUploadGrid');
    if (!container) return;

    let html = listingGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (listingGallery.length < 6) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('galleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// UPDATE confirmDelete for listings
// ==========================================
const _origConfirmDelete = confirmDelete;
confirmDelete = function() {
    if (deleteTarget.type === 'listing') {
        const listings = Storage.getListings().filter(l => l.id !== deleteTarget.id);
        Storage.setListings(listings);
        showToast('Listing deleted.', 'info');
        currentViewListingId = null;
        closeDeleteModal();
        navigateTo('provider-directory');
        return;
    }
    if (deleteTarget.type === 'venue') {
        const venues = Storage.getVenues().filter(v => v.id !== deleteTarget.id);
        Storage.setVenues(venues);
        showToast('Venue deleted.', 'info');
        currentViewVenueId = null;
        closeDeleteModal();
        navigateTo('provider-venue-directory');
        return;
    }
    _origConfirmDelete();
};

// ==========================================
// VENUE DIRECTORY - BROWSE (General User Page)
// ==========================================
function renderVenueDirectory() {
    const venues = Storage.getVenues();
    const container = document.getElementById('venueDirectoryList');
    if (!container) return;

    let filtered = venues.filter(v => v.status === 'active');

    if (currentVenueDirectoryFilter !== 'all') {
        filtered = filtered.filter(v => v.category === currentVenueDirectoryFilter);
    }

    const locationVal = document.getElementById('venueLocationFilter')?.value || '';
    if (locationVal) {
        filtered = filtered.filter(v => v.location && v.location.toLowerCase().includes(locationVal.toLowerCase()));
    }

    const searchVal = (document.getElementById('venueSearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(v =>
            v.name.toLowerCase().includes(searchVal) ||
            v.location.toLowerCase().includes(searchVal) ||
            (v.tags || []).some(t => t.toLowerCase().includes(searchVal))
        );
    }

    const sortVal = document.getElementById('venueSort')?.value || 'newest';
    filtered.sort((a, b) => {
        if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
        if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    document.getElementById('venueDirectoryCount').textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No venues found</h3><p>Try adjusting your filters or search terms</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((v, i) => {
        const type = VENUE_TYPES[v.category] || {};
        return `
        <div class="directory-card" style="animation-delay:${i * 0.05}s" onclick="viewVenueDirectory('${v.id}')">
            <div class="directory-card-photo">
                ${v.photo ? `<img src="${v.photo}" alt="">` : `<div class="directory-card-icon" style="background:${type.color}"><i class="fas ${type.icon || 'fa-store'}"></i></div>`}
            </div>
            <div class="directory-card-body">
                <div class="directory-card-header">
                    <h3>${v.name}</h3>
                    <span class="directory-type-badge" style="background:${type.color}20; color:${type.color}">${type.label || v.category}</span>
                </div>
                <p class="directory-card-location"><i class="fas fa-map-marker-alt"></i> ${v.location}</p>
                <div class="directory-card-tags">${(v.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
                <div class="directory-card-footer">
                    <span class="directory-card-rate">${v.rate || 'Free Entry'}</span>
                    ${v.capacity ? `<span class="directory-card-capacity"><i class="fas fa-users"></i> ${v.capacity}</span>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterVenueDirectory(type) {
    currentVenueDirectoryFilter = type;
    document.querySelectorAll('#page-venue-directory .filter-tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    renderVenueDirectory();
}

function searchVenueDirectory() { renderVenueDirectory(); }

function viewVenueDirectory(id) {
    const venues = Storage.getVenues();
    const v = venues.find(item => item.id === id);
    if (!v) return;
    currentViewVenueId = id;

    const type = VENUE_TYPES[v.category] || {};

    document.getElementById('venViewName').textContent = v.name;
    document.getElementById('venViewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${v.location}`;
    document.getElementById('venViewEmail').textContent = v.email;
    document.getElementById('venViewPhone').textContent = v.phone || '-';
    document.getElementById('venViewRate').textContent = v.rate || 'Free Entry';
    document.getElementById('venViewCapacity').textContent = v.capacity || '-';
    document.getElementById('venViewBio').textContent = v.bio || '-';
    document.getElementById('venViewWebsite').textContent = v.website || '-';
    document.getElementById('venViewWebsite').href = v.website || '#';

    const typeBadge = document.getElementById('venViewType');
    typeBadge.textContent = type.label || v.category;
    typeBadge.style.background = (type.color || '#6366f1') + '20';
    typeBadge.style.color = type.color || '#6366f1';

    const avatarImg = document.getElementById('venViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    const avatarContainer = document.getElementById('venueViewAvatar');
    if (v.photo) { avatarImg.src = v.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; avatarPlaceholder.style.background = `linear-gradient(135deg, ${type.color}, ${type.color}dd)`; }

    const tagsContainer = document.getElementById('venViewTags');
    if (v.tags && v.tags.length > 0) {
        tagsContainer.innerHTML = v.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No features listed</span>';
    }

    const galleryContainer = document.getElementById('venViewGallery');
    if (v.gallery && v.gallery.length > 0) {
        galleryContainer.innerHTML = v.gallery.map(img => `<div class="gallery-item"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('venViewHours');
    availContainer.innerHTML = days.map((d, i) => `<span class="day-badge ${v.hours?.[d] ? 'day-active' : 'day-inactive'}">${dayLabels[i]}</span>`).join('');

    navigateTo('venue-directory-view');
}

// ==========================================
// VENUE DIRECTORY - CRUD (Provider Page)
// ==========================================
function resetVenueForm() {
    const form = document.getElementById('venueForm');
    if (!form) return;
    form.reset();
    document.getElementById('venueId').value = '';
    document.getElementById('venueFormTitle').textContent = 'Add Venue';
    document.getElementById('venueSubmitBtn').textContent = 'Publish Venue';
    venueTags = [];
    venueGallery = [];
    renderVenueTags();
    renderVenueGalleryUpload();
    document.getElementById('venuePhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleVenueSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('venueId').value;
    const now = new Date().toISOString();

    const venue = {
        id: id || generateId(),
        name: document.getElementById('venueName').value,
        category: document.getElementById('venueCategory').value,
        email: document.getElementById('venueEmail').value,
        phone: document.getElementById('venuePhone').value,
        location: document.getElementById('venueLocation').value,
        rate: document.getElementById('venueRate').value,
        capacity: document.getElementById('venueCapacity').value,
        website: document.getElementById('venueWebsite').value,
        bio: document.getElementById('venueBio').value,
        tags: [...venueTags],
        gallery: [...venueGallery],
        photo: document.getElementById('venuePhotoPreview').querySelector('img')?.src || '',
        hours: {
            mon: document.getElementById('venMon').checked,
            tue: document.getElementById('venTue').checked,
            wed: document.getElementById('venWed').checked,
            thu: document.getElementById('venThu').checked,
            fri: document.getElementById('venFri').checked,
            sat: document.getElementById('venSat').checked,
            sun: document.getElementById('venSun').checked
        },
        status: 'active',
        updatedAt: now
    };

    const venues = Storage.getVenues();
    if (id) {
        const idx = venues.findIndex(v => v.id === id);
        if (idx !== -1) { venue.createdAt = venues[idx].createdAt; venues[idx] = venue; }
        showToast('Venue updated successfully!');
    } else {
        venue.createdAt = now;
        venues.push(venue);
        showToast('Venue published successfully!');
    }
    Storage.setVenues(venues);
    navigateTo('provider-venue-directory');
}

function renderVenueListings(filter = 'all') {
    const venues = Storage.getVenues();
    const container = document.getElementById('venueListingsList');
    const countEl = document.getElementById('venueCount');
    if (!container) return;

    const filtered = filter === 'all' ? venues : venues.filter(v => v.category === filter);
    if (countEl) countEl.textContent = venues.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-store"></i><h3>No venues yet</h3><p>Add your first venue to get discovered</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-venue-create')">Add Venue</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((v, i) => {
        const type = VENUE_TYPES[v.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${type.color}20; color:${type.color}">
                ${v.photo ? `<img src="${v.photo}" alt="">` : `<i class="fas ${type.icon || 'fa-store'}"></i>`}
            </div>
            <div class="list-card-info">
                <h3>${v.name}</h3>
                <p>${type.label || v.category} &middot; ${v.location}</p>
                <div class="list-card-tags">${(v.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${v.status}">${v.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editVenueById('${v.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteVenue('${v.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterVenueListings() { renderVenueListings(document.getElementById('venueListingFilter').value); }

function editVenueById(id) {
    const venues = Storage.getVenues();
    const v = venues.find(item => item.id === id);
    if (!v) return;
    populateVenueForm(v);
    navigateTo('provider-venue-create');
}

function populateVenueForm(v) {
    document.getElementById('venueId').value = v.id;
    document.getElementById('venueName').value = v.name || '';
    document.getElementById('venueCategory').value = v.category || '';
    document.getElementById('venueEmail').value = v.email || '';
    document.getElementById('venuePhone').value = v.phone || '';
    document.getElementById('venueLocation').value = v.location || '';
    document.getElementById('venueRate').value = v.rate || '';
    document.getElementById('venueCapacity').value = v.capacity || '';
    document.getElementById('venueWebsite').value = v.website || '';
    document.getElementById('venueBio').value = v.bio || '';
    document.getElementById('venueFormTitle').textContent = 'Edit Venue';
    document.getElementById('venueSubmitBtn').textContent = 'Update Venue';

    venueTags = [...(v.tags || [])];
    venueGallery = [...(v.gallery || [])];
    renderVenueTags();
    renderVenueGalleryUpload();

    if (v.hours) {
        document.getElementById('venMon').checked = v.hours.mon || false;
        document.getElementById('venTue').checked = v.hours.tue || false;
        document.getElementById('venWed').checked = v.hours.wed || false;
        document.getElementById('venThu').checked = v.hours.thu || false;
        document.getElementById('venFri').checked = v.hours.fri || false;
        document.getElementById('venSat').checked = v.hours.sat || false;
        document.getElementById('venSun').checked = v.hours.sun || false;
    }

    const preview = document.getElementById('venuePhotoPreview');
    if (v.photo) { preview.innerHTML = `<img src="${v.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function promptDeleteVenue(id) {
    deleteTarget = { type: 'venue', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this venue listing.';
    document.getElementById('deleteModal').classList.add('active');
}

// ==========================================
// VENUE DIRECTORY - Tags
// ==========================================
function handleVenueTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !venueTags.includes(val)) { venueTags.push(val); renderVenueTags(); }
        e.target.value = '';
    }
}

function addVenueSuggestedTag(tag) {
    if (!venueTags.includes(tag)) { venueTags.push(tag); renderVenueTags(); }
}

function removeVenueTag(index) { venueTags.splice(index, 1); renderVenueTags(); }

function renderVenueTags() {
    const container = document.getElementById('venueTagsDisplay');
    if (!container) return;
    container.innerHTML = venueTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeVenueTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// VENUE DIRECTORY - Gallery
// ==========================================
function addVenueGalleryImage(input) {
    if (input.files && input.files[0] && venueGallery.length < 8) {
        const reader = new FileReader();
        reader.onload = function(e) {
            venueGallery.push(e.target.result);
            renderVenueGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeVenueGalleryImage(index) {
    venueGallery.splice(index, 1);
    renderVenueGalleryUpload();
}

function renderVenueGalleryUpload() {
    const container = document.getElementById('venueGalleryUploadGrid');
    if (!container) return;

    let html = venueGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeVenueGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (venueGallery.length < 8) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('venueGalleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}