// Debug and Update Logger
const Logger = {
    debugLogs: [],
    updateLogs: [],
    
    logError: function(error, context = '') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [ERROR] ${context ? context + ': ' : ''}${error}`;
        this.debugLogs.push(logEntry);
        console.error(logEntry);
    },
    
    logFeature: function(feature, description = '') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [FEATURE] ${feature}${description ? ': ' + description : ''}`;
        this.updateLogs.push(logEntry);
        console.log(logEntry);
    },
    
    downloadDebugLog: function() {
        const content = this.debugLogs.join('\n') || 'No errors recorded';
        this.downloadFile('debug.log', content);
    },
    
    downloadUpdatesLog: function() {
        const content = this.updateLogs.join('\n') || 'No updates recorded';
        this.downloadFile('updates.log', content);
    },
    
    downloadFile: function(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Global error handler
window.onerror = function(msg, url, line, col, error) {
    Logger.logError(`${msg} at line ${url}:${line}:${col}`, 'Global');
    return false;
};

window.addEventListener('unhandledrejection', function(e) {
    Logger.logError(`Unhandled Promise Rejection: ${e.reason}`, 'Promise');
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');
    const navItems = document.querySelectorAll('.nav-item');

    Logger.logFeature('Page Load', 'DOM content loaded successfully');

    function openSidebar() {
        sidebar.classList.remove('hidden');
        menuToggle.classList.remove('visible');
        Logger.logFeature('Sidebar Open', 'User opened the sidebar menu');
    }

    function closeSidebar() {
        sidebar.classList.add('hidden');
        menuToggle.classList.add('visible');
        Logger.logFeature('Sidebar Close', 'User closed the sidebar menu');
    }

    menuToggle.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            Logger.logFeature('Navigation', `User clicked: ${this.querySelector('span').textContent}`);
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    Logger.logFeature('Initialization', 'Logger initialized and ready');

    // Download log buttons
    document.getElementById('downloadDebug').addEventListener('click', function(e) {
        e.preventDefault();
        Logger.downloadDebugLog();
    });

    document.getElementById('downloadUpdates').addEventListener('click', function(e) {
        e.preventDefault();
        Logger.downloadUpdatesLog();
    });
});

// Expose logger globally for manual logging
window.Logger = Logger;