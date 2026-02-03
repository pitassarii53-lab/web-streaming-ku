"use client"
import { supabase } from '../supabase'

export default function Admin() {
  const simpanVideo = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;
    
    // Otomatis ubah link YouTube ke Embed
    let embedLink = link;
    if(link.includes("watch?v=")) {
        embedLink = link.replace("watch?v=", "embed/");
    }

    // KIRIM KE SUPABASE
    const { error } = await supabase
      .from('videos')
      .insert([{ title: judul, url: embedLink }])

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      alert("Mantap! Video berhasil diupload.");
      e.target.reset(); // Kosongkan form lagi
    }
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-5">Panel Admin - Tambah Video</h1>
      <form onSubmit={simpanVideo} className="space-y-4 max-w-lg">
        <input name="judul" placeholder="Judul Film" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" required />
        <input name="link" placeholder="Paste Link YouTube/Video" className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">Upload Sekarang</button>
      </form>
    </div>
  );
}
