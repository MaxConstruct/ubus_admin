<template>
  <div>
    <div class="row justify-content-center my-2">
      <div class="col-lg-4 col-md-4 col-sm-8">
        <h5 class="my-2">สถานี</h5>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-4 text-end">
        <button class="btn btn-outline-success border-0 btn-sm m-1"
                @click="create_station()"
        >
          <font-awesome-icon :icon="['fas', 'plus']"/>
          เพิ่มสถานี
        </button>
        <button class="btn btn-outline-secondary border-0 btn-sm m-1"
                @click="reload()"
        >
          <font-awesome-icon :icon="['fas', 'sync-alt']"/>
          อัปเดต
        </button>
      </div>

    </div>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-sm-12">
        <b-card class="shadow-sm px-0 border-0"
                body-class="px-0"
        >
          <b-table class=""
                   thead-tr-class="border-bottom"
                   tbody-tr-class=""
                   :sort-by.sync="sortBy"
                   table hover
                   striped
                   borderless
                   responsive
                   :items="station_items"
                   :fields="station_table_column"
          >
            <template v-slot:cell(action)="data">
                <span><a @click="edit_station(data.item)" class="btn btn-sm btn-outline-secondary border-0">
                    <span class="material-icons align-middle action">edit</span>
                </a></span>
              <span><a @click="delete_station(data.item)" class="btn btn-sm btn-outline-danger border-0">
                  <span class="material-icons align-middle action">delete</span>
                </a></span>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>


  </div>
</template>

<script>
import moment from "moment";
moment.locale('th');

export default {

  name: 'station',

  head() {
    return {
      title: "RSU Shuttle bus - Admin"
    };
  },

  data() {
    return {
      station_items: [],
      sortBy: 'order',
      station_table_column: [
        { key: 'order',   label: 'ลำดับ', tdClass: 'pl-4',  thClass: 'pl-4', sortable: true},
        { key: 'name',   label: 'ชื่อสถานี', sortable: true },
        { key: 'desc',  label: 'คำอธิบาย', },
        { key: 'lat',   label: 'LATITUDE', },
        { key: 'lng',   label: 'LONGITUDE',},
        { key: 'action', label: '#', tdClass: 'small-col align-content-end' },
      ],
    }
  },

  methods: {

    sort_row(data_items) {
      return data_items.sort((a, b) => a['order'] - b['order']);
    },

    format_time_col(dt) {
      if(Number.isInteger(dt)) {
        return moment.unix(dt).format('Do-MM-YYYY LTS');
      }
      return moment(dt).format('Do-MM-YYYY LTS')
    },

    async reload() {
      console.log('YEP');

      let station_items = []
      let station_temp = await this.$store.dispatch('storage/getAllStation');

      Object.entries(station_temp).forEach(([k,v]) => {
        v['id'] = k
        station_items.push(v);
      });

      console.log(station_items);
      this.station_items = station_items;
    },

    async create_station() {
      let result = await this.$swal.fire({
        title: 'เพิ่มสถานี',
        html:`
        <form class="text-left">
          <div class="mb-3">
            <label for="create-station-name" class="form-label">ชื่อสถานี</label>
            <input type="text" class="form-control" id="create-station-name" required>
          </div>
          <div class="mb-3">
            <label for="create-station-desc" class="form-label">คำอธิบาย</label>
            <textarea type="text" class="form-control" id="create-station-desc" required></textarea>
          </div>
          <div class="row">
             <div class="mb-3">
              <label for="create-station-lat" class="form-label">ละติจูด</label>
              <input type="number" class="form-control" id="create-station-lat" required>
            </div>
            <div class="mb-3">
              <label for="create-station-lng" class="form-label">ลองจิจูด</label>
              <input type="number" class="form-control" id="create-station-lng" required>
            </div>
          </div>

          <div class="mb-3">
            <label for="create-station-order" class="form-label">Order</label>
            <input type="number" class="form-control" id="create-station-order" required>
          </div>
        </form>
        `,

        // '<input id="swal-input1" class="swal2-input" title="Name">' +
        // '<input id="swal-input2" class="swal2-input" title="Description">',
        focusConfirm: false,
        preConfirm: () => {
          return {
            'name': document.getElementById('create-station-name').value,
            'desc': document.getElementById('create-station-desc').value,
            'lat': document.getElementById('create-station-lat').value,
            'lng': document.getElementById('create-station-lng').value,
            'order': document.getElementById('create-station-order').value,
          }
        }
      }).then((data) => data);

      console.log(result)

      if(result.isConfirmed) {
        let params = result.value;
        let re = await this.$store.dispatch('storage/createStation', params);
        await this.reload();
        console.log(re);
      }

    },

    async edit_station(data) {
      let result = await this.$swal.fire({
        title: 'Edit station',
        html:`
        <form class="text-left">
          <div class="mb-3">
            <label for="edit-station-name" class="form-label">Shuttle Bus Name</label>
            <input type="text" class="form-control" id="edit-station-name" value="` + data.name + `" required>
          </div>
          <div class="mb-3">
            <label for="edit-station-desc" class="form-label">Description</label>
            <textarea type="text" class="form-control" id="edit-station-desc" required>` + data.desc + `</textarea>
          </div>
          <div class="mb-3">
            <label for="edit-station-lat" class="form-label">Latitude</label>
            <input type="number" class="form-control" id="edit-station-lat" value="` + data.lat + `" required>
          </div>
          <div class="mb-3">
            <label for="edit-station-lng" class="form-label">Longitude</label>
            <input type="number" class="form-control" id="edit-station-lng" value="` + data.lng + `" required>
          </div>
          <div class="mb-3">
            <label for="edit-station-order" class="form-label">Order</label>
            <input type="number" class="form-control" id="edit-station-order" value="` + data.order + `" required>
          </div>
        </form>
        `,

        // '<input id="swal-input1" class="swal2-input" title="Name">' +
        // '<input id="swal-input2" class="swal2-input" title="Description">',
        focusConfirm: false,
        preConfirm: () => {

          let form_data = {
            'id': data.id,
            'name': document.getElementById('edit-station-name').value,
            'desc': document.getElementById('edit-station-desc').value,
            'lat': document.getElementById('edit-station-lat').value,
            'lng': document.getElementById('edit-station-lng').value,
            'order': document.getElementById('edit-station-order').value,
          }

          // this.$swal.showValidationMessage('First input missing')
          return form_data;
        }
      }).then((data) => data);

      console.log(result)

      if(result.isConfirmed) {
        let params = result.value;
        await this.$store.dispatch('storage/editStation', params);
        await this.reload();
      }
    },

    async delete_station(data) {
      let result = await this.$swal.fire({
        title: 'ยืนยันการลบ',
        text: "คุณต้องการที่จะลบ " + data.name + ' หรือไม่',
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
        let re = await this.$store.dispatch('storage/deleteStation', params);
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

    let station_items = []

    let station_data = await store.dispatch('storage/getAllStation');
    Object.entries(station_data).forEach(([k,v]) => {
      v['id'] = k
      station_items.push(v);
    });
    console.log(station_data)
    return {station_items, station_data}
  },
}
</script>

<style>

</style>
