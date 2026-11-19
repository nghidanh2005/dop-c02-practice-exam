# DOP-C02 Practice Exam

Website tĩnh ôn thi AWS Certified DevOps Engineer - Professional (DOP-C02), 75 câu trắc nghiệm có đáp án và giải thích.

## Tính năng
- Luyện tập: biết đúng/sai ngay, xem giải thích, lý do loại từng đáp án sai và ghi nhớ.
- Thi thử: chấm điểm khi nộp bài, có đồng hồ đếm ngược (mặc định 75 câu, 180 phút).
- Thứ tự theo số câu hoặc ngẫu nhiên; chọn khoảng câu, câu chưa làm, câu làm sai gần nhất, câu đã đánh dấu.
- Câu chọn nhiều đáp án (Select TWO/THREE) dùng checkbox.
- Bản đồ câu hỏi, đánh dấu câu, lưu tiến độ trong localStorage, xuất/nhập tiến độ JSON.
- Chế độ sáng/tối. Phím tắt: A-F hoặc 1-6 chọn đáp án, Enter kiểm tra/câu tiếp, mũi tên chuyển câu, M đánh dấu.

## Cấu trúc
- `index.html`, `style.css`, `app.js`: giao diện và logic (JavaScript thuần, không cần build).
- `data/questions.js`: dữ liệu 75 câu (`window.DOP_QUESTIONS`).

## Ghi chú dữ liệu
- Câu 28: ảnh đề gốc bị cắt sau lựa chọn B nên không xác định được đáp án; câu này không tính điểm.
- Câu 38: đề gốc nằm trên 2 ảnh, các lựa chọn đã được ghép lại theo thứ tự A-F.
- Câu 70: lựa chọn C không nhắc `logs:CreateLogGroup` dù đề bật tạo log group tự động; kiểm tra lại quyền này khi dùng thực tế.
- Đáp án và giải thích chỉ để tự học, hãy đối chiếu với tài liệu AWS khi cần chắc chắn.
