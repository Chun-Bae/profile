'use server'

import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const jsonData = formData.get('profileData') as string
  const ociUrl = process.env.OCI_DATA_URL

  // 1. 유효성 검사 (올바른 JSON 형태인지 확인)
  try {
    JSON.parse(jsonData)
  } catch (error) {
    return { error: 'Invalid JSON format. Please check your syntax.' }
  }

  // 2. OCI URI 환경변수 확인
  if (!ociUrl) {
    return { error: 'OCI_DATA_URL environment variable is not set. Cannot save to cloud.' }
  }

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
