/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
const vuetify = createVuetify({
    components,
    directives,
})

const app=createApp(App);
app.use(vuetify)
app.use(PrimeVue);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputText', InputText);
app.mount('#app');