export const uploadImageToServer = async (base64Str: string, folder: string = 'uploads'): Promise<string> => {
  try {
    // Convert base64 data URI to a Blob natively using fetch
    const fetchResponse = await fetch(base64Str);
    const blob = await fetchResponse.blob();

    const formData = new FormData();
    formData.append('image', blob, `image.${blob.type.split('/')[1] || 'webp'}`);
    formData.append('folder', folder);

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Resim yüklenirken hata oluştu');
    }

    return data.url;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};
