<template>

  <div class="row justify-content-center mt-5 mb-5">
    <div class="row justify-content-between mb-4">
      <div class="col-auto">
        <h4 class="my-2">ข่าว</h4>
      </div>
      <div class="col-auto">
        <button class="btn btn-outline-secondary border-0 m-1"
                @click="reload()"
        >
          <font-awesome-icon :icon="['fas', 'sync-alt']"/>
          อัปเดต
        </button>
      </div>
    </div>

    <div class="row">

      <div class="mt-4 mb-3 col-lg-4 col-md-6 col-sm-12 height-news">
        <button class="btn shadow-sm border-4 h1 h-100 btn-outline-primary w-100" @click="$bvModal.show('bv-modal-create-news')" style="border-radius: 0.7rem;">
          <h1>+</h1>
        </button>
      </div>

      <b-modal id="bv-modal-create-news" hide-footer hide-header>
        <div class="modal-title">
          <h1>เพิ่มข่าว</h1>
        </div>
        <form class="text-left">
          <div class="mb-3">
            <label for="create-news-title" class="form-label">ชื่อ</label>
            <input type="text" class="form-control" id="create-news-title"
                   :state="Boolean(form.title)"
                   v-model="form.title"
                   required>
          </div>
          <div class="mb-3">
            <label for="formFile" class="form-label">รูปภาพ</label>
            <img id="news-image" class="img-thumbnail mb-3" alt="image"
                 :src="image_data.src"
                 :state="Boolean(form.image)">
            <input class="form-control" type="file" id="formFile" @change="setImageFile">
          </div>

        </form>
        <div class="row justify-content-center mt-3">
          <div class="col-auto">
            <b-button class="" @click="$bvModal.hide('bv-modal-create-news')">ยกเลิก</b-button>
          </div>
          <div class="col-auto">
            <b-button class="" @click="onSubmit()" variant="primary">เพิ่ม</b-button>
          </div>
        </div>
      </b-modal>

      <template v-for="data in news_items">
        <div class="mt-4 mb-3 col-lg-4 col-md-6 col-sm-12 height-news">
          <div class="card bg-transparent border-0 shadow-sm text-white h-100">
            <img :src="'https://ubus.scotty1944.net/' + data['a_image']"
                 class="card-img-top"
                 alt="..."
            >
            <div class="card-body text-dark">
              <div class="card-title row justify-content-between my-0">
                <div class="col-auto">
                  <span>{{ data['a_title'] }}</span>
                </div>
                <div class="col-auto">
                  <a class="btn btn-sm btn-outline-danger border-0" @click="delete_ads(data)"><span class="material-icons align-middle action">delete</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>



</template>

<script>
import moment from "moment";
const path = require('path');

export default {

  name: "news",

  data() {

    return {
      default_image: 'https://images.unsplash.com/photo-1501706649056-3cb79cccec52?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80',
      form: {
        title: null,
        image: null,
      },
      image_data: {
        file: null,
        name:null,
        src: null,
      },
      card_item: [1,2,3,4,5,6,7,8,9,10],
      image_path: '',
      news_items: [],
    }
  },

  methods: {

    async setImageFile(event) {
      console.log("start");
      event.preventDefault();
      let file = event.target.files[0];

      if(!file){
        console.log('error in file')
        delete this.form.image;
        return;
      }

      let file_ext = path.extname(file.name).toLowerCase();

      if (file_ext !== ".png" && file_ext !== ".jpg" && file_ext !== ".jpeg") {
        console.log('error in file extension')
        delete this.form.image;
        return;
      }

      this.image_data.file = file;
      const reader = new FileReader();
      let app = this;
      reader.onload = function () {
        app.image_data.src = reader.result;
      };

      reader.readAsDataURL(this.image_data.file);
      // document.getElementById("create-input-image").innerHTML = file.name.substring(0, 15);
      delete this.form.image;
    },

    async create_news(event) {
      event.preventDefault();
      let result = await this.$swal.fire({
        title: 'Create news',
        html:`
        <form class="text-left">
          <div class="mb-3">
            <label for="create-news-title" class="form-label">Title</label>
            <input type="text" class="form-control" id="create-news-title" required>
          </div>
          <div class="mb-3">
            <label for="formFile" class="form-label">Image</label>
            <img src="" id="news-image" class="img-thumbnail mb-3" alt="image">
            <input class="form-control" type="file" id="formFile">
          </div>
        </form>
        `,
        onOpen: () => {
          document.getElementById('news-image').src = this.image_data.src == null ? this.default_image: this.image_data.src
          document.getElementById('formFile').addEventListener('change', async (e) => {
            await this.setImageFile(e);
            document.getElementById('news-image').src = this.image_data.src == null ? this.default_image: this.image_data.src
          }, false)
        },

        // '<input id="swal-input1" class="swal2-input" title="Name">' +
        // '<input id="swal-input2" class="swal2-input" title="Description">',
        focusConfirm: false,
        preConfirm: () => {
          this.form.title = document.getElementById('create-news-title').value;
          console.log(this.form.title);
        }
      }).then((data) => data);

      console.log(result)

      if(result.isConfirmed) {
        await this.onSubmit();
        await this.reload();
      }

    },

    async onSubmit() {
      await this.upload_image();
      // let title = document.getElementById('create-input-title').innerText;
      // console.log(title);
      // console.log(title);
      console.log(this.form.image)
      await this.$store.dispatch('storage/createADS', {
        'title': this.form.title,
        'image': this.form.image
      }).then(async (data) => {
        console.log('Create');
        console.log(data);
      })
      this.form.title = null;
      this.image_data.src = null;
      this.$bvModal.hide('bv-modal-create-news');
      await this.reload();
    },

    async upload_image() {
      let formData = new FormData();
      formData.append('image', this.image_data.file);
      await this.$store.dispatch('storage/uploadImage', formData).then(async (data) => {
        console.log('Upload');
        console.log(data);
        this.form.image = data.path;
        this.image_path = data.path;
      });
    },

    async reload() {

      let news_items = []

      let news_temp = await this.$store.dispatch('storage/getADS').then((data) => data);

      console.log(news_temp)

      Object.entries(news_temp.data).forEach(([k,v]) => {
        news_items.push(v);
      });

      this.news_items = news_items;
    },

    async delete_ads(data) {
      let result = await this.$swal.fire({
        title: 'ยืนยันการลบ',
        text: "คุณต้องการที่จะลบ " + data.a_title + ' หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
          return {
            'id': data.id,
          }
        }
      }).then((data) => data);

      console.log(result)

      if (result.isConfirmed) {
        let params = result.value;
        let re = await this.$store.dispatch('storage/deleteADS', params).then((data) => data);
        await this.$swal.fire({
          showClass: {
            popup: 'slide-from-top'
          },
          hideClass: {
            popup: 'slide-from-bottom',
          },
          title: 'สำเร็จ!',
          text: 'ดำเนินการเสร็จสิ้น',
          icon: 'success',
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'ดำเนินการต่อ',
        },)
        await this.reload();
        console.log(re);
      }
    },

  },
  async asyncData({route, store, params}) {

    let news_items = []

    let news_temp = await store.dispatch('storage/getADS').then((data) => data);

    console.log(news_temp)

    Object.entries(news_temp.data).forEach(([k,v]) => {
      news_items.push(v);
    });

    console.log(news_items)

    return {news_items};
  },
}
</script>

<style scoped>

</style>
