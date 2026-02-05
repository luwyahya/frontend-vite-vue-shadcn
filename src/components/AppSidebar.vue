<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { getAvatarUrl, getAvatarColor } from '@/utils/avatar.utils'
import { computed, ref } from 'vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Home, Package, FolderOpen, Users } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const user = authStore.user
const imageError = ref(false)

const avatarUrl = computed(() => getAvatarUrl(user?.avatar))

const handleImageError = () => {
  imageError.value = true
}

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    path: '/products',
  },
  {
    title: 'Categories',
    icon: FolderOpen,
    path: '/categories',
  },
  {
    title: 'Users',
    icon: Users,
    path: '/users',
  },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <div class="flex items-center gap-2">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Package class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">FE Netzme</span>
                <span class="text-xs">Product Management</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigationItems" :key="item.path">
              <SidebarMenuButton
                :is-active="route.path === item.path"
                as-child
              >
                <a :href="item.path" @click.prevent="router.push(item.path)">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" @click="router.push('/profile')">
            <div class="flex items-center gap-2">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <img 
                  v-if="user?.avatar && !imageError"
                  :src="avatarUrl"
                  :alt="user?.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div 
                  v-else
                  class="w-full h-full flex items-center justify-center text-white text-sm font-semibold"
                  :class="getAvatarColor(user?.name || 'User')"
                >
                  {{ (user?.name || 'U').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="text-sm font-medium">{{ user?.name || 'User' }}</span>
                <span class="text-xs text-muted-foreground">{{ user?.email || 'user@example.com' }}</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    
    <SidebarRail />
  </Sidebar>
</template>
