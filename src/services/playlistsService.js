import api from "./api";
import { uploadToCloudinary } from "./cloudinaryService";
import { unwrapList } from "../utils/apiResponse";

export async function getPlaylists() {
  const { data } = await api.get("/admin/playlists");
  return unwrapList(data);
}

export async function getFeaturedPlaylists() {
  const { data } = await api.get("/playlists/featured");
  return unwrapList(data);
}

export async function createPlaylist(playlist) {
  const { data } = await api.post("/playlists", playlist);
  return data;
}

export async function updatePlaylist(id, playlist) {
  const { data } = await api.put(`/playlists/${id}`, playlist);
  return data;
}

export async function deletePlaylist(id) {
  const { data } = await api.delete(`/playlists/${id}`);
  return data;
}

export async function uploadPlaylistCover(file) {
  return uploadToCloudinary(file, {
    resourceType: "image",
    folder: "playlist-covers",
  });
}
