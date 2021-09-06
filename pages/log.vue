<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="row justify-content-between my-4">
        <!--      <div class="col-lg-3 col-md-4 col-sm-5 px-lg-0 px-md-0 px-sm-0 my-2 my-lg-0 my-md-0 my-sm-0">-->
        <div class="col-md-4">
          <b-form-group label="เลือกรถเวียน" label-for="car-select" class="form-label">
            <b-form-select @change="reload(true)" v-model="bus_selected" :options="bus_options" id="car-select"></b-form-select>
          </b-form-group>
        </div>
        <div class="col-md-3">
          <b-form-group label="แสดง" label-for="count-select" class="form-label">
            <b-form-select @change="reload()" v-model="display_row" :options="page_options" id="count-select"></b-form-select>
          </b-form-group>
          <b-button id="show-btn" variant="outline-primary" @click="$bvModal.show('exportToCSV')">Download Log</b-button>

          <!-- Button trigger modal -->
          <!-- Button trigger modal -->

          <b-modal id="exportToCSV" hide-footer>
            <template #modal-title>
              ดาวน์โหลดฐานข้อมูลตำแหน่งรถย้อนหลัง
            </template>
            <div class="d-block text-center">
              <b-row class="text-left">
                <label for="start-datepicker">วัน-เวลาที่เริ่ม</label>
                <b-col>
                  <b-form-datepicker id="start-datepicker" locale="th" :date-format-options="dateFormatOptions" v-model="date.start" class="mb-2"></b-form-datepicker>
                </b-col>
                <b-col>
                  <b-form-timepicker v-model="time.start" locale="th"></b-form-timepicker>
                </b-col>
              </b-row>

              <b-row class="text-left">
                <label for="end-datepicker">วัน-เวลาสิ้นสุด</label>
                <b-col>
                  <b-form-datepicker id="end-datepicker" locale="th" :date-format-options="dateFormatOptions" v-model="date.end" class="mb-2"></b-form-datepicker>
                </b-col>
                <b-col>
                  <b-form-timepicker v-model="time.end" locale="th"></b-form-timepicker>
                </b-col>
              </b-row>

            </div>
            <b-button class="mt-3" variant="success" block @click="getCSV()">ยืนยัน</b-button>
          </b-modal>
<!--          <button class="btn btn-success" @click="getCSV()">Export to CSV</button>-->
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md">
          <b-card class="shadow-sm px-0 border-0"
                  body-class="px-0"
          >
            <b-table class=""
                     thead-class=""
                     tbody-class=""
                     thead-tr-class="border-bottom"
                     tbody-tr-class=""
                     :per-page="display_row"
                     table hover
                     striped
                     borderless
                     small
                     :items="log_items"
                     :fields="log_table_column"
            >
              <template v-slot:cell(message_unique)="data">
<!--                <span>{{bus_data[data.item.message_unique].name}}</span>-->
                <span>{{ data.item.message.split("is")[0] }}</span>
              </template>

              <template v-slot:cell(message)="data">
<!--                <span>{{station_data[format_message(data.item.message)].name}}</span>-->
                <span>{{ data.item.message.split("at ")[1] }}</span>
              </template>

              <template v-slot:cell(message_time)="data">
                <span>{{ format_time_col(data.item.message_time) }}</span>
              </template>


            </b-table>
          </b-card>
        </div>
        <div class="row justify-content-center my-4">
          <b-pagination
            v-model="current_page"
            :total-rows="log_page"
            :per-page="display_row"
            @input="reload()"
            align="fill"
            size="sm"
            class="col-lg-auto col-md-auto col-sm-auto my-0"
          ></b-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
moment.locale('th');
const FileDownload = require('js-file-download');
export default {

  name: 'log',

  head() {
    return {
      title: "RSU Shuttle bus - Admin"
    };
  },

  data() {

    return {
      log_page: 1,
      log_table_column: [
        { key: 'message_unique',   label: 'รถเวียน', sortable: true },
        { key: 'message',   label: 'สถานีที่ผ่าน', },
        { key: 'message_time',  label: 'เวลา', sortable: true },
      ],
      log_items: [],
      bus_data: [],
      station_data: [],
      bus_selected: null,
      bus_options: [],
      current_page: 1,
      log_count: 0,
      display_row: 10,
      page_options: [
        10,
        20,
        50,
        100
      ],
      date: {
        start: '',
        end: '',
      },
      time: {
        start: '00:00:00',
        end: '',
      },
      dateFormatOptions: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
    }
  },

  mounted() {
    this.date.start = moment().format('YYYY-MM') + '-01';
    this.date.end = moment().format('YYYY-MM-DD')
    this.time.end = moment().format('HH:mm:ss')
  },

  methods: {

    async getCSV() {
      let start_date = moment(this.date.start + ' ' + this.time.start).unix();
      let end_date = moment(this.date.end + ' ' + this.time.end).unix();
      await this.$store.dispatch('storage/getLogCSV', {start: start_date, end: end_date}).then((data) => {
        FileDownload(data, 'report.csv');
      })
      this.$bvModal.hide('exportToCSV');
    },

    format_message(message) {
      let m_split = message.split(' ');
      let len = m_split.length;
      return m_split[len - 1];
    },
    format_time_col(dt) {
      if(Number.isInteger(dt)) {
        return moment.unix(dt).format('Do-MM-YYYY LTS');
      }
      return moment(dt).format('Do-MM-YYYY LTS')
    },

    async reload(reset) {

      let query_params = {
        'page': this.current_page,
        'limit': this.display_row,
        'unique': this.bus_selected,
      }

      console.log(query_params);

      let log_items = []
      await this.$store.dispatch('storage/getAllLog', query_params).then((data) => {
        if(data.code == 200) {
          log_items = data.data;
          if(reset) {
            this.log_page = data.count;
          }
        }
      });
      console.log(log_items);
      this.log_items = log_items

      if(reset) {
        this.current_page = 1;
      }
    },
  },

  async asyncData({route, store, params}) {

    let bus_options = [];
    let display_row = 10

    let station_data = await store.dispatch('storage/getAllStation');
    console.log(station_data);
    let bus_data = await store.dispatch('storage/getAllCar');

    Object.entries(bus_data).forEach(([k, v]) => {
      bus_options.push({value: k, text: v['name']});
    });
    let log_page = 1;
    let log_items = [];
    await store.dispatch('storage/getAllLog', {limit: display_row, page:1}).then((data) => {
      if(data.code == 200) {
        log_page = data.count;
        log_items = data.data;
      }
    });
    bus_options.push({value: null, text: 'All bus'});
    bus_options.reverse();
    return {station_data, bus_data, bus_options, log_items, log_page, display_row}
  },
}
</script>

<style>

</style>
