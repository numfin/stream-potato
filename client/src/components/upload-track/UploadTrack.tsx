import { uploadTrack } from "@/api/uploadTrack";
import { defineComponent, ref } from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";

export const UploadTrack = defineComponent({
  name: "UploadTrack",
  setup() {
    const pickedFiles = ref<{ filename: string; url: string }[]>([]);
    const reset = () => {
      pickedFiles.value = [];
    };
    const pending = ref(false);

    return {
      pickedFiles,
      pending,
      setFile(e: Event) {
        const files = (e.target as HTMLInputElement)?.files ?? [];
        pickedFiles.value = [...(files as File[])].map((file) => {
          return {
            filename: file.name,
            url: URL.createObjectURL(file),
          };
        });
        (e.target as HTMLInputElement).value = "";
      },
      async upload() {
        pending.value = true;

        try {
          const files = await Promise.all(
            pickedFiles.value.map((f) =>
              fetch(f.url)
                .then((r) => r.blob())
                .then((file) => ({ file, meta: f })),
            ),
          );

          await Promise.all(
            files.map(({ file, meta }) => {
              return uploadTrack({
                title: meta.filename,
                file,
              });
            }),
          );
        } catch (err) {
          console.log(err);
        } finally {
          reset();
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
              multiple
            />
            <span class="block w-full md:w-56 py-4 px-6 whitespace-nowrap overflow-ellipsis overflow-hidden">
              {this.pickedFiles.length > 1
                ? `Picked files (${this.pickedFiles.length})`
                : this.pickedFiles[0]?.filename || "Choose file"}
            </span>
          </label>
          <button
            class={[
              "px-4 py-2 shadow text-gray-200 bg-gray-900",
              {
                "opacity-30 cursor-default": this.pickedFiles.length === 0,
              },
            ]}
            onClick={this.pickedFiles.length > 0 ? this.upload : undefined}
          >
            Confirm
          </button>
        </div>
        <div v-show={this.pending}>Loading...</div>
      </div>
    );
  },
});
