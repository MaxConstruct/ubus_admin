<template>
  <div>
    <b-navbar toggleable="md" type="light" class="py-0 px-3">
      <b-navbar-brand href="/" class="text-primary" style="font-weight: bolder">

        <b-img src="/logo.png" alt="logo" height="45px"></b-img></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <nuxt-link to="bus" class="nav-link px-0 mx-3 mt-3 text-decoration-none text-dark">
            Shuttle bus
          </nuxt-link>
          <nuxt-link to="station" class="nav-link px-0 mx-3 mt-3 text-decoration-none text-dark">
            Station
          </nuxt-link>
          <nuxt-link to="log" class="nav-link px-0 mx-3 mt-3 text-decoration-none text-dark">
            Log
          </nuxt-link>
          <nuxt-link to="news" class="nav-link px-0 mx-3 mt-3 text-decoration-none text-dark">
            News
          </nuxt-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto mt-3">
          <b-nav-item-dropdown right class="text-success">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              Online
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item variant="danger" href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <Nuxt/>
    </div>

  </div>
</template>

<style>
</style>

