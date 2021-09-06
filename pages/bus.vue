<template>
  <div>
    <div class="row justify-content-center my-2">
      <div class="col-lg-4 col-md-4 col-sm-8">
        <h5 class="my-2">รถเวียนที่ลงทะเบียนแล้ว</h5>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-4 text-end">
        <button class="btn btn-outline-success border-0 btn-sm m-1"
                @click="create_bus()"
        >
          <font-awesome-icon :icon="['fas', 'plus']"/>
          เพิ่มรถ
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
                   table hover
                   striped
                   borderless
                   responsive
                   :items="car_items"
                   :fields="car_table_column"
          >

            <template v-slot:cell(upTime)="data">
                <span class="align-middle">
                  {{format_time_col(data.item.upTime)}}
                </span>
            </template>
            <template v-slot:cell(action)="data">
                <span><a @click="edit_bus(data.item)" class="btn btn-sm btn-outline-secondary border-0">
                    <span class="material-icons align-middle action">edit</span>
                </a></span>
              <span><a @click="delete_bus(data.item)" class="btn btn-sm btn-outline-danger border-0">
                  <span class="material-icons align-middle action">delete</span>
                </a></span>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>
    <div class="row justify-content-center mt-5 mb-2">
      <div class="col-lg-7 col-md-8 col-sm-12">
        <h5 class="my-2">รถเวียนที่รอลงทะเบียน</h5>
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
                   table hover
                   striped
                   borderless
                   responsive
                   :items="pending_items"
                   :fields="pending_table_column"
          >

            <template v-slot:cell(created_time)="data">
                <span class="align-middle">
                  {{format_time_col(data.item.created_time)}}
                </span>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>

    <!--    <div class="row justify-content-center my-5">-->
    <!--      <div class="col-md-8 col-sm-12">-->
    <!--        <b-list-group>-->
    <!--          <template v-for="data in items">-->
    <!--            <b-list-group-item href="#" class="flex-column align-items-start">-->
    <!--            <div class="d-flex w-100 justify-content-between">-->
    <!--              <h5 class="mb-1">{{data.name}}</h5>-->
    <!--              <div class="col-auto">-->
    <!--                <a @click="edit_bus(data.token)" class="btn btn-sm btn-outline-secondary border-0">-->
    <!--                  <span class="material-icons align-middle action">edit</span>-->
    <!--                </a>-->
    <!--                <a @click="delete_bus(data)" class="btn btn-sm btn-outline-danger border-0">-->
    <!--                  <span class="material-icons align-middle action">delete</span>-->
    <!--                </a>-->
    <!--              </div>-->
    <!--            </div>-->

    <!--            <p class="mb-1">{{data.desc}}</p>-->

    <!--            <div class="d-flex w-100">-->
    <!--              <b-badge variant="primary" class="pr-2 mr-1" pill>{{ data.token }}</b-badge>-->
    <!--              <small>{{ format_time_col(data.time) }}</small>-->
    <!--            </div>-->

    <!--          </b-list-group-item>-->
    <!--          </template>-->
    <!--        </b-list-group>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import moment from "moment";
moment.locale('th');

