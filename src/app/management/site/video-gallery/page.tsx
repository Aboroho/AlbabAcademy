import React from "react";
import MediaManager from "../image-gallery/MediaManager";

type Props = {};

function VideoGallery({}: Props) {
  return <MediaManager groupName="video" pageTitle="Video Gallery" />;
}

export default VideoGallery;
