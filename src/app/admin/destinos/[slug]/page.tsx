import { DestinationEditorPage } from "@/components/admin/DestinationEditorPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminDestinoEditPage({ params }: PageProps) {
  const { slug } = await params;
  return <DestinationEditorPage slug={slug} />;
}
