# 1. TỔNG QUAN TÀI LIỆU & CƠ CHẾ NỀN TẢNG

Tài liệu này hướng dẫn chơi **Pikachu Cổ Điển (Onet Connect Animal)**, một game giải đố ghép cặp dựa trên quan sát, lập kế hoạch đường đi và quản lý thời gian. Mục tiêu của mỗi màn là xóa toàn bộ các cặp hình giống nhau trước khi đồng hồ về 0.

> **Phạm vi phiên bản:** Game hiện có 6 màn chơi khả dụng. Level 7–10 trong tài liệu là lộ trình cơ chế đề xuất để mở rộng game lên đúng cấu trúc 10 màn.

## 1.1. Quy tắc nối cơ bản

Hai ô cùng hình được xóa khi có thể nối chúng bằng một đường không đi qua ô đang chứa hình, vật cản hoặc ô băng. Đường nối có tối đa **3 đoạn thẳng**, tương đương tối đa **2 góc vuông**.

| Kiểu đường | Mô tả | Cách nhận biết nhanh |
| --- | --- | --- |
| I-Shape | Một đoạn thẳng ngang hoặc dọc | Hai ô cùng hàng/cột, giữa chúng trống |
| L-Shape | Hai đoạn, một góc vuông | Có một ô giao góc trống |
| Z-Shape | Ba đoạn, hai góc vuông | Có một hành lang ngang/dọc trống ở giữa |
| U-Shape | Biến thể ba đoạn đi vòng mép bàn | Tận dụng hàng hoặc cột viền trống |

## 1.2. Thuật ngữ và tính năng hỗ trợ

| Thuật ngữ | Ý nghĩa | Cách dùng hiệu quả |
| --- | --- | --- |
| Hint / Gợi ý | Làm nổi bật một cặp hợp lệ trong thời gian ngắn | Dùng khi đã quét mép bàn mà chưa thấy nước đi |
| Auto-Shuffle | Tự xáo các ô còn lại khi bàn không còn cặp nối được | Đợi hoàn tất xáo bài rồi quét lại từ viền |
| Locked Board | Trạng thái nhiều cặp còn lại nhưng đường đi bị chặn | Ưu tiên mở hành lang và các ô sát biên |
| Ô băng | Ô bị khóa, chắn đường nối | Xóa một ô kề trên/dưới/trái/phải để phá băng |
| Ô ẩn | Ô hiển thị dấu hỏi, lật tạm thời để xem hình | Ghi nhớ vị trí và ghép khi có cặp tương ứng |

> **Cảnh báo thời gian:** Đừng dành quá lâu để tìm một đường Z khó. Sau một lượt quét có hệ thống mà chưa thấy cặp, hãy dùng Hint thay vì làm mất nhịp chơi.

# 2. HƯỚNG DẪN CHI TIẾT THEO LEVEL

## LEVEL 1: BÀN CHƠI ĐỨNG YÊN

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Không dịch chuyển | 300 giây | 5 | Tự động khi hết nước đi | Dễ |

### 2.2. Phân tích cơ chế & điểm mù

Các ô giữ nguyên vị trí sau khi ghép. Điểm mù thường gặp là bỏ qua hai cặp cùng hàng hoặc cùng cột ở sát viền, nơi đường U có thể đi qua vùng trống ngoài bàn.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Quét bốn cạnh bàn, ưu tiên cặp nối thẳng hoặc L-Shape.
2. Xóa các ô sát mép để tạo hành lang vòng ngoài.
3. Chỉ dùng Hint khi đã quét hết biên và không tìm được cặp rõ ràng.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Mỗi khi tạo một ô trống sát cạnh, hãy kiểm tra ngay hàng và cột của nó; một khoảng trống mới thường mở được nhiều đường Z.

## LEVEL 2: CÁC Ô TRÔI XUỐNG

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô trong từng cột dồn xuống sau mỗi cặp | 300 giây | 5 | Tự động khi hết nước đi | Trung bình |

### 2.2. Phân tích cơ chế & điểm mù

Sau mỗi cặp bị xóa, các ô còn lại trong cột rơi xuống. Cặp ở phía trên dễ đổi tọa độ; việc chọn một cặp chỉ vì nối được có thể che kín hành lang ở đáy cột.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Ưu tiên ghép ở phần dưới để giảm số ô phải dự đoán khi rơi.
2. Trước khi chọn, nhìn hai cột liên quan và hình dung vị trí sau khi dồn xuống.
3. Dùng Hint khi bàn vừa thay đổi mạnh và chưa kịp định vị lại các cặp.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Đừng cố ghi nhớ tọa độ tuyệt đối. Hãy ghi nhớ theo từng cột: hình nào đang ở gần đáy, vì đó là vị trí ổn định nhất sau khi dồn ô.

## LEVEL 3: VẬT CẢN ĐÁ CỐ ĐỊNH

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô đứng yên; 8 tảng đá chắn đường | 300 giây | 5 | Tự động khi hết nước đi | Trung bình |

