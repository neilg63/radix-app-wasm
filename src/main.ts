import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import SelectButton from "primevue/selectbutton";
import SplitButton from "primevue/splitbutton";
import Toast from "primevue/toast";
import "./registerServiceWorker";
const app = createApp(App);

import "primevue/resources/themes/luna-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

app.use(router);
app.use(PrimeVue);
app.component("Button", Button);
app.component("SelectButton", SelectButton);
app.component("SplitButton", SplitButton);
app.component("InputText", InputText);
app.component("Toast", Toast);

app.mount("#app");
