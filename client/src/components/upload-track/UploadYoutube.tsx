import { ws } from "@/api/ws";
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import axios from "axios";

export const UploadYoutube = defineComponent({
  name: "UploadYoutube",
  setup() {
    const inputstring = ref("");
    const url = computed(() => {
      try {
        return new URL(inputstring.value);
      } catch {
        return;
      }
    });
    const hasPlaylist = computed(() => {
      return url.value?.searchParams.has("list");
    });
    const hasVideo = computed(() => {
      return url.value?.searchParams.has("v");
    });
    const isYT = computed(() => {
      return url.value?.host === "www.youtube.com";
    });

    const playlist = ref<string[]>([]);
    const pending = ref(false);

    let reqId = Symbol();
    watch(inputstring, async (playlistLink) => {
      pending.value = true;
      const currReqId = Symbol();
      reqId = currReqId;
      playlist.value = [];
      try {
        const { data } = await axios.get<string[]>("/api/yt", {
          params: { link: playlistLink },
        });
        if (currReqId === reqId) {
          playlist.value = data;
        }
      } catch (err) {
        if (currReqId === reqId) {
          playlist.value = [];
        }
      } finally {
        pending.value = false;
      }
    });

    const isValidPlaylist = computed(() => {
      return hasPlaylist.value && playlist.value.length > 0;
    });

    return {
      pending,
      playlist,
      inputstring,
      valid: computed(() => {
        try {
          return isYT.value && (hasVideo.value || isValidPlaylist);
        } catch (err) {
          return false;
        }
      }),
      upload() {
        playlist.value.forEach((link) => {
          ws.send({
            name: "uploadYoutube",
            data: { link },
          });
        });
        inputstring.value = "";
      },
    };
  },
  render() {
    return (
      <div class="px-4">
        <div class="text-white mb-2 font-bold">
          Youtube/Playlist: ({this.playlist.length})
        </div>
        <div class="flex">
          <input
            type="text"
            class={[
              "bg-gray-900 p-4 w-full md:w-56 outline-none border border-gray-900 focus:border-gray-500 focus:border text-white",
            ]}
            placeholder="Youtube link"
            v-model={this.inputstring}
          />
          <button
            class={[
              "px-4 py-2 shadow text-gray-200 bg-gray-900",
              {
                "opacity-30 cursor-default": !this.valid || this.pending,
              },
            ]}
            onClick={() => {
              if (this.valid && !this.pending) {
                this.upload();
              }
            }}
          >
            {this.pending ? "Loading..." : "Confirm"}
          </button>
        </div>
      </div>
    );
  },
});
