package khong the thieu (morgan)
-Morgan la mot thu vien de in ra cac log cua 
chung ta khi ma mot nguoi dung chay 1 request
dev - trang thai
combined - ip nguoi req -- time -- method
common - ra nhat ky chung tieu chuan apache giong combined
short - thong bao mac dinh ngan hon bao gom thoi gian phan hoi
tiny - method + link req -- time

-helmet su dung y rang morgan
la app middleware
bao mat, khong cho nguoi khac biet minh su dung cong nghe gi de bao hiem
ngan chan nhung trang thu 3 vao trang web cua chung ta


-compress
khi mà chùng ta vận chuyển dữ liệu - payload, 
khi gửi dữ liệu quá nhiều đến Mobile, web, ... 
chúng ta gửi mấy mê thì sẽ tốn băng thông
tốn cho người dùng và tốn cho chúng ta
khi đó chúng ta dùng compress
để giảm băng thông

có nên đóng connect mongodb giống php với java k

không nên đóng kết nối mongoose lien tuc theo cach thu cong
tai vi sao? tai vi mongoose no su dung 1 cai pull? pool?, nhung ma ngta goi la 1 nhom ket noi cac CSDL va no se tu dong xu ly mo va dong cac ket noi khi can
Tuy nhien cung co the mot so truong hop ma ban muon dong ket noi 1 cach ro rang, vi du neu ung dung cua chung ta can tat mot cach duyen dang thi chung ta co the tat tat ca cac ket noi CSDL dang hoat dong de dam bao du lieu khong bi mat


dung 
<!-- // process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`));
// }) -->
de dong mongo cua chung ta 1 cach duyen dang

- chung ta co the dong tat ca cac mongo bang method mongo disconnect, method nay cung rat pho bien tren mongoose


- poolSize la gi


- neu ket noi vuot qua poolSize ?
dieu nay co nghia mongoose khong vuot qua kich thuoc poolsize
thay vao do, no se cho thang do xep hang, doi cac yeu cau xu ly xong va co cac ket noi dau ra free thi se cho phep chung ta duoc su dung
gia su poolsize 50, co thang 51 nhay vao, no phai xep hang, de thang 50 bung ra, thi thang 51 moi duoc dung

-file env la gi
.Chung ta khong can file env cung duoc neu chung ta khong can luu tru nhung thong tin nhay cam, neu ban cam thay thoai mai, lam viec luu tru nhung thong tin nhay cam do trong code cua minh luon thi ban khong can env
.Cac bien nay co the nhu la key api, string url cua CSDL, ... chung ta khong muon ma hoa cung vao code cua minh
.Ly do chinh su dung env de tach biet thong tin nhay cam khoi code cua chung ta, giup chung ta co code sach se co the bao tri 1 cach tron chu hon, cung nhu an toan hon vi thong tin nhay cam khong duoc luu tru o cac van ban thuan tuy ma khi chung ta push len code

-Khac nhau giua config va env
config duoc su dung de luu tru cai dat va tuy chon cau hinh cho ung dung cua chung ta
folder config luu duoc nhieu dinh dang json, xml, .. khong giong nhu file env - folder config khong nham muc dich luu tru thong tin nhay cam
khac biet chinh config dung de kiem soat, luu tru nhung cai dat ung dung cua chung ta ma co the kiem soat duoc code, kiem soat van ban
tom lai chung ta can luu tru nhung thong tin nhay cam cho ung dung cua minh thi chung ta nen dung file env
con neu ma chung ta chi can luu tru file config thoi thi co the su dung file config
dam bao thong tin nhay cam k nam trong file config cua chung ta



- Elasicsearch
- Logstash
- Kibana

- Token là một loại mã thông báo chung, còn JWT là 1 loại riêng sử dụng thuật toán token
- Chứ không phải gọi Token là JWT (không đúng nha)


- Tại sao access token lại tồn tại thời gian ngắn ?
- JWT sinh ra AT và RT, nhưng tại sao AT lại tồn tại trong thời gian ngắn hơn ?
- Hãy tưởng tượng AT tồn tại 3 tháng (dài), trong quá trình sử dụng bình thường tại vì chúng ta không có cái tuỳ chọn nào để mà thu hồi cái token đó cả, do đó nếu AT bị đánh cắp thì kẻ tấn công có thế đóng vai trò nạn nhân trong vòng 3 tháng hoặc nếu dài hơn nữa thì càng chết - đây chính là lý do tại sao AT phải có thời gian tồn tại là ngắn và được bảo mặt tốt (càng nhanh chóng hết hạn càng tốt vì nếu như bị ai đó lấy đi thì ngta sẽ đóng vai trò của bạn trong thời gian đó) - đó là lý do tại sao AT nên tồn tại trong thời gian ngắn