export default {

  name: 'bus',

  head() {
    return {
      title: "RSU Shuttle bus - Admin"
    };
  },

  data() {

    return {
      car_items: [],
      pending_items: [],
      car_table_column: [
        { key: 'name',   label: 'รถเวียน', sortable: true },
        { key: 'car_id',  label: 'รหัส', tdClass: 'font-monospace' },
        { key: 'desc',   label: 'คำธิบาย', },
        { key: 'upTime',   label: 'ใช้งานล่าสุด', sortable: true},
        { key: 'action', label: '', thClass: 'text-dark', tdClass: 'small-col align-content-end ' },
      ],
      pending_table_column: [
        { key: 'name',   label: 'รถเวียน', sortable: true},
        { key: 'car_id',  label: 'รหัส', tdClass: 'font-monospace' },
        { key: 'desc',   label: 'คำธิบาย',  },
        { key: 'created_time',   label: 'เวลาที่เริ่มรอลงทะเบียน', sortable: true},
      ],
    }
  },

  methods: {

    format_time_col(dt) {
      if(Number.isInteger(dt)) {
        return moment.unix(dt).format('Do-MM-YYYY LTS');
      }
      return moment(dt).format('Do-MM-YYYY LTS')
    },

    async reload() {
      console.log('YEP');

      let car_items = []
      let pending_items = []

      let car_temp = await this.$store.dispatch('storage/getAllCar').then((data) => data);
      Object.entries(car_temp).forEach(([k,v]) => {
        v['car_id'] = k;
        car_items.push(v);
      });

      let pending_temp = await this.$store.dispatch('storage/getAllPending').then((data) => data.data);
      Object.entries(pending_temp).forEach(([k,v]) => {
        v['car_id'] = k;
        pending_items.push(v);
      });

      this.car_items = car_items;
      this.pending_items = pending_items;
    },

    async create_bus() {
      let result = await this.$swal.fire({
        title: 'Create bus',
        html:`
        <form class="text-left">
          <div class="mb-3">
            <label for="car-name" class="form-label">Shuttle Bus Name</label>
            <input type="text" class="form-control" id="create-car-name" required>
          </div>
          <div class="mb-3">
            <label for="car_desc" class="form-label">Description</label>
            <textarea type="text" class="form-control" id="create-car-desc" required></textarea>
          </div>
        </form>
        `,

        // '<input id="swal-input1" class="swal2-input" title="Name">' +
        // '<input id="swal-input2" class="swal2-input" title="Description">',
        focusConfirm: false,
        preConfirm: () => {
          return {
            'name': document.getElementById('create-car-name').value,
            'desc': document.getElementById('create-car-desc').value
          }
        }
      }).then((data) => data);

      console.log(result)

      if(result.isConfirmed) {
        let params = result.value;
        let re = await this.$store.dispatch('storage/createCar', params).then((data) => data);
        await this.reload();
        console.log(re);
      }

    },

    async edit_bus(data) {
      let result = await this.$swal.fire({
        title: 'Edit bus',
        html:`
        <form class="text-left">
          <div class="mb-3">
            <label for="car-name" class="form-label">Shuttle Bus Name</label>
            <input type="text" class="form-control" id="edit-car-name" value="` + data.name + `" required>
          </div>
          <div class="mb-3">
            <label for="car_desc" class="form-label">Description</label>
            <textarea type="text" class="form-control" id="edit-car-desc" required>` + data.desc + `</textarea>
          </div>
        </form>
        `,

        // '<input id="swal-input1" class="swal2-input" title="Name">' +
        // '<input id="swal-input2" class="swal2-input" title="Description">',
        focusConfirm: false,
        preConfirm: () => {
          return {
            'car_id': data.car_id,
            'name': document.getElementById('edit-car-name').value,
            'desc': document.getElementById('edit-car-desc').value
          }
        }
      }).then((data) => data);

      console.log(result)

      if(result.isConfirmed) {
        let params = result.value;
        let re = await this.$store.dispatch('storage/editCar', params).then((data) => data);
        this.reload();
        console.log(re);
      }
    },

    async delete_bus(data) {
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
            'car_id': data.car_id,
          }
        }
      }).then((data) => data);

      console.log(result)

      if (result.isConfirmed) {
        let params = result.value;
        let re = await this.$store.dispatch('storage/deleteCar', params).then((data) => data);
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
        this.reload();
        console.log(re);
      }
    },
  },

  async asyncData({route, store, params}) {

    let car_items = []
    let pending_items = []

    let car_temp = await store.dispatch('storage/getAllCar').then((data) => data);
    Object.entries(car_temp).forEach(([k,v]) => {
      v['car_id'] = k;
      car_items.push(v);
    });

    let pending_temp = await store.dispatch('storage/getAllPending').then((data) => data.data);
    Object.entries(pending_temp).forEach(([k,v]) => {
      v['car_id'] = k;
      pending_items.push(v);
    });

    return {car_items, pending_items}
  },
}
</script>

<style>

</style>
