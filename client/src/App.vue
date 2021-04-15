<template>
    <div>
        <b-alert :show="dismissCountDown" variant="danger" fade dismissible @dismiss-count-down="countDownChanged">
            An error ocurred during processing of the request.
        </b-alert>
        <b-card 
          align="center"
        >
          <b-card>
              <b-button variant="outline-primary" href="#" v-on:click="getResponse" v-bind:class="{ 'is-loading': isGetting}">Ping</b-button>
          </b-card>
          <em>Hint: Click the content text to toggle full content</em>
          <b-card>
              <b-table small striped hover :items="responses" :fields="fields">
                <template #cell(content)="data">
                    <code v-on:click="toggleContent">{{ data.value }}</code>
                </template>
              </b-table>
              <div v-if="isLoading">Loading responses...</div>
          </b-card>
        </b-card>
    </div>
</template>

<style>
html, div { background: #EEE }
td.content-col { width: 75%; text-align: start; }
td.content-truncate {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; }
</style>

<script>
import axios from 'axios'
import { API_BASE_URL, DATE_API_BASE_URL } from './config'

export default {
    data() {
        return {
            isLoading: true,
            fields: ['date_time', {key: 'content', class: 'content-col content-truncate'}],
            responses: [],
            isGetting: false,
            dismissSecs: 10,
            dismissCountDown: 0
        }
    },
    async created () {
      try {
        const response = await axios.get(`${API_BASE_URL}/responses`)
        this.responses = response.data.data
      } catch (error) {
        console.log(error)
        this.showAlert()
      }
      this.isLoading = false
      this.isGetting = false
    },
    methods: {
      async getResponse() {
        this.isGetting = true
        axios.get(DATE_API_BASE_URL)
            .then(response => {
              this.isGetting = false
              const { date_time } = response.data
              axios.post(`${API_BASE_URL}/responses`, { date_time, content: JSON.stringify(response) })
                  .then(async response => {
                    console.log(response)
                    const update = await axios.get(`${API_BASE_URL}/responses`)
                    this.responses = update.data.data
                  })
                  .catch(error => {
                    console.log(error)
                    this.showAlert()
                  })
            })
            .catch(error => {
              console.log(error)
              this.isGetting = false
              this.showAlert()
            })
      },
      toggleContent(e) {
          e.target.parentElement.classList.toggle('content-truncate')
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
    }
}
</script>