### 2.2. Phân tích cơ chế & điểm mù

Đá không thể chọn, không di chuyển và không thể đi xuyên qua. Các khu vực kẹp giữa đá và cụm ô là nơi dễ phát sinh Locked Board.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Xóa các cặp sát đá trước khi khu vực đó bị bao vây.
2. Duy trì ít nhất một hành lang trống quanh mỗi cụm đá.
3. Nếu chỉ còn các cặp phía trong, dùng Hint để xác định đường vòng đang mở thay vì xáo bài sớm.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Xem đá như một cạnh bàn mới: mọi ô kề đá nên được kiểm tra trước các ô nằm giữa vùng trống rộng.

## LEVEL 4: Ô BĂNG CÓ THỂ PHÁ

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô đứng yên; 8 ô băng chặn đường | 300 giây | 5 | Tự động khi hết nước đi | Khó |

### 2.2. Phân tích cơ chế & điểm mù

Ô băng che hình bên dưới và chặn đường nối. Khi xóa một cặp kề cạnh theo bốn hướng, băng bị phá. Người chơi hay bỏ lỡ các cặp "mồi" giúp mở một vùng lớn.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Xác định các ô kề băng có thể ghép ngay.
2. Ưu tiên phá băng nằm ở nút giao hoặc gần trung tâm bàn.
3. Sau mỗi lần phá băng, dừng một nhịp để quét các đường mới trước khi dùng Hint.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Không phải ô băng nào cũng cần phá ngay. Hãy ưu tiên ô băng đang cắt đôi hành lang giữa hai nhóm hình giống nhau.

## LEVEL 5: Ô ẨN DẤU HỎI

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| 12 ô ẩn lật lại sau 2 giây nếu chưa ghép | 300 giây | 5 | Tự động khi hết nước đi | Khó |

### 2.2. Phân tích cơ chế & điểm mù

Ô ẩn không thể ghép khi chưa lật. Chúng làm gián đoạn khả năng nhìn toàn bàn và tạo áp lực ghi nhớ; lật nhiều ô không theo thứ tự thường khiến người chơi mất dấu hình vừa thấy.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Lật một ô ẩn và kiểm tra ngay cặp giống nó trong vùng đang mở.
2. Nếu chưa ghép được, ghi nhớ theo mốc gần nhất: góc, đá, băng hoặc mép bàn.
3. Ưu tiên xóa các cặp thường trước, để dành khoảng trống cho ô ẩn vừa lộ diện.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Chỉ lật ô ẩn khi bạn sẵn sàng xử lý thông tin đó. Lật để "xem thử" nhưng không có hành lang trống thường chỉ làm quá tải trí nhớ.

## LEVEL 6: VÒNG NGOÀI XOAY THEO CHIỀU KIM ĐỒNG HỒ

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Các ô viền xoay một vị trí mỗi 3 giây | 300 giây | 5 | Tự động khi hết nước đi | Rất khó |

### 2.2. Phân tích cơ chế & điểm mù

Các ô giữa giữ nguyên, nhưng vòng ngoài thay đổi liên tục. Một đường nối có thể biến mất ngay khi vòng xoay; việc chọn chậm theo tọa độ cũ là nguyên nhân chính gây hụt cơ hội.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Tập trung xử lý cặp ở vùng giữa vì chúng ổn định.
2. Với cặp ở viền, chọn nhanh ngay sau khi vòng xoay hoàn tất.
3. Nếu đang phân tích một nước đi ở viền, chờ nhịp xoay kế tiếp thay vì cố chọn sát thời điểm chuyển vị trí.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Hãy coi mỗi chu kỳ 3 giây là một "ảnh bàn mới". Sau khi xoay, quét nhanh toàn bộ viền trước rồi mới quay vào trung tâm.

## LEVEL 7: CÁC Ô TRÔI LÊN *(đề xuất mở rộng)*

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô trong từng cột dồn lên sau mỗi cặp | 280 giây | 4 | 1 | Khó |

### 2.2. Phân tích cơ chế & điểm mù

Quy tắc ngược Level 2: các khoảng trống được tạo ở phía đáy. Người chơi thường vẫn ưu tiên đáy theo thói quen, làm mất các cơ hội mở đường ở đỉnh cột.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Ưu tiên ghép ở phần trên bàn.
2. Theo dõi các hình sắp dồn lên cùng một cột.
3. Dùng Shuffle khi nhiều cột chỉ còn một ô đơn lẻ bị kẹt.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Khi ô dồn lên, đáy bàn là hành lang quý giá. Tránh lấp kín các đường vòng phía dưới quá sớm.

## LEVEL 8: CÁC Ô TRÔI SANG TRÁI *(đề xuất mở rộng)*

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô trong từng hàng dồn sang trái | 270 giây | 4 | 1 | Rất khó |

### 2.2. Phân tích cơ chế & điểm mù

