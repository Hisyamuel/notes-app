import Swal from 'sweetalert2';
import { gsap } from 'gsap';

const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';

// Fitur API Client untuk berinteraksi dengan backend
const api = {
  async getNotes() {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data;
  },
  async getArchivedNotes() {
    const response = await fetch(`${API_BASE_URL}/notes/archived`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data;
  },
  async createNote(note) {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data;
  },
  async deleteNote(noteId) {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, { method: 'DELETE' });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
  },
  async archiveNote(noteId) {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/archive`, { method: 'POST' });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
  },
  async unarchiveNote(noteId) {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/unarchive`, { method: 'POST' });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);
  },
};


// Custom Element 1: Note Bar 
class NoteBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const title = this.getAttribute('note-title') || 'Notes App';
    this.render(title);
  }
  render(title) {
    this.shadowRoot.innerHTML = `
          <style>
            header { 
              background-color: var(--primary-color); 
              color: var(--on-primary); 
              padding: 20px; 
              text-align: center; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
              font-size: 1.2rem; 
            }

            h1 { 
              margin: 0; 
            }
          </style>

          <header>
            <h1>${title}</h1>
          </header>
        `;
  }
}
customElements.define('note-bar', NoteBar);

// Custom Element 2: Note Form 
class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  render() {
    this.shadowRoot.innerHTML = `
          <style>
            .form-container { 
              background-color: var(--surface-color); 
              padding: 24px; 
              border-radius: var(--border-radius); 
              box-shadow: var(--box-shadow); 
            }

            h2 {
              text-align: center;
              margin-bottom: 8px;
            }

            .form-group { 
              margin-bottom: 16px; 
            }

            label { 
              display: block; 
              margin-bottom: 8px; 
              font-weight: 500; 
            }

            input, textarea { 
              width: 100%; 
              padding: 12px; 
              border: 1px solid #ccc; 
              border-radius: var(--border-radius); 
              font-size: 1rem; 
              font-family: inherit; 
              box-sizing: border-box; 
            }

            textarea { 
              min-height: 120px; 
              resize: vertical; 
            }

            .validation-message { 
              color: white; 
              font-size: 0.8rem; 
              margin-top: 4px; 
              height: 1.2em; 
            }

            button { 
              width: 100%; 
              padding: 14px; 
              background-color: rgb(61, 98, 167); 
              color: var(--on-primary); 
              border: none; 
              border-radius: var(--border-radius); 
              font-size: 1rem; 
              font-weight: 700; 
              cursor: pointer; 
              transition: background-color 0.3s; 
            }

            button:disabled { 
              background-color: navy; 
              cursor: not-allowed; 
            }

            button:not(:disabled):hover { 
              color: black; 
              background-color: aqua; 
            }
          </style>

          <div class="form-container">
            <h2>Buat Catatan Baru</h2>
            <form id="noteForm">
              <div class="form-group">
                <label for="noteTitle">Judul</label>
                <input type="text" id="noteTitle" name="title" required>
                <div class="validation-message" id="titleValidation"></div>
              </div>
              <div class="form-group">
                <label for="noteBody">Isi Catatan</label>
                <textarea id="noteBody" name="body" required></textarea>
                <div class="validation-message" id="bodyValidation"></div>
              </div>
              <button type="submit" id="submitButton" disabled>Tambahkan Catatan</button>
            </form>
          </div>
        `;
  }

  // Perubahan utama ada di method ini
  setupEventListeners() {
    const form = this.shadowRoot.querySelector('#noteForm');
    const titleInput = this.shadowRoot.querySelector('#noteTitle');
    const bodyInput = this.shadowRoot.querySelector('#noteBody');
    const submitButton = this.shadowRoot.querySelector('#submitButton');

    // Fungsi untuk memeriksa validitas seluruh form
    const validateForm = () => {
      const isTitleValid = titleInput.value.trim() !== '';
      const isBodyValid = bodyInput.value.trim() !== '';
      submitButton.disabled = !(isTitleValid && isBodyValid);
    };

    // Fungsi untuk menampilkan pesan validasi
    const showValidationMessage = (element, message) => {
      const validationElement = this.shadowRoot.querySelector(`#${element}Validation`);
      validationElement.textContent = message;
    };

    // Event listener untuk input judul secara real-time
    titleInput.addEventListener('input', () => {
      if (titleInput.value.trim() === '') {
        showValidationMessage('title', 'Judul wajib diisi!');
      } else {
        showValidationMessage('title', '');
      }
      validateForm();
    });

    // Event listener untuk input isi catatan secara real-time
    bodyInput.addEventListener('input', () => {
      if (bodyInput.value.trim() === '') {
        showValidationMessage('body', 'Isi catatan tidak boleh kosong!');
      } else {
        showValidationMessage('body', '');
      }
      validateForm();
    });

    // Event listener untuk submit form
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('note-added', {
        detail: { title: titleInput.value, body: bodyInput.value },
        bubbles: true, composed: true
      }));
      form.reset();
      validateForm();
    });
  }
}
customElements.define('note-form', NoteForm);


