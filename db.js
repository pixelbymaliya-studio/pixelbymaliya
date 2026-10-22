/**
 * db.js - Firestore Database for Pixel by Maliya Portfolio
 * Handles all projects data persistence using Firebase Firestore
 */

const DB = {
    // Lazy initialization for Firestore
    get _db() {
        return firebase.firestore();
    },

    async _ensureFirebase() {
        if (typeof firebase !== 'undefined' && firebase.firestore) return;
        const loadScript = (src) => new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
        if (typeof firebase === 'undefined') {
            await loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
        }
        if (!firebase.firestore) {
            await loadScript('https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js');
        }
        if (typeof firebaseConfig !== 'undefined' && !firebase.apps.length) {
            await loadScript('firebase-init.js');
        }
    },

    _cache: null,
    _cacheTs: 0,

    /**
     * Get all projects from Firestore (Used by frontend & admin panel)
     * Utilizes ultra-fast REST API on public pages to avoid heavy SDK & Listen channel overhead
     */
    async getProjects(forceFresh = false) {
        const now = Date.now();
        if (!forceFresh && this._cache && (now - this._cacheTs < 60000)) {
            return this._cache;
        }

        // Try direct REST API for instant response without SDK initialization
        try {
            const res = await fetch('https://firestore.googleapis.com/v1/projects/portfolio-3c910/databases/(default)/documents/projects');
            if (res.ok) {
                const data = await res.json();
                if (data.documents && Array.isArray(data.documents)) {
                    const projects = data.documents.map(doc => {
                        const id = doc.name.split('/').pop();
                        const fields = doc.fields || {};
                        const parsed = { id };
                        for (const [k, v] of Object.entries(fields)) {
                            if ('stringValue' in v) parsed[k] = v.stringValue;
                            else if ('integerValue' in v) parsed[k] = parseInt(v.integerValue, 10);
                            else if ('booleanValue' in v) parsed[k] = v.booleanValue;
                            else if ('arrayValue' in v) {
                                parsed[k] = (v.arrayValue?.values || []).map(val => val.stringValue || val);
                            }
                        }
                        return parsed;
                    });
                    projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    this._cache = projects;
                    this._cacheTs = now;
                    return projects;
                }
            }
        } catch (err) {
            // REST fetch failed, proceed to fallback
        }

        // Fallback to Firebase SDK if initialized
        try {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                const snapshot = await this._db.collection('projects').get();
                const projects = [];
                snapshot.forEach(doc => {
                    projects.push({ id: doc.id, ...doc.data() });
                });
                projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                this._cache = projects;
                this._cacheTs = now;
                return projects;
            }
        } catch (e) {
            console.warn('DB.getProjects fallback error:', e.message);
        }
        return this._cache || [];
    },

    /**
     * Save a new project to Firestore
     */
    async saveProject(project) {
        try {
            await this._ensureFirebase();
            const docRef = await this._db.collection('projects').add(project);
            project.id = docRef.id;
            this._cache = null;
            return project;
        } catch (e) {
            console.error('DB.saveProject error:', e);
            throw e;
        }
    },

    /**
     * Delete a project from Firestore by ID (DISABLED)
     */
    async deleteProject(id) {
        try {
            await this._ensureFirebase();
            await this._db.collection('projects').doc(id).delete();
            this._cache = null;
        } catch (e) {
            console.error('DB.deleteProject error:', e);
            throw e;
        }
    },

    /**
     * Update an existing project in Firestore by ID
     */
    async updateProject(id, data) {
        try {
            await this._ensureFirebase();
            await this._db.collection('projects').doc(id).update(data);
            this._cache = null;
        } catch (e) {
            console.error('DB.updateProject error:', e);
            throw e;
        }
    },

    /**
     * Get aggregated stats for the admin dashboard
     */
    async getProjectStats() {
        try {
            const projects = await this.getProjects();
            const stats = { total: projects.length, graphic: 0, web: 0, video: 0, pos: 0 };
            projects.forEach(p => {
                if (p.type === 'graphic') stats.graphic++;
                else if (p.type === 'web') stats.web++;
                else if (p.type === 'video') stats.video++;
                else if (p.type === 'pos') stats.pos++;
            });
            return stats;
        } catch (e) {
            console.error('DB.getProjectStats error:', e);
            return { total: 0, graphic: 0, web: 0, video: 0, pos: 0 };
        }
    }
};
