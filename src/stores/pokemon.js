import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    currentPokemon: null,
    loading: false,
    searchQuery: '',
    favorites: JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'),
    error: null,
    loadingProgress: 0, // Track loading progress
  }),

  getters: {
    filteredPokemon: (state) => {
      if (!state.searchQuery) return state.pokemonList
      return state.pokemonList.filter((p) =>
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase()),
      )
    },

    favoritePokemon: (state) => {
      return state.pokemonList.filter((p) => state.favorites.includes(p.id))
    },

    isFavorite: (state) => (id) => {
      return state.favorites.includes(id)
    },
  },

  actions: {
    async fetchPokemon() {
      this.loading = true
      this.error = null

      try {
        // Fetch exactly 100 Pokémon list first (fast)
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100`)

        // Create initial list with basic info only
        this.pokemonList = response.data.results.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          url: pokemon.url,
          // Add placeholder data for immediate display
          sprites: {
            other: {
              'official-artwork': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
              },
            },
            front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
          },
          types: [{ type: { name: 'unknown' } }], // Placeholder
          loaded: false, // Track which Pokemon have full details
        }))

        // Apply any previously saved edits
        this.loadSavedEdits()

        // Show initial list immediately
        this.loading = false

        // Load full details in batches (non-blocking)
        this.loadPokemonDetails()
      } catch (error) {
        console.error('Error:', error)
        this.error = 'Failed to load Pokémon. Please try again.'
        this.loading = false
      }
    },

    async loadPokemonDetails() {
      // Load details in batches of 20 to avoid overwhelming the API
      const batchSize = 20
      const totalBatches = Math.ceil(this.pokemonList.length / batchSize)

      for (let i = 0; i < totalBatches; i++) {
        const batch = this.pokemonList.slice(i * batchSize, (i + 1) * batchSize)

        try {
          const detailPromises = batch.map(async (pokemon) => {
            if (pokemon.loaded) return pokemon

            const detail = await axios.get(pokemon.url)
            const fullPokemon = {
              ...pokemon,
              ...detail.data,
              loaded: true,
            }

            // Update the pokemon in the list
            const index = this.pokemonList.findIndex((p) => p.id === pokemon.id)
            if (index !== -1) {
              this.pokemonList[index] = fullPokemon
            }

            return fullPokemon
          })

          await Promise.all(detailPromises)
          console.log(`Loaded batch ${i + 1}/${totalBatches}`)

          // Small delay between batches to be nice to the API
          if (i < totalBatches - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.error(`Error loading batch ${i + 1}:`, error)
        }
      }

      console.log('All Pokemon details loaded!')
    },

    setSearch(query) {
      this.searchQuery = query
    },

    async fetchDetail(id) {
      this.loading = true
      this.error = null

      try {
        // First check if we already have this Pokemon in our list
        const existingPokemon = this.pokemonList.find((p) => p.id === parseInt(id))

        if (existingPokemon && existingPokemon.loaded) {
          // Use existing data immediately, but still fetch species info
          this.currentPokemon = { ...existingPokemon }
          this.loading = false

          // Fetch species data in background if not already present
          if (!existingPokemon.species) {
            try {
              const speciesResponse = await axios.get(
                `https://pokeapi.co/api/v2/pokemon-species/${id}`,
              )
              this.currentPokemon.species = speciesResponse.data

              // Update the list item too
              const listIndex = this.pokemonList.findIndex((p) => p.id === parseInt(id))
              if (listIndex !== -1) {
                this.pokemonList[listIndex] = {
                  ...this.pokemonList[listIndex],
                  species: speciesResponse.data,
                }
              }
            } catch (err) {
              console.log('Species data fetch failed, continuing without it', err)
            }
          }
        } else {
          // Fetch fresh data if not in list or not loaded
          const [pokemonResponse, speciesResponse] = await Promise.all([
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
          ])

          this.currentPokemon = {
            ...pokemonResponse.data,
            species: speciesResponse.data,
            loaded: true,
          }

          this.loading = false
        }

        // Apply any saved edits for this Pokemon
        const savedEdits = JSON.parse(localStorage.getItem('updatedPokemon') || '{}')
        if (savedEdits[id]) {
          Object.assign(this.currentPokemon, savedEdits[id])
          console.log('Applied saved edits to current Pokemon:', savedEdits[id])
        }
      } catch (error) {
        console.error('Error:', error)
        this.error = 'Failed to load Pokémon details. Please try again.'
        this.loading = false
      }
    },

    updatePokemon(id, data) {
      console.log('Updating Pokemon in store:', id, data)

      // Update in the main Pokemon list (this updates the gallery view)
      const pokemonIndex = this.pokemonList.findIndex((p) => p.id === id)
      if (pokemonIndex !== -1) {
        // Use Vue's reactivity - direct assignment to trigger updates
        this.pokemonList[pokemonIndex] = { ...this.pokemonList[pokemonIndex], ...data }
        console.log(
          'Updated Pokemon in list:',
          this.pokemonList[pokemonIndex].name,
          this.pokemonList[pokemonIndex].height,
          this.pokemonList[pokemonIndex].weight,
        )
      }

      // Update current Pokemon if it's the same one being viewed
      if (this.currentPokemon && this.currentPokemon.id === id) {
        this.currentPokemon = { ...this.currentPokemon, ...data }
        console.log('Updated current Pokemon:', this.currentPokemon.name)
      }

      // Store in localStorage for persistence across sessions
      const updatedPokemon = JSON.parse(localStorage.getItem('updatedPokemon') || '{}')
      updatedPokemon[id] = { ...updatedPokemon[id], ...data }
      localStorage.setItem('updatedPokemon', JSON.stringify(updatedPokemon))

      console.log('Pokemon successfully updated in store and localStorage')
    },

    toggleFavorite(id) {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(id)
      }
      localStorage.setItem('pokemonFavorites', JSON.stringify(this.favorites))
    },

    clearError() {
      this.error = null
    },

    loadSavedEdits() {
      const savedEdits = JSON.parse(localStorage.getItem('updatedPokemon') || '{}')

      Object.keys(savedEdits).forEach((pokemonId) => {
        const id = parseInt(pokemonId)
        const editData = savedEdits[pokemonId]

        // Update in pokemon list using reactive assignment
        const pokemonIndex = this.pokemonList.findIndex((p) => p.id === id)
        if (pokemonIndex !== -1) {
          this.pokemonList[pokemonIndex] = { ...this.pokemonList[pokemonIndex], ...editData }
        }
      })

      console.log('Loaded saved Pokemon edits:', Object.keys(savedEdits).length)
    },
  },
})
