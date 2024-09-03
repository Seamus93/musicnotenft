import React from 'react';

function FileMetadata({ metadata }) {
  if (!metadata) return null;

  return (
    <div>
      <p>Title: {metadata.title}</p>
      <p>Artist: {metadata.artist}</p>
      <p>Album: {metadata.album}</p>
      <p>Year: {metadata.year}</p>
      <p>Genre: {metadata.genre}</p>
      <p>Comment: {metadata.comment}</p>
    </div>
  );
}

export default FileMetadata;
