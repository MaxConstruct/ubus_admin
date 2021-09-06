
export const actions = {

  async getAllCar({commit}, data) {
    return this.$axios.get(`api/location`, data).then((res) => res.data);
  },

  async getAllPending({commit}, data) {
    return this.$axios.get(`api/v1/bus/pending`, data).then((res) => res.data);
  },

  async getAllStation({commit}, data) {
    return this.$axios.get(`api/v1/station/list`, data).then((res) => res.data);
  },

  async getAllLog({commit}, data) {
    return this.$axios.get(`api/v1/log/get`, {
      params: {
        limit: data ? data.limit : null,
        page: data ? data.page : null,
        unique: data ? data.unique : null
      }
    }).then((res) => res.data);
  },

  async editCar({commit}, data) {
    return this.$axios.post(`api/v1/bus/edit`, data).then((res) => res.data);
  },

  async editStation({commit}, data) {
    return this.$axios.post(`api/v1/station/edit`, data).then((res) => res.data);
  },

  async createCar({commit}, data) {
    return this.$axios.post(`api/v1/bus/create`, data).then((res) => res.data);
  },

  async createStation({commit}, data) {
    return this.$axios.post(`api/v1/station/create`, data).then((res) => res.data);
  },

  async deleteCar({commit}, data) {
    return this.$axios.delete(`api/v1/bus/destroy`, {data: data}).then((res) => res.data);
  },

  async deleteStation({commit}, data) {
    return this.$axios.delete(`api/v1/station/destroy`, {data: data}).then((res) => res.data);
  },

  async getADS({commit}, data) {
    return this.$axios.get(`api/v1/advert/list`, data).then((res) => res.data);
  },

  async uploadImage({commit}, data) {
    return this.$axios.post(`api/upload/image`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  },
  async createADS({commit}, data) {
    return this.$axios.post(`api/v1/advert/create`, data).then((res) => res.data);
  },

  async editADS({commit}, data) {
    return this.$axios.post(`api/v1/advert/edit`, {data: data}).then((res) => res.data);
  },

  async deleteADS({commit}, data) {
    return this.$axios.delete(`api/v1/advert/destroy`, {data: data}).then((res) => res.data);
  },

  async getLogCSV({commit}, data) {
    return this.$axios.get(`api/v1/log/get?csv=1`, { responseType: 'blob', data: data }).then((res) => res.data);
  }

}
