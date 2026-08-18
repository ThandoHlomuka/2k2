document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');

    // Sidebar toggle
    function openSidebar() {
        sidebar.classList.remove('hidden');
        menuToggle.classList.remove('visible');
    }

    function closeSidebar() {
        sidebar.classList.add('hidden');
        menuToggle.classList.add('visible');
    }

    menuToggle.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    // Page navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`page-${pageId}`).classList.add('active');
        });
    });

    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Add service functionality
    const addServiceBtn = document.getElementById('addService');
    const servicesList = document.getElementById('servicesList');

    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            const newService = document.createElement('div');
            newService.className = 'service-item';
            newService.innerHTML = `
                <input type="text" placeholder="Service name" class="service-name">
                <input type="number" placeholder="Price" class="service-price">
                <button class="btn-remove"><i class="fas fa-times"></i></button>
            `;
            servicesList.appendChild(newService);

            newService.querySelector('.btn-remove').addEventListener('click', function() {
                newService.remove();
            });
        });
    }

    // Remove existing service items
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.service-item').remove();
        });
    });

    // Save profile buttons
    document.getElementById('saveGeneralProfile')?.addEventListener('click', function() {
        alert('General User profile saved!');
    });

    document.getElementById('saveProviderProfile')?.addEventListener('click', function() {
        alert('Service Provider profile saved!');
    });
});