- tại sao lại có RF ? - RT sinh ra giải quyết vấn đề AT tồn tại trong thời gian ngắn.
- Vì AT chỉ tồn tại trong thời gian rất ngắn, nên việc nhận AT trờ thành vấn đề
- Nếu như AT chỉ có 1 ngày, thậm chí vài giờ mà bây giờ các bạn sử dụng fireBase, Google API đều có hạn 1 giờ, thì nếu như v hết 1 giờ, nếu k có RT thì phải login lại từ đầu, trải nghiệm ng dùng rất kém, sử dụng 1 giờ => login lại => sử dụng 1 giờ => login lại => repeat => đó là 1 điều gây phiền phức cho người dùng của chúng ta, có thể nói bạn đổi người dùng của mình đi, khi họ phải đăng nhập lại vài lần trong 1 ngày, vài lần trong 1 giờ - do đó RT sinh ra để giải quyết vấn đề này

- Sao đảm bảo RT tồn tại lâu dài ?
- AT tồn tại thời gian ngắn, RT tồn tại thời gian dài - vậy tại sao AT k phải thời dài mà lại RT thời gian dài ?
- tại sao lại an toàn khi RT tồn tại trong nhiều tháng mà AT không thể ?
- Câu trả lời rất đơn giản - phải có khả năng, cơ chế thu hồi RT
- Cái AT lưu trữ tại client nhưng RT lưu trữ tại client và server thậm chí các app hiện nay đều lưu trữ AT và RT tại client và server để có 1 cơ ché thu hồi rất hay
- Chúng ta có 1 cơ chế thu hồi RT để server không chấp nhận hoặc loại bỏ nó ra để k cấp 1 cái AT mới cho ng dùng, bằng cách này nếu 1 kẻ tấn công nhận đc 1 bản sao của RT thì chúng ta có thể thu hồi và kẻ tấn công mất tất cả các quyền truy cập sau khi AT tốn tại trong thời gian ngắn của chúng ta hết hạn - Do đó chúng ta sẽ làm mất hiệu lực tất cả các RT của ng dùng để đảm bảo sự kiện bảo mật của chúng ta nếu hệ thống nghi ngờ bị đánh cắp nếu ng dùng có thể thay đổi mật khẩu của họ, nếu ng dùng có thể thay đổi cái email của họ - đó là tất cả những gì mà RT phải đảm bảo thời gian lâu dài - về bản chất thu hồi 1 RT là bạn bắt buộc ng dùng phải đăng xuất (bắt buộc xảy ra)

- Thu hôi token diễn ra ntn ? việc thu hồi token có diễn ra đc hay k ? - trong lúc diễn ra AT thì chúng ta k thể thu hồi đc nhưng chúng ta có thể làm mất hiệu lực của các token đó bằng 2 thuật toán White list và black list
- Túc là khi bạn login thành công thì nó trả về cho 2 cái tokens là AT và RT, tất cả AT và RT đc lưu vào 1 dữ liệu (cach, đĩa, mySql, mongoDB, .... thì chưa bàn tới) nhưng nó phải lưu cái đã.
- Khi xác minh mã token, trước tiên chúng ta xác minh mã đó có tồn tại hay k, nếu k thì token này k hợp lệ, nếu có mã token sẽ đc decode để lấy thông tin nhân dạng của ng dùng, nếu chúng ta cần vô hiệu thì chúng ta cần xoá cái mã thông báo của danh sách đó đi

- cái Token đó mã hoá dữ liệu v tại sao tôi lại thấy đc dữ liệu ?
- Token đc sinh ra bởi 3 thành phần sau (header, payload, sign)
header 
{
    type: 'JWT',
    alg: 'HS256',

}
payload
{
    userId: '123456',
    name: 'Anooystick'
}
- lưu ý cái payload và header sẽ đc chuyển thành base64 nên bất cứ ở đâu nó cũng sẽ đc giải mã - không cần phải lo lắng, cho nên đừng để thông tin đăng nhập ở payload - payload chỉ kèm theo những thông tin hữu ích như role, permisions của chúng ta, và kèm thêm userId nếu như thông tin k đổi
sign = hash(data, secret)
data = base64 header + base64 payload
keysecrect chúng ta phải định danh, và chúng ta có những công thức để định danh những secret này đề những hacker k mò ra đc


- ví dụ tạo token
JWT.sign({
    userId: 123456,
}, { algorithm: 'HS256' }, (err, token) => {
    clg(token);
});

output: ra 1 token 'adsjfkhasdlfkhasldfj.adlskfjhasdlfue.adlkjfhsadlfkjhds'

- quan trọng cái token này nó sẽ mang đi trong server có, client có và tất cả mọi người đều thấy cái token này của chúng ta
- 2 dấu chấm đầu thì mọi ng đều biết, vì đó là header và payload, dấu chấm sau thì ngta k biết vì đó là secret key
- Tại vì sao chúng ta không được bỏ dữ liệu qtrong trong header và payload, vì họ có thể decode ra
- Nếu ngta decode cái token đó thì cũng chỉ thấy header và payload, còn secretKey thì không thấy