Mỗi cặp bị xóa làm hình trong cùng hàng trượt về trái. Đường dọc thay đổi nhanh hơn đường ngang, nên các cặp cùng cột rất dễ mất cơ hội.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Xử lý cặp ở phía trái trước để giảm biến động.
2. Chụp nhanh bằng mắt những cặp đang cùng cột trước khi ghép một cặp trong hàng đó.
3. Giữ cạnh phải trống để tạo đường U.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Ghép một cặp ngang ở hàng trên có thể phá đồng thời nhiều cặp dọc. Hãy kiểm tra cột trước khi thực hiện.

## LEVEL 9: CÁC Ô DỒN VÀO GIỮA *(đề xuất mở rộng)*

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô trượt về trục giữa sau mỗi cặp | 260 giây | 3 | 1 | Rất khó |

### 2.2. Phân tích cơ chế & điểm mù

Biên bàn dần mở rộng, trong khi trung tâm nhanh chóng đặc lại. Các cặp ở trung tâm có nguy cơ bị bít kín nếu chưa xử lý trước khi các hàng/cột dồn vào.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Tìm và xóa các cặp ở vùng tâm ngay từ đầu.
2. Dùng biên trống để tạo đường U cho các cặp khó.
3. Không lãng phí Hint cho cặp ở mép dễ quan sát.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Khi trung tâm đông, hãy đổi góc nhìn: quét theo các "vành" từ tâm ra biên thay vì quét từng hàng.

## LEVEL 10: DỒN RA BỐN GÓC *(đề xuất mở rộng)*

### 2.1. Thông số màn chơi

| Quy tắc di chuyển ô | Thời gian | Hint ban đầu | Shuffle ban đầu | Độ khó |
| --- | ---: | ---: | ---: | --- |
| Ô trượt về góc gần nhất sau mỗi cặp | 240 giây | 3 | 1 | Thử thách cuối |

### 2.2. Phân tích cơ chế & điểm mù

Tâm bàn nhanh chóng trống nhưng bốn góc trở thành các cụm dày đặc. Mỗi góc có thể hình thành một vùng kẹt riêng nếu xóa thiếu cân bằng.

### 2.3. Chiến thuật phá đảo theo từng bước

1. Luân phiên xử lý bốn góc thay vì dọn sạch một góc.
2. Mở đường từ trong ra ngoài ở từng cụm góc.
3. Giữ Shuffle cho giai đoạn cuối, khi các cụm góc không còn nước đi chéo nhau.

### 2.4. Mẹo chuyên sâu

> 💡 **Pro-Tip:** Bốn góc là bốn bàn nhỏ. Sau mỗi cặp, quét nhanh cả bốn góc để tránh bỏ qua cặp vừa được mở đường.

# 3. TỔNG HỢP CHIẾN THUẬT CAO CẤP & BẢNG TRA CỨU MẸO

## 3.1. Bảng tóm tắt quy tắc di chuyển

| Level | Cơ chế chính | Trọng tâm quan sát |
| ---: | --- | --- |
| 1 | Đứng yên | Mở mép và hành lang |
| 2 | Dồn xuống | Dự đoán đáy cột |
| 3 | Đá cố định | Đường vòng quanh vật cản |
| 4 | Băng có thể phá | Cặp kề ô băng |
| 5 | Ô ẩn | Ghi nhớ vị trí và ghép nhanh |
| 6 | Viền xoay | Canh nhịp 3 giây |
| 7 | Dồn lên | Giữ hành lang đáy |
| 8 | Dồn trái | Bảo toàn đường dọc |
| 9 | Dồn vào giữa | Xử lý tâm bàn sớm |
| 10 | Dồn ra bốn góc | Luân phiên bốn cụm |

## 3.2. Kỹ thuật quan sát bằng mắt

- **Quét biên trước:** Mép bàn là nơi dễ tạo đường U và ít bị che nhất.
- **Quét theo hình thay vì theo ô:** Chọn một biểu tượng, tìm biểu tượng giống nó, rồi kiểm tra đường đi; cách này nhanh hơn kiểm tra từng ô.
- **Nhìn trước một nước:** Trước khi xóa cặp hiện tại, dự đoán khoảng trống hoặc sự dịch chuyển mà nó tạo ra cho cặp kế tiếp.
- **Dùng nhịp cố định:** Sau mỗi cặp, dành một nhịp ngắn để quét lại các hành lang mới thay vì bấm liên tục.
- **Giữ bình tĩnh khi hết nước đi:** Auto-Shuffle là cơ chế khôi phục hợp lệ, không phải thất bại. Hãy lập tức quay về chiến lược quét biên sau khi xáo.

> **Nguyên tắc cốt lõi:** Một cặp dễ nối chưa chắc là nước đi tốt nhất. Nước đi tốt là nước vừa xóa được cặp, vừa tạo thêm không gian và lựa chọn cho lượt kế tiếp.
