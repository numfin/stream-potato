export interface Track {
  title: string;
  id: string;
  previewUrl?: string;
  mime: string;
}

export interface AddTrack {
  title: string;
  file: Blob;
}
