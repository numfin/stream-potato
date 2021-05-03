export interface Track {
  title: string;
  id: string;
  previewUrl?: string;
  mime: string;
  duration: number;
}

export interface AddTrack {
  title: string;
  file: Blob;
}
