'use client';

import { useEffect } from 'react';

import { trackViewItem } from '@/lib/track';

/**
 * Landing-page tracking, mounted once on the page. Renders nothing.
 *
 * ONLY ViewContent lives here. AddToCart does NOT: it fires from the
 * checkout's own mount, for two reasons.
 *
 *  1. This page carries seven CTA lockups. A reader who clicked two of them
 *     would count twice, which inflates AddToCart volume and deflates the
 *     cost-per-AddToCart the ads are judged on.
 *  2. A click is not an arrival. Counting the checkout's mount counts the
 *     people who actually reached it, and it is the only Meta event a visitor
 *     who opens /checkout directly will ever produce.
 *
 * Do not re-add it here: the two together double-count every ordinary buyer.
 */
export default function FunnelTracker() {
  useEffect(() => {
    /* ViewContent: the offer has been seen. Once per SESSION, not per browser
       lifetime, so a returning visitor still feeds the retargeting audience. */
    trackViewItem();
  }, []);

  return null;
}
