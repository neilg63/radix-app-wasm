import { mount } from "@vue/test-utils";
import Console from "@/components/console.vue";
import InputText from "primevue/inputtext";

describe("Console.vue", () => {
  it("Contains an input element", () => {
    mount(InputText);
    const wrapper = mount(Console);
    expect(wrapper.findAll("input.expression-input").length).toBe(1);
  });
});
