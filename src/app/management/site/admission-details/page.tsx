"use client";

import ImageGalleryManager from "../image-gallery/MediaManager";

type Props = {};

function AdmissionDetails({}: Props) {
  return (
    <ImageGalleryManager
      pageTitle="Admission Details Media"
      groupName="admission-details"
    />
  );
}

export default AdmissionDetails;
