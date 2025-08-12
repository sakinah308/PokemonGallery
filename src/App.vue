<template>
  <div id="app">
    <nav
      class="navbar navbar-expand-lg navbar-dark"
      style="background: linear-gradient(135deg, #ff5f5f 0%, #e74c3c 100%)"
    >
      <div class="container">
        <router-link class="navbar-brand fw-bold fs-3 pokemon-brand" to="/"> ⚡ Pokédex Gallery </router-link>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  background: #f1f5f9;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.pokemon-brand {
  color: white !important;
  text-decoration: none !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transition: all 0.3s ease;
}

.pokemon-brand:hover {
  color: #ffeb3b !important;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 12px rgba(255, 235, 59, 0.6));
  transform: scale(1.05);
}
</style>
