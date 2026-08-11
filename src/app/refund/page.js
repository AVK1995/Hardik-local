'use client';

import LegalPage from '@/components/LegalPage';
import { legal } from '@/lib/content';

export default function Refunds() {
  return <LegalPage doc={legal.refund} />;
}
