import { shallowMount } from "@vue/test-utils";
import Console from "@/components/Console.vue";

describe("Console.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(Console, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
