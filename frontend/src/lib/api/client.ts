import axios from 'axios'

// API客户端配置
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 类型安全的API方法
export const api = {
  getBlogPosts: () => apiClient.get('/blog-posts?populate=*'),
  getProjects: () => apiClient.get('/projects?populate=*'),
  getPhotos: () => apiClient.get('/photos?populate=*'),
  getAlbums: () => apiClient.get('/albums?populate=*'),
  getMovies: () => apiClient.get('/movies?populate=*'),
  getMusic: () => apiClient.get('/musics?populate=*'),
  getMedia: () => apiClient.get('/media?populate=*'),
  getSocialLinks: () => apiClient.get('/social-links'),
  
  // Single item APIs
  getBlogPost: (id: string) => apiClient.get(`/blog-posts/${id}?populate=*`),
  getProject: (id: string) => apiClient.get(`/projects/${id}?populate=*`),
  getPhoto: (id: string) => apiClient.get(`/photos/${id}?populate=*`),
  getAlbum: (id: string) => apiClient.get(`/albums/${id}?populate=*`),
  getMovie: (id: string) => apiClient.get(`/movies/${id}?populate=*`),
  getMusicItem: (id: string) => apiClient.get(`/musics/${id}?populate=*`),
  getMediaItem: (id: string) => apiClient.get(`/media/${id}?populate=*`)
}