// Custom Element 3: Note Item 
class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  set note(note) {
    this._note = note;
    this.render();
  }
  connectedCallback() {
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('note-deleted', { detail: { id: this._note.id }, bubbles: true, composed: true }));
    });

    this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('note-archived', { detail: { id: this._note.id, archived: this._note.archived }, bubbles: true, composed: true }));
    });
  }
  render() {
    const { title, body, createdAt, archived } = this._note;
    const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Memastikan event listener ditambahkan setelah elemen dirender
    this.shadowRoot.innerHTML = `
          <style>
            .note-card { 
              background-color: var(--surface-color); 
              border-radius: var(--border-radius); 
              padding: 20px; 
              box-shadow: var(--box-shadow); 
              display: flex; 
              flex-direction: column; 
              height: 100%; 
              box-sizing: border-box; 
            }

            .note-title { 
              font-size: 1.5rem; 
              font-weight: 700; 
              margin: 0 0 8px 0; 
            }

            .note-date { 
              font-size: 0.8rem; 
              color: white; 
              margin-bottom: 16px; 
            }

            .note-body { 
              font-size: 1rem; 
              line-height: 1.5; 
              flex-grow: 1; 
              white-space: pre-wrap; 
            }

            .note-actions { 
              margin-top: 16px; 
              display: flex; 
              gap: 10px; 
              justify-content: flex-end; 
            }

            .note-actions button { 
              padding: 8px 16px; 
              border: none; 
              border-radius: var(--border-radius); 
              cursor: pointer; 
              font-weight: 500; 
              transition: transform 0.2s ease, box-shadow 0.2s ease; 
            }

            .note-actions button:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
            }

            .archive-btn { 
              background-color: var(--third-color); 
              color: var(--on-primary); 
            }

            .delete-btn { 
              background-color: #ef4444; 
              color: white; 
            }
          </style>

          <div class="note-card">
            <h3 class="note-title">${title}</h3>
            <p class="note-date">${formattedDate}</p>
            <p class="note-body">${body}</p>
            <div class="note-actions">
                <button class="archive-btn">${archived ? 'Unarchive' : 'Archive'}</button>
                <button class="delete-btn">Delete</button>
            </div>
          </div>
        `;
  }
}
customElements.define('note-item', NoteItem);

// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
  const notesContainer = document.querySelector('#notes-list-container');
  const archivedNotesContainer = document.querySelector('#archived-notes-list-container');
  const loadingIndicator = document.querySelector('#loading-indicator');

  // Fungsi untuk mengatur layout grid responsif
  const setupGrid = (container) => {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    container.style.gap = '24px';
  };

  setupGrid(notesContainer);
  setupGrid(archivedNotesContainer);

  // Fungsi untuk menampilkan dan menyembunyikan loading indicator
  const showLoading = () => loadingIndicator.style.display = 'block';
  const hideLoading = () => loadingIndicator.style.display = 'none';

  // Fungsi untuk merender daftar catatan
  const renderNotes = (notes, container) => {
    container.innerHTML = '';
    notes.forEach(note => {
      const noteElement = document.createElement('note-item');
      noteElement.note = note;
      container.appendChild(noteElement);
    });
    gsap.from(container.children, {
      duration: 0.5,
      opacity: 0,
      y: 30,
      stagger: 0.1,
      ease: 'power2.out'
    });
  };

  // Fungsi untuk memuat catatan dari API
  const loadNotes = async () => {
    showLoading();
    try {
      const [activeNotes, archivedNotes] = await Promise.all([api.getNotes(), api.getArchivedNotes()]);
      renderNotes(activeNotes, notesContainer);
      renderNotes(archivedNotes, archivedNotesContainer);
    } catch (error) {
      Swal.fire('Error!', `Gagal memuat catatan: ${error.message}`, 'error');
    } finally {
      hideLoading();
    }
  };

  // Event listeners untuk custom events seperti penambahan, penghapusan, dan pengarsipan catatan
  document.addEventListener('note-added', async (event) => {
    showLoading();
    try {
      await api.createNote(event.detail);
      Swal.fire('Sukses!', 'Catatan baru berhasil ditambahkan!', 'success');
      await loadNotes();
    } catch (error) {
      Swal.fire('Error!', `Gagal menambahkan catatan: ${error.message}`, 'error');
    } finally {
      hideLoading();
    }
  });

  document.addEventListener('note-deleted', async (event) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Catatan yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      showLoading();
      try {
        await api.deleteNote(event.detail.id);
        Swal.fire('Terhapus!', 'Catatan Anda telah dihapus.', 'success');
        await loadNotes();
      } catch (error) {
        Swal.fire('Error!', `Gagal menghapus catatan: ${error.message}`, 'error');
      } finally {
        hideLoading();
      }
    }
  });

  document.addEventListener('note-archived', async (event) => {
    showLoading();
    const { id, archived } = event.detail;
    try {
      if (archived) {
        await api.unarchiveNote(id);
        Swal.fire('Berhasil!', 'Catatan dipindahkan ke daftar aktif.', 'success');
      } else {
        await api.archiveNote(id);
        Swal.fire('Diarsipkan!', 'Catatan telah diarsipkan.', 'success');
      }
      await loadNotes();
    } catch (error) {
      Swal.fire('Error!', `Gagal memperbarui catatan: ${error.message}`, 'error');
    } finally {
      hideLoading();
    }
  });

  loadNotes();
});