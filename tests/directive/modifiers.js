import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, mapValidationAction } from '@/index';

describe('directive modifiers', () => {
  test('.bails modifier', async () => {
    const Vue = createLocalVue();
    // test if it overrides the fastExit global setting.
    Vue.use(VeeValidate, { fastExit: false });

    const wrapper = mount({
      computed: mapValidationState('vee'),
      methods: mapValidationAction('validate'),
      template: `
      <div>
        <input type="text" name="bails" v-validate.bails="'required|min:3|is:3'">
        <p v-for="error in vee.for('bails').errors">{{ error }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await wrapper.vm.validate();
    await flushPromises();

    expect(wrapper.findAll('p')).toHaveLength(1);
  });

  test('.continues modifier', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      methods: mapValidationAction('validate'),
      template: `
      <div>
        <input type="text" name="bails" v-validate.continues="'required|min:3|is:3'">
        <p v-for="error in vee.for('bails').errors">{{ error }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await wrapper.vm.validate();
    await flushPromises();

    expect(wrapper.findAll('p')).toHaveLength(3);
  });

  test('.immediate modifier', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="text" name="field" v-validate.immediate="'required'">
        <p>{{ vee.for('field').errors[0] }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await flushPromises();
    expect(wrapper.find('p').text()).toBe('The field field is required.');
  });
});