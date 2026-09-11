import { TourEditorPage } from "@/components/admin/TourEditorPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminTourEditorRoute({ params }: PageProps) {
  const { slug } = await params;
  return <TourEditorPage slug={slug} />;
}
