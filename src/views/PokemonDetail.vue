<template>
  <div class="container py-4">
    <!-- Error Alert -->
    <div v-if="store.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ store.error }}
      <button type="button" class="btn-close" @click="store.clearError()"></button>
    </div>

    <!-- Loading Spinner for Detail Page -->
    <div v-if="store.loading" class="detail-loading-container">
      <div class="detail-loading-spinner">
        <div class="pokeball-loader-small">
          <div class="pokeball-small">
            <div class="pokeball-top-small"></div>
            <div class="pokeball-bottom-small"></div>
            <div class="pokeball-center-small">
              <div class="pokeball-button-small"></div>
            </div>
          </div>
        </div>
        <p class="loading-text-detail mt-3">Loading Pokémon details...</p>
      </div>
    </div>

    <!-- Pokemon Details -->
    <div v-else-if="pokemon" class="pokemon-detail-container">
      <!-- Header Section with blue gradient background -->
      <div class="pokemon-header-section">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="pokemon-image-wrapper">
                <img
                  :src="pokemon.sprites.other['official-artwork'].front_default"
                  class="img-fluid pokemon-hero-image"
                  :alt="pokemon.name"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="pokemon-header-info">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <router-link to="/" class="btn btn-outline-light">
                    ← Back to Pokedex
                  </router-link>
                  <button
                    @click="startEdit"
                    class="btn btn-outline-light"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    ✏️ Edit
                  </button>
                </div>
                <h1 class="pokemon-title">{{ formatName(pokemon.name) }}</h1>
                <div class="pokemon-number">#{{ pokemon.id.toString().padStart(3, '0') }}</div>
                <div class="pokemon-types mb-3">
                  <span
                    v-for="type in pokemon.types"
                    :key="type.type.name"
                    class="type-pill"
                    :class="`type-${type.type.name}`"
                  >
                    {{ type.type.name }}
                  </span>
                </div>

                <!-- Pokemon Description -->
                <div class="pokemon-description">
                  <p class="description-text">
                    {{
                      getEnglishFlavorText() ||
                      `${formatName(pokemon.name)} is a ${pokemon.types.map((t) => t.type.name).join('/')} type Pokémon from Generation ${getGeneration()}.`
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        class="modal fade"
        id="editModal"
        tabindex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Edit Pokémon Information</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="cancelEdit"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveEdit">
                <div class="mb-3">
                  <label class="form-label fw-bold">Name</label>
                  <input v-model="editData.name" class="form-control" required />
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Height (m)</label>
                    <input
                      v-model.number="editData.height"
                      type="number"
                      step="0.1"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Weight (kg)</label>
                    <input
                      v-model.number="editData.weight"
                      type="number"
                      step="0.1"
                      class="form-control"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="saveEdit"
                data-bs-dismiss="modal"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Toast Notification -->
      <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
        <div
          class="toast show"
          :class="{ show: showSuccessToast }"
          v-if="showSuccessToast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-body success-toast">
            <div class="d-flex align-items-center">
              <div class="toast-icon me-3">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                  />
                </svg>
              </div>
              <div class="toast-message">
                <strong>Pokémon information updated successfully!</strong>
              </div>
              <button
                type="button"
                class="btn-close ms-auto"
                @click="showSuccessToast = false"
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="pokemon-content-section">
        <div class="container">
          <div class="row">
            <!-- Left Column - Physical Stats -->
            <div class="col-lg-4 mb-4">
              <div class="stats-card">
                <h3 class="section-title">Physical Stats</h3>
                <div class="physical-stats">
                  <div class="physical-stat">
                    <div class="stat-icon">📏</div>
                    <div>
                      <div class="stat-label">Height</div>
                      <div class="stat-value">{{ (pokemon.height / 10).toFixed(1) }} m</div>
                    </div>
                  </div>
                  <div class="physical-stat">
                    <div class="stat-icon">⚖️</div>
                    <div>
                      <div class="stat-label">Weight</div>
                      <div class="stat-value">{{ (pokemon.weight / 10).toFixed(1) }} kg</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Abilities Section -->
              <div class="stats-card">
                <h3 class="section-title">Abilities</h3>
                <div class="abilities-list">
                  <div
                    v-for="ability in pokemon.abilities"
                    :key="ability.ability.name"
                    class="ability-item"
                  >
                    {{ formatName(ability.ability.name) }}
                    <span v-if="ability.is_hidden" class="hidden-badge">Hidden</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Base Stats -->
            <div class="col-lg-8 mb-4">
              <div class="stats-card">
                <h3 class="section-title">Base Stats</h3>
                <div class="base-stats">
                  <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="base-stat-row">
                    <div class="stat-info">
                      <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
                      <span class="stat-number">{{ stat.base_stat }}</span>
                    </div>
                    <div class="stat-bar-container">
                      <div class="stat-bar-bg">
                        <div
                          class="stat-bar-fill"
                          :class="getStatColorClass(stat.base_stat)"
                          :style="`width: ${Math.min((stat.base_stat / 255) * 100, 100)}%`"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Total Stats -->
                  <div class="stat-total">
                    <div class="stat-info">
                      <span class="stat-name total-label">Total</span>
                      <span class="stat-number total-number">{{ getTotalStats() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Pokemon Info -->
              <div class="stats-card">
                <h3 class="section-title">Additional Info</h3>
                <div class="additional-info">
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Base Experience</span>
                      <span class="info-value">{{ pokemon.base_experience || 'Unknown' }}</span>
                    </div>
                    <div class="info-item" v-if="pokemon.species">
                      <span class="info-label">Species</span>
                      <span class="info-value">{{ formatName(pokemon.species.name) }}</span>
                    </div>
                    <div class="info-item" v-if="pokemon.species && pokemon.species.generation">
                      <span class="info-label">Generation</span>
                      <span class="info-value">{{
                        formatGeneration(pokemon.species.generation.name)
                      }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Order</span>
                      <span class="info-value">#{{ pokemon.order || pokemon.id }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sprites Gallery -->
              <div class="stats-card">
                <h3 class="section-title">Sprites</h3>
                <div class="sprites-gallery">
                  <div class="sprite-item" v-if="pokemon.sprites.front_default">
                    <img
                      :src="pokemon.sprites.front_default"
                      alt="Front Default"
                      class="sprite-image"
                    />
                    <span class="sprite-label">Normal</span>
                  </div>
                  <div class="sprite-item" v-if="pokemon.sprites.back_default">
                    <img
                      :src="pokemon.sprites.back_default"
                      alt="Back Default"
                      class="sprite-image"
                    />
                    <span class="sprite-label">Back</span>
                  </div>
                  <div class="sprite-item" v-if="pokemon.sprites.front_shiny">
                    <img
                      :src="pokemon.sprites.front_shiny"
                      alt="Shiny Front"
                      class="sprite-image"
                    />
                    <span class="sprite-label">✨ Shiny</span>
                  </div>
                  <div class="sprite-item" v-if="pokemon.sprites.back_shiny">
                    <img :src="pokemon.sprites.back_shiny" alt="Shiny Back" class="sprite-image" />
                    <span class="sprite-label">✨ Back Shiny</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '../stores/pokemon'

export default {
  data() {
    return {
      editing: false,
      editData: {},
      showSuccessToast: false,
    }
  },
  setup() {
    const store = usePokemonStore()
    return { store }
  },
  computed: {
    pokemon() {
      return this.store.currentPokemon
    },
  },
  methods: {
    startEdit() {
      this.editing = true
      this.editData = {
        name: this.pokemon.name,
        height: (this.pokemon.height / 10).toFixed(1),
        weight: (this.pokemon.weight / 10).toFixed(1),
      }
    },
    saveEdit() {
      // Convert back to API format
      const updateData = {
        name: this.editData.name,
        height: Math.round(parseFloat(this.editData.height) * 10),
        weight: Math.round(parseFloat(this.editData.weight) * 10),
      }
      this.store.updatePokemon(this.pokemon.id, updateData)
      this.editing = false
      // Show success toast notification
      this.showToast()
    },
    cancelEdit() {
      this.editing = false
      this.editData = {}
    },
    formatName(name) {
      return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    formatGeneration(genName) {
      const genNumber = genName.replace('generation-', '').toUpperCase()
      return `Gen ${genNumber}`
    },
    getGeneration() {
      if (this.pokemon?.species?.generation?.name) {
        return this.formatGeneration(this.pokemon.species.generation.name)
      }
      // Fallback based on Pokemon ID
      const id = this.pokemon?.id || 1
      if (id <= 151) return 'Gen I'
      if (id <= 251) return 'Gen II'
      if (id <= 386) return 'Gen III'
      return 'Gen I'
    },
    formatStatName(statName) {
      const statNames = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Sp. Attack',
        'special-defense': 'Sp. Defense',
        speed: 'Speed',
      }
      return statNames[statName] || this.formatName(statName)
    },
    getStatColor(value) {
      if (value >= 150) return 'bg-danger'
      if (value >= 120) return 'bg-warning'
      if (value >= 90) return 'bg-info'
      if (value >= 60) return 'bg-primary'
      return 'bg-secondary'
    },
    getStatColorClass(value) {
      if (value >= 150) return 'stat-excellent'
      if (value >= 120) return 'stat-high'
      if (value >= 90) return 'stat-good'
      if (value >= 60) return 'stat-medium'
      return 'stat-low'
    },
    getTotalStats() {
      return this.pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
    },
    getEnglishFlavorText() {
      if (!this.pokemon?.species?.flavor_text_entries) return ''
      const englishEntry = this.pokemon.species.flavor_text_entries.find(
        (entry) => entry.language.name === 'en',
      )
      const flavorText = englishEntry
        ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim()
        : ''
      console.log('Flavor text:', flavorText)
      return flavorText
    },
    showToast() {
      this.showSuccessToast = true
      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.showSuccessToast = false
      }, 3000)
    },
  },
  async mounted() {
    const id = this.$route.params.id
    await this.store.fetchDetail(id)
  },
}
</script>

<style scoped>
/* New Pokemon Detail Styles */
.pokemon-detail-container {
  min-height: 100vh;
}

.pokemon-header-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 2rem 0;
  margin: -2rem -15px 0 -15px;
}

.pokemon-image-wrapper {
  text-align: center;
  padding: 2rem;
}

.pokemon-hero-image {
  max-width: 300px;
  max-height: 300px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

.pokemon-header-info {
  padding: 2rem;
}

.pokemon-back-btn .btn {
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.pokemon-back-btn .btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.pokemon-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.pokemon-number {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.pokemon-types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-pill {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.9rem;
  opacity: 0.9;
}

.pokemon-description {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.description-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  font-style: italic;
  color: #1e293b !important;
  text-shadow: none;
  font-weight: 500;
}

.pokemon-content-section {
  padding: 2rem 0;
  background: #f8fafc;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  color: #1e293b;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e293b !important;
  margin-bottom: 1rem;
}

.physical-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.physical-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 12px;
  color: #1e293b;
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.stat-icon-bootstrap {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 50%;
  color: #6366f1;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.stat-icon-bootstrap svg {
  width: 18px;
  height: 18px;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b !important;
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1e293b !important;
}

.abilities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ability-item {
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 12px;
  font-weight: 500;
  color: #1e293b !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hidden-badge {
  background: #fbbf24;
  color: #92400e;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.base-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.base-stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  font-weight: 600;
  color: #374151 !important;
}

.stat-number {
  font-weight: bold;
  color: #1f2937 !important;
  font-size: 1.1rem;
}

.stat-bar-container {
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.stat-bar-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.stat-bar-fill {
  background: linear-gradient(90deg, #2563eb, #1d4ed8) !important;
  border-radius: 4px;
}

/* Blue fill for all stats - modern professional look */
.stat-bar-fill.stat-low,
.stat-bar-fill.stat-medium,
.stat-bar-fill.stat-good,
.stat-bar-fill.stat-high,
.stat-bar-fill.stat-excellent {
  background: linear-gradient(90deg, #2563eb, #1d4ed8) !important;
}

.stat-total {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.total-label {
  font-weight: bold;
  color: #1f2937 !important;
  font-size: 1.1rem;
}

.total-number {
  font-weight: bold;
  color: #3b82f6 !important;
  font-size: 1.3rem;
}

.additional-info {
  display: flex;
  flex-direction: column;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 12px;
  color: #1e293b;
}

.info-label {
  font-weight: 500;
  color: #64748b !important;
}

.info-value {
  font-weight: bold;
  color: #1e293b !important;
}

.sprites-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.sprite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 12px;
  transition: transform 0.2s ease;
  color: #1e293b;
}

.sprite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sprite-image {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  margin-bottom: 0.5rem;
}

.sprite-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b !important;
  text-align: center;
}

/* Mobile responsiveness improvements */
@media (max-width: 768px) {
  .pokemon-header-section {
    margin: -1rem -15px 0 -15px;
    padding: 1rem 0;
  }

  .pokemon-title {
    font-size: 2rem;
  }

  .pokemon-hero-image {
    max-width: 200px;
    max-height: 200px;
  }

  .pokemon-header-info {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .sprites-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Responsive design for tablets */
@media (max-width: 992px) {
  .pokemon-content-section .container {
    padding: 0 1rem;
  }
}

/* Toast Notification Styles */
.toast-container {
  z-index: 9999;
}

.success-toast {
  background: white;
  border: 1px solid #d1ecf1;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 350px;
}

.toast-icon {
  width: 40px;
  height: 40px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.toast-message {
  color: #333;
  font-size: 0.95rem;
  flex-grow: 1;
}

.toast-message strong {
  font-weight: 600;
}

.toast.show {
  display: block !important;
  animation: slideInRight 0.3s ease-out;
}

.toast:not(.show) {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  opacity: 0.6;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
}

.btn-close:hover {
  opacity: 1;
}

/* Detail Page Loading Styles */
.detail-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 20px;
  margin: 2rem 0;
}

.detail-loading-spinner {
  text-align: center;
  color: white;
}

.pokeball-loader-small {
  display: inline-block;
  position: relative;
  margin: 0 auto 1rem;
}

.pokeball-small {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  animation: pokeball-spin 1.5s linear infinite;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.pokeball-top-small {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ff5f5f, #e74c3c);
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  border-bottom: 2px solid #2c3e50;
}

.pokeball-bottom-small {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  border-top: 2px solid #2c3e50;
}

.pokeball-center-small {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: white;
  border: 3px solid #2c3e50;
  border-radius: 50%;
  z-index: 10;
}

.pokeball-button-small {
  width: 6px;
  height: 6px;
  background: #34495e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-text-detail {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes pokeball-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Original styles kept for backwards compatibility */
.pokemon-image-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.pokemon-main-image {
  max-height: 300px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.sprite-gallery {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.sprite-thumb {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.sprite-thumb:hover {
  transform: scale(1.1);
}

.pokemon-name {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pokemon-description {
  font-style: italic;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #667eea;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 1rem;
  border: 1px solid #dee2e6;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #495057;
}

.stat-label {
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.ability-badge {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

.type-badge-large {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0.25rem;
}

/* Pokémon type colors (same as HomeView) */
.type-normal {
  background-color: #a8a878;
}
.type-fire {
  background-color: #f08030;
}
.type-water {
  background-color: #6890f0;
}
.type-electric {
  background-color: #f8d030;
}
.type-grass {
  background-color: #78c850;
}
.type-ice {
  background-color: #98d8d8;
}
.type-fighting {
  background-color: #c03028;
}
.type-poison {
  background-color: #a040a0;
}
.type-ground {
  background-color: #e0c068;
}
.type-flying {
  background-color: #a890f0;
}
.type-psychic {
  background-color: #f85888;
}
.type-bug {
  background-color: #a8b820;
}
.type-rock {
  background-color: #b8a038;
}
.type-ghost {
  background-color: #705898;
}
.type-dragon {
  background-color: #7038f8;
}
.type-dark {
  background-color: #705848;
}
.type-steel {
  background-color: #b8b8d0;
}
.type-fairy {
  background-color: #ee99ac;
}

.stat-progress {
  height: 8px;
  background-color: #e9ecef;
}

.stat-row {
  padding: 0.5rem 0;
}

.stat-number {
  font-weight: bold;
  min-width: 3rem;
  text-align: right;
}

.info-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.info-card h5 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

/* Loading skeleton styles */
.skeleton-image-large {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 1rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-line.short {
  width: 60%;
}
</style>
