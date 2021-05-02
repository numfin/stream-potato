import { uploadTrack } from "@/api/uploadTrack";
import { defineComponent, reactive, ref } from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";

export const UploadTrack = defineComponent({
  name: "UploadTrack",
  setup() {
    const chosenFile = reactive({
      filename: "",
      url: "",
    });
    const resetFile = () => {
      chosenFile.filename = "";
      chosenFile.url = "";
    };
    const pending = ref(false);

    return {
      chosenFile,
      pending,
      setFile(e: Event) {
        const file = (e.target as HTMLInputElement)?.files?.[0];
        if (file) {
          chosenFile.filename = file.name;
          URL.revokeObjectURL(chosenFile.url);
          chosenFile.url = URL.createObjectURL(file);
          chosenFile.filename = file.name;
        }
        (e.target as HTMLInputElement).value = "";
      },
      async upload() {
        pending.value = true;

        try {
          const file = await fetch(chosenFile.url).then((r) => r.blob());

          await uploadTrack({
            title: chosenFile.filename,
            file,
          });
        } catch (err) {
          console.log(err);
        } finally {
          resetFile();
          pending.value = false;
          playlist.load();
        }
      },
    };
  },
  render() {
    return (
      <div class="p-4">
        <span class="font-bold text-gray-300">Add track:</span>
        <div class="flex flex-wrap my-4" v-show={!this.pending}>
          <label class="relative w-max max-w-full block bg-blue-600 text-white shadow cursor-pointer hover:bg-blue-700">
            <input
              type="file"
              class="hidden"
              accept="audio/mpeg"
              onChange={this.setFile}
            />
            <span class="block w-full md:w-56 py-4 px-6 whitespace-nowrap overflow-ellipsis overflow-hidden">
              {this.chosenFile.filename || "Choose file"}
            </span>
          </label>
          <button
            class={[
              "px-4 py-2 shadow text-gray-200 bg-gray-900",
              {
                "opacity-30 cursor-default": !this.chosenFile.url,
              },
            ]}
            onClick={this.chosenFile.url ? this.upload : undefined}
          >
            Confirm
          </button>
        </div>
        <div v-show={this.pending}>Loading...</div>
      </div>
    );
  },
});
