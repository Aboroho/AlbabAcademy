"use client";

import { imageToDataUrl } from "@/lib/utils";
import { ChangeEventHandler, useRef, useState } from "react";

type Props = {
  render: (
    trigger: () => void,
    images: File[],
    imageUrls: string[],
    eraseFile: (idx: number) => void
  ) => React.ReactNode;

  onImageChange: (images: File[], imageUrls: string[]) => void;

  multiple?: boolean;
  defaultImageUrl?: string;
};

export function ImageUpload({
  render,
  multiple = false,
  onImageChange,
  defaultImageUrl,
}: Props) {
  const [imageUrls, setImageUrls] = useState<string[]>(
    defaultImageUrl ? [defaultImageUrl] : []
  );
  const [images, setImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const trigger = () => inputRef.current?.click();

  const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const images = Array.from(files);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(await imageToDataUrl(files[i]));
      }
      const imageUrls = urls;

      onImageChange(images, imageUrls);
      setImageUrls(imageUrls);
      setImages(images);
    }
  };

  const eraseFile = (idx: number) => {
    const fileteredImages = images.filter((_, index) => index !== idx);
    const fileteredImageUrls = imageUrls.filter((_, index) => index !== idx);

    onImageChange(fileteredImages, fileteredImageUrls);
    setImageUrls(fileteredImageUrls);
    setImages(fileteredImages);
  };

  return (
    <>
      <input
        type="file"
        multiple={multiple}
        onChange={fileChangeHandler}
        className="hidden"
        ref={inputRef}
      />
      {render(trigger, images, imageUrls, eraseFile)}
    </>
  );
}
