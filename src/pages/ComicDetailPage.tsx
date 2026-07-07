import { useParams } from "react-router-dom"
import ComicDetail from "../components/ui/ComicDetail";
import { useEffect, useState } from "react";
import * as storyService from "../services/story.service";
import type { Story } from "../models/story.model";
import * as chapterService from "../services/chapter.service";
import type { Chapter } from "../models";
import LoadingLayout from "../components/ui/LoadingLayout";
import ChapterUI from "../components/ui/ChapterUI";


function ComicDetailPage() {

  const { slug } = useParams();

  const [story, setStory] = useState<Story>();
  const [chapters, setChapters] = useState<Chapter[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchComicDetail = async () => {

      try {
        setLoading(true);
        const response =
          await storyService.getStoryBySlug(slug || "");
        setStory(response.result);

      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchComicDetail();

  }, [slug]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        if(!story) return;
        console.log(story._id);
        const res = await chapterService.getListChapter(story._id);
        setChapters(res.result);
        console.log(res.result);
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchChapter();
  },[story])

  if (!story) {
    return <div>Loading...</div>;
  }

  const comic = {
    id: story._id,
    slug: story.slug,
    title: story.title,
    author: story.author ??   "Unknown",
    description: story.description ?? "No description available.",
    coverUrl: story.coverUrl ?? "https://placehold.co/250x350",
    genres: story.genres.map(g => g.name),
    views: story.views,
    status: story.status,
  };

  return (
    <>
    <LoadingLayout loading={loading}>
      <ComicDetail {...comic} />
      <ChapterUI slug={story.slug} chapters={chapters || []} />
    </LoadingLayout>
    </>
  )
}

export default ComicDetailPage;