import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { QueryClient } from '@tanstack/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
    const queryClient = new QueryClient()

    const router = createRouter({
        routeTree,
        context: {
            queryClient,
        },
        defaultNotFoundComponent: () => <div>404: Page Not Found</div>,
        defaultPreload: 'intent',
        defaultPreloadDelay: 200,
    })

    setupRouterSsrQueryIntegration({ router, queryClient })
    return router
}
