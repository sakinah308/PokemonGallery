<template>
  <div class="container py-4">
    <div class="text-center mb-4">
      <h1 class="display-4 fw-bold text-dark mb-4">Pokédex</h1>

      <!-- Simple Search -->
      <div class="row justify-content-center mb-3">
        <div class="col-md-6">
          <div class="search-container">
            <input
              v-model="searchQuery"
              @input="store.setSearch(searchQuery)"
              type="text"
              class="form-control search-input"
              placeholder="Search Pokémon..."
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="btn search-clear-btn"
              type="button"
              aria-label="Clear search"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Pokémon Count -->
      <p class="text-muted mb-4">
        Showing {{ displayedPokemon.length }} Pokémon
        <span v-if="store.loading" class="ms-2">
          <span class="spinner-border spinner-border-sm" role="status"></span>
          Loading details...
        </span>
      </p>
    </div>

    <!-- Error Alert -->
    <div v-if="store.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ store.error }}
      <button type="button" class="btn-close" @click="store.clearError()"></button>
    </div>

    <!-- Main Loading Spinner - only show when no Pokemon loaded yet -->
    <div v-if="store.loading && store.pokemonList.length === 0" class="loading-container">
      <div class="loading-spinner">
        <div class="pokeball-loader">
          <div class="pokeball">
            <div class="pokeball-top"></div>
            <div class="pokeball-bottom"></div>
            <div class="pokeball-center">
              <div class="pokeball-button"></div>
            </div>
          </div>
        </div>
        <p class="loading-text mt-3">Loading Pokémon...</p>
      </div>
    </div>

    <!-- Pokemon Grid -->
    <div v-if="!store.loading || store.pokemonList.length > 0" class="row">
      <div
        v-for="pokemon in displayedPokemon"
        :key="pokemon.id"
        class="pokemon-grid-item col-lg-3 col-md-4 col-sm-6 mb-4"
      >
        <div class="card h-100 pokemon-card" @click="$router.push(`/pokemon/${pokemon.id}`)">
          <div class="card-body p-3">
            <div class="image-container">
              <img
                :src="
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default
                "
                class="pokemon-image"
                :alt="pokemon.name"
                loading="lazy"
              />
            </div>
            <div class="text-center">
              <h5 class="card-title text-capitalize fw-bold mb-3">{{ pokemon.name }}</h5>
              <div>
                <span
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  class="badge me-1 type-badge"
                  :class="type.type.name === 'unknown' ? 'type-loading' : `type-${type.type.name}`"
                >
                  {{ type.type.name === 'unknown' ? 'Loading...' : type.type.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note: Load More removed as we fetch all 100 Pokémon at once per interview requirements -->

    <!-- Empty State -->
    <div v-if="displayedPokemon.length === 0 && !store.loading" class="text-center py-5">
      <div class="display-1 mb-3 text-muted">🔍</div>
      <h3 class="text-dark">No Pokémon found</h3>
      <p class="text-muted">Try adjusting your search terms</p>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '../stores/pokemon'

export default {
  data() {
    return {
      searchQuery: '',
    }
  },
  setup() {
    const store = usePokemonStore()
    return { store }
  },
  computed: {
    displayedPokemon() {
      return this.store.filteredPokemon
    },
  },
  methods: {
    clearSearch() {
      this.searchQuery = ''
      this.store.setSearch('')
    },
  },
  async mounted() {
    if (this.store.pokemonList.length === 0) {
      await this.store.fetchPokemon()
    } else {
      // If Pokemon list is already loaded, ensure saved edits are applied
      this.store.loadSavedEdits()
    }
  },
}
</script>

<style scoped>
.search-container {
  background: white;
  border-radius: 50px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  border: none;
  border-radius: 46px;
  padding: 14px 20px;
  font-size: 1.1rem;
  width: 100%;
  box-shadow: none;
  outline: none;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  font-size: 18px;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-clear-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.pokemon-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  aspect-ratio: 1 / 1;
  background-color: #f1f5f9;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.pokemon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 300ms ease;
}

.pokemon-card:hover .pokemon-image {
  transform: scale(1.1);
}

.favorite-btn {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.pokemon-card:hover .favorite-btn {
  opacity: 1;
}

.type-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.type-badge:hover {
  background-color: #f1f5f9 !important;
  color: #333 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Pokémon type colors */
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
.type-loading {
  background-color: #e5e7eb;
  color: #6b7280;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom grid for exactly 5 cards per row on large screens */
@media (min-width: 1200px) {
  .pokemon-grid-item {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

/* Loading Animation Styles */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin: 2rem 0;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.pokeball-loader {
  display: inline-block;
  position: relative;
  margin: 0 auto 1rem;
}

.pokeball {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  animation: pokeball-spin 2s linear infinite;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.pokeball-top {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ff5f5f, #e74c3c);
  border-top-left-radius: 80px;
  border-top-right-radius: 80px;
  border-bottom: 2px solid #2c3e50;
}

.pokeball-bottom {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 80px;
  border-top: 2px solid #2c3e50;
}

.pokeball-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 4px solid #2c3e50;
  border-radius: 50%;
  z-index: 10;
}

.pokeball-button {
  width: 8px;
  height: 8px;
  background: #34495e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-text {
  font-size: 1.2rem;
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

/* Loading skeleton styles */
.skeleton-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-badge {
  height: 1.5rem;
  width: 4rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
