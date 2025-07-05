// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global variables
let currentPage = 1;
let totalPages = 1;
let patients = [];
let editingPatientId = null;

// DOM Elements
const patientTableBody = document.getElementById('patientTableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const addPatientBtn = document.getElementById('addPatientBtn');
const patientModal = document.getElementById('patientModal');
const patientForm = document.getElementById('patientForm');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const pagination = document.getElementById('pagination');

// Stats elements
const totalPatientsEl = document.getElementById('totalPatients');
const activeCasesEl = document.getElementById('activeCases');
const recentUpdatesEl = document.getElementById('recentUpdates');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter functionality
    statusFilter.addEventListener('change', handleFilter);
    
    // Modal controls
    addPatientBtn.addEventListener('click', openAddPatientModal);
    closeModal.addEventListener('click', closePatientModal);
    cancelBtn.addEventListener('click', closePatientModal);
    
    // Form submission
    patientForm.addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === patientModal) {
            closePatientModal();
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load patients from API
async function loadPatients(page = 1, search = '', status = '') {
    try {
        showLoading();
        
        const queryParams = new URLSearchParams({
            page: page,
            limit: 10,
            ...(search && { search }),
            ...(status && { status })
        });
        
        const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch patients');
        }
        
        const data = await response.json();
        
        patients = data.patients || data; // Handle both paginated and non-paginated responses
        currentPage = data.currentPage || 1;
        totalPages = data.totalPages || 1;
        
        renderPatients();
        renderPagination();
        updateStats();
        
    } catch (error) {
        console.error('Error loading patients:', error);
        showError('Failed to load patients. Please check if the backend server is running.');
    }
}

// Render patients in the table
function renderPatients() {
    if (!patients || patients.length === 0) {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">No patients found</td>
            </tr>
        `;
        return;
    }
    
    patientTableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.email}</td>
            <td>${patient.phone}</td>
            <td>${patient.condition}</td>
            <td>${formatDate(patient.lastVisit)}</td>
            <td>
                <span class="status-badge status-${patient.status}">
                    ${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editPatient(${patient.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render pagination
function renderPagination() {
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    const search = searchInput.value;
    const status = statusFilter.value;
    loadPatients(page, search, status);
}

// Handle search
function handleSearch() {
    currentPage = 1;
    const search = searchInput.value;
    const status = statusFilter.value;
    loadPatients(currentPage, search, status);
}

// Handle filter
function handleFilter() {
    currentPage = 1;
    const search = searchInput.value;
    const status = statusFilter.value;
    loadPatients(currentPage, search, status);
}

// Update stats
function updateStats() {
    // For demonstration, we'll calculate stats from current data
    // In a real app, you might have separate API endpoints for this
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'active').length;
    
    totalPatientsEl.textContent = totalPatients;
    activeCasesEl.textContent = activePatients;
    recentUpdatesEl.textContent = totalPatients; // Placeholder
}

// Open add patient modal
function openAddPatientModal() {
    editingPatientId = null;
    modalTitle.textContent = 'Add New Patient';
    patientForm.reset();
    patientModal.style.display = 'block';
}

// Open edit patient modal
function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    
    editingPatientId = id;
    modalTitle.textContent = 'Edit Patient';
    
    // Fill form with patient data
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = patient.age;
    document.getElementById('patientEmail').value = patient.email;
    document.getElementById('patientPhone').value = patient.phone;
    document.getElementById('patientCondition').value = patient.condition;
    document.getElementById('patientStatus').value = patient.status;
    
    patientModal.style.display = 'block';
}

// Close patient modal
function closePatientModal() {
    patientModal.style.display = 'none';
    patientForm.reset();
    editingPatientId = null;
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(patientForm);
    const patientData = {
        name: document.getElementById('patientName').value,
        age: parseInt(document.getElementById('patientAge').value),
        email: document.getElementById('patientEmail').value,
        phone: document.getElementById('patientPhone').value,
        condition: document.getElementById('patientCondition').value,
        status: document.getElementById('patientStatus').value
    };
    
    try {
        let response;
        
        if (editingPatientId) {
            // Update existing patient
            response = await fetch(`${API_BASE_URL}/patients/${editingPatientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientData)
            });
        } else {
            // Create new patient
            response = await fetch(`${API_BASE_URL}/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientData)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save patient');
        }
        
        closePatientModal();
        loadPatients(currentPage, searchInput.value, statusFilter.value);
        showSuccess(editingPatientId ? 'Patient updated successfully!' : 'Patient added successfully!');
        
    } catch (error) {
        console.error('Error saving patient:', error);
        showError(error.message || 'Failed to save patient');
    }
}

// Delete patient
async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete patient');
        }
        
        loadPatients(currentPage, searchInput.value, statusFilter.value);
        showSuccess('Patient deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting patient:', error);
        showError('Failed to delete patient');
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showLoading() {
    patientTableBody.innerHTML = `
        <tr>
            <td colspan="9" class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading patients...
            </td>
        </tr>
    `;
}

function showError(message) {
    // Simple alert for now - you could implement a better notification system
    alert('Error: ' + message);
}

function showSuccess(message) {
    // Simple alert for now - you could implement a better notification system
    alert('Success: ' + message);
}

// Make functions globally available
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.changePage = changePage;