import { reactive } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

function useAppState() {
  return {
    state: reactive({
      isControl: computed({
        get: () => !location.pathname.startsWith("/player"),
        set: (state: boolean) => {
          location.pathname = state ? "/" : "/player";
        },
      }),
    }),
  };
}
export const appState = useAppState();
