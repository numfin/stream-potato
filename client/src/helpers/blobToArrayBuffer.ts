export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (target?.result instanceof ArrayBuffer) {
        resolve(target.result);
      } else {
        reject();
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}
