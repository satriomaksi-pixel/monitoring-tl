'use client';
import { useParams } from 'next/navigation';
import { useSession } from '@/lib/store';
import { can } from '@/lib/constants';
import TemuanForm from '@/components/TemuanForm';
import { PageHeader, Empty } from '@/components/ui';

export default function UbahTemuan() {
  const { id } = useParams();
  const { data, user } = useSession();
  const t = data.temuan.find((x) => x.id === id);
  if (!t) return <Empty>Temuan tidak ditemukan.</Empty>;
  if (!can.inputTemuan(user) || !['draft', 'dikembalikan'].includes(t.statusReviu))
    return <Empty>Temuan ini tidak dapat diubah (hanya draf/dikembalikan oleh Anggota Tim).</Empty>;
  return (
    <>
      <PageHeader title="Perbaiki Temuan" subtitle={`${t.id} · ${t.judul}`} />
      <TemuanForm user={user} awal={t} />
    </>
  );
}
