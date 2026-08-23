import { useNavigate, useParams } from "react-router-dom";
import ChapterForm from "../components/function/ChapterForm";

const AddChapterPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();

  if (!storyId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-900 text-slate-300">
        Không tìm thấy truyện.
      </div>
    );
  }

  return (
    <ChapterForm
      storyId={storyId}
      onSuccess={() => {
        navigate(`/`);
      }}
      onCancel={() => {
        navigate(-1);
      }}
    />
  );
};

export default AddChapterPage;