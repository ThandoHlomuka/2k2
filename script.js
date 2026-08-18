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

    // Page navigation with animation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => {
                page.classList.remove('active');
                page.style.animation = 'none';
            });

            const targetPage = document.getElementById(`page-${pageId}`);
            targetPage.classList.add('active');
            targetPage.style.animation = 'pageFadeIn 0.5s ease';
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
                newService.style.animation = 'serviceSlide 0.3s ease reverse';
                setTimeout(() => newService.remove(), 300);
            });
        });
    }

    // Remove existing service items
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.service-item');
            item.style.animation = 'serviceSlide 0.3s ease reverse';
            setTimeout(() => item.remove(), 300);
        });
    });

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Save profile buttons with animation
    document.getElementById('saveGeneralProfile')?.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check"></i> Saved!';
            showToast('General User profile saved successfully!');
            setTimeout(() => {
                this.innerHTML = 'Save Profile';
            }, 2000);
        }, 1500);
    });

    document.getElementById('saveProviderProfile')?.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check"></i> Saved!';
            showToast('Service Provider profile saved successfully!');
            setTimeout(() => {
                this.innerHTML = 'Save Profile';
            }, 2000);
        }, 1500);
    });

    // Tag click animation
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                this.classList.toggle('selected');
            }, 100);
        });
    });

    // Stat counter animation
    document.querySelectorAll('.stat-value').forEach(stat => {
        const target = parseInt(stat.textContent) || 0;
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 50);
    });

    // Input focus effects
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = '';
        });
    });
});