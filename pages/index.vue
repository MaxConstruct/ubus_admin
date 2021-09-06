<template>
  <div class="">
    <div class="row fullscreen justify-content-center align-content-center">
      <b-card class="col-xxl-4 col-xl-5  col-lg-6 col-md-8 col-sm-10 fit-content shadow-sm">
        <b-card-header class="bg-transparent border-0 text-center my-2">
          <h5 class="text-primary mb-3" style="font-weight: bolder">
            UBUS Admin
          </h5>
          <h3>
            ลงชื่อเข้าใช้งาน
          </h3>
        </b-card-header>
        <b-form @submit="sign_in" @reset="" v-if="">
          <b-form-group
            label="อีเมล"
            label-for="input-email"
            class="mb-3"
          >
            <b-form-input
              id="input-email"
              v-model="form.email1"
              placeholder="example@rsu.ac.th"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="รหัสผ่าน"
            label-for="input-password"
            class="mb-2"
          >
            <b-form-input
              id="input-password"
              type="password"
              v-model="form.password1"
              placeholder="รหัสผ่าน"
              required
            ></b-form-input>
          </b-form-group>

          <b-row class="mb-5">
            <b-form-group class="col-sm-6">
              <b-form-checkbox-group
                class="col-sm-12 p-0"
                v-model="form.checked"
                id="checkboxes-4"
              >
                <b-form-checkbox class="text-center" style="font-size: 13px">
                  <p style="margin-top: 2px" class="mb-0">จดจำข้อมูลของฉัน</p>
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <nuxt-link to="/" class="col-sm-6 text-decoration-none text-end" style="font-size: 13px;margin-top: 2px;">
              หากต้องการความช่วยเหลือ
            </nuxt-link>
          </b-row>

          <div class="col-sm-12 mb-2 p-0 text-end">
            <b-button type="submit" variant="primary">เข้าสู่ระบบ</b-button>
          </div>

        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {

  head() {
    return {
      title: "RSU Shuttle bus - Admin"
    };
  },

  data() {
    return {
      form: {
        email1: '',
        password1: '',
        checked: [],
      },

    }
  },

  methods: {

    sign_in(event) {
      event.preventDefault()
      this.$router.push('bus')
    },

    formatter(value) {
      return value.toLowerCase()
    }
  }

}
</script>

<style>
</style>
