import { notFound } from "next/navigation";
import { LessonPage } from "@/components/LessonPage";
import { lessons } from "@/data/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function Page({
  params
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPage lesson={lesson} />;
}
