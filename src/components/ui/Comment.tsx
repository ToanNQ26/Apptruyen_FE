import { useEffect, useState, type FormEvent } from "react";
import LoadingLayout from "./LoadingLayout";
import { useAuth } from "../../contexts/authContext";
import * as commentService from "../../services/comment.service";
import type { Comment } from "../../models/comment.model";

type CommentForm = {
  content: string;
};

const emptyForm: CommentForm = {
  content: "",
};

const getEntityId = (item: unknown) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    const entity = item as Record<string, unknown>;
    return String(entity._id ?? entity.id ?? "");
  }
  return String(item);
};

const normalizeRelation = (relation: unknown) => {
  if (!relation) return "-";
  if (typeof relation === "string") return relation;
  if (typeof relation === "object") {
    const item = relation as Record<string, unknown>;
    return String(item.title || item.name || item._id || item.id || "-");
  }
  return String(relation);
};

function Comments({
  chapterId,
  storyId,
}: {
  chapterNumber?: string;
  chapterId?: string;
  storyId: string;
}) {
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState<CommentForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await commentService.getAllComments();
      const allComments = response.result ?? [];
      const filtered = allComments.filter((comment) => {
        const commentStoryId = getEntityId(comment.storyId);
        const commentChapterId = getEntityId(comment.chapterId);
        if (commentStoryId !== storyId) return false;
        if (chapterId && commentChapterId !== chapterId) return false;
        return true;
      });
      setComments(filtered);
    } catch (error) {
      console.error(error);
      setMessage("Không thể tải bình luận. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [storyId, chapterId]);

  const handleChange = (value: string) => {
    setForm({ content: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoggedIn || !user) {
      setMessage("Vui lòng đăng nhập trước khi bình luận.");
      return;
    }

    if (!form.content.trim()) {
      setMessage("Nội dung bình luận không được để trống.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await commentService.updateComment(editingId, {
          content: form.content.trim(),
        });
        setMessage("Cập nhật bình luận thành công.");
      } else {
        await commentService.createComment({
          userId: user._id,
          storyId,
          chapterId: chapterId || undefined,
          content: form.content.trim(),
        });
        setMessage("Bình luận đã được gửi.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchComments();
    } catch (error) {
      console.error(error);
      setMessage("Đã có lỗi khi lưu bình luận. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setForm({
      content: comment.content,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa bình luận này?");
    if (!confirm) return;

    setSubmitting(true);
    try {
      await commentService.deleteComment(id);
      setMessage("Đã xóa bình luận.");
      await fetchComments();
    } catch (error) {
      console.error(error);
      setMessage("Xóa bình luận thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoadingLayout loading={loading}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
                  Bình luận
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  Viết bình luận của bạn
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                  Nhập nội dung bình luận và gửi. Story ID và chapter ID đã được
                  gán tự động từ trang truyện.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              {message && (
                <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                  {message}
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-white/10
                    bg-slate-950
                    p-4
                    text-white
                    outline-none
                    transition
                    focus:border-cyan-400
                "
                  />

                  <div className="mt-4 flex justify-end gap-3">
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-xl border border-white/10 px-5 py-2 text-white"
                      >
                        Hủy
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={ submitting}
                      className="rounded-xl bg-cyan-500 px-6 py-2 font-medium text-white hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {editingId ? "Cập nhật" : "Gửi bình luận"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
                  Danh sách
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Bình luận mới nhất
                </h2>
              </div>
              <p className="text-sm text-slate-400">
                {comments.length} bình luận
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
                  Chưa có bình luận nào. Hãy tạo bình luận đầu tiên.
                </div>
              ) : (
                comments.map((comment) => (
                  <article
                    key={comment._id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
                        {normalizeRelation(comment.userId)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">
                            {normalizeRelation(comment.userId)}
                          </span>

                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-200">
                          {comment.content}
                        </p>

                        <div className="mt-5 flex gap-5">
                          {user?._id === getEntityId(comment.userId) && (
                            <>
                              <button
                                onClick={() => handleEdit(comment)}
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                              >
                                Sửa
                              </button>

                              <button
                                onClick={() => handleDelete(comment._id)}
                                className="text-sm text-red-400 hover:text-red-300"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </LoadingLayout>
  );
}

export default Comments;
