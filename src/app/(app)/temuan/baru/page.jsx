'use client';
import { useSession } from '@/lib/store';
import { can } from '@/lib/constants';
import TemuanForm from '@/components/TemuanForm';
import { PageHeader, Empty } from '@/components/ui';

export default function TemuanBaru() {
  const { user } = useSession();
  if (!can.inputTemuan(user)) return <Empty>Hanya Anggota Tim yang dapat menginput temuan.</Empty>;
  return (
    <>
      <PageHeader title="Input Temuan Baru" subtitle="Lengkapi unsur temuan (kondisi, kriteria, sebab, akibat) dan rekomendasinya." />
      <TemuanForm user={user} />
    </>
  );
}
