export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  if (!avatarPath) return null
  
  // Jika sudah full URL, return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath
  }
  
  // Jika path relatif, tambahkan base URL Laravel storage
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'
  return `${baseUrl}/storage/${avatarPath.replace('storage/', '')}`
}