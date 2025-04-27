
import { useState } from "react";
import { ContentItem } from "@/services/storageService";

interface MusicPlayerProps {
  tracks: ContentItem[];
}

const MusicPlayer = ({ tracks }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState<ContentItem | null>(null);

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-site-gray text-lg">No music tracks uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Active player */}
      {currentTrack && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-3">{currentTrack.title}</h2>
          <div className="mb-4">
            <audio controls className="w-full" src={currentTrack.url} autoPlay />
          </div>
          {currentTrack.description && (
            <p className="text-site-gray">{currentTrack.description}</p>
          )}
        </div>
      )}

      {/* Track list */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium">All Tracks</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {tracks.map((track) => (
            <li
              key={track.id}
              onClick={() => setCurrentTrack(track)}
              className={`flex items-center p-4 cursor-pointer hover:bg-site-light-gray transition-colors ${
                currentTrack?.id === track.id ? "bg-site-light-gray" : ""
              }`}
            >
              <div className="flex-1">
                <h4 className="font-medium">{track.title}</h4>
                {track.description && (
                  <p className="text-sm text-site-gray line-clamp-1">{track.description}</p>
                )}
              </div>
              <button 
                className="ml-4 p-2 rounded-full bg-site-gray text-white hover:bg-site-dark-gray transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentTrack(track);
                }}
              >
                {currentTrack?.id === track.id ? "Playing" : "Play"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;