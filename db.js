/**
 * db.js - Firestore Database for Pixel by Maliya Portfolio
 * Handles all projects data persistence using Firebase Firestore
 */

const DB = {
    KEYS: {
        PASSWORD: 'pbm_admin_pass',
    },

    DEFAULT_PASSWORD: 'pixelmaliya2025',

    // Lazy initialization for Firestore
    get _db() {
        return firebase.firestore();
    },

    /**
     * Get all projects from Firestore (Used by admin panel & app.js if needed)
     */
    async getProjects() {
        try {
            const snapshot = await this._db.collection('projects').get();
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            return projects;
        } catch (e) {
            console.error('DB.getProjects error:', e);
            return [];
        }
    },

    /**
     * Save a new project to Firestore
     */
    async saveProject(project) {
        try {
            const docRef = await this._db.collection('projects').add(project);
            project.id = docRef.id;
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
        throw new Error("Deletion is disabled for this project.");
    },

    /**
     * Update an existing project in Firestore by ID
     */
    async updateProject(id, data) {
        try {
            await this._db.collection('projects').doc(id).update(data);
        } catch (e) {
            console.error('DB.updateProject error:', e);
            throw e;
        }
    },

    /**
     * Get the admin password from LocalStorage
     */
    getPassword() {
        return localStorage.getItem(this.KEYS.PASSWORD) || this.DEFAULT_PASSWORD;
    },

    /**
     * Set a new admin password in LocalStorage
     */
    setPassword(newPass) {
        localStorage.setItem(this.KEYS.PASSWORD, newPass);
    },

    /**
     * Check if password matches
     */
    checkPassword(input) {
        return input === this.getPassword();
    }
};
