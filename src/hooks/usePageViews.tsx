'use client'

import { useEffect } from 'react'
import { Router } from "next/router";

type HitOptions = {
  callback?: () => void
  ctx?: object
  params?: {
    order_price?: number
    currency?: string
  }
  referer?: string
  title?: string
}

interface UsePageViewsOptions {
  yandexId?: number
  ignoreHashChange?: boolean
  disabled?: boolean
}

const trackPageView = (url: string, options?: HitOptions) => {
  if (typeof window !== 'undefined' && 'ym' in window) {
    const ym = window.ym as unknown as (yid: number, method: string, url: string, options?: HitOptions) => void

    if (!ym) {
      return
    }

    const yid = Number(process.env.NEXT_PUBLIC_YANDEX_ID) ?? 98796529

    https://yandex.ru/support/metrica/code/counter-spa-setup.html
    ym(yid, 'hit', url, {
      ...options,
      title: options?.title || document.title
    })
  }
}

export function usePageViews({
  yandexId,
  ignoreHashChange,
  disabled
}: UsePageViewsOptions = {}) {

  useEffect(() => {
    if (disabled) {
      return
    }

    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    if (typeof window !== 'undefined') {
      Router.events.on('routeChangeComplete', handleRouteChange)

      if (!ignoreHashChange) {
        Router.events.on('hashChangeComplete', handleRouteChange) 
      }

      return () => {
        Router.events.off('routeChangeComplete', handleRouteChange)
        
        if (!ignoreHashChange) {
          Router.events.off('hashChangeComplete', handleRouteChange)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router.events, yandexId, ignoreHashChange, disabled])
}

// export function YandexMetrikaEvents() {
//   usePageViews()
//   return null
// }