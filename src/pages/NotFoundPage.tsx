import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="container">
      <h1>404 - Không tìm thấy trang</h1>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}

export default NotFoundPage;