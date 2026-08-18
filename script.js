document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');
    const navItems = document.querySelectorAll('.nav-item');

    function openSidebar() {
        sidebar.classList.remove('hidden');
        menuToggle.classList.remove('visible');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.add('hidden');
        menuToggle.classList.add('visible');
        overlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
});