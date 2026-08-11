'use client';

import LegalPage from '@/components/LegalPage';
import { legal } from '@/lib/content';

export default function Privacy() {
  return <LegalPage doc={legal.privacy} />;
}
