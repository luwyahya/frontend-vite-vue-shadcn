export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ]
  
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export const getAvatarUrl = (avatar?: string): string => {
  if (!avatar) {
    return '/images/default-avatar.png'
  }

  if (avatar.startsWith('http')) {
    return avatar
  }

  return `http://localhost:8000/storage/${avatar}`
}