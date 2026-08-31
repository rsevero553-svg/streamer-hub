import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'apps/mujeres', name: 'apps-women', component: () => import('@/views/apps/WomenAppsView.vue') },
      { path: 'apps/hombres', name: 'apps-men', component: () => import('@/views/apps/MenAppsView.vue') },
      { path: 'apps/:slug', name: 'app-detail', component: () => import('@/views/apps/AppDetailView.vue') },
      { path: 'guias', name: 'guides', component: () => import('@/views/guides/GuidesView.vue') },
      { path: 'guias/:id', name: 'guide-detail', component: () => import('@/views/guides/GuideDetailView.vue') },
      { path: 'ser-agente', name: 'become-agent', component: () => import('@/views/agent/BecomeAgentView.vue') },
      { path: 'iniciar-sesion', name: 'login', component: () => import('@/views/auth/LoginView.vue') },
      { path: 'recuperar-contrasena', name: 'forgot-password', component: () => import('@/views/auth/ForgotPasswordView.vue') },
      { path: 'registro', name: 'register', component: () => import('@/views/auth/RegisterView.vue') },
      {
        path: 'perfil',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { requiresAuth: true }
      },
      { path: 'politicas', name: 'policies', component: () => import('@/views/content/PoliciesView.vue') },
      { path: 'contacto', name: 'contact', component: () => import('@/views/content/ContactView.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
      { path: 'apps', name: 'admin-apps', component: () => import('@/views/admin/AdminAppsView.vue') },
      { path: 'apps/:id', name: 'admin-app-detail', component: () => import('@/views/admin/AdminAppDetailView.vue') },
      { path: 'banners', name: 'admin-banners', component: () => import('@/views/admin/AdminBannersView.vue') },
      { path: 'guias', name: 'admin-guides', component: () => import('@/views/admin/AdminGuidesView.vue') },
      { path: 'usuarios', name: 'admin-users', component: () => import('@/views/admin/AdminUsersView.vue') },
      { path: 'faqs', name: 'admin-faqs', component: () => import('@/views/admin/AdminFaqsView.vue') },
      { path: 'redes-sociales', name: 'admin-social', component: () => import('@/views/admin/AdminSocialView.vue') },
      { path: 'politicas', name: 'admin-policies', component: () => import('@/views/admin/AdminPoliciesView.vue') },
      { path: 'ser-agente', name: 'admin-agent-content', component: () => import('@/views/admin/AdminAgentContentView.vue') },
      { path: 'moderadores', name: 'admin-moderators', component: () => import('@/views/admin/AdminModeratorsView.vue') },
      { path: 'notificaciones', name: 'admin-notifications', component: () => import('@/views/admin/AdminNotificationsView.vue') }
    ]
  },
  {
    path: '/moderador',
    component: () => import('@/layouts/ModeratorLayout.vue'),
    meta: { requiresAuth: true, requiresModerator: true },
    children: [
      { path: '', name: 'moderator-dashboard', component: () => import('@/views/moderator/ModeratorDashboardView.vue') },
      { path: 'apps', name: 'moderator-apps', component: () => import('@/views/moderator/ModeratorAppsView.vue') },
      { path: 'apps/:id', name: 'moderator-app-detail', component: () => import('@/views/moderator/ModeratorAppDetailView.vue') },
      { path: 'guias', name: 'moderator-guides', component: () => import('@/views/moderator/ModeratorGuidesView.vue') },
      { path: 'agencia', name: 'moderator-agency', component: () => import('@/views/moderator/ModeratorAgencyView.vue') },
      { path: 'membresia', name: 'moderator-membership', component: () => import('@/views/moderator/ModeratorMembershipView.vue') },
      { path: 'sorteo', name: 'moderator-raffle', component: () => import('@/views/moderator/ModeratorRaffleView.vue') },
      { path: 'notificaciones', name: 'moderator-notifications', component: () => import('@/views/moderator/ModeratorNotificationsView.vue') }
    ]
  },
  {
    path: '/agencia/:slug',
    component: () => import('@/layouts/AgencyLayout.vue'),
    children: [
      { path: '', name: 'agency-home', component: () => import('@/views/agency/AgencyHomeView.vue') },
      { path: 'apps/:appSlug', name: 'agency-app-detail', component: () => import('@/views/apps/AppDetailView.vue') },
      { path: 'ser-agente', name: 'agency-become-agent', component: () => import('@/views/agency/AgencyBecomeAgentView.vue') }
    ]
  },
  { path: '/r/:slug', name: 'referral-redirect', component: () => import('@/views/ReferralRedirectView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
  if (to.meta.requiresModerator && auth.profile?.role !== 'moderator' && !auth.isAdmin) {
    return { name: 'home' }
  }
  return true
})

export default router
