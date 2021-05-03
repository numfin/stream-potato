import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

function useAppState() {
  const isControl = ref(localStorage.getItem("is-control") === "1");
  return {
    state: reactive({
      isControl: computed({
        get: () => isControl.value,
        set: (state: boolean) => {
          isControl.value = state;
          localStorage.setItem("is-control", String(state ? "1" : "0"));
        },
      }),
    }),
  };
}
export const appState = useAppState();
