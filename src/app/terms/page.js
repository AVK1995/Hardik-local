'use client';

import LegalPage from '@/components/LegalPage';
import { legal } from '@/lib/content';

export default function Terms() {
  return <LegalPage doc={legal.terms} />;
}
