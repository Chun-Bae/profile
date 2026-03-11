'use server'

import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const jsonData = formData.get('profileData') as string
  const lang = (formData.get('lang') as string) || 'ko';
  const bucketUrl = process.env.OCI_BUCKET_URL;

  // 1. 유효성 검사 (올바른 JSON 형태인지 확인)
  try {
    JSON.parse(jsonData)
  } catch (error) {
    return { error: 'Invalid JSON format. Please check your syntax.' }
  }

  // 2. OCI URI 환경변수 확인
  if (!bucketUrl) {
    return { error: 'OCI_BUCKET_URL environment variable is not set. Cannot save to cloud.' }
  }

  const filename = `profile_${lang}.json`;
  const ociUrl = bucketUrl.endsWith('/') ? `${bucketUrl}${filename}` : `${bucketUrl}/${filename}`;

  // 3. OCI 버킷에 저장 (미리 인증된 요청의 읽기/쓰기 URL 사용)
  try {
    const res = await fetch(ociUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })

    if (!res.ok) {
      const text = await res.text();
      return { error: `Failed to save changes to OCI: ${res.status} - ${text}` }
    }
  } catch (error: any) {
    return { error: `Network error updating OCI: ${error.message}` }
  }

  // 4. 저장 완료 및 서버 상태 갱신
  revalidatePath('/')
  
  return { success: 'Profile updated successfully!' }
}

export async function checkPassword(password: string) {
  const sitePassword = process.env.SITE_EDIT_PASSWORD;
  return password === sitePassword;
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const type = formData.get('type') as 'avatar' | 'banner' | 'generic';
  
  const bucketUrl = process.env.OCI_BUCKET_URL;

  if (!bucketUrl) {
    return { error: `OCI_BUCKET_URL 환경 변수가 .env.local에 설정되어 있지 않습니다.` }
  }

  let filename = file.name;
  if (type === 'avatar') {
    filename = 'profile_img.jpeg';
  } else if (type === 'banner') {
    filename = 'profile_img_banner.jpg';
  } else {
    filename = (formData.get('filename') as string) || encodeURIComponent(file.name.replace(/\s+/g, '_'));
  }

  const ociUrl = bucketUrl.endsWith('/') ? `${bucketUrl}${filename}` : `${bucketUrl}/${filename}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const res = await fetch(ociUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: Buffer.from(arrayBuffer),
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `업로드 실패: ${res.status} - ${text}` }
    }
    
    revalidatePath('/');
    return { success: true, url: ociUrl }
  } catch (error: any) {
    return { error: `업로드 오류: ${error.message}` }
  }
}
