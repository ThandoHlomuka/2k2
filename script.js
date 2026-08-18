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
    clearAll: () => { localStorage.removeItem('k2_users'); localStorage.removeItem('k2_providers'); }
};

let currentViewUserId = null;
let currentViewProviderId = null;
let deleteTarget = { type: null, id: null };
let userTags = [];
let providerTags = [];

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