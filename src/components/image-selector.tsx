import { ChangeEvent, useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

const ImageSelector = <T extends FieldValues>({
  control,
  name,
}: UseControllerProps<T>) => {
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [scale, setScale] = useState<number>(1.5);
  const ref = useRef<AvatarEditor>(null);
  const { field }: any = useController({
    name,
    control,
  });
  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);
  const getCroppedImage = () => {
    const image = ref.current?.getImage();
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image!, 0, 0, 80, 80);

    field.onChange(canvas.toDataURL('image/png') as any);
    setSelectedImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
  });
  return (
    <div
      className="aspect-square relative  rounded-full w-40 border border-dashed"
      {...getRootProps()}
    >
      <input className="hidden" {...getInputProps} />
      {field.value && (
        <img
          className="w-full absolute block rounded-full top-0 left-0 h-full"
          src={field.value}
        />
      )}
      {selectedImage && (
        <div>
          <AvatarEditor
            ref={ref}
            image={selectedImage}
            width={250}
            height={250}
            borderRadius={125}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={scale}
            rotate={0}
          />
          <input
            type="range"
            min={1}
            max={2}
            defaultValue={1.5}
            step={0.1}
            onChange={handleScaleChange}
          />
        </div>
      )}
      {field.value && <button onClick={() => field.onChange('')}>削除</button>}
      {selectedImage && (
        <div className="flex space-x-4 justify-end">
          <button className="px-3 rounded-full bg-slate-200 py-2">
            閉じる
          </button>
          <button
            onClick={getCroppedImage}
            className="px-3 rounded-full bg-blue-500 text-white py-2"
          >
            保存
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
