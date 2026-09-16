import { BlogEditorPage } from "@/components/admin/BlogEditorPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { slug } = await params;
  return <BlogEditorPage slug={slug} />;
}
